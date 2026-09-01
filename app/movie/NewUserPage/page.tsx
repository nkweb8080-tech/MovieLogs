import BackButton from "@/app/Common/PageBackButton"
import { registUser } from "@/app/Script/registFunction/RegistNewUser"

export default async function WelcomePage(){
    return (
        <main>
            <BackButton/>
            <h1>新規登録</h1>
            <form action={ registUser }>
                <p>Eメール</p>
                <input type="text" name="email" placeholder="sample@.com"/>
                <p>パスワード</p>
                <input type="text" name="password" placeholder="パスワード"/>
                <p>確認用</p>
                <input type="text" name="checkPassword" placeholder="もう一度入力してください"/>
                <button type="submit">新規登録</button>
            </form>
        </main>
    )
}