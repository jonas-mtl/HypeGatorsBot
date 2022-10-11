import {
    ButtonInteraction,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ActionRowBuilder,
} from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === 'submit-pincode-btn') {
            const modal = new ModalBuilder()
                .setCustomId('pincode-modal')
                .setTitle('Verify your Twitter account');

            const favoriteColorInput = new TextInputBuilder()
                .setCustomId('pincode')
                .setLabel('Please enter the pincode below'.toUpperCase())
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

            modal.addComponents(firstActionRow as any);

            await interaction.showModal(modal);
        }
    },
};

export default event;
