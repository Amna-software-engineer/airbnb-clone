
const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    houseName: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    },
    location: {
        type: String, required: true
    },
    rating: {
        type: Number, required: true
    },
    photoUrl: String,
    description: String,
})

// homeSchema.pre("findOneAndDelete",async function(next) {
//     const homeId = this.getQuery()._id;
//     console.log("Deleting home with ID: ", homeId);
    
//    await Favourite.deleteMany({ homeId: homeId }).then(()=>{
//        console.log("Deleted favourites for homeId: ", homeId);

//    })
//     next();
// })

module.exports = mongoose.model('Home', homeSchema);