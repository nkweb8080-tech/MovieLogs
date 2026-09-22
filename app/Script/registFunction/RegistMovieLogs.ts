"use server"
import prisma from "@/app/Script/prosmaAction/prismaAction"
import { Message } from "@/app/Common/Message"
import { formatDate } from "@/app/Common/CommonConst"

export async function registMovieLog(formData: FormData) {
    try
    {
        const userId = String(formData.get("userId"))
        const movieId = String(formData.get("movieId"))
        const title = String(formData.get("title"))
        const watchDate = String(formData.get("watchDate"))
        const watchedAt = new Date(watchDate)
        const hyouka = Number(formData.get("hyouka"))
        const comment = String(formData.get("comment"))
        let date = new Date();

        const id = formatDate(date)+"_"+movieId+"_"+userId

        // INSERT
        const record = await prisma.movieRecord.create({
            data: {
            id:id,
            userId:userId,
            movieId,
            title,
            watchedAt:watchedAt,
            rating:hyouka,
            review:comment,
            createdAt:date,
            updatedAt:date
            }
        });
    }
    catch(e)
    {
        if (e instanceof Error) {
        console.error(e.message);
        }
        throw new Error(Message.COMMON.SYSTEM_ERROR);
    }
}