"use server"
import prisma from "@/app/Script/Actions/prismaAction"
import { revalidatePath } from "next/cache";
import { Message } from "@/app/Common/Message"
import { formatDate } from "@/app/Common/CommonConst"
import { resetEditMode } from '@/app/Script/Actions/cookieAction'
import { requireUserInfo } from "@/app/Script/Actions/sessionAction"
import { throwSystemError } from "@/app/Common/ErrorHandler"
import {
    getFormString,
    isValidRecordId,
    parseDateInput,
    parseIntInRange,
    parseTmdbMovieId,
    MAX_RATING,
    MAX_REVIEW_LENGTH,
    MAX_TITLE_LENGTH,
    MIN_RATING,
} from "@/app/Common/Validation"

// Refactor: 登録・更新で重複していた入力値の取得を共通化し、Security: 日付・評価・コメントを検証
function parseMovieLogInput(formData: FormData) {
    const watchedAt = parseDateInput(getFormString(formData, "watchDate"))
    const rating = parseIntInRange(getFormString(formData, "hyouka"), MIN_RATING, MAX_RATING)
    const review = getFormString(formData, "comment")

    if (!watchedAt || rating === null || review.length > MAX_REVIEW_LENGTH) {
        throw new Error(Message.VALID.INVALID_INPUT)
    }
    return { watchedAt, rating, review }
}

// Security: 映画ID・記録IDの形式を検証
function parseTargetIds(formData: FormData) {
    const movieId = parseTmdbMovieId(getFormString(formData, "movieId"))
    const movieLogId = getFormString(formData, "movieLogId")

    if (movieId === null || !isValidRecordId(movieLogId)) {
        throw new Error(Message.VALID.INVALID_INPUT)
    }
    return { movieId: String(movieId), movieLogId }
}

export async function registMovieLog(formData: FormData) {
    // Security: 登録者はフォームの hidden 値ではなく署名検証済みセッションから取得（なりすまし防止）
    const userId = await requireUserInfo()
    try
    {
        const tmdbMovieId = parseTmdbMovieId(getFormString(formData, "movieId"))
        const title = getFormString(formData, "title").trim()
        if (tmdbMovieId === null || !title || title.length > MAX_TITLE_LENGTH) {
            throw new Error(Message.VALID.INVALID_INPUT)
        }
        const movieId = String(tmdbMovieId)
        const { watchedAt, rating, review } = parseMovieLogInput(formData)
        const date = new Date();

        const id = formatDate(date)+"_"+movieId+"_"+userId

        // INSERT
        await prisma.movieRecord.create({
            data: {
            id:id,
            userId:userId,
            movieId,
            title,
            watchedAt:watchedAt,
            rating:rating,
            review:review,
            createdAt:date,
            updatedAt:date
            }
        });
        // Fix: 更新・削除と同様に、登録後の一覧へ即時反映されるよう再検証を追加
        revalidatePath("/movie/movieDetailPage/"+movieId);
    }
    catch(e)
    {
        throwSystemError(e)
    }
}

export async function updateMovieLog(formData: FormData) {
    const userId = await requireUserInfo()
    try
    {
        const { movieId, movieLogId } = parseTargetIds(formData)
        const { watchedAt, rating, review } = parseMovieLogInput(formData)
        const date = new Date();

        // UPDATE
        // Security: 他ユーザの記録を更新できないよう userId を条件に追加（IDOR対策）
        await prisma.movieRecord.update({
            where: {
                id: movieLogId,
                userId,
                movieId,
                deleteFlg: false,
            },
            data: {
                watchedAt:watchedAt,
                rating:rating,
                review:review,
                updatedAt:date
            }
        });
        await resetEditMode()
        revalidatePath("/movie/movieDetailPage/"+movieId);
    }
    catch(e)
    {
        throwSystemError(e)
    }
}


export async function deleteMovieLog(formData: FormData) {
    const userId = await requireUserInfo()
    try
    {
        const { movieId, movieLogId } = parseTargetIds(formData)
        const date = new Date();

        // UPDATE
        // Security: 他ユーザの記録を削除できないよう userId を条件に追加（IDOR対策）
        await prisma.movieRecord.update({
            where: {
                id: movieLogId,
                movieId:movieId,
                userId,
                deleteFlg: false,
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
        throwSystemError(e)
    }
}
