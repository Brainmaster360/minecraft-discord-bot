const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Welcome Message
client.on('guildMemberAdd', async member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
    if (welcomeChannel) {
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`Welcome, ${member.user.username}! 🎉`)
            .setDescription(`We're glad to have you here! Please check out the rules and verify yourself.`)
            .setColor(0x00ff00);
        welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
});

// Verification System
client.on('messageCreate', async message => {
    if (message.content.toLowerCase() === "!verify") {
        const role = message.guild.roles.cache.find(r => r.name === "Verified");
        if (role) {
            await message.member.roles.add(role);
            message.reply("✅ You have been verified!");
        } else {
            message.reply("⚠️ No 'Verified' role found. Contact an admin.");
        }
    }
});

client.login(process.env.BOT_TOKEN);
