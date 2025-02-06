require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!BOT_TOKEN) {
    console.error("❌ ERROR: BOT_TOKEN is missing. Check your .env file.");
    process.exit(1);
}

console.log("🔄 Loading bot...");

// Load commands dynamically
const fs = require('fs');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: ${command.data.name}`);
}

// Event: Bot Ready
client.once('ready', () => {
    console.log(`✅ Bot is online! Logged in as ${client.user.tag}`);
});

// Event: Slash Command Handling
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`❌ ERROR: Command "${interaction.commandName}" not found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ ERROR executing command "${interaction.commandName}":`, error);
        await interaction.reply({ content: "⚠️ An error occurred while executing this command.", ephemeral: true });
    }
});

// Event: Guild Member Joins (For Custom Greetings)
client.on('guildMemberAdd', async member => {
    console.log(`🎉 ${member.user.tag} joined the server!`);
    const channel = member.guild.systemChannel;
    if (!channel) return;

    const welcomeEmbed = {
        color: 0x00ff00,
        title: "Welcome to the Server!",
        description: `Hey <@${member.id}>, welcome to **${member.guild.name}**! 🎉\nMake sure to check out the rules and say hi!`,
        thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
        footer: { text: `User ID: ${member.id}` },
    };

    channel.send({ embeds: [welcomeEmbed] }).catch(console.error);
});

// Bot Login
client.login(BOT_TOKEN);
