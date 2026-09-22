import prisma from "@/app/Script/prosmaAction/prismaAction"
import { getUserInfo } from '@/app/Script/cookieAction/cookieAction'
import { Message } from "@/app/Common/Message"

export async function getMovieLogs() {
    const userId = String(await getUserInfo())

    if(!userId)return null;

    // 鑑賞記録取得
    const movieLogs = 
        await prisma.movieRecord.findMany({
            where: {
            userId,
            deleteFlg:false
            },
    });

    return movieLogs
}