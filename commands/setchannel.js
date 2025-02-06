const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const configPath = './config.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set a specific bot channel (suggestion, review, or approved).')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of channel to set (suggestion, review, approved)')
                .setRequired(true)
                .addChoices(
                    { name: 'Suggestion', value: 'suggestionChannel' },
                    { name: 'Review', value: 'reviewChannel' },
                    { name: 'Approved Suggestions', value: 'approvedSuggestionsChannel' }
                ))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to assign')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');

        try {
            // Ensure config file exists
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
            }

            // Read config dynamically to prevent caching issues
            let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Update the channel ID
            config[type] = channel.id;

            // Write back to config.json
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await interaction.reply(`✅ **${type.replace('Channel', '')} channel** has been set to ${channel}`);
        } catch (error) {
            console.error(`❌ ERROR setting channel:`, error);
            await interaction.reply({ content: '⚠️ Error setting channel. Check permissions and try again.', ephemeral: true });
        }
    }
};
