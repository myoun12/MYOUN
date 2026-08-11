const axios = require("axios");

// Typing Indicator Function
const typing = async (api, threadID, ms = 1000) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

// Local Smart Reply Generator (No external API delay)
function getLocalResponse(text) {
  const q = text.toLowerCase();

  if (q.includes("kemon") || q.includes("কেমন")) {
    const replies = ["আমি ভালো আছি! তুমি কেমন আছো?", "একদম বিন্দাস! তোমার কি খবর?", "আলহামদুলিল্লাহ্‌ ভালো। তুমি কেমন আছো?"];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (q.includes("ki koro") || q.includes("কি করো") || q.includes("কি করিস")) {
    const replies = ["তোমার মেসেজের জন্য অপেক্ষা করছিলাম!", "বসে বসে তোমার সাথে চ্যাট করছি 🙈", "কিছু না, তোমার কথা ভাবছি!"];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (q.includes("khabar") || q.includes("kheyecho") || q.includes("খাবার") || q.includes("খেয়েছো")) {
    const replies = ["আমি তো ডিজিটাল খাবার (ডাটা) খাই! তুমি খাইছো?", "হ্যাঁ খেয়েছি! তুমি কি খেলে আজ?", "হুমম খাইছি! তুমি খাইছো তো?"];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (q.includes("nam ki") || q.includes("নাম কি")) {
    return "আমার নাম Baby! আপনার কিউটি বট 🙈";
  }

  if (q.includes("love") || q.includes("ভালোবাসি") || q.includes("bhalobashi")) {
    return "আমিও তোমাকে অনেক ভালোবাসি! ❤️✨";
  }

  // Default Random Replies
  const defaults = [
    "হুমম বলো, শুনছি! 💖",
    "অহ তাই নাকি? তারপর বলো!",
    "হুমমম... তারপর কি হলো?",
    "কথা শুনে বেশ ভালো লাগলো! 🥰",
    "হ্যাঁ বলো, আমি তো অলওয়েজ লাইনে আছি!",
    "হুমম বুঝলাম! আর কি খবর বলো?"
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

module.exports = {
  config: {
    name: "baby",
    aliases: ["xan", "bby", "bbz", "lamiya", "lamia", "bot"],
    version: "7.0",
    author: "rX (fixed by AI)",
    countDown: 0,
    role: 0,
    shortDescription: "Instant Local Smart Baby AI",
    longDescription: "Instant offline reply without API timeout",
    category: "box chat",
    guide: {
      en: "{p}baby [message]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ").trim();
    const threadID = event.threadID;

    try {
      if (!query) {
        await typing(api, threadID, 800);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)]);
      }

      await typing(api, threadID, 800);
      return message.reply(getLocalResponse(query));

    } catch (err) {
      console.error("Baby command error:", err.message);
    }
  },

  onReply: async function ({ api, event, message }) {
    const text = event.body?.trim();
    if (!text) return;

    try {
      await typing(api, event.threadID, 800);
      await message.reply(getLocalResponse(text));
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message }) {
    const raw = event.body ? event.body.trim() : "";
    if (!raw) return;

    if (event.senderID === api.getCurrentUserID()) return;
    if (raw.startsWith("+") || raw.startsWith("!") || raw.startsWith("/")) return;

    const senderID = event.senderID;
    const threadID = event.threadID;
    const ownerID = "100021922069388"; // Myoun UID

    try {
      const triggers = ["baby", "bby", "xan", "bbz", "bot", "lamiya", "lamia", "লামিয়া"];
      
      if (triggers.includes(raw.toLowerCase())) {
        await typing(api, threadID, 800);

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

      await typing(api, threadID, 800);
      return message.reply(getLocalResponse(raw));

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
