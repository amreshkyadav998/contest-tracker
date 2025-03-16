import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['Codeforces', 'CodeChef', 'LeetCode']
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'PAST'],
        required: true
    },
    solutionLink: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Contest', ContestSchema);