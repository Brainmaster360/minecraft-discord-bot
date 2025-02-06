const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Send a custom embed message')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Hex color code (e.g., #ff0000 for red)')
                .setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        let color = interaction.options.getString('color') || '#0099FF';

        // Ensure color is formatted correctly
        if (!/^#?[0-9A-F]{6}$/i.test(color)) {
            color = '#0099FF'; // Default color if invalid
        } else {
            color = color.replace(/^#/, ''); // Remove "#" if present
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(`#${color}`) // Ensure Discord.js handles it correctly
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
