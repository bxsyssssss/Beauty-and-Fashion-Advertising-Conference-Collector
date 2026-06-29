import { TrendSource } from "@/lib/types";

interface Props { sourceKey: string; source: TrendSource; }

export default function TrendSourceCard({ source }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{source.emoji}</span>
        <div>
          <p className="font-bold text-gray-900 text-sm">{source.name}</p>
          <p className="text-xs text-gray-400">{source.description}</p>
        </div>
      </div>

      {/* 아이템 */}
      <ol className="space-y-2.5">
        {source.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-xs font-black text-gray-300 w-4 shrink-0 mt-0.5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-800 hover:text-brand transition truncate block"
              >
                {item.text}
              </a>
              <p className="text-xs text-gray-400 truncate">{item.subtext}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
