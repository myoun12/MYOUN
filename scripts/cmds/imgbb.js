Const axios = require("axios");

module.exports = {
  config: {
    name: "imgbb",
    version: "2.0.1",
    author: "MYOUN SORKAR",
    category: "tools",
    shortDescription: "Upload replied image to ImgBB and get link",
    longDescription: "Reply to an image with this command to upload it to ImgBB and receive a direct link.",
    guide: {
      en: "{pn}imgbb (reply to an image)"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const attachments = event.messageReply?.attachments;

      if (!attachments || attachments.length === 0) {
        return api.sendMessage("❌ Please reply to an image.", event.threadID, event.messageID);
      }

      if (attachments[0].type !== "photo") {
        return api.sendMessage("❌ Only photo attachments are supported.", event.threadID, event.messageID);
      }

      const imageUrl = attachments[0].url;
      const apiKey = "6d207e02198a847aa98d0a2a901485a5";

      const res = await axios.get(`https://api.imgbb.com/1/upload?key=${apiKey}&image=${encodeURIComponent(imageUrl)}`);

      if (res.data && res.data.data && res.data.data.url) {
        return api.sendMessage(res.data.data.url, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ Upload failed. Please try again.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("ImgBB Error:", error.message);
      return api.sendMessage("❌ Something went wrong. Please try again.", event.threadID, event.messageID);
    }
  }
};
