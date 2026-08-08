const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs-extra");
const path = require("path");

const YOUTUBE_API_KEY = "AIzaSyDHzEm8mctwJMFCOyP0osgjoaapqsUZkpI";

module.exports = {
        config: {
                name: "sing",
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
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
                        notFound: "× দুঃখিত বেবি, কোনো গান পাওয়া যায়নি!",
                        success: "✅ | এই নাও তোমার গান বেবি <😘\n• 𝐒𝐨𝐧𝐠: %1",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please provide a song name! 🎵\nExample: {pn} shape of you",
                        notFound: "× Sorry baby, no song was found!",
                        success: "✅ | Here's your requested song baby <😘\n• 𝐒𝐨𝐧𝐠: %1",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng cung cấp tên bài hát! 🎵\nVí dụ: {pn} shape of you",
                        notFound: "× Không tìm thấy bài hát!",
                        success: "✅ | Bài hát của cưng đây <😘\n• 𝐁𝐚̀𝐢 𝐡𝐚́𝐭: %1",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
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

                        // ১. ইউটিউব API দিয়ে ভিডিও সার্চ করা
                        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;
                        const searchRes = await axios.get(searchUrl);

                        const items = searchRes.data.items;
                        if (!items || items.length === 0) {
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return message.reply(getLang("notFound"));
                        }

                        const videoId = items[0].id.videoId;
                        const videoTitle = items[0].snippet.title;
                        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

                        // ২. ফাইল সেভ করার পাথ
                        const filePath = path.join(__dirname, "cache", `${videoId}.mp3`);
                        await fs.ensureDir(path.join(__dirname, "cache"));

                        // ৩. ইউটিউব থেকে গান ডাউনলোড করে পাঠানো
                        const stream = ytdl(videoUrl, { filter: "audioonly", quality: "highestaudio" });
                        const writeStream = fs.createWriteStream(filePath);

                        stream.pipe(writeStream);

                        writeStream.on("finish", () => {
                                return message.reply({
                                        body: getLang("success", videoTitle),
                                        attachment: fs.createReadStream(filePath)
                                }, () => {
                                        api.setMessageReaction("🪽", event.messageID, () => {}, true);
                                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                                });
                        });

                        writeStream.on("error", (err) => {
                                throw err;
                        });

                } catch (err) {
                        console.error("Sing Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
