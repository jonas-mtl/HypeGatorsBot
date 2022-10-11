import {
    EmbedBuilder,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { Command } from '../../Structures/Interfaces/index.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/UserProfile.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit a link.')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription('Select a link type.')
                .setRequired(true)
                .addChoices(
                    { name: 'twitter', value: 'twitter' },
                    { name: 'artwork', value: 'artwork' },
                ),
        )
        .addStringOption((option) =>
            option.setName('url').setDescription('Input a URL to your submit.').setRequired(true),
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;
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

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription(
                        `> Thank you for your submission. You will **recieve a DM** wheather your submission was approved soon.`,
                    ),
            ],
            ephemeral: true,
        });

        const modEmbedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('accept-btn')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('deny-btn')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger),
        );

        interaction.channel!.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                    .setDescription(`> New submit by ${interaction.user}.`)
                    .addFields(
                        {
                            name: `Type:`,
                            value: options.getString('type')!,
                        },
                        {
                            name: `URL:`,
                            value: options.getString('url')!,
                        },
                    ),
            ],
            components: [modEmbedButtons as any],
        });
    },
};

export default command;
