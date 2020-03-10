const mongoose = require('mongoose');

const tasks = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    listTask: {
        type: String,
    },
    DateTask: {
        type: Date,
        default: Date.now
    }
});

tasks.set('toJSON', { virtuals : true });

module.exports = mongoose.model('task', tasks);