import GoToButton from '@/app/Common/GoToPageButton'
import BackButton from "@/app/Common/PageBackButton"


export default async function LoginPage(){
    return (
        <main>
            <BackButton/>
            <h1>ログインページ</h1>
            <form>
                <p>ユーザID</p>
                <input type="text" name="email" placeholder="sample@gamil.com"/>
                <p>パスワード</p>
                <input type="text" name="password" placeholder="パスワード"/>
                <button type="submit">ログイン</button>
            </form>
            <GoToButton label="新規登録" goToPath='/movie/NewUserPage'></GoToButton>
        </main>
    )
}