const authorize = (...roles) => {//...roles uses JavaScript's rest parameter to collect all passed roles into an array. This allows the same middleware to authorize multiple roles (e.g., admin, manager, seller) without rewriting the logic, making it flexible and reusable.
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

        next();
    };
};

module.exports = authorize;