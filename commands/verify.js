const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    async handleInteraction(interaction) {
        if (interaction.customId !== "verify_button") return;

        const role = interaction.guild.roles.cache.get(config.verifiedRoleID);
        if (!role) return interaction.reply({ content: "⚠️ Verification role not found.", ephemeral: true });

        await interaction.member.roles.add(role);
        await interaction.reply({ content: "✅ You have been verified!", ephemeral: true });
    },
    
    async sendVerificationEmbed(client) {
        const channel = await client.channels.fetch(config.verificationChannelID);

        const verifyEmbed = new EmbedBuilder()
            .setTitle("🔒 Verification Required")
            .setDescription("Click the **Verify Me** button below to get verified.")
            .setColor(0x00ff00)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: "Verification is required to access the server." });

        const verifyButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("verify_button")
                .setLabel("✅ Verify Me")
                .setStyle(ButtonStyle.Success)
        );

        const messages = await channel.messages.fetch();
        if (!messages.find(msg => msg.author.id === client.user.id)) {
            await channel.send({ embeds: [verifyEmbed], components: [verifyButton] });
        }
    }
};
