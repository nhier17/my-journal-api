const express = require('express');
const router = express.Router();

const {
    newJournalEntry,
    getJournalEntries,
    getJournalEntryById,
    updateJournalEntry,
    deleteJournalEntry,
} = require('../controllers/JournalEntryController')

router.route('/')
    .post(newJournalEntry)
    .get(getJournalEntries)
 router.route('/:id ')
            .get(getJournalEntryById)
            .patch(updateJournalEntry)  
            .delete(deleteJournalEntry)

 module.exports = router;