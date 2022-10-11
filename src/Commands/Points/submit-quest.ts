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
import QuestsDB from '../../Structures/Schemas/Quest.js';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('submit-quest')
        .setDescription('Submit your quest!')
        .addStringOption((option) =>
            option.setName('name').setDescription('The quests name').setRequired(true),
        )
        .addAttachmentOption((option) =>
            option
                .setName('screenshot')
                .setDescription('Add a screenshot to prove you did the quest')
                .setRequired(true),
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;
        let user: any;

        const quest: any = await QuestsDB.findOne({
            QuestName: options.getString('name')?.toLowerCase(),
        }).catch(() => {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${color.Discord.BACKGROUND}`)
                        .setDescription(
                            `> There is no Quest with the **name ${options.getString('name')}**`,
                        ),
                ],
            });
        });

        if (!quest)
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${color.Discord.BACKGROUND}`)
                        .setDescription(
                            `> There is no Quest with the **name ${options.getString('name')}**`,
                        ),
                ],
            });

        user = await DB.findOne({ GuildID: interaction.user.id });

        let duplicateCount = 0;
        for (const userID in quest.Users) {
            if (userID === interaction.user.id) duplicateCount++;
        }
        if (duplicateCount >= quest.Limit && quest.Limit !== 0)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${color.Discord.BACKGROUND}`)
                        .setDescription(`> You have exceeded the limit!`),
                ],
                ephemeral: true,
            });

        quest.updateOne({ Users: [...quest.Users, interaction.user.id] });

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
                .setCustomId('accept-quest-btn')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('deny-quest-btn')
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
                    .setDescription(`> New quest submit by ${interaction.user}.`)
                    .addFields({
                        name: `Quest:`,
                        value: options.getString('name')!,
                    })
                    .setImage(options.getAttachment('screenshot')?.url || 'error'),
            ],
            components: [modEmbedButtons as any],
        });
    },
};

export default command;
