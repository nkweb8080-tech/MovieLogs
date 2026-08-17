"use client"
import { useRouter } from "next/navigation";

type GoButtonProps = {
    label: string
    goToPath: string
}

export default function LoginButton({ label,goToPath }: GoButtonProps){
    const router = useRouter();
    return (
        <button onClick={() => router.push(goToPath)}>{label}</button>        
    )
}