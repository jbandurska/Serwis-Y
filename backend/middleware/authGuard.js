export const authGuard = (router) => {
  router.use((req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.status(401).json({
      message: "Unauthorized access",
    });
  });
};
