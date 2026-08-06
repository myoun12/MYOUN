const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    aliases: ["bby", "lamiya", "lamia", "bot"],
    version: "3.0",
    author: "MYOUN SORKAR",
    countDown: 1,
    role: 0,
    shortDescription: "Chat with Baby / Lamiya",
    longDescription: "AI Chat bot for group and personal replies",
    category: "chat",
    guide: {
      en: "{pn} or {pn} [text]"
    }
  },

  onStart: async function ({ api, event, message, args }) {
    const senderID = event.senderID;
    const ownerID = "100021922069388";

    if (!args[0]) {
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
        return message.reply(ownerResponses[Math.floor(Math.random() * ownerResponses.length)]);
      } else {
        const funny = [
          "🌹 বেবি, তোমার নোটিফিকেশন দেখলেই অনলাইনে চলে আসি!",
          "🥺 এত মিস করলে আগেই তো ডাকতে পারতে!",
          "🤭 কী হলো? আমার কথা মনে পড়ছে নাকি?",
          "💖 বলো জান... আমি শুনছি।",
          "😌 তুমি ডাকলে 'না' বলার কোনো অপশন নেই।",
          "😜 আমার ব্যাটারি ১০০%, বলো কী লাগবে!",
          "🍫 চকলেট দিলে VIP রিপ্লাই পাবা!",
          "🤖 Error 404: বেবিকে ইগনোর করা সম্ভব না!",
          "🫣 আমার RAM-এ শুধু তোমার মেসেজই ঘোরে!",
          "😎 আমি আজকে একদম প্রিমিয়াম মুডে আছি!"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)]);
      }
    }

    const ask = args.join(" ");
    try {
      const res = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(ask)}&lc=bn`);
      return message.reply(res.data?.success || "হুম বলো, শুনছি!");
    } catch {
      return message.reply("হুম বলো, শুনছি!");
    }
  }
};
