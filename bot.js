const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, PermissionsBitField, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// ✅ Register Slash Commands
const commands = [
    new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Shows an informative embed for admins on how to set up the bot.'),
    new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Get verified in the server.')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('Select the verification role')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion')
        .addStringOption(option => 
            option.setName('content')
                .setDescription('The suggestion text')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Category for the suggestion')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('clear-suggestions')
        .setDescription('Clears all messages in #suggestion-review (Admin only)')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
    new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Send a message to a specified channel (Admin only)')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Select the target channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to send')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
].map(command => command.toJSON());

// ✅ Deploy Commands to Discord
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered!');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
})();

// ✅ Bot Ready Message
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// ✅ Handle Slash Commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // 📌 Admin Setup Guide
    if (interaction.commandName === 'setup') {
        const setupEmbed = new EmbedBuilder()
            .setTitle("🔧 Bot Setup Guide")
            .setDescription("Welcome Admin! Here's how to set up the bot.")
            .addFields(
                { name: "1️⃣ Set up Verification", value: "Use `/verify` to assign roles." },
                { name: "2️⃣ Set up Suggestions", value: "Users use `/suggest` to submit suggestions." },
                { name: "3️⃣ Approve Suggestions", value: "React ✅ or ❌ in #suggestion-review." },
                { name: "4️⃣ Announcements", value: "Use `/broadcast` to send a message in any channel." }
            )
            .setColor(0x3498db);
        
        await interaction.reply({ embeds: [setupEmbed], ephemeral: true });
    }

    // ✅ Verify Command
    if (interaction.commandName === 'verify') {
        let role = interaction.options.getRole('role') || interaction.guild.roles.cache.find(r => r.name === "Verified");

        if (role) {
            await interaction.member.roles.add(role);
            await interaction.reply({ content: `✅ You have been verified with the role: ${role.name}!`, ephemeral: true });
        } else {
            await interaction.reply({ content: "⚠️ No verification role found. Contact an admin.", ephemeral: true });
        }
    }

    // ✅ Suggest Command
    if (interaction.commandName === 'suggest') {
        const suggestionContent = interaction.options.getString('content');
        const category = interaction.options.getString('category') || "General";
        const reviewChannel = interaction.guild.channels.cache.find(ch => ch.name === "suggestion-review");

        if (!reviewChannel) {
            await interaction.reply({ content: "⚠️ The review channel is missing. Please contact an admin.", ephemeral: true });
            return;
        }

        const suggestionEmbed = new EmbedBuilder()
            .setTitle("New Suggestion 📩")
            .setDescription(suggestionContent)
            .addFields({ name: "Category", value: category })
            .setFooter({ text: `Suggested by: ${interaction.user.tag}` })
            .setColor(0x3498db);

        const sentMessage = await reviewChannel.send({ embeds: [suggestionEmbed] });

        await sentMessage.react("✅");
        await sentMessage.react("❌");

        await interaction.reply({ content: "✅ Your suggestion has been submitted for review!", ephemeral: true });
    }

    // ✅ Clear Suggestions Command (Admin Only)
    if (interaction.commandName === 'clear-suggestions') {
        const reviewChannel = interaction.guild.channels.cache.find(ch => ch.name === "suggestion-review");
        if (!reviewChannel) return interaction.reply({ content: "⚠️ The review channel is missing.", ephemeral: true });

        const messages = await reviewChannel.messages.fetch({ limit: 100 });
        await reviewChannel.bulkDelete(messages, true);

        await interaction.reply({ content: "🗑️ Cleared all suggestions from review.", ephemeral: true });
    }

    // ✅ Broadcast Command (Admin Only)
    if (interaction.commandName === 'broadcast') {
        const targetChannel = interaction.options.getChannel('channel');
        const messageContent = interaction.options.getString('message');

        if (!targetChannel) {
            return interaction.reply({ content: "⚠️ Please select a valid channel.", ephemeral: true });
        }

        await targetChannel.send(messageContent);
        await interaction.reply({ content: "📢 Message sent successfully!", ephemeral: true });
    }
});

// ✅ Handle Admin Approval for Suggestions
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.name === "suggestion-review" && !user.bot) {
        const approvedChannel = reaction.message.guild.channels.cache.find(ch => ch.name === "approved-suggestions");
        if (!approvedChannel) return;

        if (reaction.emoji.name === "✅") {
            await approvedChannel.send({ content: "**Approved Suggestion:**", embeds: reaction.message.embeds });
            await reaction.message.delete();
        } else if (reaction.emoji.name === "❌") {
            await reaction.message.reply("❌ Suggestion was rejected.");
            await reaction.message.delete();
        }
    }
});

// ✅ Log in the bot
client.login(process.env.BOT_TOKEN);
