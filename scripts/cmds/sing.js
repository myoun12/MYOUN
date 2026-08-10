Cmd install sing.jsconst axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "sing",
    version: "1.8",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    category: "music"
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");

    if (!query)
      return message.reply("🎵 | ব্যবহার:\nsing <গানের নাম>");

    try {
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const baseUrl = await mahmud();
      const apiUrl = `${baseUrl}/api/song/mahmud?query=${encodeURIComponent(query)}`;

      const response = await axios({
        method: "GET",
        url: apiUrl,
        responseType: "stream",
        timeout: 30000
      });

      return message.reply(
        {
          body: `🎵 | Song: ${query}\n✅ Download Complete`,
          attachment: response.data
        },
        () => {
          api.setMessageReaction("🎶", event.messageID, () => {}, true);
        }
      );

    } catch (err) {
      console.error(err);

      api.setMessageReaction("❌", event.messageID, () => {}, true);

      return message.reply(
        "❌ | গান আনা যায়নি। API Server Down অথবা Error দিচ্ছে।"
      );
    }
  }
};
