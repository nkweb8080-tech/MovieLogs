"use server";
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

//モーダルの展開処理をCookieで制御
export async function setToggleModal() {
  const cookieStore = await cookies()

  const isLogin = cookieStore.get("isLogin")
  if(!isLogin){
    redirect("/movie/LoginPage")
  }
  else{
    const current = cookieStore.get("showModal")?.value === "true"

    cookieStore.set( "showModal", String(!current))
  }
}

//ユーザ情報の取得処理
export async function getUserInfo(){
  const cookieStore = await cookies()
  const isLogin = cookieStore.get("isLogin")?.value? cookieStore.get("isLogin")?.value : ""
  return isLogin
}

//鑑賞記録編集後、編集モードを終了させるため、Cookie情報を更新
export async function resetEditMode() {
  const cookieStore = await cookies()
  cookieStore.set( "editId", "")
  cookieStore.set( "isEdit", "false")
}

//編集モードをCookie情報を登録することで制御
export async function setEditMode(formData: FormData) {
  const cookieStore = await cookies()
  const currentEditId = cookieStore.get("editId")?.value
  const editId = String(formData.get("editId"))
  const isEdit = currentEditId != editId

  cookieStore.set( "editId", String(editId))
  cookieStore.set( "isEdit", String(isEdit))
}

//削除モード制御
export async function setDeleteMode() {
  const cookieStore = await cookies()
  const isdelete = cookieStore.get("isDelete")?.value === "true"

  cookieStore.set( "isDelete", String(!isdelete))
}

//ログイン状況を保持取得
export async function setLoginCookie(user:string) {
  const cookieStore = await cookies()

  //3時間だけCookieを保持
  cookieStore.set( "isLogin", String(user),{maxAge:60*60*3})
}