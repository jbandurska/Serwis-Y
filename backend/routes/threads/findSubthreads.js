import { NotFoundError } from "../../exceptions/NotFoundError.js";
import Thread from "../../models/thread.model.js";

export const findSubthreads = async (
  threadId,
  subthreadId,
  time_direction,
  limit,
  includeEqual = false
) => {
  const newer = time_direction === "newer";

  let matchIdKey = newer ? "$gt" : "$lt";
  if (includeEqual) matchIdKey += "e";

  const thread = await Thread.findOne({
    _id: threadId,
  })
    .populate({
      path: "children",
      match: subthreadId
        ? {
            _id: {
              [matchIdKey]: subthreadId,
            },
          }
        : {},
      populate: {
        path: "user",
        select: "login",
      },
      options: {
        sort: {
          _id: newer ? 1 : -1,
        },
        limit,
      },
    })
    .lean();

  if (!thread)
    throw new NotFoundError(`Thread with id ${threadId} was not found`);

  return thread.children;
};
