/* eslint-disable camelcase */
import { Client, Collection, GatewayIntentBits, Partials, version } from 'discord.js';
import { Command, Config, Event } from '../Interfaces/index.js';
import { Handler } from '../Handlers/Handler.js';
import { Box } from '../Classes/Boxen.js';

import ClientConfig from '../../config.js';
import Twitter from 'twitter';
import twitterPin from 'twitter-pin';
import mongoose from 'mongoose';
import chalk from 'chalk';

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const IBox = new Box();
const BoxContents = await IBox.createBox();

export class BaseClient extends Client {
    public commands: Collection<string, Command>;
    public events: Collection<string, Event>;
    public config: Config;
    public twitter: Twitter;
    public twitterPin: twitterPin;

    private boxContents = BoxContents;

    constructor() {
        super({
            intents: [Guilds, GuildMembers, GuildMessages],
            partials: [User, Message, GuildMember, ThreadMember],
        });

        this.commands = new Collection();
        this.events = new Collection();
        this.config = ClientConfig;

        this.twitterPin = new twitterPin(
            this.config.APIs![0].apiKeys[0],
            this.config.APIs![0].apiKeys[1],
        );
    }

    public async start() {
        // Login
        await IBox.addItem(this.boxContents, {
            name: `${chalk.bold.hex('#5865F2')('Discord.js')}`,
            value: `v${version}\n`,
        });

        // Modules
        await this.registerModules();

        // Database
        this.setMaxListeners(0);
        await this.connectMongoDB();

        await IBox.showBox(this.boxContents, {
            borderColor: 'white',
            borderStyle: 'round',
            dimBorder: true,
            padding: 1,
            margin: 1,
        });

        await this.login(this.config.TOKEN);
    }

    private async registerModules() {
        const { loadEvents, loadCommands, handleCrashes } = new Handler();

        try {
            await loadEvents(this);
            IBox.addItem(this.boxContents, {
                name: `${chalk.yellow('Events')}`,
                value: `OK`,
            });
        } catch (err) {
            IBox.addItem(this.boxContents, {
                name: `${chalk.bold.red('Events')}`,
                value: `${err}`,
            });
        }

        try {
            await loadCommands(this);
            IBox.addItem(this.boxContents, {
                name: `${chalk.yellow('Commands')}`,
                value: `OK`,
            });
        } catch (err) {
            IBox.addItem(this.boxContents, {
                name: `${chalk.red('Commands')}`,
                value: `${err}`,
            });
        }

        await handleCrashes(this);
    }

    private async connectMongoDB() {
        try {
            await mongoose.connect(`${this.config.Database?.MongoDB}`);
            IBox.addItem(this.boxContents, {
                name: `${chalk.yellow('Database')}`,
                value: `OK`,
            });
        } catch (err) {
            IBox.addItem(this.boxContents, {
                name: `${chalk.red('Database')}`,
                value: `${err}`,
            });
        }
    }
}
