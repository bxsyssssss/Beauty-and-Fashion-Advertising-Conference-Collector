"use client";
import { SeasonEvent } from "@/lib/types";

interface Props { events: SeasonEvent[] }

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const TYPE_LABELS: Record<string, string> = {
  holiday: "공휴일", love: "기념일", sale: "세일", beauty: "뷰티", global: "글로벌",
};

export default function SeasonCalendar({ events }: Props) {
  const upcoming = events
    .map((e) => ({ ...e, days: daysUntil(e.date) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 8);

  return (
    <section>
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        📅 다가오는 시즌
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {upcoming.map((e) => (
          <div
            key={e.name}
            className="shrink-0 rounded-2xl p-4 min-w-[130px] text-white flex flex-col gap-1"
            style={{ background: e.color }}
          >
            <span className="text-xs font-medium opacity-80">
              {TYPE_LABELS[e.type] ?? e.type}
            </span>
            <span className="font-bold text-base leading-tight">{e.name}</span>
            <span className="text-2xl font-black mt-1">D-{e.days}</span>
            <span className="text-xs opacity-70">{e.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
