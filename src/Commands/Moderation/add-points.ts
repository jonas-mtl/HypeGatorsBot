import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../../Structures/Interfaces/index.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/UserProfile.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('add-points')
        .setDescription('Add Points to a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to display the points from')
                .setRequired(true),
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;
        let user: any;

        user = await DB.findOne({ UserID: options.getUser('user')?.id });
        if (!user) {
            user = await DB.create({
                UserID: options.getUser('user')?.id,
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

        await user.updateOne({ Points: user.Points + options.getNumber('points') }).catch((err) => {
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
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription(
                        `> Successfully added **${options.getNumber(
                            'points',
                        )} points** to ${options.getUser('user')}`,
                    ),
            ],
            ephemeral: true,
        });
    },
};

export default command;
