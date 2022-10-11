import { Event } from '../../Structures/Interfaces/Event.js';
import { color } from '../../Structures/Design/index.js';
import { EmbedBuilder } from 'discord.js';

import userProfileDB from '../../Structures/Schemas/UserProfile.js';

const event: Event = {
    name: 'guildMemberUpdate',

    execute: async (oldMember, newMember) => {
        //Settings for name check
        const ADDPOINTSNAME: number = 200;
        const REMOVEPOINTSNAME: boolean = true;
        const CHECKNAME: string = 'Jonas';

        //Settings for role check
        const ADDPOINTSROLE: number = 100;
        const REMOVEPOINTSROLE: boolean = true;
        const CHECKROLES: Array<string> = ['test'];

        //Dont edit unless you undestand it :P

        let user: any;
        const dbUser = newMember;

        if (!dbUser) return;

        user = await userProfileDB.findOne({ UserID: dbUser.user.id });
        if (!user) {
            user = await userProfileDB
                .create({
                    UserID: dbUser.user.id,
                    Points: 0,
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (newMember.user.username && oldMember.user.username !== newMember.user.username) {
            if (newMember.user.username.includes(CHECKNAME)) {
                if (user.TagLock) return;

                await user
                    .updateOne({ Points: user.Points + ADDPOINTSNAME, TagLock: true })
                    .catch((err: Error) => {
                        console.log(err);
                    });

                newMember.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(
                                `> Thank you for changing your name, **you recieved ${ADDPOINTSNAME} points!**`,
                            ),
                    ],
                    ephemeral: true,
                });
            }

            if (oldMember.user.username) {
                if (oldMember.user.username.includes(CHECKNAME) && REMOVEPOINTSNAME) {
                    if (!user.TagLock) return;

                    await user
                        .updateOne({ Points: user.Points - ADDPOINTSROLE, TagLock: false })
                        .catch((err: Error) => {
                            console.log(err);
                        });

                    newMember.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${color.Discord.BACKGROUND}`)
                                .setDescription(
                                    `> Because you canged your name, **we removed ${ADDPOINTSROLE} of your points!**`,
                                ),
                        ],
                        ephemeral: true,
                    });
                }
            } else {
                newMember.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(`#${color.Discord.BACKGROUND}`)
                            .setDescription(
                                `> Hey, seems like there was an error checking your Username for the TAG **${CHECKNAME}**! Please try again.`,
                            ),
                    ],
                    ephemeral: true,
                });
            }
        } else if (newMember.roles && oldMember.roles && newMember.roles !== oldMember.roles) {
            for await (const currentRole of CHECKROLES) {
                if (
                    !oldMember.roles.cache.find((role: any) => role.name === currentRole) &&
                    newMember.roles.cache.find((role: any) => role.name === currentRole)
                ) {
                    await user
                        .updateOne({ Points: user.Points + ADDPOINTSROLE })
                        .catch((err: Error) => {
                            console.log(err);
                        });

                    newMember.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${color.Discord.BACKGROUND}`)
                                .setDescription(
                                    `> Because the role "${currentRole}" was added to your profile, **you recieved ${ADDPOINTSROLE} points!**`,
                                ),
                        ],
                        ephemeral: true,
                    });
                } else if (
                    oldMember.roles.cache.find((role: any) => role.name === currentRole) &&
                    !newMember.roles.cache.find((role: any) => role.name === currentRole) &&
                    REMOVEPOINTSROLE
                ) {
                    await user
                        .updateOne({ Points: user.Points - ADDPOINTSROLE })
                        .catch((err: Error) => {
                            console.log(err);
                        });

                    newMember.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${color.Discord.BACKGROUND}`)
                                .setDescription(
                                    `> Because the role "${currentRole}" was removed from your profile, **you lost ${ADDPOINTSROLE} points!**`,
                                ),
                        ],
                        ephemeral: true,
                    });
                }
            }
        }
    },
};

export default event;
