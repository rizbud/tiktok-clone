import type { Request, Response } from "express";
import responseJson from "../helpers/response-json";
import db from "../utils/prisma";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const account = await db.account.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      return responseJson(res, 404, { message: "User not found" });
    }

    // @ts-ignore
    delete account.password;

    return responseJson(res, 200, {
      ...account,
      user: account.user[0],
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};
