"use server"
import prisma from "@/app/Script/prosmaAction/prismaAction"
import { revalidatePath } from "next/cache";
import { Message } from "@/app/Common/Message"
import { formatDate } from "@/app/Common/CommonConst"
import { resetEditMode } from '@/app/Script/cookieAction/cookieAction'

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

export async function updateMovieLog(formData: FormData) {
    try
    {
        const movieId = String(formData.get("movieId"))
        const movieLogId = String(formData.get("movieLogId"))
        const watchDate = String(formData.get("watchDate"))
        const hyouka = Number(formData.get("hyouka"))
        const comment = String(formData.get("comment"))
        const watchedAt = new Date(watchDate)
        let date = new Date();

        // UPDATE
        const record = await prisma.movieRecord.update({
            where: {
                id: movieLogId,

            },
            data: {
                watchedAt:watchedAt,
                rating:hyouka,
                review:comment,
                updatedAt:date
            }
        });
        await resetEditMode()
        revalidatePath("/movie/movieDetailPage/"+movieId);
    }
    catch(e)
    {
        if (e instanceof Error) {
        console.error(e.message);
        }
        throw new Error(Message.COMMON.SYSTEM_ERROR);
    }
}


export async function deleteMovieLog(formData: FormData) {
    try
    {
        const movieId = String(formData.get("movieId"))
        const movieLogId = String(formData.get("movieLogId"))
        let date = new Date();

        // UPDATE
        const record = await prisma.movieRecord.update({
            where: {
                id: movieLogId,
                movieId:movieId
            },
            data: {
                updatedAt:date,
                deleteFlg:true
            }
        });
        await resetEditMode()
        revalidatePath("/movie/movieDetailPage/"+movieId);
    }
    catch(e)
    {
        if (e instanceof Error) {
        console.error(e.message);
        }
        throw new Error(Message.COMMON.SYSTEM_ERROR);
    }
}