"use client"
import { useRouter } from "next/navigation";

/* --------------------------------------------------------------
   [編集] 見た目の指定用に任意の variant を追加（省略時は従来どおり主ボタン）
   -------------------------------------------------------------- */
type GoButtonProps = {
    label: string
    goToPath: string
    variant?: "primary" | "outline"
}

export default function LoginButton({ label,goToPath,variant = "primary" }: GoButtonProps){
    const router = useRouter();
    /* --------------------------------------------------------------
       [編集] ブラウザ既定表示だったボタンに共通クラス（.btn）を適用
       -------------------------------------------------------------- */
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
