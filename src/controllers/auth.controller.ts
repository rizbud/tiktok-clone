import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { generateToken, hashToken, verifyAccessToken } from "../utils/jwt";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from "../services/auth.service";
import {
  createUserByEmailAndPassword,
  findAccountById,
  findAccountByUsername,
} from "../services/user.service";
import responseJson, { errorResponse } from "../helpers/response-json";

import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseJson(res, 422, { errors: errors.array() });
  }

  const { email, password, username, fullName } = req.body;

  try {
    const [Account] = await createUserByEmailAndPassword({
      email,
      password,
      username,
      fullName,
    });

    return responseJson(res, 201, {
      message: "User created successfully",
      account: {
        id: Account.id,
        username: Account.username,
        email: Account.email,
      },
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseJson(res, 422, { errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const account = await findAccountByUsername(username);
    const isValid = await bcrypt.compare(password, account!.password);

    if (!isValid) {
      return errorResponse(res, 401, {
        value: password,
        msg: "Invalid password",
        param: "password",
        location: "body",
      });
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateToken(
      {
        accountId: account!.id,
      },
      jti
    );

    await addRefreshTokenToWhitelist(jti, refreshToken, account!.id);

    return responseJson(res, 200, {
      message: "Login successfully",
      accessToken,
      refreshToken,
      account: {
        id: account!.id,
        username: account!.username,
        email: account!.email,
      },
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseJson(res, 422, { errors: errors.array() });
  }

  const { refreshToken } = req.body;

  try {
    const payload = verifyAccessToken(refreshToken);
    const savedRefreshToken = await findRefreshTokenById(payload.jti ?? "");

    if (!savedRefreshToken || savedRefreshToken.revoked) {
      return errorResponse(res, 401, {
        msg: "Invalid refresh token",
        param: "refreshToken",
        location: "body",
      });
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken!.hashedToken) {
      return errorResponse(res, 401, {
        msg: "Invalid refresh token",
        param: "refreshToken",
        location: "body",
      });
    }

    const account = await findAccountById(payload.accountId ?? "");
    if (!account) {
      return errorResponse(res, 401, {
        msg: "User not found",
      });
    }

    await deleteRefreshToken(savedRefreshToken!.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      { accountId: account!.id },
      jti
    );

    await addRefreshTokenToWhitelist(jti, newRefreshToken, account!.id);

    return responseJson(res, 200, {
      message: "Refresh token successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    await deleteRefreshToken(token!);

    return responseJson(res, 200, {
      message: "Logout successfully",
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};
