const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

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

        const config = { welcomeChannelId: channel.id };
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        interaction.reply({ content: `✅ Welcome messages will now be sent in ${channel}.`, ephemeral: true });
    }
};
