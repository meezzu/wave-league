import { Schema, model } from 'mongoose';

var notificationSchema = new Schema ({
    messages: {
        type: String,
        read: {type: Boolean, default: false}
    }
})

module.exports = model('Notification', notificationSchema)