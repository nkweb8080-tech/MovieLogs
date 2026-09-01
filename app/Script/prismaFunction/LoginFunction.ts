import bcrypt from "bcryptjs"
import prisma from "@/app/Script/prosmaAction/prismaAction"
import { Message } from "@/app/Common/Message"

export async function Login(formData: FormData) {
    try{
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")

    const passwordHash = await bcrypt.hash(
        password,
        12
    );

    // 会員情報照会
    const existingUser =
        await prisma.user.findUnique({
            where: {
            email,
            },
    });

    // 会員情報未登録
    if (!existingUser || existingUser.deleteFlg || existingUser.passwordHash === passwordHash) {
        throw new Error(Message.VALID.YOU_ARE_NOT_USER);
    }

    //cookie登録　TODO

    }
    catch(e)
    {
        if (e instanceof Error) {
            console.error(e.message);
        }
        throw new Error(Message.COMMON.SYSTEM_ERROR);
    }
}