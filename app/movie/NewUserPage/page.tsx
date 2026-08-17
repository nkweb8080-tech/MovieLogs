import BackButton from "@/app/Common/PageBackButton"

export default async function LoginPage(){
    return (
        <main>
            <BackButton/>
            <h1>新規登録</h1>
            <form>
                <p>ユーザID</p>
                <input type="text" name="userId" placeholder="ユーザID"/>
                <p>パスワード</p>
                <input type="text" name="password" placeholder="パスワード"/>
                <button type="submit">新規登録</button>
            </form>
        </main>
    )
}