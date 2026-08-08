const axios = require("axios");

module.exports = {
        config: {
                name: "sing",
                version: "4.0",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "যেকোনো গান সার্চ করে অডিও ফাইল ডাউনলোড করুন",
                        en: "Search and download any song as an audio file",
                        vi: "Tìm kiếm và tải xuống bất kỳ bài hát nào dưới dạng tệp âm thanh"
                },
                category: "music",
                guide: {
                        bn: '   {pn} <গানের নাম>: গান ডাউনলোড করতে নাম লিখুন',
                        en: '   {pn} <song name>: Enter song name to download',
                        vi: '   {pn} <tên bài hát>: Nhập tên bài hát để tải xuống'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, গানের নাম তো দাও! 🎵\nউদাহরণ: {pn} shape of you",
                        success: "✅ | এই নাও তোমার গান বেবি <😘\n• 𝐒𝐨𝐧𝐠: %1",
                        error: "× গান ডাউনলোড করতে সমস্যা হয়েছে: %1"
                },
                en: {
                        noInput: "× Baby, please provide a song name! 🎵\nExample: {pn} shape of you",
                        success: "✅ | Here's your requested song baby <😘\n• 𝐒𝐨𝐧𝐠: %1",
                        error: "× API error: %1"
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng cung cấp tên bài hát! 🎵\nVí dụ: {pn} shape of you",
                        success: "✅ | Bài hát của cưng đây <😘\n• 𝐁𝐚̀𝐢 𝐡𝐚́𝐭: %1",
                        error: "× Lỗi: %1"
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const query = args.join(" ");
                if (!query) return message.reply(getLang("noInput"));

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        // Mostakim YouTube Search & Download API
                        const apiUrl = `https://mostakim.onrender.com/mostakim/ytSearch?search=${encodeURIComponent(query)}`;
                        const searchRes = await axios.get(apiUrl, { timeout: 20000 });

                        // API Response validation
                        const songData = Array.isArray(searchRes.data) ? searchRes.data[0] : (searchRes.data.results?.[0] || searchRes.data);
                        const audioUrl = songData?.downloadUrl || songData?.audio || songData?.url || songData?.download_url;
                        const songTitle = songData?.title || query;

                        if (!audioUrl) {
                                throw new Error("গানটির অডিও লিংক খুঁজে পাওয়া যায়নি!");
                        }

                        // Stream audio attachment
                        const audioStream = await axios({
                                method: "GET",
                                url: audioUrl,
                                responseType: "stream",
                                timeout: 35000
                        });

                        return message.reply({
                                body: getLang("success", songTitle),
                                attachment: audioStream.data
                        }, () => {
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        });

                } catch (err) {
                        console.error("Sing Error:", err.message);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
