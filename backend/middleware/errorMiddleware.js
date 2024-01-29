import { BadRequestError } from "../exceptions/BadRequestError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  console.error(err.stack);

  return res.status(500).json({ message: "Internal Server Error" });
};
