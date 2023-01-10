import type { Request, Response } from "express";
import db from "../utils/prisma";
import responseJson from "../helpers/response-json";

export const getComments = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    order = "createdAt",
  } = req.query;
  const { contentId } = req.params;

  try {
    const total = await db.comment.count({
      where: {
        deletedAt: null,
        contentId,
      },
    });
    const totalPage = Math.ceil(total / Number(limit));
    const comments = await db.comment.findMany({
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
        deletedAt: null,
      },
    });

    comments.forEach((item) => {
      // @ts-ignore
      delete item.account.password;
    });

    return responseJson(res, 200, {
      data: comments,
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

export const createComment = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const { contentId } = req.params;

  try {
    const content = await db.content.findUnique({
      where: {
        id: contentId,
      },
    });

    if (!content || content.deletedAt) {
      return responseJson(res, 404, { message: "Content not found" });
    }

    const comment = await db.comment.create({
      data: {
        comment: req.body.comment,
        accountId,
        contentId,
      },
      include: {
        account: true,
      },
    });

    // @ts-ignore
    delete comment.account.password;

    return responseJson(res, 201, comment);
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const { contentId, commentId } = req.params;

  try {
    const comment = await db.comment.findFirst({
      where: {
        id: commentId,
        contentId,
        accountId,
      },
    });

    if (!comment || comment.deletedAt) {
      return responseJson(res, 404, { message: "Comment not found" });
    }

    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return responseJson(res, 204);
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};
