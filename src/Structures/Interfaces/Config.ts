export interface Config {
    TOKEN: string;
    Twitter?: {
        id: string;
        username: string;
    };
    Database: {
        MongoDB: string;
        Redis?: string;
    };
    OwnerIds?: object[];
    AdminIds?: object[];
    Webhooks?: object[];
    DevGuilds: [
        {
            name: string;
            id: string;
            modChannel: string;
        },
    ];
    APIs?: [
        {
            name: string;
            apiKeys: Array<string>;
        },
    ];
}
