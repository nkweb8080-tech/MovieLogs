"use server"
import path from "path";
import bcrypt from "bcryptjs"
import prisma from "@/app/Script/Actions/prismaAction"
import { readFile } from "fs/promises";
import { Message } from "@/app/Common/Message"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache";
import { setLoginSession,clearLoginSession } from "@/app/Script/Actions/sessionAction"
import { getFormString, isValidEmail } from "@/app/Common/Validation"
import { throwSystemError } from "@/app/Common/ErrorHandler"


export async function DummyLogin(){
    // Security: ボタン非表示だけでなくサーバ側でも開発環境以外での実行を拒否
    if (process.env.NODE_ENV !== "development") {
        throw new Error(Message.COMMON.SYSTEM_ERROR)
    }

    const filePath = path.join(
        process.cwd(),
        "app",
        "dummy.txt"
    )

    // Security: 末尾の改行等を除去し、メール形式でない値はセッションに設定しない
    const email = (await readFile(filePath, "utf8")).trim()
    if (!isValidEmail(email)) {
        throw new Error(Message.COMMON.SYSTEM_ERROR)
    }

    await setLoginSession(email)
    revalidatePath("/movie/TopPage")
}

export async function Login(formData: FormData) {
    try{
        // Security: FormDataの値を型チェックして取得し、形式不正な入力はDB照会前に弾く
        const email = getFormString(formData, "email").trim().toLowerCase()
        const password = getFormString(formData, "password")
        if (!isValidEmail(email) || !password) {
            throw new Error(Message.VALID.YOU_ARE_NOT_USER);
        }

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

        const isPassword = await bcrypt.compare(password, existingUser.passwordHash)
        if(!isPassword){
            throw new Error(Message.VALID.YOU_ARE_NOT_USER)
        }

        await setLoginSession(email)
    }
    catch(e)
    {
        // Refactor: 共通のエラー処理を利用
        throwSystemError(e)
    }
    redirect("/movie/TopPage")
}

export async function Logout() {
    await clearLoginSession()
}
