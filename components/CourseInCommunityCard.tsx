import Link from "next/link";
import { PlayCircle } from "lucide-react";
import type { Community, Course } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { t } from "@/lib/i18n/t";
import { getAccent } from "@/lib/accents";
import FavoriteButton from "./FavoriteButton";

export default function CourseInCommunityCard({
  course,
  community,
  locale,
  dict
}: {
  course: Course;
  community: Community;
  locale: Locale;
  dict: Dictionary;
}) {
  const accent = getAccent(course.accent);
  const title = locale === "ar" ? course.titleAr : course.titleEn;

  return (
    <Link
      href={`/${locale}/communities/${community.slug}/courses/${course.slug}`}
      className="hover-lift group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card hover:border-primary-200"
    >
      <div className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${accent.gradient}`}>
        <span className="seal-ring h-12 w-12 border-white/50 text-white transition-transform duration-300 group-hover:scale-110">
          <PlayCircle size={22} className="text-white" />
        </span>
        <div className="absolute top-3 end-3">
          <FavoriteButton favoritableType="course" favoritableId={course.id} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-primary-700">
          {title}
        </h3>
        <p className="mt-auto text-xs text-ink/50">
          {t(dict.communityDetails.lessonsCount, { count: course.lessons.length })}
        </p>
      </div>
    </Link>
  );
}
