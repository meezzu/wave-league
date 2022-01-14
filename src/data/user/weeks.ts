import { Schema, model } from 'mongoose';

var weeksSchema =  new Schema ({
    points: {
        type: Number
    }
})

module.exports = model('Weeks', weeksSchema)