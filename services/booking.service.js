const Booking = require('../models/booking.model');
const Slot=require('../models/slot.model');
const User=require('../models/user.model');

const NewBooking = async (bookingBody) => {
    try {
        const money_req=bookingBody.money_req;
        const slot=await Slot.findById(bookingBody.slot_id);
        if(bookingBody.start_time>=bookingBody.end_time){
            throw "PLease Choose Correct timing!";
        }
        const all_bookings=slot.bookings;
        if(all_bookings.length!=0)
        {
            for(var i=0;i<all_bookings.length;i++)
            {
                var booking=await Booking.findById(all_bookings[i]);
                if(!booking)continue;
                if(!((bookingBody.start_time<=booking.start_time && bookingBody.end_time<=booking.end_time)||
                (bookingBody.start_time>=booking.start_time && bookingBody.end_time>=booking.end_time))){
                    throw "Already Booked!";
                }                
            }
        }
        const user=await User.findById(bookingBody.user_id);
        if(!user) throw "User doesnt Exist";
        if(money_req>user.money)throw "Not Enough Money!";
        const result=await Booking.create(bookingBody);
        slot.bookings.push(result);
        await slot.save();
        var money=parseFloat(user.money);
        money-=parseFloat(money_req);
        user.money=money;
        await user.save();
        return result;
    } catch (error) {
        throw error;
    }
};

const FindBooking = async (id) => {
    const booking = await Book.findOne({ _id: id });
    return booking;
};

module.exports={
    NewBooking,
    FindBooking
}