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

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('quest-panel')
        .setDescription('Sends the quests panel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const panelButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('view-quests')
                .setLabel('View Quests')
                .setStyle(ButtonStyle.Primary),
        );
        return interaction.channel!.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription('Here you can see all the quests!'),
            ],
            components: [panelButtons as any],
        });
    },
};

export default command;
