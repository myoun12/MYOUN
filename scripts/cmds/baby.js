const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

const typing = async (api, threadID, ms = 3000) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz"],
    version: "3.7",
    author: "rX (fixed)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + typing",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      // no text => random reply
      if (!query) {
        await typing(api, threadID, 2000);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // AUTOTEACH TOGGLE
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on","off"].includes(mode)) return message.reply("Use: baby autoteach on/off");

        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 10000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      // LIST
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 10000 });
        return message.reply(
`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}
╰─╼👤 𝐃𝐞𝐯: rX 𝐀𝐛𝐝𝐮𝐥𝐥𝐚𝐡`
        );
      }

      // MSG
      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");

        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 10000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");

        const formatted = res.data.replies.map((rep, i) => `➤ ${i+1}. ${rep}`).join("\n");
        return message.reply(
`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
━━━━━━━━━━━━━━
${formatted}`
        );
      }

      // TEACH
      if (args[0] === "teach") {
        const parts = query.replace(/^teach\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      // EDIT
      if (args[0] === "edit") {
        const parts = query.replace(/^edit\s+/i, "").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      // REMOVE / RM
      if (["remove","rm"].includes(args[0])) {
        const parts = query.replace(/^(remove|rm)\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

      // Normal chat
      await typing(api, threadID, 2000);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      let responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response || "Hmm baby 😚"];
      for (const r of responses) {
        await new Promise(resolve => {
          message.reply(r, (err, info) => {
            if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("Baby command error:", err.message);
      message.reply("❌ Error: " + (err.message.includes("404") ? "Feature not available (backend issue)" : err.message));
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, event.threadID, 2000);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const r of replies) {
        await message.reply(r, (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;

    try {
      // triggers only
      const triggers = ["baby","bby","xan","bbz","mari","মারিয়া","bot"];
      if (triggers.includes(raw)) {
        await typing(api, threadID, 2000);
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
          "🤗 এসো, আজকে আজকে অনেক গল্প হবে!",
          "🎵 তোমার ভাইবটা পুরো সুরের মতো!",
          "🌸 একটু হাসো তো... হাসলে তোমাকে বেশি মানায়।",
          "💙 মন খারাপ? আমি আছি তো!",
          "🌧️ বৃষ্টির মতো কিছু স্মৃতি কখনো শেষ হয় না।",
          "💔 কিছু মানুষ ফিরে আসে না, স্মৃতি হয়ে থেকে যায়।",
          "✨ নিজেকে কখনো ছোট মনে করবে না।",
          "🌈 খারাপ সময়ের পর ভালো সময় আসবেই।",
          "🫶 তোমার একটা মেসেজেই দিনটা সুন্দর হয়ে গেল।",
          "😴 ঘুম থেকে তুলে আবার চলে যাবে না তো?",
          "🍕 খাওয়া-দাওয়া করেছ তো?",
          "☕ চা নাকি কফি? আজকে কোনটা চলবে?",
          "🎉 আজকে তোমার মুড বেশ ফ্রেশ মনে হচ্ছে!",
          "😂 এত ডাকাডাকি করলে কিন্তু এবার স্যালারি বাড়াতে হবে!",
          "🤣 ফ্রিতে এত সার্ভিস আর কোথাও পাবা না!",
          "👑 বস মুড অ্যাক্টিভেটেড!",
          "🚀 মিশন স্টার্ট... বেবির কমান্ড রিসিভড!",
          "⚡ আমি রেডি, তুমি বলো!",
          "💫 তোমার জন্য অলওয়েজ অনলাইন।",
          "😇 সব সময় হাসি-খুশি থেকো।",
          "📩 আমার ইনবক্সে তোমার মেসেজ অলওয়েজ ওয়েলকাম!",
          "🎀 বলো বেবি, আজকে কী অ্যাডভেঞ্চার করব?",
          "🫡 অর্ডার করুন, কাজ শুরু হচ্ছে!",
          "😁 তোমার সাথে আড্ডা দিতে আমারও বেশ ভালো লাগে!",
          "❤️ তুমি ডাকলেই রিপ্লাই আসবেই।",
          "🌹 আমার রিপ্লাই পেতে হলে শুধু 'bby' বলো।"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)], (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // prefixes
      const prefixes = ["baby ","bby ","xan ","bbz ","mari ","মারিয়া ","bot "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix,"").trim();
        if (!q) return;

        await typing(api, threadID, 2000);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

        const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
        for (const r of replies) {
          await message.reply(r, (err, info) => {
            if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }
        return;
      }

      // AUTO-TEACH from reply
      if (event.messageReply) {
        try {
          const setting = await axios.get(`${simsim}/setting`, { timeout: 8000 });
          if (setting.data?.autoTeach) {
            const ask = event.messageReply.body?.toLowerCase().trim();
            const ans = raw.trim();
            if (ask && ans && ask !== ans) {
              setTimeout(async () => {
                try {
                  await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 10000 });
                } catch {}
              }, 500);
            }
          }
        } catch {}
      }

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
