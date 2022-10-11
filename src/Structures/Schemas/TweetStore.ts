import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export default model(
    'TweetStore',
    new Schema({
        LastTweetID: String,
    }),
);
