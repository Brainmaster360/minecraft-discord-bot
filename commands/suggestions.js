const { EmbedBuilder } = require('discord.js');

module.exports = {
    async handleSuggestions(message) {
        if (message.author.bot) return;

        const suggestionChannelId = process.env.SUGGESTION_CHANNEL_ID;
        const reviewChannelId = process.env.REVIEW_CHANNEL_ID;

        if (message.channel.id !== suggestionChannelId) return;

        const reviewChannel = message.guild.channels.cache.get(reviewChannelId);
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

    async handleApproval(reaction, user) {
        if (user.bot) return;

        const reviewChannelId = process.env.REVIEW_CHANNEL_ID;
        const approvedChannelId = process.env.APPROVED_SUGGESTIONS_CHANNEL_ID;

        if (reaction.message.channel.id !== reviewChannelId) return;

        const approvedChannel = reaction.message.guild.channels.cache.get(approvedChannelId);
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
