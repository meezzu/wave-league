import { Schema, model } from 'mongoose';

var chartSchema = new Schema ({
    chartname: {
        type: String,
        trim: true,
    },
    artistePoints: {
        type: Array
    },
    artistes: {
        type: Array
    }
})

module.exports = model('Chart', chartSchema)