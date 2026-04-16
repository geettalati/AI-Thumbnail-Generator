const protect = (req, res, next) => {
    const { isLoggedIn } = req.session;
    const sessionUser = req.session.user;
    if (!isLoggedIn || !sessionUser) {
        return res.status(401).json({ message: "Unauthorized! Please log in to access this resource." });
    }
    next();
};
export default protect;
