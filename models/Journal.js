const mongoose = require('mongoose');

//define journal entry schema
const JournalEntrySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: 100,
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    category: {
        type: String,
        enum: ['Personal', 'Work', 'Travel', 'Other'],
        default: 'Personal',
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);