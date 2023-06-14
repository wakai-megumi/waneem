import CreateError from "./CreateError.js";
import jwt from "jsonwebtoken";

export const VerifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        console.log(token, 'with tokendd')

        if (!token)
            return next(CreateError(401, "Not authenticated to access this resource, please login"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, ' with decode')
        console.log('secnond')
        req.user = decoded;
        console.log(req.user, ' user naher')
        next();
    } catch (err) {
        console.log(err)
        return next(CreateError(403, "This token is not valid anymore"));
    }
};

export const verifyAdmin = async (req, res, next) => {
    console.log("fist")
    try {
        await VerifyToken(req, res, async () => {
            console.log(req)
            if (!req.user || !req.user.isAdmin) {
                return next(CreateError(403, "You are not authorized to access this resource"));
            }

            next();
        });
    } catch (err) {
        return next(CreateError());


    }
};


export const verifyUser = async (req, res, next) => {
    try {
        await VerifyToken(req, res, async () => {

            console.log(req.user, ' inside token    ')
            if (req.user.id !== req.params.id && !req.user.isAdmin) {
                return next(CreateError(403, "You are not authorized to access this resource"));
            }
        });
        next();

    } catch (err) {

        return next(err);
    }
};
