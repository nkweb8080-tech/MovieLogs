//日付形式変換
export function formatDate(date: Date): string {
  return (
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
}

// Refactor: 画面で重複していた日付表示（YYYY-MM-DD）変換を共通化
export function toDateInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}