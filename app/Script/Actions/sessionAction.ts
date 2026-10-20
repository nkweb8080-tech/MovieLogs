/*
ユーザ情報などセッションに関する署名・検証・Cookie の読み書きをまとめたファイル
*/ 

"server-only"
import { cookies } from "next/headers"

//Cookieへの値設定
export async function setCookie(cookieName:string,value:string){
  const cookieStore = await cookies()

  //XSS,CSRF対策の属性付与
  cookieStore.set( cookieName, value,{
    maxAge:60*60*1,
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

//Cookieの値取得
export async function deleteCookie(cookieName:string){
  const cookieStore = await cookies()

  cookieStore.delete(cookieName)
}

//ユーザ情報の取得処理
export async function getUserInfo(){
  const isLogin = await getCookie("isLogin")

  return isLogin?.value ? isLogin?.value : ""
}