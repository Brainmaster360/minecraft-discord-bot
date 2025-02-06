const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup suggestion channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: "This command must be run in a server.", ephemeral: true });

        try {
            const suggestionChannel = await guild.channels.create({
                name: 'suggestions',
                type: 0, // 0 = Text Channel
                reason: 'Created for user suggestions'
            });

            const reviewChannel = await guild.channels.create({
                name: 'suggestion-review',
                type: 0,
                reason: 'Created for admins to review suggestions'
            });

            await interaction.reply({ content: `✅ Channels created:\n📢 **${suggestionChannel}** (for user suggestions)\n🔍 **${reviewChannel}** (for admin review).`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: '⚠️ Error creating channels. Check my permissions.', ephemeral: true });
        }
    }
};
