import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export default model(
    'Quest',
    new Schema({
        QuestName: String,
        Description: String,
        Rewards: Number,
        Limit: Number,
        Users: Array,
    }),
);
