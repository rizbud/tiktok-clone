import bcrypt from "bcrypt";
import db from "../utils/prisma";

export interface IUserPayload {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export const findAccountByEmail = async (email: string) => {
  return await db.account.findUnique({
    where: {
      email,
    },
  });
};

export const createUserByEmailAndPassword = async (user: IUserPayload) => {
  user.password = bcrypt.hashSync(user.password, 12);

  return await db.$transaction([
    db.account.create({
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
      },
    }),
    db.user.create({
      data: {
        fullName: user.fullName,
        account: {
          connect: {
            username: user.username,
          },
        },
      },
    }),
  ]);
};

export const findAccountByUsername = async (username: string) => {
  return await db.account.findUnique({
    where: {
      username,
    },
  });
};

export const findAccountById = async (id: string) => {
  return await db.account.findUnique({
    where: {
      id,
    },
  });
};
