import { Message } from "@/app/Common/Message"

//エラー詳細はサーバログにのみ出力し、利用者へは汎用メッセージを返す
export function throwSystemError(e: unknown): never {
  if (e instanceof Error) {
    console.error(e.message)
  }
  throw new Error(Message.COMMON.SYSTEM_ERROR)
}
