const config = require('../config.json');

const captchaAnswers = ["apple", "banana", "grape", "orange", "watermelon"];
const pendingCaptcha = new Map();

module.exports = {
    async handleInteraction(interaction) {
        if (interaction.customId !== "verify_button") return;

        const randomWord = captchaAnswers[Math.floor(Math.random() * captchaAnswers.length)];
        pendingCaptcha.set(interaction.user.id, randomWord);

        await interaction.reply({
            content: `🛡️ **Security Check**: Type this word correctly in chat: **${randomWord}**`,
            ephemeral: true
        });
    },

    async handleMessage(message) {
        if (!pendingCaptcha.has(message.author.id)) return;

        const correctAnswer = pendingCaptcha.get(message.author.id);
        if (message.content.toLowerCase() === correctAnswer) {
            const role = message.guild.roles.cache.get(config.verifiedRoleID);
            if (role) {
                await message.member.roles.add(role);
                await message.reply("✅ **You have passed the verification and are now verified!**");
            }
            pendingCaptcha.delete(message.author.id);
        } else {
            await message.reply("❌ **Incorrect CAPTCHA. Please try again!**");
        }
    }
};
