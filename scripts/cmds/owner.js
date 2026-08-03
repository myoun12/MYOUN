const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.2",
    author: "MYOUN SORKAR",
    role: 0,
    shortDescription: "Owner information",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = `
━━━[ OWNER DETAILS ]━━━

👤 Name : MYOUN SORKAR
👤 Gender : Male
❤️ Relation : Single
🔥 Age : 19+
🕌 Religion : Islam
🎓 Education : 2nd Semester (CSE)
💼 Job : Taka Mara
👑 Role : Group Owner
🏠 Address : Tangail, Bangladesh
    `;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const imgLink = "https://i.ibb.co/ycjGsQjd/e01f26ed0849.jpg";

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
            api.sendMessage(ownerText, event.threadID, event.messageID);
          }
        })
        .on("error", () => {
          api.sendMessage(ownerText, event.threadID, event.messageID);
        });
    } catch (err) {
      api.sendMessage(ownerText, event.threadID, event.messageID);
    }
  }
};
