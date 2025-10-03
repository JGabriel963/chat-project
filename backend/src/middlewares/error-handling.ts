import { AppError } from "@/utils/app-error";
import { ErrorRequestHandler } from "express";

import z, { ZodError } from "zod";

export const errorHandling: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: z.treeifyError(error),
    });
  }

  return response.status(500).json({
    message: error.message,
  });
};
