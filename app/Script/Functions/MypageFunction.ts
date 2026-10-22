// Security: DBアクセスを行うためサーバ専用モジュールとして明示
import "server-only"
import prisma from "@/app/Script/Actions/prismaAction"

export async function getMovieLogs(userId:string,movieId?:string) {

    if(!userId)return null;

    // 鑑賞記録取得
    // Refactor: movieId の有無で重複していたクエリを1つに統合（undefined の条件は Prisma が無視する）
    return prisma.movieRecord.findMany({
        where: {
            userId,
            movieId: movieId || undefined,
            deleteFlg:false
        },
    });
}
