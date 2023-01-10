import type { Request, Response } from "express";
import db from "../utils/prisma";
import responseJson from "../helpers/response-json";

export const getLikes = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    order = "createdAt",
  } = req.query;
  const { contentId } = req.params;

  try {
    const total = await db.like.count({
      where: {
        contentId,
      },
    });
    const totalPage = Math.ceil(total / Number(limit));
    const likes = await db.like.findMany({
      include: {
        account: true,
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      orderBy: {
        [order as string]: sort,
      },
      where: {
        contentId,
      },
    });

    likes.forEach((item) => {
      // @ts-ignore
      delete item.account.password;
    });

    return responseJson(res, 200, {
      data: likes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPage,
      },
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const createLike = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const { contentId } = req.params;

  try {
    const content = await db.content.findUnique({
      where: {
        id: contentId,
      },
      include: {
        like: true,
      },
    });

    if (!content || content.deletedAt) {
      return responseJson(res, 404, { message: "Content not found" });
    }

    if (content.like.some((item) => item.accountId === accountId)) {
      return responseJson(res, 400, { message: "Already liked" });
    }

    await db.like.create({
      data: {
        accountId,
        contentId,
      },
    });

    return responseJson(res, 201, { message: "Liked!" });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const { contentId } = req.params;

  try {
    const like = await db.like.findFirst({
      where: {
        contentId,
        accountId,
      },
    });

    if (!like || like.deletedAt) {
      return responseJson(res, 404, { message: "Like not found" });
    }

    await db.like.deleteMany({
      where: {
        contentId,
        accountId,
      },
    });

    return responseJson(res, 204);
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};
