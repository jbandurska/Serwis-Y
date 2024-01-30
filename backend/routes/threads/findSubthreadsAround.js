import { BadRequestError } from "../../exceptions/BadRequestError.js";
import { findSubthreads } from "./findSubthreads.js";

export const findSubthreadsAround = async (threadId, subthreadId, limit) => {
  if (!subthreadId) {
    throw new BadRequestError(
      "Cannot send threads around a subthread without the subthread id (Query Params: threadId)"
    );
  }

  // in case limit is uneven
  const halfOfLimitCeil = Math.ceil(limit / 2);
  const halfOfLimitFloor = Math.floor(limit / 2);

  const newer = await findSubthreads(
    threadId,
    subthreadId,
    "newer",
    halfOfLimitCeil,
    true
  );
  const older = await findSubthreads(
    threadId,
    subthreadId,
    "older",
    halfOfLimitFloor
  );

  return newer.concat(older);
};
