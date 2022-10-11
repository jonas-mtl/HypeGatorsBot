import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export default model(
    'UserProfile',
    new Schema({
        UserID: String,
        Twitter: String,
        Points: Number,
        TagLock: Boolean,
    }),
);
