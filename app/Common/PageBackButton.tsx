"use client"
import { useRouter } from "next/navigation";

//戻るボタン
export default function BackButton() {
  const router = useRouter();

  /* --------------------------------------------------------------
     [編集] 共通クラス（.btn）とアイコンを追加し、戻る動作を視覚化
     -------------------------------------------------------------- */
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="btn btn-ghost btn-sm -ml-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      戻る
    </button>
  );
}
