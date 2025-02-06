const { EmbedBuilder } = require('discord.js');

module.exports = {
    async handleSuggestions(message, config) {
        if (message.author.bot) return;
        if (!config.suggestionChannel || message.channel.id !== config.suggestionChannel) return;

        const reviewChannel = message.guild.channels.cache.get(config.reviewChannel);
        if (!reviewChannel) return message.reply("⚠️ Review channel not found.");

        const suggestionEmbed = new EmbedBuilder()
            .setTitle("📩 New Suggestion")
            .setDescription(message.content)
            .setFooter({ text: `Suggested by: ${message.author.tag}` })
            .setColor(0x3498db);

        const sentMessage = await reviewChannel.send({ embeds: [suggestionEmbed] });
        await sentMessage.react("✅");
        await sentMessage.react("❌");

        message.reply("✅ Your suggestion has been submitted for review.");
    },

    async handleApproval(reaction, user, config) {
        if (user.bot || !config.reviewChannel || reaction.message.channel.id !== config.reviewChannel) return;

        const approvedChannel = reaction.message.guild.channels.cache.get(config.approvedSuggestionsChannel);
        if (!approvedChannel) return;

        if (reaction.emoji.name === "✅") {
            await approvedChannel.send({ content: "**✅ Approved Suggestion:**", embeds: reaction.message.embeds });
            await reaction.message.delete();
        } else if (reaction.emoji.name === "❌") {
            await reaction.message.reply("❌ Suggestion was rejected.");
            await reaction.message.delete();
        }
    }
};
