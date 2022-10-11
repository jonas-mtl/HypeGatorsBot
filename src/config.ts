import { Config as IConfig } from './Structures/Interfaces/index.js';

const Config: IConfig = {
    TOKEN: 'MTAyMTg1ODEwOTEyMTExMDExOA.G7UQ9p.BUbPJYtwoKuon5kKBBEVneYGqeBSGb0m9y7l7k',
    Twitter: {
        username: 'HypeGators',
        id: '1541540551966834688',
    },
    Database: {
        MongoDB:
            'mongodb+srv://discordbot:PVJ4hIORBVWWsFrZ@cluster0.z63o9tw.mongodb.net/?retryWrites=true&w=majority',
    },
    DevGuilds: [
        {
            name: 'HYPE GATORS',
            id: '1011006517283143740',
            modChannel: '1011007190447960094',
        },
    ],
    OwnerIds: [
        {
            name: 'Jonas',
            id: '783252406753689601',
        },
    ],
    AdminIds: [
        {
            name: 'Jonas',
            id: '783252406753689601',
        },
    ],
    APIs: [
        {
            name: 'TwitterAPI',
            apiKeys: [
                'Ah7uEkLFwCg82yFfFQ3dHbJRf', //API KEY
                'o1qgZOBwSajnknT98nlQANyqSpwd8jl66qfrOaL2YBWvnmcBgG', // API SECRET
                'AAAAAAAAAAAAAAAAAAAAACVGiAEAAAAAMMhOqs%2FKQIJEh6csrt1Iq1uzrWc%3DGYfrfmJiyc2HCHk2ZKOGiRIBr5AlsGr0GZkRTm1tZZwlYQ1pxj', //Bearer Token
            ],
        },
    ],
};

export default Config;
