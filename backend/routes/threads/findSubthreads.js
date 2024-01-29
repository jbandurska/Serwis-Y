import { NotFoundError } from "../../exceptions/NotFoundError.js";
import Thread from "../../models/thread.model.js";

export const findSubthreads = async (
  threadId,
  subthreadId,
  time_direction,
  limit
) => {
  const newer = time_direction === "newer";

  const thread = await Thread.findOne({
    _id: threadId,
  })
    .populate({
      path: "children",
      match: subthreadId
        ? {
            _id: newer
              ? {
                  $gt: subthreadId,
                }
              : {
                  $lt: subthreadId,
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

  console.log(thread);

  if (!thread)
    throw new NotFoundError(`Thread with id ${threadId} was not found`);

  return thread.children;
};
