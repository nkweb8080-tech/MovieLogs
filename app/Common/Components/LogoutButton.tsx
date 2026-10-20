"use client"
import { Logout } from "@/app/Script/Functions/LoginFunction"

export default function LogoutButton(){

    return (
        <form action={Logout}>
            <button type="submit" className="btn btn-primary w-full">ログアウト</button>
        </form>
    )
}