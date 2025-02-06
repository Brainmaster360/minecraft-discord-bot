const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        if (!config.welcomeChannelId) return;

        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle('🎉 Welcome to the Server!')
            .setDescription(`Hey ${member}, welcome to **${member.guild.name}**! 🎊\nMake sure to check out the rules and say hi!`)
            .setColor('#00ff00')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
