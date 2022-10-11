import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../Structures/Interfaces/index.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/UserProfile.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays your current points.'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const LeaderBoard = await DB.find().sort({ Points: -1 }).limit(3);

        if (LeaderBoard.length < 1)
            return interaction.reply("> :exclamation: There aren't any users in the leaderboard.");

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setTitle(`The current Leaderboard:`)
                    .addFields(
                        {
                            name: 'First Place',
                            value: `🥇 <@${LeaderBoard[0].UserID}> *(${LeaderBoard[0].Points} points)*`,
                        },
                        {
                            name: 'Second Place',
                            value: `🥈 <@${LeaderBoard[1].UserID}> *(${LeaderBoard[1].Points} points)*`,
                        },
                        {
                            name: 'Third Place',
                            value: `🥉 <@${LeaderBoard[2].UserID}> *(${LeaderBoard[2].Points} points)*`,
                        },
                    ),
            ],
            ephemeral: true,
        });
    },
};

export default command;
