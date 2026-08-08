const axios = require("axios");

module.exports = {
        config: {
                name: "sing",
                version: "6.0",
                author: "MYOUN SORKAR",
                countDown: 5,
                role: 0,
                description: {
                        bn: "অডিও গান ডাউনলোড",
                        en: "Download audio songs",
                },
                category: "music",
        },

        onStart: async function ({ api, event, args, message }) {
                const query = args.join(" ");
                if (!query) return message.reply("× গানের নাম দাও বেবি! 🎵");

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        // API Sourcing to avoid 429 errors
                        const apis = [
                                `https://api.vytal.dev/music?query=${encodeURIComponent(query)}`,
                                `https://mostakim.onrender.com/mostakim/ytSearch?search=${encodeURIComponent(query)}`
                        ];

                        let audioUrl = null;
                        let songTitle = query;

                        // Try first API, then fallback
                        for (let url of apis) {
                                try {
                                        const res = await axios.get(url, { timeout: 15000 });
                                        if (res.data) {
                                                audioUrl = res.data.downloadUrl || res.data.audio || res.data.url;
                                                songTitle = res.data.title || query;
                                                break;
                                        }
                                } catch (e) { continue; }
                        }

                        if (!audioUrl) throw new Error("গান পাওয়া যায়নি!");

                        const audioStream = await axios({
                                method: "GET",
                                url: audioUrl,
                                responseType: "stream",
                                timeout: 30000
                        });

                        return message.reply({
                                body: `✅ | গান রেডি বেবি <😘\n• 𝐒𝐨𝐧𝐠: ${songTitle}`,
                                attachment: audioStream.data
                        }, () => {
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        });

                } catch (err) {
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply("× এই মুহূর্তে গান ডাউনলোডের লিমিট শেষ। একটু পরে চেষ্টা করো বেবি!");
                }
        }
};
