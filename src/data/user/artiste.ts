import { Schema, model } from 'mongoose';


var artisteSchema = new Schema ({
    aristeName: {
        type: String,
        trim: true,
    },
    nationality: {
        type: String,
    },
    Songs: {
        type: String
    },
    artistePrice: {
        type: Number
    },
    chartRank: {
        type: Number
    }
})

module.exports = model('Artiste', artisteSchema)