// Refactor: Server Action を呼ぶだけのフォームのため "use client" を外し、クライアントJSを削減
import { DummyLogin } from "@/app/Script/Functions/LoginFunction"

export default function DummyLoginButton(){
    return (
        <form action={DummyLogin}>
            <button type="submit" className="btn btn-primary w-full">ダミー</button>
        </form>
    )
}
