const authorize = (...roles) => {//...roles uses JavaScript's rest parameter to collect all passed roles into an array. This allows the same middleware to authorize multiple roles (e.g., admin, manager, seller) without rewriting the logic, making it flexible and reusable.
    return (req, res, next) => {//return the actual express middleware

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({//suppose role have admin and manager so for a customer we have 403 meaning authenticated but not allowed
                message: "Access Denied"
            });
        }

        next();
    };
};

module.exports = authorize;
/**
 authorize(...roles) is a higher-order function that returns an Express middleware.
The roles array is preserved by a closure, so it is available during every request.
roles.includes(req.user.role) checks whether the logged-in user's role is one of the allowed roles.
Return 403 Forbidden when the user is authenticated but lacks permission.
Call next() only when authorization succeeds.
 */