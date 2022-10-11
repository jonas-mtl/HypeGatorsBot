import {
    ActivityType,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
} from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
const { Watching } = ActivityType;

import needle from 'needle';
import TweetDB from '../../Structures/Schemas/TweetInfo.js';
import TweetStore from '../../Structures/Schemas/TweetStore.js';

const event: Event = {
    name: 'ready',
    options: {
        ONCE: true,
    },

    execute: async (client) => {
        const REWARDS = [1000, 2000];

        const randomReward = Math.floor(Math.random() * (REWARDS[0] - REWARDS[1] + 1) + REWARDS[1]);
        client.user?.setPresence({
            activities: [
                {
                    name: `HYPE GATOR`,
                    type: Watching,
                },
            ],
            status: 'online',
        });

        let prevTweetID: any = await TweetStore.find();
        if (prevTweetID.length == 0) {
            const id = client.config.Twitter.id;
            const token = client.config.APIs[0].apiKeys[2];

            const endpointURL = `https://api.twitter.com/2/users/${id}/tweets`;

            async function getRequest() {
                const params = {
                    'tweet.fields': 'lang,author_id',
                    'user.fields': 'created_at',
                };

                const res = await needle('get', endpointURL, params, {
                    headers: {
                        'User-Agent': 'v2LikedTweetsJS',
                        authorization: `Bearer ${token}`,
                    },
                });

                if (res.body) {
                    return res.body;
                } else {
                    throw new Error('Unsuccessful request');
                }
            }

            const response = await getRequest();
            prevTweetID = TweetStore.create({ LastTweetID: response.data[0].id });
        }

        const checkForTweet = async () => {
            const id = client.config.Twitter.id;
            const token = client.config.APIs[0].apiKeys[2];

            const endpointURL = `https://api.twitter.com/2/users/${id}/tweets`;

            async function getRequest() {
                const params = {
                    'tweet.fields': 'lang,author_id',
                    'user.fields': 'created_at',
                };

                const res = await needle('get', endpointURL, params, {
                    headers: {
                        'User-Agent': 'v2LikedTweetsJS',
                        authorization: `Bearer ${token}`,
                    },
                });

                if (res.body) {
                    return res.body;
                } else {
                    throw new Error('Unsuccessful request');
                }
            }

            const response = await getRequest();

            if (prevTweetID[0].LastTweetID === response.data[0].id) {
                await TweetStore.updateOne({ LastTweetID: response.data[0].id });
            } else {
                const modEmbedButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('like-btn')
                        .setLabel('Claim Like Points')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('retweet-btn')
                        .setLabel('Claim Retweet Points')
                        .setStyle(ButtonStyle.Primary),
                );

                if (!(await TweetDB.findOne({ TweetID: response.data[0].id })))
                    await TweetDB.create({
                        TweetID: response.data[0].id,
                        ClaimedUserLike: [],
                        ClaimedUserFollow: [],
                    });

                const devGuild = await client.guilds.cache.find(
                    (g: any) => g.id === client.config.DevGuilds[0].id,
                );
                const devChannel = await devGuild.channels.cache.find(
                    (c: any) => c.id === client.config.DevGuilds[0].modChannel,
                );

                await devChannel.send({
                    content: `https://twitter.com/${client.config.Twitter.username}/status/${response.data[0].id}`,
                });

                devChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#1da0f2`)
                            .setDescription(
                                `
                            \`1\` - LIKE, COMMENT and RETWEET the tweet linked below.\n\`2\` - Click on the buttons below to claim your rewards.`,
                            )
                            .addFields(
                                {
                                    name: '🔗 Tweet Link',
                                    value: `**[click here](https://twitter.com/${client.config.Twitter.username}/status/${response.data[0].id}) -** https://twitter.com/${client.config.Twitter.username}/status/${response.data[0].id}`,
                                },
                                {
                                    name: '💿 Rewards ',
                                    value: randomReward.toString() + ' points.',
                                },
                            ),
                    ],
                    components: [modEmbedButtons as any],
                });
                await TweetStore.updateOne({ LastTweetID: response.data[0].id });
            }
        };

        setInterval(checkForTweet, 1000);
    },
};

export default event;
