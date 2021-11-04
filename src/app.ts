require('dotenv').config(); // load .env into environment variables (for development purpose)

import { Client, ClientApplication, Guild, Interaction } from 'discord.js';

// client definition and initialization is in 'bot.ts'
import { client } from './bot'

// TODO: migrate those files and fix them
//import * as config from './config';
//import * as perms from './permissions';
//import * as modules from './modules';

process.on('unhandledRejejection', console.error);

function HandleReady(client: Client) {
    // Get all commands from modules
    //modules.preloadModules();
    //modules.loadModules(client)
}

function HandleInteraction(interaction: Interaction) {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;

    // Check if it is the correct command
    if (interaction.commandName === 'echo') {
        // Get the input of the user
        const input: string = interaction.options.getString("0") ?? "";
        // Reply to the command
        interaction.reply(input);
    }
}

// Bind events
client.once('ready', HandleReady);
client.on('interaction', HandleInteraction);

// Connect client to discord
console.log('logging in with token');
client.login(process.env.BOT_TOKEN)
    .then(() => {
        // TODO: generate permission request depending on the rights needed for all plugins
        console.log('invite link: https://discord.com/api/oauth2/authorize?client_id=' + process.env.BOT_ID + '&permissions=8&scope=bot%20applications.commands');
    })
    .catch(error => {
        console.log('failed to connect ' + error + process.env.BOT_ID);
    });

// -------------------------------

if (0) {   /// Slash Commands stuff -- should ignore and migrate old bot before making adjustments
    if (client.application === null)
        throw Error;

    const application: ClientApplication = client.application;

    // Delete all commands
    application.commands.fetch().then(value => {
        value.forEach(element => {
            application.commands.delete(element);
        });
        console.log(application.commands.cache);
    });

    var guildscache = client.guilds.cache.first();

    if (client.guilds.cache.size <= 0 || guildscache == null)
        throw Error;

    const guild: Guild = guildscache;

    guild.commands.fetch().then(value => {
        value.forEach(element => {
            guild.commands.delete(element);
        });
        console.log(guild.commands.cache);
    });

    /*

    // Creating a global command
    commandData;
    application.commands.create(commandData);
    console.log('created command ' + commandData);

    // Creating a guild-specific command
    guild.commands.create(commandData);

    */
}
