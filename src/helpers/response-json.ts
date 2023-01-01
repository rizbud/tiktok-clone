import type { Response } from "express";
import { getReasonPhrase } from "http-status-codes";

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface IErrorData {
  value?: string;
  msg?: string;
  param?: string;
  location?: string;
}

const responseJson = (
  res: Response,
  status: number = 200,
  data?: any,
  pagination?: Pagination
) => {
  return res.status(status).send({
    response: {
      code: status,
      message: getReasonPhrase(status),
    },
    data,
    pagination,
  });
};

export default responseJson;

export const errorResponse = (
  res: Response,
  status: number = 200,
  data?: IErrorData
) => {
  return responseJson(res, status, {
    errors: [data],
  });
};
