import prisma from "@/app/Script/prosmaAction/prismaAction"
import { getUserInfo } from '@/app/Script/cookieAction/cookieAction'
import { Message } from "@/app/Common/Message"

export async function registMovieLog(formData: FormData) {
    try
    {
        const userId = String(await getUserInfo())
        const movieId = String(formData.get("movieId"))
        const logId = movieId + userId
        const watchDate = String(formData.get("watchDate"))
        const watchedAt = new Date(watchDate)
        const hyouka = Number(formData.get("hyouka"))
        const comment = String(formData.get("comment"))
        let date = new Date();
        const createdAt = date
        const updatedAt = date


        // INSERT
        const user = await prisma.movieRecord.create({
            data: {
            id:logId,
            userId,
            movieId,
            watchedAt,
            rating:hyouka,
            review:comment,
            createdAt,
            updatedAt
            }
        });
    }
    catch
    {

    }
}