const mongoose = require('mongoose')

const kwSchema = new mongoose.Schema({
    signature: {
        type: String,
        required: true
    },
    oldKw: {
        type: String,
        required: true
    },
    newKw: {
        type: String,
        required: true
    },
    conwDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('KW', kwSchema)