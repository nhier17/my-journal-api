const JournalEntry = require('../models/Journal');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const mongoose = require('mongoose');


//create a new Journal entry
const newJournalEntry =  async (req, res) => {
    try {
      const { title, content, category } = req.body;  
      const journalEntry = new JournalEntry({
        user: req.user.userId,
        title,
        content,
        category,
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
        const { category, search } = req.query;
        let queryObject = { user };
        if (category) {
            queryObject.category = category;
        }
    
        if (search) {
            queryObject.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } }
            ];
        }

        const journals = await JournalEntry.find(queryObject).populate('user', 'name');
        res.status(StatusCodes.OK).json(journals);
    } catch (error) {
        
    }
};

//get a single journal entry
const getJournalEntryById = async (req, res) => {
    try {
      const { id } = req.params
      const journalEntry = await JournalEntry.findById(id);

      if (!journalEntry) {
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
      if (!journalEntry) {
        throw new CustomError.BadRequestError('Journal entry not found');
      }
      res.status(StatusCodes.OK).json(journalEntry);
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

//get journal summary
const getJournalSummary = async (req, res) => {
    try {
        const user = req.user.userId;
        const { period } = req.query;

        let startDate;
        const endDate = new Date();

        switch (period) {
            case 'daily':
                startDate = new Date();
                startDate.setDate(endDate.getDate() - 1);
                break;
            case 'weekly':
                startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'monthly':
                startDate = new Date();
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            default:
                startDate = new Date(0);
                break;
        }

        const summary = await JournalEntry.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(user), date: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        console.log('Summary:', summary);

        res.status(StatusCodes.OK).json(summary);
    } catch (error) {
        console.error('Error fetching journal summary', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching journal summary' });
    }
};

module.exports = {
    newJournalEntry,
    getJournalEntries,
    getJournalEntryById,
    updateJournalEntry,
    deleteJournalEntry,
    getJournalSummary
};
