import { Schema, model } from 'mongoose';

var squadSchema = new Schema ({
    squadName: {
        type: String,
        required: [true, 'please provide your Squad name'],
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    transfersLeft: {
        type: Number
    },
    squadCost: {
        type: Number
    },
    totalPoints: {
        type: Number
    }
})

module.exports = model('Squad', squadSchema)