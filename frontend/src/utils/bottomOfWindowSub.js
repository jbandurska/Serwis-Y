export const bottomOfWindowSub = (cb) => {
  // document.documentElement.offsetHeight: the amount of pixels
  // for the entire height of the document element.

  // document.documentElement.scrollTop: the current
  // amount of pixels positioned from the top of the document element.

  // window.innerHeight: the number of pixels for the height of the screen.

  const bottomOfWindowFn = () => {
    let bottomOfWindow =
      Math.abs(
        document.documentElement.scrollTop +
          window.innerHeight -
          document.documentElement.offsetHeight
      ) <= 1;

    if (bottomOfWindow) {
      cb();
    }
  };

  window.addEventListener('scroll', bottomOfWindowFn);

  return () => {
    window.removeEventListener('scroll', bottomOfWindowFn);
  };
};
