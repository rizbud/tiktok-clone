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

    const jti = uuidv4();
    const accessToken = generateToken(
      {
        accountId: Account.id,
      },
      jti
    );

    await addRefreshTokenToWhitelist(jti, accessToken.refreshToken, Account.id);

    return responseJson(res, 201, {
      message: "User created successfully",
      accessToken: accessToken.accessToken,
      refreshToken: accessToken.refreshToken,
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
    const user = await findAccountByUsername(username);
    const isValid = await bcrypt.compare(password, user!.password);

    if (!isValid) {
      return responseJson(res, 401, {
        errors: [
          {
            value: password,
            msg: "Invalid password",
            param: "password",
            location: "body",
          },
        ],
      });
    }

    const jti = uuidv4();
    const accessToken = generateToken(
      {
        accountId: user!.id,
      },
      jti
    );

    await addRefreshTokenToWhitelist(jti, accessToken.refreshToken, user!.id);

    return responseJson(res, 200, {
      message: "Login successfully",
      accessToken: accessToken.accessToken,
      refreshToken: accessToken.refreshToken,
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

    const user = await findAccountById(payload.accountId ?? "");
    if (!user) {
      return errorResponse(res, 401, {
        msg: "User not found",
      });
    }

    await deleteRefreshToken(savedRefreshToken!.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      { accountId: user!.id },
      jti
    );

    await addRefreshTokenToWhitelist(jti, newRefreshToken, user!.id);

    return responseJson(res, 200, {
      message: "Refresh token successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return responseJson(res, 500, { error });
  }
};
