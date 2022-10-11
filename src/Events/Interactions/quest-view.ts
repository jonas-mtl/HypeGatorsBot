import { ButtonInteraction, ActionRowBuilder, SelectMenuBuilder } from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';

import DB from '../../Structures/Schemas/Quest.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'view-quests') return;

        const selectMenu = new SelectMenuBuilder()
            .setCustomId('select-quest')
            .setPlaceholder('Select a quest here');

        const panelSelect = new ActionRowBuilder().addComponents(selectMenu);

        for await (const questRes of DB.find()) {
            if (questRes.QuestName) {
                selectMenu.addOptions({
                    label: questRes.QuestName?.toString(),
                    description: questRes.Description?.toString(),
                    value: questRes.QuestName?.toString().replaceAll(' ', '-'),
                });
            }
        }
        return interaction.reply({
            embeds: [],
            components: [panelSelect as any],
            ephemeral: true,
        });
    },
};

export default event;
