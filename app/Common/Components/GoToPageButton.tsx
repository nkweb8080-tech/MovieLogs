"use client"
import { useRouter } from "next/navigation";

type GoButtonProps = {
    label: string
    goToPath: string
    variant?: "primary" | "outline"
}

// Refactor: 汎用の画面遷移ボタンのため、実態に合わせて関数名を変更
export default function GoToPageButton({ label,goToPath,variant = "primary" }: GoButtonProps){
    const router = useRouter();
    //ブラウザ既定表示だったボタンに共通クラス（.btn）を適用
    return (
        <button
            type="button"
            onClick={() => router.push(goToPath)}
            className={`btn ${variant === "outline" ? "btn-outline" : "btn-primary"}`}
        >
            {label}
        </button>
    )
}
