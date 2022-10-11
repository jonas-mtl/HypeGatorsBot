import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export default model(
    'TweetInfo',
    new Schema({
        TweetID: String,
        ClaimedUserLike: Array,
        ClaimedUserFollow: Array,
    }),
);
