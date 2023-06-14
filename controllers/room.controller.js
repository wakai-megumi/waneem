import Hotel from "../models/hotel.model.js";
import Room from "../models/room.model.js";
export const createRoom = async (req, res) => {
    const hotelId = req.params.hotelid;
    const room = new Room({
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
        maxpeople: req.body.maxpeople,
        roomNumbers: req.body.roomNumbers,
    });

    try {
        const roomSaved = await room.save();
        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $push: { rooms: roomSaved._id } },
            { new: true }
        );

        res.status(201).json(roomSaved);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


//update room
export const updateRoom = async (req, res) => {

    const { id } = req.params
    try {
        const updatedRoom = await Room.findByIdAndUpdate(id, {
            $set: req.body
        },
            { new: true })

        res.status(200).json(updatedRoom)

    }
    catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}
//delete hotel
export const deleteRoom = async (req, res) => {



    const { id } = req.params
    try {
        const deletedRoom = await Room.findByIdAndDelete(id)
        if (!deletedRoom) return res.status(404).json('room not found')


        res.status(200).json({
            message: "room deleted successfully",
            success: true,
        })

    }
    catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}


// get a specific hotel -- can be accessed  any anyone
export const getRoom = async (req, res) => {

    const { id } = req.params
    try {
        const room = await Room.findById(id)
        res.status(200).json(room)

    }
    catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}

//get all hotels

export const getAllRoom = async (req, res, next) => {

    try {
        const rooms = await Room.find()

        res.status(200).json({
            message: "All rooms",
            results: rooms.length,
            rooms: rooms,

        })

    }
    catch (error) {
        next(error)


    }
}


export const updateroomavailability = async (req, res, next) => {
    console.log('update');
    const data = req.body;
    console.log(data);
    try {
        const hotel = await Hotel.findById(data.hotelid);
        console.log(hotel);
        const roomIds = hotel.rooms.map(item => item.toString());
        console.log(roomIds);
        try {
            await Promise.all(roomIds.map(async roomId => {
                const reqroom = await Room.findById(roomId);
                const roomNumbers = reqroom.roomNumbers;
                roomNumbers.forEach(item => {                // object of the all the roomnumbers of that particular room
                    if (data.selectedrooms.includes(item._id.toString())) {
                        const dates = data.dates
                        item.unavialableDates.push(...dates);
                    }
                });
                await reqroom.save();
            }));
        } catch (err) {
            console.log(err, "inside this room controller")
            return
            next(err)
        }
        return res.status(200).json({ message: 'successfuly updated dates' });

    } catch (err) {
        console.log(err);
    }
};
