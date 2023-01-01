import type { Response } from "express";
import { getReasonPhrase } from "http-status-codes";

interface Pagination {
  page: number;
  limit: number;
  total: number;
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
