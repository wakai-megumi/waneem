import Hotel from "../models/hotel.model.js"
import Reviews from "../models/reviews.model.js";
import Room from "../models/room.model.js"
import CreateError from "../utils/CreateError.js"


//crud operation can only be accessed by the admin -
export const createHotel = async (req, res, next) => {
    try {
        const { rooms, ...hotelData } = req.body;
        const newRooms = await Promise.all(
            rooms.map(async (item) => {
                const room = await Room.findById(item.toString());
                const newRoom = new Room({
                    title: room.title,
                    price: room.price,
                    desc: room.desc,
                    maxpeople: room.maxpeople,
                    roomNumbers: room.roomNumbers.map((roomNumber) => ({
                        number: roomNumber.number,
                        unavailableDates: [],
                    })),
                });
                return await newRoom.save();
            })
        );

        const newHotel = new Hotel({
            ...hotelData,
            rooms: newRooms.map((room) => room._id),   // adding the newly created room ids to hotel 
        });

        const savedHotel = await newHotel.save();
        // here in the rooms created above we will now add the hotel id 
        await Promise.all(
            newRooms.map(async (room) => {
                room.hotelId = savedHotel._id;
                await room.save();
            })
        );

        res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            savedHotel,
        });
    } catch (error) {
        console.log(error);
        return next(error)
    }
};


//update hotel
export const updateHotel = async (req, res) => {
    try {
        const { _id, photos, rooms, hotelLogo, ...updatedFields } = req.body;

        const existingHotel = await Hotel.findById(_id);

        // ading the logic for creatin new rooms if any required
        if (rooms && rooms !== existingHotel.rooms) {
            const newRooms = await Promise.all(
                rooms.map(async (item) => {
                    const room = await Room.findById(item.toString());
                    const newRoom = new Room({
                        title: room.title,
                        price: room.price,
                        desc: room.desc,
                        maxpeople: room.maxpeople,
                        hotelId: _id,                            //adding the id of the current hotel
                        roomNumbers: room.roomNumbers.map((roomNumber) => ({
                            number: roomNumber.number,
                            unavailableDates: [],
                        })),
                    });
                    return await newRoom.save();
                })
            );

            existingHotel.rooms.push(...newRooms.map((room) => room._id));
        }
        // Combine the existing photos with the new photos
        const mergedPhotos = [...existingHotel.photos, ...photos];
        const logo = hotelLogo ? hotelLogo : existingHotel.hotelLogo
        updatedFields.rooms = existingHotel.rooms
        updatedFields.photos = mergedPhotos;
        updatedFields.hotelLogo = logo

        const updatedHotel = await Hotel.findByIdAndUpdate(_id, { $set: updatedFields }, { new: true });

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            updatedHotel
        });
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: error.message });
    }
};


//delete hotel
export const deleteHotel = async (req, res) => {

    const { id } = req.params
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(id)
        const { rooms } = deletedHotel
        const roomdeleted = await Room.deleteMany({ _id: { $in: rooms } })


        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedHotel
        })

    }
    catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}


// get a specific hotel -- can be accessed  any anyone
export const getHotel = async (req, res, next) => {
    const filter = {};

    const { destination, max, min, limit, adults, rooms, child, type, ...other } = req.query;

    if (destination !== 'undefined') {
        filter.city = { $regex: new RegExp(destination, "i") };
    }

    if (type !== 'undefined') {
        filter.type = { $regex: new RegExp(type, "i") };
    }

    if (min || max) {
        filter.cheapestprice = {
            $gte: parseInt(min, 10) || 1,
            $lte: parseInt(max, 10) || Number.MAX_VALUE
        };
    }

    try {
        const data = { ...filter };

        const hotels = await Hotel.find(data).limit(limit);


        return res.status(200).json({
            success: true,
            results: hotels.length,
            hotels
        });
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: error.message });
    }
};




//get all hotels

export const getAllHotels = async (req, res, next) => {

    try {
        const hotels = await Hotel.find()

        res.status(200).json({
            message: "All hotels",
            results: hotels.length,
            hotels: hotels,

        })

    }
    catch (error) {
        next(CreateError())


    }
}

export const singleHotel = async (req, res, next) => {
    const { id } = req.params
    try {
        const hotel = await Hotel.findById(id)
        if (!hotel) return next(CreateError(404, "no result matches the query in database"))
        res.status(200).json({
            success: true,
            hotel
        })
    } catch (err) {

        next(err)
    }
}

//countby city

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(',');
    if (cities.length === 0) return next(CreateError(404, "No results match the query in the database."));
    try {
        const regexCities = cities.map(city => new RegExp(city, 'i'));
        const list = await Promise.all(regexCities.map(async (regexCity) => {
            const count = await Hotel.countDocuments({ city: { $regex: regexCity } });
            return {
                [regexCity.source]: count
            };
        }));
        res.status(200).json({
            success: true,
            list
        });
    } catch (err) {
        next(err);
    }
};


//countbytype
export const countByType = async (req, res, next) => {
    try {
        const hotelTypes = await Hotel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 4
            }
        ]);

        res.status(200).json({
            success: true,
            hotelTypes
        });
    } catch (err) {
        next(err);
    }
};

export const getroominfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        if (!hotel) return next(CreateError(404, "No result matches the query in the database"));

        const roomslist = await Promise.all(hotel.rooms.map(async (room) => {

            return Room.findById(room)
        }))

        return res.status(200).json({
            success: true,
            results: roomslist.length,
            roomslist
        }
        )

    } catch (err) {
        console.log(err);
        next(err);
    }
};
//reviews section 
export const addReview = async (req, res, next) => {
    const { rating, review, user, username, userimage, updatedAt, createdAt, hotelid, title } = req.body;
    try {

        const Review = new Reviews({
            rating,
            review,
            user,
            username,
            userimage,
            updatedAt,
            createdAt,
            hotelid,
            title
        });
        await Review.save();
        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const getReviews = async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log(id)
        const reviews = await Reviews.find({ hotelid: id });
        console.log(reviews)
        return res.status(200).json({
            success: true,
            results: reviews.length,
            reviews
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}
