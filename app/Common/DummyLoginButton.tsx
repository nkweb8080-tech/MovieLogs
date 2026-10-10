"use client"
import { DummyLogin } from "@/app/Script/prismaFunction/LoginFunction"

export default function DummyLoginButton(){
    return (
        <form action={DummyLogin}>
            <button type="submit" className="btn btn-primary w-full">ダミー</button>
        </form>
    )
}