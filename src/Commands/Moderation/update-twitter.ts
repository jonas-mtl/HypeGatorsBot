/* eslint-disable camelcase */
import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { Command } from '../../Structures/Interfaces/index.js';
import { color } from '../../Structures/Design/index.js';
import needle from 'needle';

import DB from '../../Structures/Schemas/UserProfile.js';
import TweetDB from '../../Structures/Schemas/TweetInfo.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('update-twitter')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Updates twitter.'),

    execute: async (interaction: ChatInputCommandInteraction, client) => {
        const REWARDS = [1000, 2000];

        const randomReward = Math.floor(Math.random() * (REWARDS[0] - REWARDS[1] + 1) + REWARDS[1]);

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

        let user: any;

        const dbUser = interaction.member;

        if (!dbUser) return;

        user = await DB.findOne({ UserID: dbUser.user.id });
        if (!user) {
            user = await DB.create({
                UserID: dbUser.user.id,
                Points: 0,
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

        if (!(await TweetDB.findOne({ TweetID: response.data[0].id })))
            await TweetDB.create({
                TweetID: response.data[0].id,
                ClaimedUserLike: [],
                ClaimedUserFollow: [],
            });

        await interaction.channel!.send({
            content: `https://twitter.com/${client.config.Twitter.username}/status/${response.data[0].id}`,
        });

        interaction.channel!.send({
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
    },
};

export default command;
