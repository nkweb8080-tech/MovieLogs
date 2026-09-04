"use server"
import bcrypt from "bcryptjs"
import prisma from "@/app/Script/prosmaAction/prismaAction"
import { Message } from "@/app/Common/Message"
import { redirect } from "next/navigation"

export async function registUser(formData: FormData) {
  try{
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const name = email
  const password = String(formData.get("password") ?? "")
  const checkPassword = String(formData.get("checkPassword") ?? "")

  let date = new Date();
  const createdAt = date
  const updatedAt = date

  // 必須チェック
  if (!email || !password || !checkPassword) {
    throw new Error(Message.VALID.NOT_INPUT_ALL)
  }

  //パスワード8ケタ未満
  if (password.length < 8) {
    throw new Error(Message.VALID.ERROR_KETA_PASSWORD)
  }

  //確認用と不一致
  if(password !== checkPassword){
    throw new Error(Message.VALID.ERROR_CHECK_PASSWORD)
  }

  // 既に登録済みか確認(SELECT)
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  //メール登録済み
  if (existingUser) {
    throw new Error(Message.VALID.ERROR_EXIST_EMAIL);
  }

  // パスワードをハッシュ化
  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  // INSERT
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      createdAt,
      updatedAt
    },
  });

  redirect("/movie/LoginPage")
  }
  catch(e)
  {
    if (e instanceof Error) {
      console.error(e.message);
    }
    throw new Error(Message.COMMON.SYSTEM_ERROR);
  }
}