const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Shows the admin setup guide'),
    async execute(interaction) {
        const setupEmbed = new EmbedBuilder()
            .setTitle("⚙️ Server Setup Guide")
            .setDescription("Follow these steps to set up your Discord bot:")
            .setColor(0x3498db)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: "1️⃣ Suggestions", value: "Users can submit suggestions with `/suggest`." },
                { name: "2️⃣ Auto-Roles", value: "Users automatically get roles when verified." },
                { name: "3️⃣ Advanced Commands", value: "Use `/help` for a list of available commands." }
            )
            .setFooter({ text: "Need help? Contact an admin." });

        await interaction.reply({ embeds: [setupEmbed], ephemeral: true });
    }
};
