/*
フォーム入力値の取得・検証をまとめたファイル
*/

//入力値の上限
export const MAX_EMAIL_LENGTH = 254
export const MAX_PASSWORD_BYTES = 72
export const MAX_TITLE_LENGTH = 500
export const MAX_REVIEW_LENGTH = 2000
export const MAX_RECORD_ID_LENGTH = 512
export const MIN_RATING = 1
export const MAX_RATING = 10

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const INTEGER_PATTERN = /^-?\d{1,15}$/

//FormDataから文字列を取得（未送信・File型は空文字として扱う）
export function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

//メールアドレス形式チェック
export function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email)
}

//bcrypt が扱える長さ（72バイト）以内かチェック
export function isWithinPasswordBytes(password: string): boolean {
  return new TextEncoder().encode(password).length <= MAX_PASSWORD_BYTES
}

//指定範囲の整数に変換（不正値は null）
export function parseIntInRange(value: string, min: number, max: number): number | null {
  if (!INTEGER_PATTERN.test(value)) return null
  const num = Number(value)
  return num >= min && num <= max ? num : null
}

//TMDBの映画ID（正の整数）に変換（不正値は null）
export function parseTmdbMovieId(value: string): number | null {
  return parseIntInRange(value, 1, Number.MAX_SAFE_INTEGER)
}

//YYYY-MM-DD 形式の日付に変換（存在しない日付は null）
export function parseDateInput(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  //2月31日などの繰り上がりを除外
  return date.toISOString().slice(0, 10) === value ? date : null
}

//鑑賞記録IDの形式チェック
export function isValidRecordId(id: string): boolean {
  return id.length > 0 && id.length <= MAX_RECORD_ID_LENGTH
}
