"use server";
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

//Cookieへの値設定
async function setCookie(cookieName:string,value:string){
  const cookieStore = await cookies()

  //XSS,CSRF対策の属性付与
  cookieStore.set( cookieName, value,{
    maxAge:60*60*3,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  })
}

//Cookieの値取得
async function getCookie(cookieName:string){
  const cookieStore = await cookies()

  return cookieStore.get(cookieName)
}

//モーダルの展開処理をCookieで制御
export async function setToggleModal() {
  const isLogin = await getCookie("isLogin")

  if(!isLogin){
    redirect("/movie/LoginPage")
  }
  else{
    const showModal = await getCookie("showModal")
    const currentModal =  showModal?.value === "true"

    await setCookie( "showModal", String(!currentModal))
  }
}

//ユーザ情報の取得処理
export async function getUserInfo(){
  const isLogin = await getCookie("isLogin")

  return isLogin?.value ? isLogin?.value : ""
}

//鑑賞記録編集後、編集モードを終了させるため、Cookie情報を更新
export async function resetEditMode() {
  await setCookie( "editId", "")
  await setCookie( "isEdit", "false")
}

//編集モードをCookie情報を登録することで制御
export async function setEditMode(formData: FormData) {
  const currentEditId = await getCookie("editId")
  const editId = String(formData.get("editId"))
  const isEdit = currentEditId?.value != editId

  await setCookie( "editId", String(editId))
  await setCookie( "isEdit", String(isEdit))
}

//削除モード制御
export async function setDeleteMode() {
  const currentDeleteMode = await getCookie("isDelete")
  const isdelete = currentDeleteMode?.value === "true"

  await setCookie( "isDelete", String(!isdelete))
}

//ログイン状況を保持取得
export async function setLoginCookie(user:string) {
  await setCookie( "isLogin", String(user))
}

//ログイン状況を削除（仮）
export async function resetLoginCookie() {
  await setCookie( "isLogin", "")
}