const axios = require("axios");

// Typing Indicator Function
const typing = async (api, threadID, ms = 1200) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

// Sretan/Working AI Fetcher Function
async function getAIResponse(text) {
  try {
    const res = await axios.get(`https://api.kenliejugarap.com/ai-chat/?q=${encodeURIComponent(text)}`, { timeout: 10000 });
    if (res.data && res.data.response) {
      return res.data.response;
    }
  } catch {}

  try {
    const backupRes = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(text)}&owner=Myoun&botname=Baby`, { timeout: 8000 });
    if (backupRes.data && backupRes.data.response) {
      return backupRes.data.response;
    }
  } catch {}

  return "হুম বলো, শুনছি! কেমন আছো?";
}

module.exports = {
  config: {
    name: "baby",
    aliases: ["xan", "bby", "bbz", "lamiya", "lamia", "bot"],
    version: "6.0",
    author: "rX (fixed by AI)",
    countDown: 0,
    role: 0,
    shortDescription: "Always Active AI Chatbot",
    longDescription: "Responds to all messages automatically",
    category: "box chat",
    guide: {
      en: "{p}baby [message]"
    }
  },

  // +baby কমান্ড দিয়ে ডাকলে
  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ").trim();
    const threadID = event.threadID;

    try {
      if (!query) {
        await typing(api, threadID, 1000);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)]);
      }

      await typing(api, threadID, 1200);
      const reply = await getAIResponse(query);
      return message.reply(reply);

    } catch (err) {
      console.error("Baby command error:", err.message);
    }
  },

  // বটের মেসেজে Reply দিলে
  onReply: async function ({ api, event, message }) {
    const text = event.body?.trim();
    if (!text) return;

    try {
      await typing(api, event.threadID, 1200);
      const reply = await getAIResponse(text);
      await message.reply(reply);
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  // গ্রুপে বা ইনবক্সে যেকোনো মেসেজ দিলেই উত্তর দেবে
  onChat: async function ({ api, event, message }) {
    const raw = event.body ? event.body.trim() : "";
    if (!raw) return;

    // বট যদি নিজে মেসেজ পাঠায় তবে ইগনোর করবে
    if (event.senderID === api.getCurrentUserID()) return;

    // কমান্ড হলে (যেমন +help বা +cmd) ইগনোর করবে
    if (raw.startsWith("+") || raw.startsWith("!") || raw.startsWith("/")) return;

    const senderID = event.senderID;
    const threadID = event.threadID;
    const ownerID = "100021922069388"; // Myoun UID

    try {
      // ১. শুধু 'baby' বা ট্রিগার ওয়ার্ড লিখলে ওনার/সাধারণ রিপ্লাই
      const triggers = ["baby", "bby", "xan", "bbz", "bot", "lamiya", "lamia", "লামিয়া"];
      if (triggers.includes(raw.toLowerCase())) {
        await typing(api, threadID, 1000);

        if (senderID === ownerID) {
          const ownerResponses = [
            "👑 সতর্কবার্তা! আমার ওনার Myoun মেসেজ দিয়েছে, সবাই সাইড দে!",
            "🚨 সবাই ক্লিয়ার কর! ওনার Myoun-এর এন্ট্রি হইছে!",
            "🫡 ওনার Myoun সালাম গ্রহণ করুন! আপনার বট একদম এটেনশন মোডে!",
            "💖 বলো Myoun... তোমার বটের কান সবসময় প্রস্তুত!",
            "🚀 Myoun ভাই, রকেট স্পিডে আপনার সেবায় হাজির!"
          ];
          return message.reply(ownerResponses[Math.floor(Math.random() * ownerResponses.length)]);
        }

        const funny = [
          "🌹 বলো, শুনছি!",
          "🥺 এত মিস করলে আগেই তো ডাকতে পারতে!",
          "💖 বলো জান... আমি শুনছি।",
          "😜 ব্যাটারি ১০০%, বলো কী লাগবে!"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)]);
      }

      // ২. যেকোনো সাধারণ লেখার সরাসরি উত্তর দেবে
      await typing(api, threadID, 1200);
      const reply = await getAIResponse(raw);
      return message.reply(reply);

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
