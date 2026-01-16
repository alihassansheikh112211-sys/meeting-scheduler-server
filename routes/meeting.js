const express = require('express')
const { createMeeting, getAllMeeting, getSingleMeeting, deleteMeeting, updateMeeting } = require('../controllers/meeting')
const router = express.Router()

router.post('/create-meeting', createMeeting)
router.get('/get-all-meeting', getAllMeeting)
router.get('/get-single-meeting:id', getSingleMeeting)
router.delete('/delete-meeting:id', deleteMeeting)
router.patch('/update-meeting:id', updateMeeting)

module.exports = router