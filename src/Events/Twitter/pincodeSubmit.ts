import { ColorResolvable, EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
import { color } from '../../Structures/Design/index.js';

import DB from '../../Structures/Schemas/UserProfile.js';

const event: Event = {
    name: 'interactionCreate',

    execute: async (interaction: ModalSubmitInteraction, client) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'pincode-modal') {
            client.twitterPin.authorize(
                interaction.fields.getTextInputValue('pincode').toString().trim(),
                async function (err: Error, result) {
                    if (err) throw err;

                    let user: any;

                    const dbUser = interaction.member;

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

                    await user.updateOne({ Twitter: result.user_id }).catch((err: Error) => {
                        if (err) console.log(err);
                    });

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.displayAvatarURL(),
                                })
                                .setColor(color.Discord.BACKGROUND as ColorResolvable)
                                .setDescription(
                                    `> Successfully linked your **Twitter account (${result.screen_name}) with Discord!**`,
                                ),
                        ],
                        ephemeral: true,
                    });
                },
            );
        }
    },
};

export default event;
