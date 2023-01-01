import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwt";
import { addRefreshTokenToWhitelist } from "../services/auth.service";
import { createUserByEmailAndPassword } from "../services/user.service";
import responseJson from "../helpers/response-json";

import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseJson(res, 422, { errors: errors.array() });
  }

  const { email, password, username, fullName } = req.body;

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
};
