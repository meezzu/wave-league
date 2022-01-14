import { Schema, model } from 'mongoose';

var leagueSchema = new Schema ({
    leagueName: {
        type: String,
        required: [true, 'The league should have a name'],
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    level: {
        type: Boolean
    },
    weekNumber: {
        type: Number
    },
    squads: {
        type: Array
    }

})

module.exports = model('League', leagueSchema)