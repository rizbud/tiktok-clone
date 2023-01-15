import type { Request, Response } from "express";
import responseJson from "../helpers/response-json";
import db from "../utils/prisma";

export const follow = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { accountId } = req.body;

  try {
    const account = await db.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      return responseJson(res, 404, { message: "User not found" });
    }

    const follow = await db.follow.create({
      data: {
        followerId: accountId,
        followingId: id,
      },
    });

    return responseJson(res, 201, follow);
  } catch (error) {
    return responseJson(res, 500, error);
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { accountId } = req.body;

  try {
    const account = await db.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      return responseJson(res, 404, { message: "User not found" });
    }

    await db.follow.deleteMany({
      where: {
        followerId: accountId,
        followingId: id,
      },
    });

    return responseJson(res, 204);
  } catch (error) {
    return responseJson(res, 500, error);
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { accountId } = req.body;

  const targetId = id === "me" ? accountId : id;

  try {
    const account = await db.account.findUnique({
      where: {
        id: targetId,
      },
    });

    if (!account) {
      return responseJson(res, 404, { message: "User not found" });
    }

    const followers = await db.follow.findMany({
      where: {
        follower: {
          follower: {
            some: {
              followingId: targetId,
            },
          },
        },
      },
      include: {
        follower: {
          include: {
            user: true,
          },
        },
      },
    });

    const data = followers.map((follower) => {
      // @ts-ignore
      delete follower.follower.password;

      return {
        ...follower,
        follower: {
          ...follower.follower,
          user: follower.follower.user[0],
        },
      };
    });

    return responseJson(res, 200, data);
  } catch (error) {
    return responseJson(res, 500, error);
  }
};

export const getFollowings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { accountId } = req.body;

  const targetId = id === "me" ? accountId : id;

  try {
    const account = await db.account.findUnique({
      where: {
        id: targetId,
      },
    });

    if (!account) {
      return responseJson(res, 404, { message: "User not found" });
    }

    const followings = await db.follow.findMany({
      where: {
        following: {
          following: {
            some: {
              followerId: targetId,
            },
          },
        },
      },
      include: {
        following: {
          include: {
            user: true,
          },
        },
      },
    });

    const data = followings.map((following) => {
      // @ts-ignore
      delete following.following.password;

      return {
        ...following,
        following: {
          ...following.following,
          user: following.following.user[0],
        },
      };
    });

    return responseJson(res, 200, data);
  } catch (error) {
    return responseJson(res, 500, error);
  }
};
