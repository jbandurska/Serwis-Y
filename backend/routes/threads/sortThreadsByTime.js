export const sortThreadsByTime = (threads) => {
  const sortedThreads = threads.sort((a, b) => {
    if (b.createdAt === a.createdAt) {
      return b.toHexString().localeCompare(a.toHexString());
    }

    return b.createdAt - a.createdAt;
  });

  return sortedThreads;
};
