const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0",
    author: "MYOUN SORKAR",
    countDown: 3,
    role: 0,
    hasPrefix: false,
    description: "Ask anything to Gemini AI",
    category: "ai",
    guide: "{pn} <আপনার প্রশ্ন>"
  },

  onStart: async function ({ args, message }) {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("⚠ অনুগ্রহ করে AI-কে করার জন্য একটি প্রশ্ন লিখুন।\n\nউদাহরণ: ai বাংলাদেশের রাজধানী কী?");
    }

    message.reply("🔍 চিন্তা করছি, একটু অপেক্ষা করুন...");

    try {
      const res = await axios.get(`https://api.kenliejugarap.com/gemini/?question=${encodeURIComponent(prompt)}`);
      const responseText = res.data.response;

      if (responseText) {
        return message.reply(responseText);
      } else {
        return message.reply("✖ AI থেকে কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      return message.reply("✖ AI সার্ভারে সংযোগ করতে সমস্যা হচ্ছে। কিছুক্ষণ পর চেষ্টা করুন।");
    }
  }
};
