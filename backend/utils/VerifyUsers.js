import jwt from "jsonwebtoken";
import {errorHandler} from "./error.js";

export const verifyToken = async (req, res, next) => {
    const {token} = req.body;

    console.log(req.body);

    if (!token) {
        return next(errorHandler(401, "you are not authorized"));
    }
    console.log("user verified");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, "Token not verified"));
        }
        req.user = user;
        next();
    });
}