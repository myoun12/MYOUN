const axios = require("axios");

module.exports = {
  config: {
    name: "imgbb",
    version: "2.0.2",
    author: "MYOUN SORKAR",
    category: "tools",
    shortDescription: "Upload replied image to ImgBB and get link",
    longDescription: "Reply to an image with this command to upload it to ImgBB and receive a direct link.",
    guide: {
      en: "{pn}imgbb (reply to an image)"
    }
  },

  onStart: async function ({ api, event }) {
    const attachments = event.messageReply?.attachments;

    if (!attachments || attachments.length === 0) {
      return api.sendMessage("❌ Please reply to an image.", event.threadID, event.messageID);
    }

    if (attachments[0].type !== "photo") {
      return api.sendMessage("❌ Only photo attachments are supported.", event.threadID, event.messageID);
    }

    const imageUrl = attachments[0].url;

    // Try primary upload (Imgbb endpoint)
    try {
      const res = await axios.get(`https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5&image=${encodeURIComponent(imageUrl)}`);
      
      if (res.data?.data?.url) {
        return api.sendMessage(res.data.data.url, event.threadID, event.messageID);
      }
    } catch (err) {
      // If ImgBB fails, automatically fallback to alternative free image hosting
      try {
        const fallbackRes = await axios.get(`https://catbox-api.vercel.app/api/upload?url=${encodeURIComponent(imageUrl)}`);
        if (fallbackRes.data?.url) {
          return api.sendMessage(fallbackRes.data.url, event.threadID, event.messageID);
        }
      } catch (fallbackErr) {
        console.error("Image Upload Error:", fallbackErr.message);
      }
    }

    return api.sendMessage("❌ Upload failed. Please try again later.", event.threadID, event.messageID);
  }
};
