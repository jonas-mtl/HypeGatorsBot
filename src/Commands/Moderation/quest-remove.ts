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
        .setName('quest-remove')
        .setDescription('Remove a quest')
        .addStringOption((option) =>
            option.setName('name').setDescription('The quests name').setRequired(true),
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;

        await DB.findOneAndRemove({ QuestName: options.getString('name') });

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription(
                        `> Successfully removed the quest **${options.getString(
                            'name',
                        )}** from the database!`,
                    ),
            ],
            ephemeral: true,
        });
    },
};

export default command;
