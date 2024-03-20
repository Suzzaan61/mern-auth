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
            return next(errorHandler("401", "wrong Credentials",));
        }

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: hashedPassword, ...rest} = validUser._doc;

        const expireDate = new Date(Date.now() + 60 * 60 * 1000); // Expiry time 1 hour from now
        res.cookie("access_token", token, { expires: expireDate, httpOnly: true });
        res.status(200).json({ message: "successful", rest });

    } catch (err){
        next(err)
    }
}

export const google = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(user){
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        const {password: hashedPassword, ...rest} = user._doc;
        const expireDate =new Date(Date.now() + 60 * 60 * 1000);
        res.cookie("access_token", token, { httpOnly: true, expires:expireDate }).status(200).json({message:"successful",rest});

    } else{
        const generatePassword = Math.random().toString(36).slice(-8);
        const randomNumber = Math.floor(Math.random() * 10000);
        const hashedPassword = await bcryptjs.hashSync(generatePassword, 12);
        const newUser = new User({
            username: req.body.name.split(" ").join("").toLowerCase() + randomNumber.toString(),
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.photo,
        })
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);

        const {password: hashedPassword2, ...rest} = newUser._doc;
        const expireDate =new Date(Date.now() + 60 * 60 * 1000);
        res.cookie("access_token", token, { httpOnly: true, expires:expireDate }).status(201).json({message:"successful",rest});
    }
}