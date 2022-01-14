import { Schema, model } from 'mongoose';


var playerSchema = new Schema ({
    playerName: {
        type: String,
        required: [true, 'please provide your name'],
        trim: true,
        minlength: 3,
        maxlength: 25
    }
})

module.exports = model('Player', playerSchema)