const mongoose = require('mongoose')
const meetingSchema = new mongoose.Schema({
    meetingTitle: {
        type: String,
        required: [true, "Please enter the title"],
        trim: true
    },

    meetingOrganizer: {
        type: String,
    },



    meetingDate: {
        type: String,
        required: [true, "Please enter the date"]
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },



    meetingLink: {
        type: String,
        required: [true, "Please enter the link "],
        trim: true
    },
},
    { timestamps: true });

const meetingModel = mongoose.model('meeting', meetingSchema)
module.exports = meetingModel;