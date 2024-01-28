export const topOfWindowSub = (cb) => {
  // document.documentElement.offsetHeight: the amount of pixels
  // for the entire height of the document element.

  // document.documentElement.scrollTop: the current
  // amount of pixels positioned from the top of the document element.

  // window.innerHeight: the number of pixels for the height of the screen.

  const topOfWindowFn = () => {
    let topOfWindow = document.documentElement.scrollTop === 0;

    if (topOfWindow) {
      cb();
    }
  };

  window.addEventListener('scroll', topOfWindowFn);

  return () => {
    window.removeEventListener('scroll', topOfWindowFn);
  };
};
