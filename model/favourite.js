const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing Home documents
    ref: 'Home', // Reference to the Home model
    required: true
} })
module.exports = mongoose.model('Favourite', favouriteSchema);



// module.exports = class Favourite {

//     constructor(homeId) {
//         this.homeId = homeId;
//     }

//     static getFavourite() {
//         const db = getDb();
//         return db.collection("favourites").find().toArray();
//     }

//     static addFavourite() {
//         const db = getDb();
//         return db.collection("favourites").insertOne(this);
//     }

//     static deleteFavourite(delHomeId) {
//         const db = getDb();
//         return db.collection("favourites").deleteOne({ homeId: delHomeId });
//     }
// }