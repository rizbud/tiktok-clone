import type { Request, Response } from "express";
import responseJson from "../helpers/response-json";
import { verifyAccessToken } from "../utils/jwt";
import db from "../utils/prisma";

export const getContents = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    order = "createdAt",
  } = req.query;

  try {
    const total = await db.content.count({
      where: {
        deletedAt: null,
      },
    });
    const totalPage = Math.ceil(total / Number(limit));
    const content = await db.content.findMany({
      include: {
        author: true,
        _count: {
          select: {
            comment: true,
            like: true,
          },
        },
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      orderBy: {
        [order as string]: sort,
      },
      where: {
        deletedAt: null,
      },
    });

    content.forEach((item) => {
      // @ts-ignore
      delete item.author.password;
    });

    return responseJson(res, 200, {
      data: content,
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

export const getContent = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const { id } = req.params;

  try {
    const content = await db.content.findUnique({
      include: {
        author: true,
        _count: {
          select: {
            comment: true,
            like: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!content || content.deletedAt) {
      return responseJson(res, 404, { message: "Content not found" });
    }

    // @ts-ignore
    delete content.author.password;

    if (accountId) {
      const existing = await db.alreadyViewedContent.findFirst({
        where: {
          contentId: id,
          viewerId: accountId,
        },
      });

      if (!existing) {
        await db.alreadyViewedContent.create({
          data: {
            viewerId: accountId,
            contentId: id,
          },
        });
      }
    }

    return responseJson(res, 200, content);
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const createContent = async (req: Request, res: Response) => {
  const { caption } = req.body;
  const { file } = req;

  const token = req.headers.authorization?.split(" ")[1];
  const decoded = verifyAccessToken(token!);

  try {
    const content = await db.content.create({
      data: {
        caption,
        mediaUrl: file?.path || "",
        authorId: decoded.accountId,
      },
      include: {
        author: true,
      },
    });

    // @ts-ignore
    delete content.author.password;

    return responseJson(res, 201, content);
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const { id } = req.params;

  try {
    const content = await db.content.findFirst({
      where: {
        id,
        authorId: accountId,
      },
    });

    if (!content || content.deletedAt) {
      return responseJson(res, 404, { message: "Content not found" });
    }

    await db.content.update({
      where: {
        id,
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
