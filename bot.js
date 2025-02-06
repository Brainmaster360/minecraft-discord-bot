const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

// Load stored configuration
const configPath = './config.json';
const config = fs.existsSync(configPath) ? require(configPath) : {};

// Initialize the bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User]
});

// Load Commands
const setupCommand = require('./commands/setup');
const suggestionsSystem = require('./commands/suggestions');
const setChannelCommand = require('./commands/setchannel');

// Register events
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle Slash Commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setup') {
        await setupCommand.execute(interaction);
    } else if (interaction.commandName === 'setchannel') {
        await setChannelCommand.execute(interaction);
    }
});

// Handle Suggestion System
client.on('messageCreate', (message) => suggestionsSystem.handleSuggestions(message, config));
client.on('messageReactionAdd', (reaction, user) => suggestionsSystem.handleApproval(reaction, user, config));

// Login bot with token from .env
client.login(process.env.BOT_TOKEN);
