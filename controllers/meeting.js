const meetingModel = require('../models/meeting')
const createMeeting = async (req, res) => {
    // to save static data in db
    // const product = new productModel({
    //     title:"Pants",
    //     desc:"Best pants in the market place",
    //     price:15,
    //     rating:4,
    //     review:"Best"
    // })
    // to save dynamic data in db
    try {

        const meeting = new meetingModel({
            meetingTitle: req.body.meetingTitle,
            meetingOrganizer: req.body.meetingOrganizer,
            meetingDate: req.body.meetingDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            meetingDuration: req.body.meetingDuration,
            meetingLink: req.body.meetingLink,
        })
        await meeting.save()
        res.status(201).json({
            success: true, msg: "Meeting created successfully", meeting
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
const getAllMeeting = async (req, res) => {
    try {
        const meeting = await meetingModel.find({})
        res.status(200).json({
            success: true, msg: "Get all meeting successfully", meeting
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }

}
const getSingleMeeting = async (req, res) => {
    try {

        const id = req.params.id
        const meeting = await meetingModel.findById(id)
        res.status(200).json({
            success: true, msg: "Get single meeting successfully", meeting
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}

const deleteMeeting = async (req, res) => {
    try {

        const id = req.params.id
        const meeting = await meetingModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true, msg: "Delteted meeting successfully", meeting
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
const updateMeeting = async (req, res) => {
    try {

        const id = req.params.id
        const body = req.body
        const meeting = await meetingModel.findByIdAndUpdate(id, body, { new: true })
        res.status(200).json({
            success: true, msg: "Updated meeting successfully", meeting
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
module.exports = { createMeeting, getAllMeeting, getSingleMeeting, deleteMeeting, updateMeeting }