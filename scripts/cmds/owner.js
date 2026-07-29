const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.2",
    author: "MYOUN SORKAR",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤𝐍𝐚𝐦𝐞 : 𝐌𝐘𝐎𝐔𝐍 𝐒𝐎𝐑𝐊𝐀𝐑
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞
│ 🎂 𝐀𝐠𝐞 : 𝟏𝟗+
│ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝟐𝐧𝐝 𝐒𝐞𝐦𝐞𝐬𝐭𝐞𝐫 (𝐂𝐢𝐯𝐢𝐥)
│ 💼 𝐉𝐨𝒃 : 𝐓𝐚𝐧𝐤𝐢 𝐌𝐚𝐫𝐚
│ 👑 𝐑𝐨𝐥𝐞 : 𝐆𝐫𝐨𝐮𝐩 𝐎𝐰𝐧𝐞𝐫
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐓𝐚𝐧𝐠𝐚𝐢𝐥, 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡
└───────────────⭓`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const imgLink = "https://i.ibb.co/qMCVH55f/7ee3acee86eb.jpg";

    const sendTextMessage = () => {
      api.sendMessage(ownerText, event.threadID, event.messageID);
    };

    try {
      request(encodeURI(imgLink))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", () => {
          if (fs.existsSync(imgPath)) {
            api.sendMessage(
              {
                body: ownerText,
                attachment: fs.createReadStream(imgPath)
              },
              event.threadID,
              () => {
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
              },
              event.messageID
            );
          } else {
            sendTextMessage();
          }
        })
        .on("error", () => {
          sendTextMessage();
        });
    } catch (err) {
      sendTextMessage();
    }
  }
};
