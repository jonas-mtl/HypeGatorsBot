import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../../Structures/Interfaces/index.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/Quest.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('quest-add')
        .setDescription('Add a new quest')
        .addStringOption((option) =>
            option.setName('name').setDescription('The quests name').setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('description')
                .setDescription('The quests description')
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option.setName('rewards').setDescription('The quests reward points').setRequired(true),
        )
        .addIntegerOption((option) =>
            option.setName('limit').setDescription('The quests limit for each user'),
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;
        let quest: any;

        quest = await DB.findOne({ QuestName: options.getString('name') });
        if (quest) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${color.Discord.BACKGROUND}`)
                        .setDescription(
                            `> A quest with the name "${options.getString(
                                'name',
                            )}" **already exists.**`,
                        ),
                ],
                ephemeral: true,
            });
        } else {
            quest = await DB.create({
                QuestName: options.getString('name')?.toLowerCase(),
                Description: options.getString('description'),
                Limit: options.getInteger('limit') || 0,
                Rewards: options.getInteger('rewards'),
                Users: [],
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
                    .setDescription(
                        `> Successfully added the quest **${options.getString(
                            'name',
                        )}** to the database!`,
                    ),
            ],
            ephemeral: true,
        });
    },
};

export default command;
