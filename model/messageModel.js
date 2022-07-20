const mongoose = require("mongoose");

// Since this schema uses a timestamp, there are two objects in this schema enclosed in {}
const MessageSchema = new mongoose.Schema(
    {
        message : {
            text: {
                type: String,
                required: true,
            },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Messages", MessageSchema);