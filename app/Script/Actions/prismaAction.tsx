// Security: DB接続情報を扱うためサーバ専用モジュールとして明示
import "server-only"
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Security: 非nullアサーションをやめ、接続文字列の未設定を明示的なエラーにする
function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  return databaseUrl
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Refactor: 既存インスタンスを再利用する場合はアダプタを生成しないよう変更
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: getDatabaseUrl(),
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
