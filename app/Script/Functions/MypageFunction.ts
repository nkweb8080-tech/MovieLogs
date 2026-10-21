import prisma from "@/app/Script/Actions/prismaAction"
import { getUserInfo } from '@/app/Script/Actions/sessionAction'

export async function getMovieLogs(movieId:string) {

    const userId = await getUserInfo()
    if(userId === "") return null;

    // 鑑賞記録取得
    if(!movieId){
        const movieLogs = 
            await prisma.movieRecord.findMany({
                where: {
                userId,
                deleteFlg:false
                },
        });
        return movieLogs
    }
    else
    {
        const movieLogs = 
            await prisma.movieRecord.findMany({
                where: {
                userId,
                movieId,
                deleteFlg:false
                },
        });
        return movieLogs
    }
}