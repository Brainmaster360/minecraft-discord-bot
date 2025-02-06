const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup suggestion channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: "This command must be run in a server.", ephemeral: true });

        try {
            // Create the suggestion channel
            const suggestionChannel = await guild.channels.create({
                name: 'suggestions',
                type: ChannelType.GuildText, // Ensure it's a text channel
                topic: 'Users can submit suggestions here.',
                reason: 'Created for user suggestions',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: ['ViewChannel', 'SendMessages'],
                    }
                ]
            });

            // Create the review channel
            const reviewChannel = await guild.channels.create({
                name: 'suggestion-review',
                type: ChannelType.GuildText,
                topic: 'Admins will review suggestions here.',
                reason: 'Created for admins to review suggestions',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: ['ViewChannel'], // Hide from regular users
                    },
                    {
                        id: guild.roles.highest, // Give highest role (likely admin) access
                        allow: ['ViewChannel', 'SendMessages'],
                    }
                ]
            });

            await interaction.reply({
                content: `✅ Channels created:\n📢 **${suggestionChannel}** (for user suggestions)\n🔍 **${reviewChannel}** (for admin review).`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: '⚠️ Error creating channels. Check my permissions.', ephemeral: true });
        }
    }
};
