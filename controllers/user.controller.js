import User from "../models/user.model.js"
import CreateError from "../utils/CreateError.js"




//update user
export const updateUser = async (req, res) => {
    const { id } = req.params
    const { email, password, ...other } = req.body
    console.log(id)
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })
        console.log(user)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user

        })

    }

    catch (error) {
        return res.status(409).json({ error })
    }

}
//delete hotel
export const deleteUser = async (req, res) => {


    const { id } = req.params
    try {
        const u = await User.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            u
        })

    }
    catch (error) {
        return res.status(409).json({ error })
    }

}


// get a specific hotel -- can be accessed  any anyone
export const getUser = async (req, res) => {

    const { id } = req.params
    console.log(id)
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            user
        })
    }

    catch (error) {
        return res.status(409).json({ error })
    }

}

//get all hotels

export const getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find()
        res.status(200).json({
            success: true,
            users

        })

    }
    catch (error) {
        console.log(error)
        next(err)
    }
}
