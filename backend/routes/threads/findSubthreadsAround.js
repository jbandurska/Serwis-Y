import { BadRequestError } from "../../exceptions/BadRequestError.js";
import { findSubthreads } from "./findSubthreads.js";

export const findSubthreadsAround = async (threadId, subthreadId, limit) => {
  if (!subthreadId) {
    throw new BadRequestError(
      "Cannot send threads around a subthread without the subthread id (Query Params: threadId)"
    );
  }

  const halfOfLimit = Math.floor(limit / 2);

  const newer = await findSubthreads(
    threadId,
    subthreadId,
    "newer",
    halfOfLimit
  );
  const older = await findSubthreads(
    threadId,
    subthreadId,
    "older",
    halfOfLimit
  );

  return newer.concat(older);
};
