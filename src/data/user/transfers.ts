import { Schema, model } from 'mongoose';

var transfersSchema = new Schema ({
    aristeName: {
        type: String,
        trim: true,
    },
    artistePrice: {
        type: Number
    }
})

module.exports = model('Transfers', transfersSchema)