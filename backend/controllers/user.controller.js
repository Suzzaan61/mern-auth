import {errorHandler} from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = function(req, res) {
    res.json({ message: "Welcome to the server" });
}

export const updateUser =async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You don't have permission to update"));
    }
    try{
        let hashedPassword;
        console.log(req.body);
        if (req.body.password){
             hashedPassword = await bcryptjs.hashSync(req.body.password, 12);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.profilePicture,
            }
        },{new: true});

        const {password, ...rest} = updateUser._doc;

        return res.status(200).json({message:"User updated successfully", user:rest});

    } catch (err){
        next(err);
    }

}