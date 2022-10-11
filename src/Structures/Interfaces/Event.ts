import { ClientEvents } from 'discord.js';

interface EventOptions {
    ONCE?: boolean;
    REST?: boolean;
}

export interface Event {
    name: keyof ClientEvents;
    options?: EventOptions;
    // eslint-disable-next-line no-unused-vars
    execute: (...args: any[]) => any;
}
