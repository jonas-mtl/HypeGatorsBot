<div align="center">
  <a href="https://twitter.com/HypeGators">
    <img src="https://pbs.twimg.com/profile_images/1572275335630036993/nTyftRj1_400x400.jpg" alt="Logo" width="80" style="border-radius: 50%;" height="80">
  </a>

  <h3 align="center">HYPEGATORS DISCORD BOT</h3>

  <p align="center">
    Written in Typescript
    <br />
    <a href="https://github.com/JonasThierbach/HypeGatorsBot"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Getting started</a>
    ·
    <a href="#setup">Setup</a>
    ·
    <a href="#build-and-run">Compile</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#build-and-run">Build and run</a></li>
  </ol>
</details>

## About The Project

Welcome to HypeGator Bot's instruction!

A custom bot with twitter api integration for the HypeGator discord server

Use the `README.md` to get started.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* ![NPM][NPM]
* ![TS][TS]
* ![NodeJS][NodeJS]
* ![Twitter][Twitter]
* ![MongoDB][MongoDB]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

Node.js (https://nodejs.org/en/download/) 16.17.1^ (check your version with `node -v` && `npm -v`)

Typescript Version 4.7.4^ (check your version with `tsc -v`)
* install typescript:
  ```sh
  npm install -g typescript
  ```

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/JonasThierbach/HypeGatorsBot.git
   ```
2. Install NPM packages (open cloned folder with command Prompt)
   ```sh
   npm install
   ```

3. Setup your config in src/config.ts 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Setup

### Member Username check 

- src/Events/Members/memberUpdate.ts

```ts
        //Settings for name check
        const ADDPOINTSNAME: number = 200; //Points to add when a user has specific string in his name
        const REMOVEPOINTSNAME: boolean = true; //Remove points when user changes his name back?
        const CHECKNAME: string = 'Jonas'; //String to check for in a users name

        //Settings for role check
        const ADDPOINTSROLE: number = 100; //Points to add when a user gets a specific role
        const REMOVEPOINTSROLE: boolean = true; //Remove points when role was removed?
        const CHECKROLES: Array<string> = ['test']; //Role name to check for ("name1","name2") <- use this if you want to check for more than one role
```

### Add submit categorys and setup rewards

- add categorys in src/Commands/Points/submit.ts (line 25+)

```ts
      .addChoices(
          { name: 'twitter', value: 'twitter' },
          { name: 'artwork', value: 'artwork' },
          { name: 'test', value: 'test' },
          { name: 'test2', value: 'test2' },
          ...
      ),
```

- setup rewards for categorys src/Events/Interactions/submit-accept.ts

```ts
        const POINTS = { twitter: 20, artwork: 10, test: 200, test2: 500 };
```

### Random Rewards for Twitter interactions

- change random Rewards (min, max) in 
  - src/Events/Client/ready.ts (line 22)
  - src/Commands/Moderation/update-twitter.ts (line 27)

```ts
        const REWARDS = [1000 (min Rewards), 2000 (max Rewards)];
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Customize quest panel

- Change content inside of src/Commands/Moderation/quest-panel.ts (line 27+)
  - [Click here for more information on how to customize the embed](https://discordjs.guide/popular-topics/embeds.html)

```ts
embeds: [
    new EmbedBuilder()
        .setColor(`#${color.Discord.BACKGROUND}`)
        .setDescription('Here you can see all the quests!'),
],
```


## Build and Run

You need to compile typescript to javascript for easy hosting

1. open command line in projects folder
2. run following command to compile: `tsc -w`
3. to start the bot open command line in created "dist" folder and run `node .`
   
<p align="right">(<a href="#readme-top">back to top</a>)</p>


[TS]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[NPM]: https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[Twitter]: https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white