const axios = require("axios");

// Typing Effect Function
async function typing(api, threadID, delay = 1000) {
  try {
    api.sendTypingIndicator(threadID, true);
    await new Promise(resolve => setTimeout(resolve, delay));
  } catch {}
}

// ওয়ার্কিং AI রিপ্লাই ফাংশন
async function fetchAIReply(text) {
  try {
    // ব্যাকআপ সহ ওয়ার্কিং API
    const res = await axios.get(`https://simsimi.site/api/simtalk?text=${encodeURIComponent(text)}&lc=bn`, { timeout: 8000 });
    if (res.data && res.data.message) {
      return res.data.message;
    }
  } catch {
    try {
      const res2 = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=bn`, { timeout: 8000 });
      if (res2.data && res2.data.success) return res2.data.success;
    } catch {}
  }
  return "হুম বলো জান, শুনছি!";
}

module.exports = {
  config: {
    name: "baby",
    aliases: ["bby", "lamiya", "lamia", "bot", "xan", "bbz"],
    version: "8.0",
    author: "MYOUN SORKAR",
    countDown: 1,
    role: 0,
    shortDescription: "Chat with Baby / Lamiya",
    longDescription: "AI Chat bot for group and personal replies",
    category: "chat",
    guide: {
      en: "{pn} [text] or type bby / lamiya / bot"
    }
  },

  onStart: async function ({ api, event, message, args }) {
    if (!args[0]) return;

    const ask = args.join(" ");
    try {
      await typing(api, event.threadID, 1000);
      const replyText = await fetchAIReply(ask);
      
      return message.reply(replyText, (err, info) => {
        if (!err && global.GoatBot?.onReply) {
          global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        }
      });
    } catch {
      return message.reply("হুম বলো, শুনছি!");
    }
  },

  onReply: async function ({ api, event, message }) {
    const text = event.body?.trim();
    if (!text) return;

    try {
      await typing(api, event.threadID, 1000);
      const replyText = await fetchAIReply(text);

      return message.reply(replyText, (err, info) => {
        if (!err && global.GoatBot?.onReply) {
          global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        }
      });
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderID = event.senderID;
    const threadID = event.threadID;

    // আপনার আসল ফেসবুক UID (Myoun)
    const ownerID = "100021922069388";

    try {
      const triggers = ["baby", "bby", "xan", "bbz", "bot", "lamiya", "lamia", "লামিয়া"];
      
      if (triggers.includes(raw)) {
        await typing(api, threadID, 1000);

        // ১. আপনি (অনার) ডাকলে ২৯টি স্পেশাল রিপ্লাই
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
          const ownerReply = ownerResponses[Math.floor(Math.random() * ownerResponses.length)];
          return message.reply(ownerReply, (err, info) => {
            if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        // ২. অন্য কেউ ডাকলে ৩৮টি সাধারণ রিপ্লাই
        const funny = [
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
          "☕ চা নাকি কফি? কোনটা চলবে?",
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

      // প্রিফিক্স চ্যাটিং (+baby কেমন আছো / bby কেমন আছো)
      const prefixes = ["baby ", "bby ", "xan ", "bbz ", "bot ", "lamiya ", "lamia "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix, "").trim();
        if (!q) return;

        await typing(api, threadID, 1000);
        const replyText = await fetchAIReply(q);

        return message.reply(replyText, (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
