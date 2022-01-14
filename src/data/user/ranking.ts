import { Schema, model } from 'mongoose';

var rankingSchema = new Schema ({
    weekNumber: {
        type: Number
    }
})

module.exports = model('Rankings', rankingSchema)