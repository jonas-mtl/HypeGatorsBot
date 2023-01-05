import { Config as IConfig } from './Structures/Interfaces/index.js';

const Config: IConfig = {
    TOKEN: '',
    Twitter: {
        username: 'HypeGators',
        id: '',
    },
    Database: {
        MongoDB:
            'mongodb-url',
    },
    DevGuilds: [
        {
            name: 'HYPE GATORS',
            id: '',
            modChannel: '',
        },
    ],
    OwnerIds: [
        {
            name: 'Jonas',
            id: '',
        },
    ],
    AdminIds: [
        {
            name: 'Jonas',
            id: '',
        },
    ],
    APIs: [
        {
            name: 'TwitterAPI',
            apiKeys: [
                '', //API KEY
                '', // API SECRET
                '', //Bearer Token
            ],
        },
    ],
};

export default Config;
