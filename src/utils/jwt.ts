import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const { JWT_ACCESS_SECRET = "secret", JWT_REFRESH_SECRET = "secret" } =
  process.env;

interface IJwtPayload {
  accountId: string;
}

export const generateAccessToken = (user: IJwtPayload) => {
  return jwt.sign(user, JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (user: IJwtPayload, jti: string) => {
  return jwt.sign(
    {
      accountId: user.accountId,
      jti,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const generateToken = (user: IJwtPayload, jti: string) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
