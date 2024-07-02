const express = require('express');
const router = express.Router();
const { authenticateUser  } = require('../middleware/authentication');

const {
    newJournalEntry,
    getJournalEntries,
    getJournalEntryById,
    updateJournalEntry,
    deleteJournalEntry,
    getJournalSummary
} = require('../controllers/JournalEntryController')


router.route('/summary').get(authenticateUser, getJournalSummary)

router.route('/')
    .post(authenticateUser, newJournalEntry)
    .get(authenticateUser, getJournalEntries)

 router.route('/:id')
            .get(authenticateUser, getJournalEntryById)
            .patch(authenticateUser, updateJournalEntry)  
            .delete(authenticateUser, deleteJournalEntry)    



 module.exports = router;