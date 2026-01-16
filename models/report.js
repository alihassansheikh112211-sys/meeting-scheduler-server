const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reportTitle: {
        type: String,
        required: [true, "Please enter the title"],
        trim: true
    },


    reportGenerate: {
        type: String,
        trim: true,
    },

    date: {
        type: String,
        required: [true, "Please enter the date"],
        default: Date.now
    },

    totalUser: {
        type: Number,
        default: 0,
    },
    reportType: {
        type: String,
        enum: [
            "completed",
            "uncompleted",
        ],
        required: [true, "Please choose one of them"]
        // required: true
    },
});

const reportModel = mongoose.model("report", reportSchema);
module.exports = reportModel
