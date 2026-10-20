/*
UIの状態変化に関するCookieの登録・参照をまとめたファイル
TODO：ファイルのリネーム
*/ 
"use server";
import { redirect } from "next/navigation"
import { setCookie,getCookie,deleteCookie } from "@/app/Script/Actions/sessionAction"

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
  await deleteCookie( "isLogin")
}