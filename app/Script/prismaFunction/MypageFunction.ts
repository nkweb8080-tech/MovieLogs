import prisma from "@/app/Script/prosmaAction/prismaAction"
import { Message } from "@/app/Common/Message"

export async function getMovieLogs(userId:string,movieId:string) {

    if(!userId)return null;

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