const { Schema } = require("mongoose")

const userSchema = new Schema({
    name: String,

    surname: String,

    nickname: {
        type: String,
        unique: true
    },
    phonenumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },

    password: String,

    code: String,

    isVerify: {
        type: String,
        default: false
    },

    picUrl:{
        type: String,
        default: 'https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE='
    }
})

module.exports = userSchema