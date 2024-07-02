const JournalEntry = require('../models/Journal');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');


//create a new Journal entry
const newJournalEntry =  async (req, res) => {
    try {
      const { title, content, category } = req.body;  
      const journalEntry = new JournalEntry({
        user: req.user.userId,
        title,
        content,
        category,
        date,
      });
      await journalEntry.save();
      res.status(StatusCodes.CREATED).json(journalEntry);
    } catch (error) {
        console.error(error);
    }
};

//get all the journal entries for logged in user
const getJournalEntries = async (req, res) => {
    try {
        const user = req.user.userId;
        const journals = await JournalEntry.find({ user });
        res.status(StatusCodes.OK).json(journals);
    } catch (error) {
        
    }
};

//get a single journal entry
const getJournalEntryById = async (req, res) => {
    try {
      const { id } = req.params
      const journalEntry = await JournalEntry.findById(id);

      if (!journalEntry || journalEntry.user.toString() !== req.user._id.toString()) {
        throw new CustomError.BadRequestError('Journal entry not found');
    }
      res.status(StatusCodes.OK).json(journalEntry);
    } catch (error) {
        console.error('Error getting journal', error);
    }
};

//update a journal entry
const updateJournalEntry = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, category } = req.body;

      const journalEntry = await JournalEntry.findByIdAndUpdate(id, { 
        title, 
        content,
        category,
        }, { new: true }
      );
      if (!updatedJournalEntry) {
        throw new CustomError.BadRequestError('Journal entry not found');
      }
      res.status(StatusCodes.OK).json(updatedJournalEntry);
    } catch (error) {
        console.error('Error updating journal', error);
    }
};

//delete a journal entry
const deleteJournalEntry = async (req, res) => {
    try {
      const { id } = req.params;
      const journalEntry = await JournalEntry.findByIdAndDelete(id);
     
      if (!journalEntry || journalEntry.user.toString() !== req.user._id.toString()) {
        throw new CustomError.BadRequestError('Journal entry not found');
    }

      await journalEntry.remove();

      res.status(StatusCodes.OK).json({message: 'Journal deleted successfully!'});
    } catch (error) {
        console.error('Error deleting journal', error);
    }
};

module.exports = {
    newJournalEntry,
    getJournalEntries,
    getJournalEntryById,
    updateJournalEntry,
    deleteJournalEntry,
};
