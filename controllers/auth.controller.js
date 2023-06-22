import User from "../models/user.model.js"
import CreateError from "../utils/CreateError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Sendtoken } from "../utils/Sendtoken.js"


export const register = async (req, res, next) => {
    try {
        const { password, isAdmin, ...data } = req.body;
        let isadmin = false;

        // Verify the token
        const token = req.cookies.access_token;



        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.isAdmin) {
                isadmin = req.body.isAdmin || false;
            }
        }

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return next(CreateError(400, `User with email ${data.email} already exists`));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const user = new User({
            ...data,
            password: hashedPassword,
            isAdmin: isadmin,
        });

        // Save the user
        await user.save();

        // Generate and send the token
        return Sendtoken(user, res, 200, "User registered successfully", next);
    } catch (err) {
        return next(err);
    }
};

// ... rest of the code remains unchanged



export const login = async (req, res, next) => {



    try {

        //check whether  someone exist with this email
        const user = await User.findOne({ email: req.body.email })

        if (user === null || !user) return res.status(400).json({ success: false, message: "invalid credentials" })
        // //dehashing the password
        const ispasswordcorrect = await bcrypt.compare(req.body.password, user.password)
        if (!ispasswordcorrect) return res.status(400).json({ success: false, message: "invalid credentials" })
        const { password, isAdmin, ...other } = user._doc

        return Sendtoken({ ...other, isAdmin }, res, 200, `welcome back , ${user.username}`, next)

    } catch (err) {
        return next(err)
    }

}
export const logout = (req, res, next) => {
    try {
        res.cookie("access_token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: process.env.DEVELOPMENT_MODE ? 'lax' : 'none',
            secure: process.env.DEVELOPMENT_MODE ? false : true
        }).json({
            success: true,
            message: "logout successfull",
        })
    } catch (err) {
        return next(err)
    }

}
