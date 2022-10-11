import {
    ButtonInteraction,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
import { color } from '../../Structures/Design/index.js';
import needle from 'needle';

import DB from '../../Structures/Schemas/UserProfile.js';
import TweetDB from '../../Structures/Schemas/TweetInfo.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: ButtonInteraction, client) => {
        const checkAuthStatus = async (): Promise<any> => {
            await client.twitterPin.getUrl(async function (err: Error, url: string) {
                if (err) throw err;
                const modEmbedButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('submit-pincode-btn')
                        .setLabel('Submit Pincode')
                        .setStyle(ButtonStyle.Success),
                );

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setAuthor({
                                name: 'Verify Twitter Account Ownership',
                                iconURL: interaction.user.displayAvatarURL(),
                            })
                            .setDescription(
                                `> Please link your Twitter ID with your Discord account first to claim Twitter Actions Rewards (this is a one time action).
                                
                                **Steps:**
                                \`1.\` Navigate to the Twitter [OAuth Authorization page](${url}) and authorize the app using your twitter account.
                                \`2.\` Copy the one-time pincode provided and submit it via the 'Submit Pincode' button below.
    
                                ***Note:** 
                                If an incorrect pincode is entered, please close this message and click on the 'Link Twitter' button again to restart the whole process.*
                                `,
                            )
                            .setFooter({ text: interaction.user.tag })
                            .setTimestamp(),
                    ],
                    components: [modEmbedButtons as any],
                    ephemeral: true,
                });
                return;
            });
        };

        const getDBProfile = async () => {
            let user: any;

            user = await DB.findOne({ UserID: interaction.user.id });
            if (!user) {
                user = await DB.create({
                    UserID: interaction.user.id,
                    Points: 1,
                }).catch((err) => {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${color.Discord.BACKGROUND}`)
                                .setDescription(
                                    `> There was an **error adding the user to the database**!\n\`\`\`\n${err}\`\`\``,
                                ),
                        ],
                        ephemeral: true,
                    });
                });
            }
            return user;
        };
        if (!interaction.isButton()) return;

        if (interaction.customId === 'like-btn') {
            const userProfile = await getDBProfile();
            if (!userProfile.Twitter) await checkAuthStatus();

            const token = client.config.APIs[0].apiKeys[2];
            const id = interaction.message.embeds[0].fields[0].value.split('/').pop();

            const tweetInfo = await TweetDB.findOne({ TweetID: id });
            if (tweetInfo!.ClaimedUserLike.includes(interaction.user.id))
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(`> Seems like **you already claimed the rewards**...`),
                    ],
                    ephemeral: true,
                });

            await tweetInfo?.updateOne({
                ClaimedUserLike: [...tweetInfo.ClaimedUserLike, interaction.user.id],
            });

            console.log(tweetInfo);
            const endpointURL = `https://api.twitter.com/2/tweets/${id}/liking_users`;

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

            if (response.data.find((d) => d.id === userProfile.Twitter)) {
                await userProfile
                    .updateOne({
                        Points:
                            userProfile.Points +
                            parseInt(interaction.message.embeds[0].fields[1].value),
                    })
                    .catch((err) => {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(`#${color.Discord.BACKGROUND}`)
                                    .setDescription(
                                        `> There was an **error adding the points to the database**!\n\`\`\`\n${err}\`\`\``,
                                    ),
                            ],
                            ephemeral: true,
                        });
                    });
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(
                                `> Thank you for your support! **You recieved ${parseInt(
                                    interaction.message.embeds[0].fields[1].value,
                                )} points.**`,
                            ),
                    ],
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(`> Seems like **you didn't like** the tweet yet...`),
                    ],
                    ephemeral: true,
                });
            }
        } else {
            const userProfile = await getDBProfile();
            if (!userProfile.Twitter) await checkAuthStatus();
            const token = client.config.APIs[0].apiKeys[2];
            const id = interaction.message.embeds[0].fields[0].value.split('/').pop();

            const tweetInfo = await TweetDB.findOne({ TweetID: id });
            if (tweetInfo!.ClaimedUserFollow.includes(interaction.user.id))
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(`> Seems like **you already claimed the rewards**...`),
                    ],
                    ephemeral: true,
                });
            await tweetInfo?.updateOne({
                ClaimedUserFollow: [...tweetInfo.ClaimedUserFollow, interaction.user.id],
            });

            const endpointURL = `https://api.twitter.com/2/tweets/${id}/retweeted_by`;

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
            try {
                if (response.data.find((d) => d.id === userProfile.Twitter)) {
                    await userProfile
                        .updateOne({
                            Points:
                                userProfile.Points +
                                parseInt(interaction.message.embeds[0].fields[1].value),
                        })
                        .catch((err) => {
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(`#${color.Discord.BACKGROUND}`)
                                        .setDescription(
                                            `> There was an **error adding the points to the database**!\n\`\`\`\n${err}\`\`\``,
                                        ),
                                ],
                                ephemeral: true,
                            });
                        });
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${color.Discord.BACKGROUND}`)
                                .setDescription(
                                    `> Thank you for your support! **You recieved ${parseInt(
                                        interaction.message.embeds[0].fields[1].value,
                                    )} points.**`,
                                ),
                        ],
                        ephemeral: true,
                    });
                } else {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${color.Discord.BACKGROUND}`)
                                .setDescription(
                                    `> Seems like **you didn't retweet** the tweet yet...`,
                                ),
                        ],
                        ephemeral: true,
                    });
                }
            } catch {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(`> Seems like **you didn't retweet** the tweet yet...`),
                    ],
                    ephemeral: true,
                });
            }
        }
    },
};

export default event;
