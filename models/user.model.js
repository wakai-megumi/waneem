
//user model
import mongoose from "mongoose"

const userSchema = mongoose.Schema({



    username: {

        type: String,
        required: true
    }
    ,

    email: {
        type: String, required: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    country: {
        type: String, required: true
    },
    city: {
        type: String, required: true
    },
    address: {
        type: String, required: true
    },
    phone: {
        type: String, required: true


    }
    ,
    profileimage: {
        type: String,

    },
    isAdmin: {
        type: Boolean, required: true, default: false,
    },
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema)
export default User