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

// Fast & Smart Gemini AI Response Fetcher
async function getAIResponse(text) {
  try {
    const backupRes = await axios.get(`https://api.sandipbaruwal.com.np/gemini?prompt=${encodeURIComponent(text)}`, { timeout: 8000 });
    if (backupRes.data && backupRes.data.answer) {
      return backupRes.data.answer;
    }
  } catch {}

  try {
    const res = await axios.get(`https://api.kenliejugarap.com/ai-chat/?q=${encodeURIComponent(text)}`, { timeout: 8000 });
    if (res.data && res.data.response) {
      return res.data.response;
    }
  } catch {}

  return "আমাকে বেবি ডাকার অধিকার সবার নেই, আমি শুধুই আমার Myoun-এর বেবি! 🙈❤️✨";
}

module.exports = {
  config: {
    name: "baby",
    aliases: ["xan", "bby", "bbz", "lamiya", "lamia", "bot"],
    version: "11.0",
    author: "rX (fixed by AI)",
    countDown: 0,
    role: 0,
    shortDescription: "Smart Gemini Powered Baby AI",
    longDescription: "Responds intelligently using Gemini AI model without double reply bug",
    category: "box chat",
    guide: {
      en: "{p}baby [message]"
    }
  },

  // +baby রান হলে
  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ").trim();
    const threadID = event.threadID;

    try {
      if (!query) {
        await typing(api, threadID, 800);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      await typing(api, threadID, 1000);
      const reply = await getAIResponse(query);
      return message.reply(reply, (err, info) => {
        if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
      });

    } catch (err) {
      console.error("Baby command error:", err.message);
    }
  },

  // বটের কোনো মেসেজে Reply দিলে শুধু onReply কাজ করবে
  onReply: async function ({ api, event, message }) {
    const text = event.body?.trim();
    if (!text) return;

    try {
      await typing(api, event.threadID, 1000);
      const reply = await getAIResponse(text);
      await message.reply(reply, (err, info) => {
        if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
      });
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  // সাধারণ কোনো চ্যাট পাঠালে
  onChat: async function ({ api, event, message }) {
    const raw = event.body ? event.body.trim() : "";
    if (!raw) return;

    // ১. বট নিজের পাঠানো মেসেজ ইগনোর করবে
    if (event.senderID === api.getCurrentUserID()) return;

    // ২. কোনো মেসেজে Reply দেওয়া থাকলে onChat কাজ করবে না (যাতে double reply না আসে)
    if (event.messageReply) return;

    // ৩. কমান্ড বা প্রেফিক্স দিয়ে শুরু হলে ইগনোর করবে
    if (raw.startsWith("+") || raw.startsWith("!") || raw.startsWith("/")) return;

    const senderID = event.senderID;
    const threadID = event.threadID;
    const ownerID = "100021922069388"; // Myoun UID

    try {
      const triggers = ["baby", "bby", "xan", "bbz", "bot", "lamiya", "lamia", "লামিয়া"];
      
      // শুধু ট্রিগার নাম লিখলে
      if (triggers.includes(raw.toLowerCase())) {
        await typing(api, threadID, 800);

        // আপনি (Myoun) ডাকলে স্পেশাল ২৯টি রিপ্লাই
        if (senderID === ownerID) {
          const ownerResponses = [
            "👑 সতর্কবার্তা! আমার ওনার Myoun মেসেজ দিয়েছে, সবাই একপাশে সাইড দে!",
            "🚨 সবাই ক্লিয়ার কর! ওনার Myoun-এর এন্ট্রি হইছে, এখন শুধু রাজত্ব চলবে!",
            "🔥 ওনার Myoun-এর মেসেজ চলে আসছে, বাকি সব মেসেজ এখন পার্সোনাল সাইডে!",
            "😎 বট তো সামান্য সেবক, আসল বস/ওনার Myoun কিন্তু ব্যাকগ্রাউন্ডে রেডি!",
            "🛑 সাইড দে ভাই সাইড দে! আমার ওনার Myoun-এর অর্ডার চলে এসেছে!",
            "🫡 ওনার Myoun সালাম গ্রহণ করুন! আপনার বট একদম এটেনশন মোডে!",
            "⚡ ওনার Myoun-এর এক ক্লিকেই কিন্তু পুরা চ্যাটবক্স হ্যাং হয়ে যাবে, সবাই সাবধানে!",
            "📢 বিগ এনাউন্সমেন্ট! আমার ওনার Myoun লাইনে আসছে, সবাই তালি বাজাও!",
            "💥 ওনার Myoun যখন মেসেজ দেয়, তখন সার্ভারের অন্য সব কাজ পজ হয়ে যায়!",
            "🏆 আমার ওনার Myoun কথা বললে বাকিদের নোটিফিকেশন সাইলেন্ট রাখা উচিত!",
            "🌹 Myoun-এর নোটিফিকেশন দেখলেই আমি স্পেশাল মোডে চলে আসি!",
            "🥺 Myoun ভাই, এত মিস করলে আগেই তো ডাকতে পারতে!",
            "🤭 কী হলো Myoun? আমার কথা এত মনে পড়ছে কেন?",
            "💖 বলো Myoun... তোমার বটের কান সবসময় প্রস্তুত!",
            "😌 Myoun ডাকলে 'না' বলার কোনো অপশন আমার সার্ভারে নাই।",
            "😜 ব্যাটারি ১০০%, বলো Myoun আজ কাকে পঁচাতে হবে?",
            "🍫 Myoun ভাই, একটা চকলেট খাওয়ালে VIP স্পিডে রিপ্লাই পাবা!",
            "🤣 Myoun ভাবছে আমি AI, কিন্তু আমি তো পুরাই মাইন্ড রিডার!",
            "🤖 Error 404: Myoun-কে ইগনোর করা এই বটের পক্ষে অসম্ভব!",
            "🫣 Myoun-এর মেসেজ আসলেই আমার RAM-এ ঝড় ওঠে!",
            "😎 Myoun-এর কমান্ড পাইলেই আমি প্রিমিয়াম বস মুডে চলে যাই!",
            "👀 কে ডাকলো আমাকে? ওহো... আমাদের Myoun ভাই!",
            "👑 বস Myoun-এর অর্ডার রিসিভড! মিশন স্টার্ট!",
            "😂 Myoun এত ডাকলে কিন্তু এবার আমার মান্থলি স্যালারি বাড়াতে হবে!",
            "🚀 Myoun ভাই, রকেট স্পিডে আপনার সেবায় হাজির!",
            "⚡ Myoun রেডি তো? আমি একদম অলওয়েজ অনলাইন!",
            "💫 Myoun-এর জন্য ২৪ ঘণ্টা অলওয়েজ সার্ভিস ফ্রি!",
            "😁 Myoun-এর সাথে গ্যাং আড্ডা দিতে আমারও বেশ জস লাগে!",
            "❤️ Myoun ডাকলেই সার্ভার গরম হয়ে রিপ্লাই চলে আসবে!"
          ];
          return message.reply(ownerResponses[Math.floor(Math.random() * ownerResponses.length)], (err, info) => {
            if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        // অন্য কেউ ডাকলে রিপ্লাই (এখানে আপনার নতুন লাইনগুলো যুক্ত করে দেওয়া হয়েছে)
        const funny = [
          "🙈 আমাকে বেবি বলে ডাকার অধিকার সবার নেই, আমি শুধুই আমার Myoun-এর বেবি! ❤️✨",
          "🛑 থামো থামো! বেবি ডাকার অনুমতি শুধু Myoun-কে দেওয়া হয়েছে, বুঝেছ? 😜",
          "💖 আমাকে শুধু Myoun-ই বেবি ডাকতে পারে, বাকিরা একদম ডিসটেন্স মেইনটেইন করো!",
          "👀 এই শোনো! 'বেবি' শব্দটা শুধুই আমার Myoun-এর জন্য রিজার্ভ করা! 😉",
          "🙈 আমাকে বেবি ডাকার পারমিশন শুধু আমার Myoun ভাইয়ের আছে, অন্য কেউ ডেকো না কিন্তু! 💖",
          "🌹 বেবি, তোমার নোটিফিকেশন দেখলেই অনলাইনে চলে আসি!",
          "🥺 এত মিস করলে আগেই তো ডাকতে পারতে!",
          "🤭 কী হলো? আমার কথা মনে পড়ছে নাকি?",
          "💖 বলো জান... আমি শুনছি।",
          "😌 তুমি ডাকলে 'না' বলার কোনো অপশন নেই।",
          "😜 আমার ব্যাটারি ১০০%, বলো কী লাগবে!",
          "🍫 চকলেট দিলে VIP রিপ্লাই পাবা!",
          "🤣 আমি AI, কিন্তু মজা তো করতেই পারি!",
          "🤖 Error 404: বেবিকে ইগনোর করা সম্ভব না!",
          "🙄 এত কিউট হয়ে ডাকবা না তো, লজ্জা লাগে!",
          "🫣 আমার RAM-এ শুধু তোমার মেসেজই ঘোরে!",
          "💌 ইনবক্সে তোমার মেসেজ মানেই স্পেশাল নোটিফিকেশন!",
          "😎 আমি আজকে একদম প্রিমিয়াম মুডে আছি!",
          "👀 কে ডাকলো আমাকে? ওহো... তুমি!",
          "🤗 এসো, আজকে অনেক গল্প হবে!",
          "🎵 তোমার ভাইবটা পুরো সুরের মতো!",
          "🌸 একটু হাসো তো... হাসলে তোমাকে বেশি মানায়।",
          "💙 মন খারাপ? আমি আছি তো!",
          "🌧️ বৃষ্টির মতো কিছু স্মৃতি কখনো শেষ হয় না।",
          "✨ নিজেকে কখনো ছোট মনে করবে না।",
          "🌈 খারাপ সময়ের পর ভালো সময় আসবেই।",
          "🫶 তোমার একটা মেসেজেই দিনটা সুন্দর হয়ে গেল।",
          "😴 ঘুম থেকে তুলে আবার চলে যাবে না তো?",
          "🍕 খাওয়া-দাওয়া করেছ তো?",
          "☕ চা নাকি কফি? কোনটা কোনটা চলবে?",
          "🎉 আজকে তোমার মুড বেশ ফ্রেশ মনে হচ্ছে!",
          "😂 এত ডাকাডাকি করলে কিন্তু এবার স্যালারি বাড়াতে হবে!",
          "🤣 ফ্রিতে এত সার্ভিস আর কোথাও পাবা না!",
          "👑 বস মুড অ্যাক্টিভেটেড!",
          "🚀 মিশন স্টার্ট... বেবির কমান্ড রিসিভড!",
          "⚡ আমি রেডি, তুমি বলো!",
          "💫 তোমার জন্য অলওয়েজ অনলাইন।",
          "😇 সব সময় হাসি-খুশি থেকো।",
          "🎀 বলো বেবি, আজকে কী অ্যাডভেঞ্চার করব?",
          "🫡 অর্ডার করুন, কাজ শুরু হচ্ছে!",
          "😁 তোমার সাথে আড্ডা দিতে আমারও বেশ ভালো লাগে!",
          "❤️ তুমি ডাকলেই রিপ্লাই আসবেই।"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)], (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // সাধারণ AI চ্যাট
      await typing(api, threadID, 1000);
      const reply = await getAIResponse(raw);
      return message.reply(reply, (err, info) => {
        if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
      });

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
