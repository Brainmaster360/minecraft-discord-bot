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

        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
        }

        let config = require(`../${configPath}`);
        config[type] = channel.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await interaction.reply(`✅ **${type.replace('Channel', '')} channel** has been set to ${channel}`);
    }
};
