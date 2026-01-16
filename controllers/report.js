const reportModel = require("../models/report")
const createReport = async (req, res) => {
    try {


        const report = new reportModel({
            reportTitle: req.body.reportTitle,
            reportGenerate: req.body.reportGenerate,
            date: req.body.date,
            totalUser: req.body.totalUser,
            reportType: req.body.reportType,

        })
        await report.save()
        res.status(201).json({
            success: true, msg: "Created report successfully", report
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
const getAllReport = async (req, res) => {
    try {

        const report = await reportModel.find({})
        res.status(200).json({
            success: true, msg: "Get all report successfully", report
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
const getSingleReport = async (req, res) => {
    try {

        const id = req.params.id
        const report = await reportModel.findById(id)
        res.status(200).json({
            success: true, msg: "Get single report successfully", report
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}

const deleteReport = async (req, res) => {
    try {

        const id = req.params.id
        const report = await reportModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true, msg: "Deleted report successfully", report
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
const updateReport = async (req, res) => {
    try {

        const id = req.params.id
        const body = req.body
        const report = await reportModel.findByIdAndUpdate(id, body, { new: true })
        res.status(200).json({
            success: true, msg: "Updated report successfully", report
        })
    } catch (error) {
        res.status(500).json({
            success: false, msg: "Intenal server error", error
        })
    }
}
module.exports = { createReport, getAllReport, getSingleReport, deleteReport, updateReport }