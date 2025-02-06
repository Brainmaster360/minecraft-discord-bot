const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

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

// Register events
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle Slash Commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setup') {
        await setupCommand.execute(interaction);
    }
});

// Handle Suggestion System
client.on('messageCreate', suggestionsSystem.handleSuggestions);
client.on('messageReactionAdd', suggestionsSystem.handleApproval);

// Login bot with token from .env
client.login(process.env.BOT_TOKEN);
