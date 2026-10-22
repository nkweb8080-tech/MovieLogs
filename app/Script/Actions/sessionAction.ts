/*
ユーザ情報などセッションに関する署名・検証・Cookie の読み書きをまとめたファイル
*/

// Security: 文字列式 "server-only" では効果がないため import に変更し、クライアントからの読み込みを防止
import "server-only"
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const LOGIN_COOKIE_NAME = "isLogin"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 1

//Cookieへの値設定
export async function setCookie(cookieName:string,value:string){
  const cookieStore = await cookies()

  //XSS,CSRF対策の属性付与
  cookieStore.set( cookieName, value,{
    maxAge:COOKIE_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  })
}

//Cookieの値取得
export async function getCookie(cookieName:string){
  const cookieStore = await cookies()

  return cookieStore.get(cookieName)
}

//Cookieの削除
export async function deleteCookie(cookieName:string){
  const cookieStore = await cookies()

  cookieStore.delete(cookieName)
}

// Security: セッション署名用シークレットを環境変数から取得（本番では未設定時にエラー）
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (secret && secret.length >= 32) return secret

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is not set or shorter than 32 characters")
  }

  //開発環境のみ：プロセス内で一時シークレットを生成（再起動でログイン状態は破棄される）
  const globalForSession = globalThis as unknown as { devSessionSecret?: string }
  if (!globalForSession.devSessionSecret) {
    console.warn("SESSION_SECRET is not set. Using a temporary secret for development.")
    globalForSession.devSessionSecret = randomBytes(32).toString("hex")
  }
  return globalForSession.devSessionSecret
}

type SessionPayload = {
  sub: string
  exp: number
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== "object" || value === null) return false
  const payload = value as Record<string, unknown>
  return typeof payload.sub === "string" && typeof payload.exp === "number"
}

function sign(data: string): string {
  return createHmac("sha256", getSessionSecret()).update(data).digest("base64url")
}

// Security: Cookie改ざんによるなりすましを防ぐため、ユーザ情報に有効期限とHMAC署名を付与
function encodeSession(email: string): string {
  const payload: SessionPayload = {
    sub: email,
    exp: Date.now() + COOKIE_MAX_AGE_SECONDS * 1000,
  }
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${data}.${sign(data)}`
}

// Security: 署名・有効期限を検証し、不正な値は未ログインとして扱う
function decodeSession(value: string): string | null {
  const parts = value.split(".")
  if (parts.length !== 2) return null
  const [data, signature] = parts

  const expected = Buffer.from(sign(data))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null

  try {
    const payload: unknown = JSON.parse(Buffer.from(data, "base64url").toString("utf8"))
    if (!isSessionPayload(payload) || payload.exp < Date.now()) return null
    return payload.sub
  } catch {
    return null
  }
}

//ログイン状態の保存
export async function setLoginSession(email: string) {
  await setCookie(LOGIN_COOKIE_NAME, encodeSession(email))
}

//ログイン状態の削除
export async function clearLoginSession() {
  await deleteCookie(LOGIN_COOKIE_NAME)
  // Security: 前ユーザの記録ID（メールアドレスを含む）等の画面状態Cookieをログアウト時に破棄
  for (const cookieName of ["showModal", "editId", "isEdit", "isDelete"]) {
    await deleteCookie(cookieName)
  }
}

//ユーザ情報の取得処理（未ログイン・不正なCookieの場合は空文字）
export async function getUserInfo(): Promise<string> {
  const session = await getCookie(LOGIN_COOKIE_NAME)

  return session?.value ? decodeSession(session.value) ?? "" : ""
}

// Security: 認証必須の処理向けに、未ログイン時はログイン画面へ遷移させる共通処理を追加
export async function requireUserInfo(): Promise<string> {
  const userId = await getUserInfo()
  if (!userId) {
    redirect("/movie/LoginPage")
  }
  return userId
}
