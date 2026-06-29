"use client";

interface Props {
  onClose: () => void;
}

export default function CollectModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <span className="text-4xl">⚡</span>
          <h2 className="text-xl font-bold text-gray-900 mt-3">리서치 수집 안내</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            메타 광고 수집은 <strong>본인 맥북에서</strong> 실행해야 합니다.
            (클라우드에서 실행 시 메타가 차단해요)
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
          <p className="font-semibold text-gray-700">수집 방법</p>
          <div className="space-y-2 text-gray-600">
            <div className="flex gap-2">
              <span className="bg-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p>터미널에서 <code className="bg-gray-200 px-1 rounded text-xs">ad-reference-collector</code> 폴더로 이동</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p>아래 명령어 실행:</p>
            </div>
            <code className="block bg-gray-900 text-green-400 text-xs p-3 rounded-lg">
              bash scripts/collect_and_push.sh
            </code>
            <div className="flex gap-2">
              <span className="bg-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p>완료 후 <strong>1~2분 뒤</strong> 이 페이지를 새로고침하면 새 광고가 반영됩니다</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
