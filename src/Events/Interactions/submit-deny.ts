import { ButtonInteraction, ColorResolvable, EmbedBuilder } from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
import { color } from '../../Structures/Design/index.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'deny-btn') return;

        const prevEmbed = interaction.message.embeds[0];
        if (!prevEmbed) return;

        let submissionEmbed = new EmbedBuilder()
            .setAuthor(prevEmbed.author)
            .setColor(color.Discord.RED as ColorResolvable)
            .setFields(prevEmbed.fields)
            .setDescription(prevEmbed.description);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${color.Discord.BACKGROUND}`)
                    .setDescription(`> Successfully **denied this submission!**`),
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
                        `> Hey, your submission unfortunately **got denied**. Maybe next time!`,
                    ),
            ],
        });

        return await interaction.message.edit({ embeds: [submissionEmbed], components: [] });
    },
};

export default event;
