import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../Structures/Interfaces/index.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/UserProfile.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Displays your current points.'),

    execute: async (interaction: ChatInputCommandInteraction) => {
        let user: any;

        user = await DB.findOne({ GuildID: interaction.user.id });
        if (!user) {
            user = await DB.create({
                UserID: interaction.user.id,
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

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription(`> 🪙 You currently own **${user.Points} points**.`),
            ],
            ephemeral: true,
        });
    },
};

export default command;
