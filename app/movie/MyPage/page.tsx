import MyPageComponent from "@/app/Common/MyPageComponents"

export default async function MyPage(){
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">マイページ</h1>
      <MyPageComponent/>
    </main>
  );
}