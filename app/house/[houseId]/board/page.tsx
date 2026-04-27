"use client";

import { useState } from "react";

type PostType = "Share" | "Concern" | "Shoutout" | "Request" | "Question";

interface Post {
  id: number;
  type: PostType;
  text: string;
  author: string;
  time: string;
  acknowledged?: boolean;
  resolved?: boolean;
}

const TYPE_STYLES: Record<PostType, { bg: string; color: string; emoji: string }> = {
  Share:    { bg: "#D8EBE0", color: "#4A7C5F", emoji: "🌿" },
  Concern:  { bg: "#F0DDD3", color: "#8B4A2E", emoji: "💬" },
  Shoutout: { bg: "#FEF3C0", color: "#92620D", emoji: "⭐" },
  Request:  { bg: "#E8E0F8", color: "#5534B7", emoji: "🙋" },
  Question: { bg: "#E0EEF8", color: "#1D5F8A", emoji: "❓" },
};

const ISSUE_CATEGORIES = ["Noise", "Cleanliness", "Guests", "Money", "Common areas"];
const LOCATIONS = ["Kitchen", "Bathroom", "Living room", "Whole house"];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    type: "Share",
    text: "Made too much pasta — there's a whole pot in the fridge, please eat it before Friday!",
    author: "Jordan",
    time: "2h ago",
  },
  {
    id: 2,
    type: "Concern",
    text: "I've noticed cleanliness in the kitchen has been an issue. It would help if dishes were done by end of day.",
    author: "Anonymous",
    time: "yesterday",
    acknowledged: false,
    resolved: false,
  },
  {
    id: 3,
    type: "Shoutout",
    text: "Jordan — you restocked the dish soap without being asked. Thanks!",
    author: "Aya",
    time: "3 days ago",
  },
  {
    id: 4,
    type: "Share",
    text: "Heads up — package delivery expected Friday afternoon, someone needs to be home or it'll get left outside.",
    author: "Priya",
    time: "4 days ago",
  },
];

// ─── New Post Modal ────────────────────────────────────────────────────────

function NewPostModal({
  onClose,
  onSubmit,
  initialType = "Share",
}: {
  onClose: () => void;
  onSubmit: (post: Omit<Post, "id" | "time">) => void;
  initialType?: PostType;
}) {
  const [type, setType] = useState<PostType>(initialType);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [helpText, setHelpText] = useState("");

  const concernPreview =
    category && location && helpText
      ? `I've noticed ${category.toLowerCase()} in the ${location.toLowerCase()} has been an issue. It would help if ${helpText}.`
      : category && location
      ? `I've noticed ${category.toLowerCase()} in the ${location.toLowerCase()} has been an issue. It would help if…`
      : "";

  const canSubmit =
    type === "Concern" ? !!(category && location && helpText) : text.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    const finalText = type === "Concern" ? concernPreview : text.trim();
    onSubmit({
      type,
      text: finalText,
      author: type === "Concern" ? "Anonymous" : "Aya (you)",
      acknowledged: type === "Concern" ? false : undefined,
      resolved: type === "Concern" ? false : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(44,36,22,0.45)" }}>
      <div
        className="w-full bg-nm-cream rounded-t-3xl max-h-[90vh] overflow-y-auto"
        style={{ border: "1px solid rgba(44,36,22,0.1)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(44,36,22,0.15)" }} />
        </div>

        <div className="px-6 pb-2 pt-2 flex items-center justify-between">
          <h2 className="font-serif text-[1.25rem] text-nm-ink">New post</h2>
          <button
            onClick={onClose}
            className="text-nm-muted text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-nm-sand transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-8 space-y-5">
          {/* Type picker — Share listed first per PRD */}
          <div>
            <div className="text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2.5">
              What kind of post?
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Share", "Concern", "Shoutout", "Request", "Question"] as PostType[]).map((t) => {
                const s = TYPE_STYLES[t];
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[14px] transition-all"
                    style={
                      type === t
                        ? { background: s.bg, border: `1.5px solid ${s.color}30`, color: s.color, fontWeight: "500" }
                        : { background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.12)", color: "#2C2416" }
                    }
                  >
                    <span>{s.emoji}</span>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concern guided template */}
          {type === "Concern" ? (
            <div className="space-y-4">
              <div
                className="rounded-xl p-3.5"
                style={{ background: "#F0DDD3", border: "1px solid rgba(196,113,74,0.2)" }}
              >
                <p className="text-[13px] leading-relaxed" style={{ color: "#8B4A2E" }}>
                  The template keeps things non-accusatory — your housemates will see the finished sentence, not an attack.
                </p>
              </div>

              <div>
                <div className="text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
                  What&apos;s the issue?
                </div>
                <div className="flex flex-wrap gap-2">
                  {ISSUE_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className="px-3.5 py-2 rounded-xl text-[14px] transition-all"
                      style={
                        category === c
                          ? { background: "#F0DDD3", border: "1.5px solid #C4714A", color: "#8B4A2E" }
                          : { background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.12)", color: "#2C2416" }
                      }
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
                  Where?
                </div>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocation(l)}
                      className="px-3.5 py-2 rounded-xl text-[14px] transition-all"
                      style={
                        location === l
                          ? { background: "#F0DDD3", border: "1.5px solid #C4714A", color: "#8B4A2E" }
                          : { background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.12)", color: "#2C2416" }
                      }
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
                  What would help?
                </div>
                <input
                  type="text"
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="e.g. dishes done by end of day"
                  className="w-full bg-nm-white rounded-xl px-4 py-3.5 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none"
                  style={{ border: "1px solid rgba(44,36,22,0.12)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
                />
              </div>

              {concernPreview && (
                <div className="rounded-xl p-4" style={{ background: "#F0DDD3" }}>
                  <div className="text-[11px] font-medium uppercase tracking-[0.07em] mb-1.5" style={{ color: "#8B4A2E" }}>
                    Your post will read:
                  </div>
                  <p className="text-[15px] leading-relaxed" style={{ color: "#2C2416" }}>
                    {concernPreview}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
                {type === "Shoutout" ? "Who and what did they do?" : "What's on your mind?"}
              </div>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  type === "Shoutout"
                    ? "e.g. Jordan — you cleaned the bathroom unprompted. Thanks!"
                    : type === "Share"
                    ? "e.g. Extra pasta in the fridge, help yourself!"
                    : type === "Request"
                    ? "e.g. Can someone pick up dish soap this week?"
                    : "e.g. Are we doing anything for move-in week?"
                }
                rows={4}
                className="w-full bg-nm-white rounded-xl px-4 py-3.5 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none resize-none"
                style={{ border: "1px solid rgba(44,36,22,0.12)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-4 text-white rounded-xl font-medium text-[16px] transition-all"
            style={{
              background: canSubmit ? "#C4714A" : "rgba(196,113,74,0.4)",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            Post to board
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────

function PostCard({
  post,
  onAcknowledge,
  onResolve,
}: {
  post: Post;
  onAcknowledge: (id: number) => void;
  onResolve: (id: number) => void;
}) {
  const style = TYPE_STYLES[post.type];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#FFFDFB",
        border: "1px solid rgba(44,36,22,0.08)",
        opacity: post.resolved ? 0.65 : 1,
      }}
    >
      {/* Content */}
      <div className="px-4 pt-4 pb-3">
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full mb-2.5"
          style={{ background: style.bg, color: style.color }}
        >
          <span>{style.emoji}</span>
          {post.type}
          {post.resolved && " · Resolved"}
        </span>

        <p className="text-[15px] text-nm-ink leading-relaxed">{post.text}</p>

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[12px] text-nm-muted">
            {post.author} · {post.time}
          </span>
          {/* "Seen ✓" only shows in meta area when acknowledged */}
          {post.type === "Concern" && post.acknowledged && !post.resolved && (
            <span className="text-[12px]" style={{ color: "#4A7C5F" }}>Seen ✓</span>
          )}
        </div>
      </div>

      {/* Action row — only for open Concerns */}
      {post.type === "Concern" && !post.resolved && (
        <div style={{ borderTop: "1px solid rgba(44,36,22,0.06)" }}>
          {!post.acknowledged ? (
            <button
              onClick={() => onAcknowledge(post.id)}
              className="w-full py-3.5 text-[14px] font-medium transition-colors hover:bg-nm-terra-light"
              style={{ color: "#C4714A" }}
            >
              Acknowledge — I saw this
            </button>
          ) : (
            <div className="grid grid-cols-2">
              <div
                className="py-3.5 text-[13px] text-nm-muted flex items-center justify-center"
                style={{ borderRight: "1px solid rgba(44,36,22,0.06)" }}
              >
                Acknowledged
              </div>
              <button
                onClick={() => onResolve(post.id)}
                className="py-3.5 text-[14px] font-medium transition-colors hover:bg-nm-green-light"
                style={{ color: "#4A7C5F" }}
              >
                Mark resolved
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<PostType>("Share");

  function openModal(initialType: PostType = "Share") {
    setModalInitialType(initialType);
    setShowModal(true);
  }

  function addPost(post: Omit<Post, "id" | "time">) {
    setPosts((prev) => [{ ...post, id: Date.now(), time: "just now" }, ...prev]);
  }

  function acknowledge(id: number) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, acknowledged: true } : p)));
  }

  function resolve(id: number) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, resolved: true } : p)));
  }

  const openConcerns = posts.filter((p) => p.type === "Concern" && !p.resolved).length;

  return (
    <div className="p-4 pb-24 space-y-3">
      {/* New post prompt */}
      <button
        onClick={() => openModal("Share")}
        className="w-full text-left px-5 py-4 rounded-2xl transition-colors"
        style={{ background: "#FFFDFB", border: "1px dashed rgba(196,113,74,0.4)" }}
      >
        <div className="text-[15px] text-nm-muted">+ What&apos;s going on in the house?</div>
        <div className="flex gap-2 mt-2">
          {(["Share", "Concern", "Shoutout"] as PostType[]).map((t) => {
            const s = TYPE_STYLES[t];
            return (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: s.bg, color: s.color }}
              >
                {t}
              </span>
            );
          })}
          <span className="text-[11px] text-nm-muted">+ more</span>
        </div>
      </button>

      {/* Pending concerns nudge */}
      {openConcerns > 0 && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: "#FFF5F1", border: "1px solid rgba(196,113,74,0.2)" }}
        >
          <span className="text-base">💬</span>
          <p className="text-[13px]" style={{ color: "#8B4A2E" }}>
            {openConcerns} concern{openConcerns > 1 ? "s" : ""} waiting for a response.
          </p>
        </div>
      )}

      {/* Concern template callout — only when no open concerns */}
      {openConcerns === 0 && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
        >
          <p className="text-[14px] text-nm-ink leading-relaxed mb-3">
            💬 Something bothering you? The Concern template turns &quot;you never do your dishes&quot; into a non-accusatory message your housemates can actually hear.
          </p>
          <button
            onClick={() => openModal("Concern")}
            className="text-[13px] font-medium px-3.5 py-2 rounded-xl transition-colors"
            style={{ background: "#F0DDD3", color: "#8B4A2E" }}
          >
            Try the Concern template →
          </button>
        </div>
      )}

      {/* Feed */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onAcknowledge={acknowledge}
          onResolve={resolve}
        />
      ))}

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={addPost}
          initialType={modalInitialType}
        />
      )}
    </div>
  );
}
