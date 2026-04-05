/**
 * NestMate — House Board (anonymous-first)
 * Place at: app/board/page.jsx
 *
 * Anonymity model:
 *   Concern  — always anonymous, no option
 *   Share    — anonymous by default, opt-in to show name
 *   Shoutout — two modes:
 *                "Someone specific" — recipient named, sender anon by default with opt-in
 *                "The whole house"  — no recipient, sender anon by default with opt-in
 *
 * SUPABASE SWAP-INS: search "// SUPABASE:" for every mock to replace.
 */

"use client";

import { useState } from "react";

// ─── Brand ────────────────────────────────────────────────────────────────────
const T    = "#C55E30";
const T2   = "#B04E25";
const S    = "#4A7A6A";
const S2   = "#3D6559";
const GOLD = "#9B6B10";
const CREAM = "#F5EDE0";
const FF   = "'Plus Jakarta Sans', sans-serif";
const FS   = "'Fraunces', serif";

// ─── Mock data ────────────────────────────────────────────────────────────────
// SUPABASE: supabase.from("members").select().eq("house_id", ...)
const MEMBERS = [
  { id: "m1", name: "Alex M.", initials: "AM" },
  { id: "m2", name: "Sam K.",  initials: "SK" },
];
// SUPABASE: supabase.auth.getUser()
const YOU = { id: "m3", name: "Jordan L.", initials: "JL", isYou: true };

// SUPABASE: supabase.from("board_posts").select().eq("house_id", ...).order("created_at", { ascending: false })
const SEED_POSTS = [
  {
    id: "p1", type: "share",
    author: null, // anonymous
    tag: "Food to share",
    content: "Made too much pasta — big bowl in the fridge, help yourselves!",
    timeAgo: "2 hours ago",
    acknowledged: [], resolved: false, noResponse: false,
  },
  {
    id: "p2", type: "shoutout",
    author: null, // anonymous sender
    shoutoutMode: "specific",
    recipient: "Alex M.",
    content: "Alex M. — replaced the bathroom lightbulb without being asked. Thanks!",
    timeAgo: "Yesterday",
    acknowledged: [], resolved: false, noResponse: false,
  },
  {
    id: "p3", type: "shoutout",
    author: null, // anonymous
    shoutoutMode: "house",
    recipient: null,
    content: "Whoever cleaned the bathroom last — you're an absolute angel. Thank you!",
    timeAgo: "2 days ago",
    acknowledged: [], resolved: false, noResponse: false,
  },
  {
    id: "p4", type: "concern",
    author: null, // always anonymous
    content: "I've noticed noise in the living room has been an issue. It would help if we kept it down after midnight on weeknights.",
    timeAgo: "2 days ago",
    acknowledged: [], resolved: false, noResponse: true,
  },
  {
    id: "p5", type: "share",
    author: "Alex M.", // opted to show name
    tag: "House update",
    content: "Landlord is coming for inspection next Thursday. Just a heads up!",
    timeAgo: "3 days ago",
    acknowledged: ["Sam K.", "Jordan L."], resolved: false, noResponse: false,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const SHARE_TAGS         = ["Food to share", "Good vibes", "Heads up", "House update", "Just for fun"];
const CONCERN_CATEGORIES = ["Noise", "Cleanliness", "Guests", "Money", "Common areas"];
const CONCERN_LOCATIONS  = ["Kitchen", "Bathroom", "Living room", "Whole house"];

const TYPE_CFG = {
  share:    { label: "Share",    badgeBg: "#C4D9D3", badgeColor: S,    borderColor: S    },
  concern:  { label: "Concern",  badgeBg: "#F0D4C4", badgeColor: T,    borderColor: T    },
  shoutout: { label: "Shoutout", badgeBg: "#F5E4B8", badgeColor: GOLD, borderColor: GOLD },
};

// ─── Shared primitives ────────────────────────────────────────────────────────
function Logo({ onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <span style={{ fontFamily: FS, fontSize: 20, fontWeight: 600, color: "#1A1209" }}>
        Nest<span style={{ color: T }}>Mate</span>
      </span>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: FF, fontSize: 13, color: "#9A8A7A", cursor: "pointer" }}>
          ← Board
        </button>
      )}
    </div>
  );
}

function Avatar({ initials, color = "stone", size = 32 }) {
  const palettes = {
    terra: { bg: "#F0D4C4", color: T    },
    sage:  { bg: "#C4D9D3", color: S    },
    gold:  { bg: "#F5E4B8", color: GOLD },
    stone: { bg: "#E7E3DE", color: "#6B6560" },
    anon:  { bg: "#F0EBE3", color: "#B0A090" },
  };
  const p = palettes[color] || palettes.stone;
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      backgroundColor: p.bg, color: p.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FF, fontSize: size < 34 ? 11 : 13, fontWeight: 600,
    }}>
      {initials}
    </div>
  );
}

function Pill({ label, selected, onClick, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "6px 12px" : "9px 14px", borderRadius: 10,
        fontSize: small ? 12 : 13, fontWeight: 500, fontFamily: FF,
        cursor: "pointer", transition: "all 0.12s",
        border: `1.5px solid ${selected ? T : "#E7E0D5"}`,
        backgroundColor: selected ? T : "#FAF6F1",
        color: selected ? "#fff" : "#4A3A2E",
      }}
    >
      {label}
    </button>
  );
}

function PrimaryBtn({ children, onClick, color = "terra", disabled = false }) {
  const bg  = color === "sage" ? S : color === "gold" ? GOLD : T;
  const bg2 = color === "sage" ? S2 : color === "gold" ? "#7A540C" : T2;
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        width: "100%", padding: "13px", borderRadius: 16, border: "none",
        fontFamily: FF, fontSize: 14, fontWeight: 600,
        backgroundColor: disabled ? "#E7E0D5" : bg,
        color: disabled ? "#B0A090" : "#fff",
        cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.14s",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = bg2; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = bg; }}
    >
      {children}
    </button>
  );
}

function TextArea({ placeholder, value, onChange, rows = 3 }) {
  return (
    <textarea
      placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)} rows={rows}
      style={{
        width: "100%", padding: "12px 14px", borderRadius: 12,
        border: "1.5px solid #E7E0D5", fontFamily: FF, fontSize: 14,
        color: "#1A1209", background: "#FAF6F1", resize: "none", outline: "none",
        lineHeight: 1.55, transition: "border-color 0.15s", boxSizing: "border-box",
      }}
      onFocus={(e) => (e.target.style.borderColor = T)}
      onBlur={(e)  => (e.target.style.borderColor = "#E7E0D5")}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9A8A7A", fontFamily: FF, marginBottom: 10 }}>
      {children}
    </p>
  );
}

// Show-name toggle — used by Share and Shoutout
function NameToggle({ showName, onChange }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderRadius: 12,
        backgroundColor: showName ? "#EEF5F2" : "#FAF6F1",
        border: `1.5px solid ${showName ? "#C4D9D3" : "#E7E0D5"}`,
        cursor: "pointer", transition: "all 0.15s", marginBottom: 20,
      }}
      onClick={() => onChange(!showName)}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1209", fontFamily: FF, margin: 0 }}>
          Show my name
        </p>
        <p style={{ fontSize: 11, color: "#9A8A7A", fontFamily: FF, margin: 0, marginTop: 2 }}>
          {showName ? "Your name will be visible on this post" : "Post anonymously (default)"}
        </p>
      </div>
      {/* Toggle switch */}
      <div style={{
        width: 40, height: 22, borderRadius: 11, position: "relative",
        backgroundColor: showName ? S : "#D0C8BE", transition: "background 0.2s", flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff",
          position: "absolute", top: 3, transition: "left 0.2s",
          left: showName ? 20 : 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );
}

// ─── Compose: Share ───────────────────────────────────────────────────────────
function ComposeShare({ onPost, onCancel }) {
  const [text,     setText]     = useState("");
  const [tag,      setTag]      = useState(null);
  const [showName, setShowName] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    onPost({
      type: "share", tag,
      content: text.trim(),
      author: showName ? YOU.name : null,
      timeAgo: "Just now", acknowledged: [], resolved: false, noResponse: false,
    });
  };

  return (
    <div>
      <Logo onBack={onCancel} />
      <h2 style={{ fontFamily: FS, fontSize: 22, fontWeight: 600, color: "#1A1209", marginBottom: 4 }}>Share</h2>
      <p style={{ fontSize: 14, color: "#8A7A6E", fontFamily: FF, marginBottom: 20 }}>
        Food, good vibes, updates — whatever's on your mind.
      </p>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Tag (optional)</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SHARE_TAGS.map((t) => (
            <Pill key={t} label={t} selected={tag === t} onClick={() => setTag(tag === t ? null : t)} small />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>What's up?</SectionLabel>
        <TextArea placeholder="e.g. Leftover pizza in the fridge, first come first served!" value={text} onChange={setText} rows={4} />
      </div>

      <NameToggle showName={showName} onChange={setShowName} />
      <PrimaryBtn color="sage" disabled={!text.trim()} onClick={handlePost}>Post to board</PrimaryBtn>
    </div>
  );
}

// ─── Compose: Concern ─────────────────────────────────────────────────────────
function ComposeConcern({ onPost, onCancel }) {
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [help,     setHelp]     = useState("");

  const cat      = category ? category.toLowerCase() : null;
  const loc      = location ? location.toLowerCase()  : null;
  const complete = category && location && help.trim();
  const preview  = `I've noticed ${cat || "[category]"} in the ${loc || "[location]"} has been an issue. It would help if ${help.trim() || "[what would help]"}.`;

  const handlePost = () => {
    if (!complete) return;
    onPost({
      type: "concern",
      content: `I've noticed ${cat} in the ${loc} has been an issue. It would help if ${help.trim()}.`,
      author: null, // concerns are always anonymous
      timeAgo: "Just now", acknowledged: [], resolved: false, noResponse: false,
    });
  };

  return (
    <div>
      <Logo onBack={onCancel} />
      <h2 style={{ fontFamily: FS, fontSize: 22, fontWeight: 600, color: "#1A1209", marginBottom: 4 }}>Concern</h2>
      <p style={{ fontSize: 14, color: "#8A7A6E", fontFamily: FF, marginBottom: 4 }}>
        Say what's bothering you — without making it a confrontation.
      </p>
      <p style={{
        fontSize: 11, fontWeight: 600, color: T, fontFamily: FF, marginBottom: 20,
        display: "inline-flex", alignItems: "center", gap: 4,
        backgroundColor: "#F0D4C4", padding: "4px 10px", borderRadius: 20,
      }}>
        Always anonymous
      </p>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>What's the issue?</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CONCERN_CATEGORIES.map((c) => (
            <Pill key={c} label={c} selected={category === c} onClick={() => setCategory(c)} small />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Where?</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CONCERN_LOCATIONS.map((l) => (
            <Pill key={l} label={l} selected={location === l} onClick={() => setLocation(l)} small />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionLabel>What would help?</SectionLabel>
        <TextArea placeholder="e.g. dishes are done by end of day" value={help} onChange={setHelp} rows={2} />
      </div>

      {/* Live preview */}
      <div style={{
        background: "#FDF5EE", border: `1.5px solid ${complete ? T : "#E7E0D5"}`,
        borderRadius: 14, padding: "14px 16px", marginBottom: 20, transition: "border-color 0.2s",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T, fontFamily: FF, marginBottom: 8 }}>
          Preview
        </p>
        <p style={{ fontSize: 14, fontFamily: FS, fontStyle: "italic", color: complete ? "#1A1209" : "#B0A090", lineHeight: 1.6, margin: 0 }}>
          "{preview}"
        </p>
      </div>

      <PrimaryBtn color="terra" disabled={!complete} onClick={handlePost}>Post concern</PrimaryBtn>
    </div>
  );
}

// ─── Compose: Shoutout ────────────────────────────────────────────────────────
function ComposeShoutout({ onPost, onCancel }) {
  const [mode,      setMode]      = useState(null);        // "specific" | "house"
  const [recipient, setRecipient] = useState(null);
  const [what,      setWhat]      = useState("");
  const [showName,  setShowName]  = useState(false);

  const complete = mode && what.trim() && (mode === "house" || recipient);

  const preview = mode === "specific" && recipient
    ? `${recipient.name} — ${what.trim() || "[what they did]"}. Thanks!`
    : mode === "house"
    ? (what.trim() || "[your message]")
    : null;

  const handlePost = () => {
    if (!complete) return;
    onPost({
      type: "shoutout",
      shoutoutMode: mode,
      recipient: mode === "specific" ? recipient?.name : null,
      content: mode === "specific"
        ? `${recipient.name} — ${what.trim()}. Thanks!`
        : what.trim(),
      author: showName ? YOU.name : null,
      timeAgo: "Just now", acknowledged: [], resolved: false, noResponse: false,
    });
  };

  const AVATAR_COLORS = ["terra", "sage"];

  return (
    <div>
      <Logo onBack={onCancel} />
      <h2 style={{ fontFamily: FS, fontSize: 22, fontWeight: 600, color: "#1A1209", marginBottom: 4 }}>Shoutout</h2>
      <p style={{ fontSize: 14, color: "#8A7A6E", fontFamily: FF, marginBottom: 20 }}>
        Put some good energy into the house.
      </p>

      {/* Mode picker */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel>Who's this for?</SectionLabel>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { value: "specific", label: "Someone specific" },
            { value: "house",    label: "The whole house"  },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setMode(value); setRecipient(null); setWhat(""); }}
              style={{
                flex: 1, padding: "10px", borderRadius: 12, cursor: "pointer",
                fontFamily: FF, fontSize: 13, fontWeight: 600, transition: "all 0.12s",
                border: `1.5px solid ${mode === value ? GOLD : "#E7E0D5"}`,
                backgroundColor: mode === value ? "#FDF8EE" : "#FAF6F1",
                color: mode === value ? GOLD : "#4A3A2E",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Specific: roommate picker */}
      {mode === "specific" && (
        <div style={{ marginBottom: 18 }}>
          <SectionLabel>Pick a roommate</SectionLabel>
          <div style={{ display: "flex", gap: 10 }}>
            {MEMBERS.map((m, i) => {
              const selected = recipient?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setRecipient(selected ? null : m)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "12px 20px", borderRadius: 14, cursor: "pointer",
                    border: `1.5px solid ${selected ? GOLD : "#E7E0D5"}`,
                    background: selected ? "#FDF8EE" : "#FAF6F1",
                    transition: "all 0.12s",
                  }}
                >
                  <Avatar initials={m.initials} color={AVATAR_COLORS[i % 2]} size={36} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#1A1209", fontFamily: FF }}>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Message */}
      {mode && (
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>
            {mode === "specific" ? "What did they do?" : "What do you want to say?"}
          </SectionLabel>
          <TextArea
            placeholder={
              mode === "specific"
                ? "e.g. cleaned the bathroom without it being their chore week"
                : "e.g. Whoever cleaned the bathroom last — you're an absolute angel!"
            }
            value={what}
            onChange={setWhat}
            rows={2}
          />
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={{
          background: "#FDF8EE", border: `1.5px solid ${complete ? GOLD : "#E7E0D5"}`,
          borderRadius: 14, padding: "14px 16px", marginBottom: 16, transition: "border-color 0.2s",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: GOLD, fontFamily: FF, marginBottom: 8 }}>
            Preview
          </p>
          <p style={{ fontSize: 14, fontFamily: FS, fontStyle: "italic", color: complete ? "#1A1209" : "#B0A090", lineHeight: 1.6, margin: 0 }}>
            "{preview}"
          </p>
        </div>
      )}

      {mode && <NameToggle showName={showName} onChange={setShowName} />}

      <PrimaryBtn color="gold" disabled={!complete} onClick={handlePost}>Post shoutout</PrimaryBtn>
    </div>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ post, onAcknowledge, onResolve }) {
  const cfg        = TYPE_CFG[post.type];
  const isConcern  = post.type === "concern";
  const isShoutout = post.type === "shoutout";
  const ackCount   = post.acknowledged.length;
  const youAcked   = post.acknowledged.includes(YOU.name);
  const isAnon     = !post.author;

  // Determine avatar color from author name
  const authorColor = isAnon ? "anon"
    : post.author === "Alex M." ? "terra"
    : post.author === "Sam K."  ? "sage"
    : "stone";

  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "14px 16px",
      border: "1px solid #F0EBE3",
      borderLeft: `3px solid ${cfg.borderColor}`,
      opacity: post.resolved ? 0.55 : 1, transition: "opacity 0.2s",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            initials={isAnon ? "?" : post.author.split(" ").map(w => w[0]).join("")}
            color={authorColor}
            size={30}
          />
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: isAnon ? "#B0A090" : "#1A1209", fontFamily: FF, fontStyle: isAnon ? "italic" : "normal" }}>
              {isAnon ? "Anonymous" : post.author}
            </span>
            <span style={{ fontSize: 11, color: "#B0A090", fontFamily: FF, marginLeft: 6 }}>{post.timeAgo}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {post.tag && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, backgroundColor: cfg.badgeBg, color: cfg.badgeColor, fontFamily: FF }}>
              {post.tag}
            </span>
          )}
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, backgroundColor: cfg.badgeBg, color: cfg.badgeColor, fontFamily: FF }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <p style={{
        fontSize: 14, color: "#1A1209", fontFamily: FF, lineHeight: 1.55,
        margin: 0, marginBottom: isConcern ? 12 : 0,
        fontStyle: isShoutout ? "italic" : "normal",
      }}>
        {isShoutout ? `"${post.content}"` : post.content}
      </p>

      {/* Concern actions */}
      {isConcern && !post.resolved && (
        <div>
          {post.noResponse && ackCount === 0 && (
            <p style={{ fontSize: 11, color: T, fontFamily: FF, fontWeight: 500, marginBottom: 10 }}>
              ⚠ No response yet
            </p>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onAcknowledge(post.id)}
              style={{
                flex: 1, padding: "8px", borderRadius: 10, border: "none",
                fontFamily: FF, fontSize: 12, fontWeight: 600, cursor: "pointer",
                backgroundColor: youAcked ? "#C4D9D3" : "#F0EBE3",
                color: youAcked ? S : "#6B6560", transition: "all 0.15s",
              }}
            >
              {youAcked ? "Acknowledged ✓" : `Acknowledge${ackCount > 0 ? ` (${ackCount})` : ""}`}
            </button>
            <button
              onClick={() => onResolve(post.id)}
              style={{
                flex: 1, padding: "8px", borderRadius: 10, border: "none",
                fontFamily: FF, fontSize: 12, fontWeight: 600, cursor: "pointer",
                backgroundColor: "#F0EBE3", color: "#6B6560", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C4D9D3"; e.currentTarget.style.color = S; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F0EBE3"; e.currentTarget.style.color = "#6B6560"; }}
            >
              Mark resolved
            </button>
          </div>
        </div>
      )}

      {isConcern && post.resolved && (
        <p style={{ fontSize: 12, color: S, fontFamily: FF, fontWeight: 600, marginTop: 8 }}>✓ Resolved</p>
      )}
    </div>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
function FeedView({ posts, onCompose, onAcknowledge, onResolve }) {
  const openConcerns = posts.filter((p) => p.type === "concern" && !p.resolved).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontFamily: FS, fontSize: 20, fontWeight: 600, color: "#1A1209" }}>
          Nest<span style={{ color: T }}>Mate</span>
        </span>
        {openConcerns > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, backgroundColor: "#F0D4C4", color: T, fontFamily: FF }}>
            {openConcerns} open concern{openConcerns !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <h2 style={{ fontFamily: FS, fontSize: 22, fontWeight: 600, color: "#1A1209", marginBottom: 4 }}>House Board</h2>
      <p style={{ fontSize: 13, color: "#8A7A6E", fontFamily: FF, marginBottom: 20 }}>
        The Loft on Eddy · {posts.length} post{posts.length !== 1 ? "s" : ""}
      </p>

      {/* Compose buttons — Share listed first per PRD */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { type: "share",    label: "＋ Share",    bg: "#EEF5F2", color: S,    border: "#C4D9D3" },
          { type: "concern",  label: "＋ Concern",  bg: "#FDF5EE", color: T,    border: "#F0D4C4" },
          { type: "shoutout", label: "＋ Shoutout", bg: "#FDF8EE", color: GOLD, border: "#F5E4B8" },
        ].map(({ type, label, bg, color, border }) => (
          <button
            key={type}
            onClick={() => onCompose(type)}
            style={{
              flex: 1, padding: "10px 6px", borderRadius: 12,
              border: `1.5px solid ${border}`, backgroundColor: bg,
              color, fontFamily: FF, fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "filter 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.96)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onAcknowledge={onAcknowledge} onResolve={onResolve} />
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BoardPage() {
  const [posts,   setPosts]   = useState(SEED_POSTS);
  const [view,    setView]    = useState("feed");
  const [visible, setVisible] = useState(true);

  const nav = (next) => {
    setVisible(false);
    setTimeout(() => { setView(next); setVisible(true); }, 180);
  };

  const handlePost = (newPost) => {
    // SUPABASE: supabase.from("board_posts").insert({ house_id, ...newPost })
    setPosts((prev) => [{ ...newPost, id: `p${Date.now()}` }, ...prev]);
    nav("feed");
  };

  const handleAcknowledge = (postId) => {
    // SUPABASE: supabase.from("acknowledgements").insert({ post_id, member_id: YOU.id })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId && !p.acknowledged.includes(YOU.name)
          ? { ...p, acknowledged: [...p.acknowledged, YOU.name], noResponse: false }
          : p
      )
    );
  };

  const handleResolve = (postId) => {
    // SUPABASE: supabase.from("board_posts").update({ resolved: true }).eq("id", postId)
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, resolved: true } : p)));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: CREAM, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, paddingTop: 32 }}>
      <div style={{
        width: "100%", maxWidth: 420,
        backgroundColor: "#fff", borderRadius: 28,
        padding: "28px 28px 24px",
        border: "1px solid #F0EBE3",
        boxShadow: "0 2px 16px rgba(28,18,10,0.07)",
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.18s ease, transform 0.18s ease",
      }}>
        {view === "feed"     && <FeedView posts={posts} onCompose={(t) => nav(t)} onAcknowledge={handleAcknowledge} onResolve={handleResolve} />}
        {view === "share"    && <ComposeShare    onPost={handlePost} onCancel={() => nav("feed")} />}
        {view === "concern"  && <ComposeConcern  onPost={handlePost} onCancel={() => nav("feed")} />}
        {view === "shoutout" && <ComposeShoutout onPost={handlePost} onCancel={() => nav("feed")} />}
      </div>
    </div>
  );
}
