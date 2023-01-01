import db from "../utils/prisma";
import { hashToken } from "../utils/jwt";

export const addRefreshTokenToWhitelist = async (
  jti: string,
  refreshToken: string,
  accountId: string
) => {
  return await db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      accountId,
    },
  });
};

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = async (id: string) => {
  return await db.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshToken = async (id: string) => {
  return await db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = async (accountId: string) => {
  return await db.refreshToken.updateMany({
    where: {
      accountId,
    },
    data: {
      revoked: true,
    },
  });
};
