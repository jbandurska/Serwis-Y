export const bottomOfWindowSub = (cb) => {
  const bottomOfWindowFn = () => {
    let bottomOfWindow =
      Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;

    if (bottomOfWindow) {
      cb();
    }
  };

  window.addEventListener('scroll', bottomOfWindowFn);

  return () => {
    window.removeEventListener('scroll', bottomOfWindowFn);
  };
};
