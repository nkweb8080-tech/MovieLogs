"use server"

import bcrypt from "bcryptjs"
import prisma from "@/app/Script/prosmaAction/prismaAction"

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  // 必須チェック
  if (!name || !email || !password) {
    throw new Error("すべて入力してください");
  }

  if (password.length < 8) {
    throw new Error(
      "パスワードは8文字以上にしてください"
    );
  }

  // 既に登録済みか確認(SELECT)
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "このメールアドレスは既に登録されています"
    );
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
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}