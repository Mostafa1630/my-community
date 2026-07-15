"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { useAuth } from "@/lib/auth-context";
import { usePlatformStore } from "@/lib/platform-store";
import { getCourseById, getCommunityById, getCreatorById } from "@/lib/data";
import { getAccent, initials } from "@/lib/accents";
import EmptyState from "./EmptyState";

type Tab = "communities" | "courses";

export default function FavoritesView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { user, toggleFavorite } = useAuth();
  const store = usePlatformStore();
  const [tab, setTab] = useState<Tab>("communities");

  if (!user) {
    return <EmptyState icon={Heart} title={dict.common.empty} />;
  }

  const myFavorites = store.favorites.all.filter((f) => f.userId === user.id);
  const communityFavorites = myFavorites.filter((f) => f.favoritableType === "community");
  const courseFavorites = myFavorites.filter((f) => f.favoritableType === "course");
  const active = tab === "communities" ? communityFavorites : courseFavorites;

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("communities")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            tab === "communities" ? "border-primary-500 bg-primary-500 text-white" : "border-line text-ink/60"
          }`}
        >
          {dict.favorites.tabCommunities} ({communityFavorites.length})
        </button>
        <button
          onClick={() => setTab("courses")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            tab === "courses" ? "border-primary-500 bg-primary-500 text-white" : "border-line text-ink/60"
          }`}
        >
          {dict.favorites.tabCourses} ({courseFavorites.length})
        </button>
      </div>

      {active.length === 0 ? (
        <EmptyState icon={Heart} title={dict.favorites.empty} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((fav) => {
            if (fav.favoritableType === "community") {
              const community = getCommunityById(fav.favoritableId);
              if (!community) return null;
              const creator = getCreatorById(community.creatorId);
              const accent = getAccent(creator?.avatarAccent ?? "ink");
              const name = locale === "ar" ? community.nameAr : community.nameEn;
              return (
                <div key={fav.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
                  <Link href={`/${locale}/communities/${community.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${accent.gradient}`}>
                      {initials(name)}
                    </span>
                    <span className="min-w-0 truncate text-sm font-medium text-ink">{name}</span>
                  </Link>
                  <button
                    onClick={() => toggleFavorite("community", community.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink/40 hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            }

            const course = getCourseById(fav.favoritableId);
            if (!course) return null;
            const community = course.communityId ? getCommunityById(course.communityId) : undefined;
            const accent = getAccent(course.accent);
            const title = locale === "ar" ? course.titleAr : course.titleEn;
            const href = community
              ? `/${locale}/communities/${community.slug}/courses/${course.slug}`
              : `/${locale}/communities`;
            return (
              <div key={fav.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
                <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ${accent.gradient}`}>
                    {initials(title)}
                  </span>
                  <span className="min-w-0 truncate text-sm font-medium text-ink">{title}</span>
                </Link>
                <button
                  onClick={() => toggleFavorite("course", course.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink/40 hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
