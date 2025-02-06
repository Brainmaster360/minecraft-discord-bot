const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const configPath = './config.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Set the welcome channel for new members.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel for welcome messages')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        try {
            // Ensure config file exists
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
            }

            // Read existing config
            let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Update the welcome channel ID
            config.welcomeChannelId = channel.id;

            // Write back to config.json
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await interaction.reply({ content: `✅ Welcome messages will now be sent in ${channel}.`, ephemeral: true });

        } catch (error) {
            console.error(`❌ ERROR setting welcome channel:`, error);
            await interaction.reply({ content: '⚠️ Error setting welcome channel. Check permissions and try again.', ephemeral: true });
        }
    }
};
