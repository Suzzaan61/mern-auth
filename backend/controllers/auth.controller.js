import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const {username, email, password, confirmPassword} = await req.body;

        const hashedPassword = await bcryptjs.hashSync(password, 12);

        if (!username || !username.length) {
            return res.status(400).json({error: 'Username is required',})
        }
        if (!email || !email.length) {
            return res.status(400).json({error: 'Email is required',})
        }
        if (!password || !password.length || !confirmPassword || !confirmPassword.length) {
            return res.status(400).json({error: 'Password and confirm password is required',})
        }
        if(password !== confirmPassword) {
            return res.status(400).json({error: 'Password didn\'t match',})
        }
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        })
        await newUser.save()
        return res.status(201).json({message: "successfully signup", newUser})
    } catch (err){
        next(errorHandler(err.status, err.message));
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        // CHECK VALID USER
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler("400", "user not found"));
        }

        // CHECK VALID PASSWORD
        const validPassword = await bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler("401", "Wrong Credentials",));
        }

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: hashedPassword, ...rest} = validUser._doc;

        const expireDate =new Date(Date.now() + 60 * 60 * 1000);
        res.cookie("access_token", token, { httpOnly: true, expires:expireDate })
            .status(200).json({message:"successful",rest});

    } catch (err){
        next(err)
    }
}