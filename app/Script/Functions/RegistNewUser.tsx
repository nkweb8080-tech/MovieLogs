"use server"
import bcrypt from "bcryptjs"
import prisma from "@/app/Script/Actions/prismaAction"
import { Message } from "@/app/Common/Message"
import { redirect } from "next/navigation"
import { getFormString, isValidEmail, isWithinPasswordBytes } from "@/app/Common/Validation"
import { throwSystemError } from "@/app/Common/ErrorHandler"

export async function registUser(formData: FormData) {
  try{
  // Security: FormDataの値を型チェックして取得
  const email = getFormString(formData, "email").trim().toLowerCase()
  const name = email
  const password = getFormString(formData, "password")
  const checkPassword = getFormString(formData, "checkPassword")

  // 必須チェック
  if (!email || !password || !checkPassword) {
    throw new Error(Message.VALID.NOT_INPUT_ALL)
  }

  // Security: メールアドレスの形式・長さを検証
  if (!isValidEmail(email)) {
    throw new Error(Message.VALID.ERROR_FORMAT_EMAIL)
  }

  //パスワード8ケタ未満
  if (password.length < 8) {
    throw new Error(Message.VALID.ERROR_KETA_PASSWORD)
  }

  // Security: bcryptは72バイト超を切り捨てるため、超過するパスワードを拒否
  if (!isWithinPasswordBytes(password)) {
    throw new Error(Message.VALID.ERROR_MAX_PASSWORD)
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

  // Refactor: createdAt/updatedAt はスキーマの @default(now()) / @updatedAt に任せる
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });
  }
  catch(e)
  {
    throwSystemError(e)
  }
  // Fix: redirect は例外で遷移するため try の外へ移動（登録成功時にシステムエラー扱いになる不具合を修正）
  redirect("/movie/LoginPage")
}
