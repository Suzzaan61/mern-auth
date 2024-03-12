import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";

export const signup = async (req, res, next) => {
    try {
        const {username, email, password, confirmPassword} = req.body;

        const hashedPassword = await bcryptjs.hashSync(password, 12);

        if (!username || !email || !password || !password) {
            return res.status(400).send({error: 'Username, email and password is required',})
        }
        if (!email || !email.length) {
            return res.status(400).send({error: 'Email is required',})
        }
        if (!password || !password.length || !confirmPassword || !confirmPassword) {
            return res.status(400).send({error: 'Password is required',})
        }
        if(password !== confirmPassword) {
            return res.status(400).send({error: 'Password didn\'t match',})
        }
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        })
        await newUser.save()
        return res.status(201).json({message: "successfully signup", newUser})
    } catch (err){
        next(err);
    }


}