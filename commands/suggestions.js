const { EmbedBuilder } = require('discord.js');

module.exports = {
    async handleSuggestions(message) {
        if (message.channel.id !== config.suggestionChannelID || message.author.bot) return;

        const reviewChannel = message.guild.channels.cache.get(config.suggestionReviewChannelID);
        if (!reviewChannel) return message.reply("⚠️ Review channel not found.");

        const suggestionEmbed = new EmbedBuilder()
            .setTitle("New Suggestion 📩")
            .setDescription(message.content)
            .setFooter({ text: `Suggested by: ${message.author.tag}` })
            .setColor(0x3498db);

        const sentMessage = await reviewChannel.send({ embeds: [suggestionEmbed] });
        await sentMessage.react("✅");
        await sentMessage.react("❌");

        message.reply("✅ Your suggestion has been submitted for review.");
    },

    async handleApproval(reaction, user) {
        if (reaction.message.channel.id !== config.suggestionReviewChannelID || user.bot) return;

        const approvedChannel = reaction.message.guild.channels.cache.get(config.suggestionApprovedChannelID);
        if (!approvedChannel) return;

        if (reaction.emoji.name === "✅") {
            await approvedChannel.send({ content: "**Approved Suggestion:**", embeds: reaction.message.embeds });
            await reaction.message.delete();
        } else if (reaction.emoji.name === "❌") {
            await reaction.message.reply("❌ Suggestion was rejected.");
            await reaction.message.delete();
        }
    }
};
