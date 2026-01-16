const express = require('express')
const { createReport, getAllReport, getSingleReport, deleteReport, updateReport } = require('../controllers/report')
const router = express.Router()

router.post('/create-report', createReport)
router.get('/get-all-report', getAllReport)
router.get('/get-single-report:id', getSingleReport)
router.delete('/delete-report:id', deleteReport)
router.patch('/update-report:id', updateReport)

module.exports = router