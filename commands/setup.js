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
                { name: "1️⃣ Verification System", value: "Users can verify using a reaction or CAPTCHA system." },
                { name: "2️⃣ Suggestions", value: "Submit suggestions using `/suggest` and admins can approve them." },
                { name: "3️⃣ Auto-Roles", value: "Users automatically get roles when verified." },
                { name: "4️⃣ Advanced Commands", value: "Use `/help` for a list of available commands." }
            )
            .setFooter({ text: "Need help? Contact an admin." });

        await interaction.reply({ embeds: [setupEmbed], ephemeral: true });
    }
};
