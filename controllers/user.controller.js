import User from "../models/user.model.js"
import CreateError from "../utils/CreateError.js"




//update user
export const updateUser = async (req, res) => {
    const { id, ...otherFields } = req.body;
    console.log(id)

    try {
        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        Object.entries(otherFields).forEach(([field, value]) => {
            if (existingUser[field] !== value) {
                existingUser[field] = value;
            }
        });


        const updatedUser = await existingUser.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the user",
            error,
        });
    }
};


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
