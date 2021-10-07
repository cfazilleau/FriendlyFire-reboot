require('dotenv').config(); // load .env into environment variables

import * as discord from 'discord.js';

import * as config from './config';
import * as perms from './permissions';
import * as modules from './modules';

process.on('unhandledRejejection', console.error);

// TODO: get all intents needed from the different plugins
const options : discord.ClientOptions = { intents: discord.Intents.ALL }

// Create bot instance
const client : discord.Client = new discord.Client(options);

// Connect bot to discord
console.log('logging in with token');

client.once('ready', () => {
    // Get all commands from modules
    modules.preloadModules();
    modules.loadModules(bot)
});

client.on('interaction', interaction => {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;

    // Check if it is the correct command
    if (interaction.commandName === 'echo') {
        // Get the input of the user
        const input : string = interaction.options[0].value.toString();
        // Reply to the command
        interaction.reply(input);
    }
});

client.login(process.env.BOT_TOKEN)
    .then(() => {
        // TODO: generate permission request depending on the rights needed for all plugins
        console.log('invite link: https://discord.com/api/oauth2/authorize?client_id=' + process.env.BOT_ID + '&permissions=8&scope=bot%20applications.commands');
    })
    .catch(error => {
        console.log('failed to connect ' + error + process.env.BOT_ID);
    });

config.configuration;
perms;
