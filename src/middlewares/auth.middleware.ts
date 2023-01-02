import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import responseJson from "../helpers/response-json";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return responseJson(res, 401, { message: "Unauthorized" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.body.accountId = decoded.accountId;
    next();
  } catch (error: any) {
    return responseJson(res, 401, { message: error?.message });
  }
};
