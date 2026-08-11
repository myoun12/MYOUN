const axios = require("axios");
const fs = require('fs');
const path = require('path');

const baseApiUrl = async () => {
  try {
    const base = await axios.get(
      `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
      { timeout: 5000 }
    );
    return base.data.api;
  } catch {
    return "https://de1pt0.onrender.com"; // Backup fallback API
  }
};

module.exports = {
  config: {
    name: "sing",
    version: "1.1.6",
    aliases: ["music", "play", "song"],
    author: "dipto (fixed by AI)",
    countDown: 5,
    role: 0,
    shortDescription: "Download audio from YouTube",
    longDescription: "Search and download any music directly from YouTube as audio mp3",
    category: "media",
    guide: {
      en: "{pn} [song name | YouTube link]"
    }
  },

  onStart: async ({ api, args, event, commandName, message }) => {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    
    if (!args[0]) {
      return message.reply("❌ অনুগ্রহ করে কোনো গানের নাম বা ইউটিউব লিংক দিন!");
    }

    const urlYtb = checkurl.test(args[0]);

    // Direct YouTube URL handling
    if (urlYtb) {
      const match = args[0].match(checkurl);
      const videoID = match ? match[1] : null;

      try {
        const apiBase = await baseApiUrl();
        const { data: { title, downloadLink } } = await axios.get(`${apiBase}/ytDl3?link=${videoID}&format=mp3`, { timeout: 15000 });
        const filePath = path.join(__dirname, `cache_sing_${Date.now()}.mp3`);

        await downloadFile(downloadLink, filePath);

        return api.sendMessage({
          body: `🎵 ${title}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, event.messageID);

      } catch (err) {
        return message.reply(`❌ গান ডাউনলোড করতে সমস্যা হয়েছে: ${err.message}`);
      }
    }

    // Keyword Search handling
    let keyWord = args.join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;
    let result;

    try {
      const apiBase = await baseApiUrl();
      const searchRes = await axios.get(`${apiBase}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`, { timeout: 10000 });
      result = (searchRes.data || []).slice(0, maxResults);
    } catch (err) {
      return message.reply("❌ গান সার্চ করতে সমস্যা হয়েছে: " + err.message);
    }

    if (!result || result.length === 0) {
      return message.reply("⭕ আপনার অনুসন্ধানের কোনো গান খুঁজে পাওয়া যায়নি: " + keyWord);
    }

    let msg = "🔎 আপনার পছন্দের গানের নম্বর লিখে রিপ্লাই দিন:\n\n";
    let i = 1;

    for (const info of result) {
      msg += `${i++}. ${info.title}\n⏱ সময়: ${info.time || "N/A"} | 👤 চ্যানেল: ${info.channel?.name || "Unknown"}\n\n`;
    }

    return api.sendMessage(msg + "👇 গানের নম্বর সিলেক্ট করে মেসেজে রিপ্লাই দিন!", event.threadID, (err, info) => {
      if (!err && global.GoatBot?.onReply) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          result
        });
      }
    }, event.messageID);
  },

  onReply: async ({ event, api, Reply, message }) => {
    try {
      const { result, author } = Reply;

      if (event.senderID !== author) {
        return message.reply("❌ যিনি গান সার্চ করেছেন কেবল তিনিই উত্তর দিতে পারবেন!");
      }

      const choice = parseInt(event.body?.trim());

      if (!isNaN(choice) && choice <= result.length && choice > 0) {
        const infoChoice = result[choice - 1];
        const idvideo = infoChoice.id;

        await api.unsendMessage(Reply.messageID);
        const waitMsg = await message.reply("⏳ গানটি ডাউনলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...");

        const apiBase = await baseApiUrl();
        const { data: { title, downloadLink, quality } } = await axios.get(`${apiBase}/ytDl3?link=${idvideo}&format=mp3`, { timeout: 20000 });
        
        const filePath = path.join(__dirname, `cache_sing_${Date.now()}.mp3`);
        await downloadFile(downloadLink, filePath);

        await api.unsendMessage(waitMsg.messageID);

        return api.sendMessage({
          body: `🎵 Title: ${title}\n🎼 Quality: ${quality || "128kbps"}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, event.messageID);

      } else {
        return message.reply("❌ ভুল নম্বর! অনুগ্রহ করে ১ থেকে ৬ এর মধ্যে নম্বর দিন।");
      }
    } catch (error) {
      console.error(error);
      return message.reply("❌ অডিও সার্ভিসটি বর্তমানে সাড়া দিচ্ছে না বা গানটি ফাইল সাইজ লিমিটের বেশি।");
    }
  }
};

// Helper function for safe file download
async function downloadFile(url, savePath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  }
                                                            
