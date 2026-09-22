import MyPageComponent from "@/app/Common/MyPageComponents"
import { getMovieLogs } from "@/app/Script/prismaFunction/MypageFunction"

export default async function MyPage(){
  const logs = await getMovieLogs();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">マイページ</h1>
      <MyPageComponent/>
    </main>
  );
}