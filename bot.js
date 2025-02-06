const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

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

// Use commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'setup') await setupCommand.execute(interaction);
});

// Use suggestions system
client.on('messageCreate', suggestionsSystem.handleSuggestions);
client.on('messageReactionAdd', suggestionsSystem.handleApproval);

client.login(process.env.BOT_TOKEN);
