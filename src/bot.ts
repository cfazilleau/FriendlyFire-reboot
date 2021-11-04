import * as Discord from 'discord.js';

// TODO: get all intents needed from the different plugins
const options: Discord.ClientOptions = { intents: Discord.Intents.FLAGS.GUILDS }

// Create client
export const client: Discord.Client = new Discord.Client(options);
