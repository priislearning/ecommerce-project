//connection mongodb and redis
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: [
        {
            productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product"
},

            name: String,

            price: Number,

            quantity: Number
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);