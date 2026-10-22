/*
UIの状態変化に関するCookieの登録・参照をまとめたファイル
TODO：ファイルのリネーム
*/
"use server";
import { setCookie,getCookie,getUserInfo } from "@/app/Script/Actions/sessionAction"
import { redirect } from "next/navigation"
import { getFormString, isValidRecordId } from "@/app/Common/Validation"

//モーダルの展開処理をCookieで制御
export async function setToggleModal() {
  // Security: Cookieの有無ではなく署名検証済みのログイン情報で判定
  const userId = await getUserInfo()

  if(!userId){
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
  // Security: 未送信時の "null" 文字列化や過大な値をCookieへ保存しないよう検証
  const rawEditId = getFormString(formData, "editId")
  const editId = isValidRecordId(rawEditId) ? rawEditId : ""
  const isEdit = currentEditId?.value !== editId

  await setCookie( "editId", editId)
  await setCookie( "isEdit", String(isEdit))
}

//削除モード制御
export async function setDeleteMode() {
  const currentDeleteMode = await getCookie("isDelete")
  const isdelete = currentDeleteMode?.value === "true"

  await setCookie( "isDelete", String(!isdelete))
}

// Security: 任意のユーザ名でログインCookieを設定できる Server Action（setLoginCookie / resetLoginCookie）を廃止し、sessionAction のサーバ専用関数へ移管
