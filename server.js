import { app } from './index.js'
import connectDB from './database.js'



app.listen(process.env.SERVER_PORT, () => {
    connectDB()

    console.log("listening on port 3000")
})