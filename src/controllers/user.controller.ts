import type { Request, Response } from "express";
import responseJson from "../helpers/response-json";
import db from "../utils/prisma";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { accountId } = req.body;

  try {
    const account = await db.account.findUnique({
      where: {
        id: id ?? accountId,
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      return responseJson(res, 404, { message: "User not found" });
    }

    const followers = await db.follow.count({
      where: {
        followingId: id ?? accountId,
      },
    });

    const followings = await db.follow.count({
      where: {
        followerId: id ?? accountId,
      },
    });

    // @ts-ignore
    delete account.password;

    return responseJson(res, 200, {
      ...account,
      followers,
      followings,
      user: account.user[0],
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};
