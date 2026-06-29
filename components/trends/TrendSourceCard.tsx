import { TrendSource } from "@/lib/types";

interface Props { sourceKey: string; source: TrendSource; }

export default function TrendSourceCard({ source }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{source.emoji}</span>
        <div>
          <p className="font-bold text-gray-900 text-xs">{source.name}</p>
          <p className="text-xs text-gray-400">{source.description}</p>
        </div>
      </div>
      <ol className="space-y-2">
        {source.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-200 w-3 shrink-0">{i + 1}</span>
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="flex-1 min-w-0"
            >
              <p className="text-xs font-semibold text-gray-800 hover:text-brand transition truncate">{item.text}</p>
              <p className="text-xs text-gray-400 truncate">{item.subtext}</p>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
