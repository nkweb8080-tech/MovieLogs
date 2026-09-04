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

//ログイン状況を保持
export async function setLoginCookie(user:string) {
  const cookieStore = await cookies()

  //3時間だけCookieを保持
  cookieStore.set( "isLogin", String(user),{maxAge:60*60*3})
}