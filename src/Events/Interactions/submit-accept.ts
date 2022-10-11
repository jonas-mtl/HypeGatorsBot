import { ButtonInteraction, ColorResolvable, EmbedBuilder } from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/UserProfile.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: ButtonInteraction) => {
        /*
          To add a category use this pattern:
          => category-name: [points],  
         */

        const POINTS = { twitter: 20, artwork: 10 };

        if (!interaction.isButton()) return;
        if (interaction.customId !== 'accept-btn') return;

        const prevEmbed = interaction.message.embeds[0];
        if (!prevEmbed) return;

        let submissionEmbed = new EmbedBuilder()
            .setAuthor(prevEmbed.author)
            .setColor(color.Discord.GREEN as ColorResolvable)
            .setFields(prevEmbed.fields)
            .setDescription(prevEmbed.description);

        let user: any;

        const ADDPOINTS = POINTS[prevEmbed.fields[0].value];

        const dbUser = interaction.guild?.members.cache.find(
            (m) => m.user.tag == prevEmbed.author!.name,
        );

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

        await user.updateOne({ Points: user.Points + ADDPOINTS }).catch((err) => {
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
                        `> Successfully added **${ADDPOINTS} points** to ${dbUser.user}`,
                    ),
            ],
            ephemeral: true,
        });

        const dmUser = await interaction.guild?.members.cache.find(
            (m: any) => m.user.tag === prevEmbed.author?.name,
        );

        dmUser?.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription(
                        `> Congrats! Your submission was accepted and you revieved **${ADDPOINTS} points**.`,
                    ),
            ],
        });

        return await interaction.message.edit({ embeds: [submissionEmbed], components: [] });
    },
};

export default event;
