"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, getRelativeTime, getInitials } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  TrendingUp,
  Award,
  Lightbulb,
  X,
  Send,
  Trophy,
  Leaf,
} from "lucide-react";

// Realistic dummy community data
const SAMPLE_POSTS = [
  {
    id: "p1", userId: "u1", userName: "Priya Sharma", userImage: null,
    title: "Switched to electric!", type: "PROGRESS",
    content: "Just completed my first month with an EV. Saved 180 kg CO₂ compared to my old petrol car. The charging infrastructure is getting so much better in my city!",
    likesCount: 47, commentsCount: 12, isLiked: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "p2", userId: "u2", userName: "Alex Chen", userImage: null,
    title: "Earned my first Gold Badge!", type: "ACHIEVEMENT",
    content: "After 30 consecutive days of logging activities, I finally earned the 'Eco Warrior' badge! This platform has completely changed how I think about my daily choices.",
    likesCount: 89, commentsCount: 23, isLiked: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "p3", userId: "u3", userName: "Maria Garcia", userImage: null,
    title: "Tip: Meal prep saves carbon!", type: "TIP",
    content: "I started batch-cooking on Sundays using seasonal vegetables. Not only am I saving money, but I've reduced my food waste by 60% and my food-related emissions by 40%. Highly recommend!",
    likesCount: 156, commentsCount: 34, isLiked: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "p4", userId: "u4", userName: "James Wilson", userImage: null,
    title: "Completed Bike to Work Challenge", type: "CHALLENGE",
    content: "5 days of cycling to work — 35 km saved from driving. My legs are tired but my conscience is clear! Who else is doing this challenge?",
    likesCount: 72, commentsCount: 18, isLiked: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "p5", userId: "u5", userName: "Aisha Patel", userImage: null,
    title: "Our office went green!", type: "DISCUSSION",
    content: "Convinced my whole office to switch to renewable energy provider. 15 people, estimated 12 tonnes CO₂ saved per year. Sometimes the biggest impact comes from influencing groups, not just individual action.",
    likesCount: 203, commentsCount: 45, isLiked: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Emma Green", xp: 4850, level: 8, co2Saved: 342 },
  { rank: 2, name: "Raj Kumar", xp: 4200, level: 7, co2Saved: 298 },
  { rank: 3, name: "Sofia Martinez", xp: 3900, level: 7, co2Saved: 276 },
  { rank: 4, name: "Alex Chen", xp: 3450, level: 6, co2Saved: 234 },
  { rank: 5, name: "Yuki Tanaka", xp: 3100, level: 6, co2Saved: 210 },
];

const typeIcons: Record<string, typeof TrendingUp> = {
  PROGRESS: TrendingUp,
  ACHIEVEMENT: Award,
  TIP: Lightbulb,
  CHALLENGE: Award,
  DISCUSSION: MessageCircle,
};

export default function CommunityPage() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p,
      ),
    );
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newPost = {
      id: `p${Date.now()}`,
      userId: "me",
      userName: "You",
      userImage: null,
      title: newTitle,
      content: newContent,
      type: "PROGRESS",
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setShowCreate(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-zinc-100">
            Community
          </h1>
          <p className="text-zinc-400 mt-1">
            Share progress, join discussions, and inspire others
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer",
            "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
            "hover:brightness-110 shadow-lg shadow-emerald-500/20",
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Post</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create Post */}
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="card-base p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-100">Create Post</h3>
                <button onClick={() => setShowCreate(false)} aria-label="Close" className="cursor-pointer text-zinc-450 hover:text-zinc-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-4 py-2 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-650 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-3"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share your eco journey..."
                rows={3}
                className="w-full px-4 py-2 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-650 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none mb-3"
              />
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Post
              </button>
            </motion.div>
          )}

          {/* Posts */}
          {posts.map((post, i) => {
            const TypeIcon = typeIcons[post.type] || MessageCircle;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-base p-5"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(post.userName)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-200">{post.userName}</p>
                    <p className="text-xs text-zinc-500">
                      {getRelativeTime(new Date(post.createdAt))}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border",
                      "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    )}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {post.type.charAt(0) + post.type.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-semibold mb-1 text-zinc-200">{post.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.08]">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-sm transition-colors cursor-pointer",
                      post.isLiked
                        ? "text-red-400"
                        : "text-zinc-500 hover:text-red-400",
                    )}
                    aria-label={post.isLiked ? "Unlike" : "Like"}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        post.isLiked && "fill-current",
                      )}
                    />
                    {post.likesCount}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-450 transition-colors cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    {post.commentsCount}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-450 transition-colors cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar: Leaderboard */}
        <div className="space-y-6">
          <div className="card-base p-5">
            <h2 className="font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
              <Trophy className="w-4 h-4 text-emerald-400" />
              Leaderboard
            </h2>
            <div className="space-y-3">
              {LEADERBOARD.map((user) => (
                <div
                  key={user.rank}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-xl border border-transparent",
                    user.rank <= 3 && "bg-white/[0.02] border-white/[0.06]",
                  )}
                >
                  <span className="text-sm font-bold w-6 text-center flex items-center justify-center">
                    {user.rank === 1 ? (
                      <Trophy className="w-4 h-4 text-amber-400" />
                    ) : user.rank === 2 ? (
                      <Trophy className="w-4 h-4 text-zinc-350" />
                    ) : user.rank === 3 ? (
                      <Trophy className="w-4 h-4 text-amber-700" />
                    ) : (
                      `#${user.rank}`
                    )}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-zinc-200">{user.name}</p>
                    <p className="text-xs text-zinc-500">
                      Lv.{user.level} · {user.co2Saved} kg saved
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    {user.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div className="card-base p-5">
            <h2 className="font-semibold font-heading mb-4 text-zinc-100 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Eco Groups
            </h2>
            <div className="space-y-3">
              {[
                { name: "Zero Waste Living", members: 1234 },
                { name: "Bike Commuters", members: 856 },
                { name: "Plant-Based Foodies", members: 2341 },
                { name: "Renewable Energy Advocates", members: 678 },
              ].map((group) => (
                <div
                  key={group.name}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{group.name}</p>
                    <p className="text-xs text-zinc-500">
                      {group.members.toLocaleString()} members
                    </p>
                  </div>
                  <button className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 font-medium hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
