import { EmbedBuilder, SelectMenuInteraction } from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/Quest.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: SelectMenuInteraction) => {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId !== 'select-quest') return;

        const questRes = await DB.findOne({ QuestName: interaction.values[0] });

        if (!questRes) return interaction.deferReply();

        const messageEmbed = new EmbedBuilder()
            .setColor(`#${color.Discord.BACKGROUND}`)
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: 'Quest details » ' + questRes.QuestName?.toString(),
            })
            .setDescription(`**Description:** ${questRes.Description?.toString()}`)
            .addFields(
                {
                    name: '🔗 Limit',
                    value: `${questRes.Limit === 0 ? 'none' : questRes.Limit} submits per User`,
                },
                {
                    name: '💿 Rewards',
                    value: questRes.Rewards?.toString() + ' points.',
                },
            );

        return interaction.reply({
            embeds: [messageEmbed],
            ephemeral: true,
        });
    },
};

export default event;
