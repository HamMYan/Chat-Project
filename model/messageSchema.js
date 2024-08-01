const { Schema } = require("mongoose");

const messageSchema = new Schema({
    text: String,
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = messageSchema