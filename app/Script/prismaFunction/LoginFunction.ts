"use server"
import bcrypt from "bcryptjs"
import prisma from "@/app/Script/prosmaAction/prismaAction"
import { Message } from "@/app/Common/Message"
import { redirect } from "next/navigation"
import { setLoginCookie } from "@/app/Script/cookieAction/cookieAction"

export async function Login(formData: FormData) {
    try{
        const email = String(formData.get("email") ?? "").trim().toLowerCase()
        const password = String(formData.get("password") ?? "")

        // 会員情報照会
        const existingUser =
            await prisma.user.findUnique({
                where: {
                email,
                },
        });

        // 会員情報未登録
        if (!existingUser || existingUser.deleteFlg) {
            throw new Error(Message.VALID.YOU_ARE_NOT_USER);
        }

        let isPassword = await bcrypt.compare(password, existingUser.passwordHash)
        if(!isPassword){
            throw new Error(Message.VALID.YOU_ARE_NOT_USER)    
        }
        
        await setLoginCookie(email)
    }
    catch(e)
    {
        if (e instanceof Error) {
            console.error(e.message);
        }
        throw new Error(Message.COMMON.SYSTEM_ERROR);
    }
    redirect("/movie/TopPage")
}