const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// কনফিগারেশন ফাইল পাথ (On/Off ডাটা সেভ রাখার জন্য)
const configPath = path.join(__dirname, "cache", "autotimer_config.json");

function getStatusMap() {
  try {
    if (fs.existsSync(configPath)) {
      return fs.readJsonSync(configPath);
    }
  } catch (err) {
    console.error("[AUTOTIMER] Config read error:", err);
  }
  return {};
}

function saveStatusMap(map) {
  try {
    fs.outputJsonSync(configPath, map, { spaces: 2 });
  } catch (err) {
    console.error("[AUTOTIMER] Config save error:", err);
  }
}

module.exports.config = {
  name: "autotimer",
  version: "6.5",
  role: 0, 
  author: "Akash Chowdhury",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে (On/Offシステムসহ)",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
  // 🔒 Author lock check
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author name has been changed. The file will not run.");
    return process.exit(1);
  }

  const timerData = {
    "12:00 AM": { text: "🌙 কিরে! এখন ১২টা বাজে! 😴\nতোর বউ নাই ভাই... এবার ঘুমা! 😂", video: "https://files.catbox.moe/8btwbx.mp4" },
    "01:00 AM": { text: "👀 এখনও অনলাইনে নাকি?\nক্রাশ রিপ্লাই দিবে না ভাই, এবার ঘুমা! 🤣", video: "https://files.catbox.moe/9iq1ki.mp4" },
    "02:00 AM": { text: "🌌 রাত ২টা বাজে!\nএত রাতে জেগে থাকলে ভূতও বলবে—'ভাই আগে আপনি ঘুমান!' 👻😂", video: "https://files.catbox.moe/g9zf5c.mp4" },
    "03:00 AM": { text: "🤲 তাহাজ্জুদের সময়।\n🕌 সুযোগ থাকলে দুই রাকাত নফল নামাজ আদায় করুন এবং বেশি বেশি ইস্তিগফার করুন।", video: "https://files.catbox.moe/siojtf.mp4" },
    "04:00 AM": { text: "🌅 ফজরের সময় প্রায় হয়ে এসেছে।\n💧 অজু করে নামাজের প্রস্তুতি নিন।", video: "https://files.catbox.moe/siojtf.mp4" },
    "05:00 AM": { text: "🕌 ফজরের আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।\n✨ আল্লাহ আপনার দিনটি বরকতময় করুন।", video: "https://files.catbox.moe/5v4nxi.mp4" },
    "06:00 AM": { text: "☀️ শুভ সকাল!\nযারা এখনও ঘুমাচ্ছে, তাদের জন্য ১০টা অ্যালার্মও কম! 😂", video: "https://files.catbox.moe/q9rf0f.mp4" },
    "07:00 AM": { text: "🍳 নাস্তা কর ভাই!\nখালি প্রেম করলে পেট ভরবে না! 🤭", video: "https://files.catbox.moe/ztnm6a.mp4" },
    "08:00 AM": { text: "💼 কাজে যা!\nবেতন কিন্তু 'Seen' দিয়ে আসে না! 😂💸", video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 AM": { text: "☕ এক কাপ চা খা!\nচা না খেলে মুখের সফটওয়্যার আপডেট হয় না! 🤣", video: "https://files.catbox.moe/2mi5oo.mp4" },
    "10:00 AM": { text: "💧 একটু পানি খা!\nশুধু চা খেয়ে মানুষ বাঁচে না ভাই! 😂", video: "https://files.catbox.moe/q2vg9i.mp4" },
    "11:00 AM": { text: "🕌 যোহরের সময় ঘনিয়ে এসেছে।\n🤲 সবাই নামাজের প্রস্তুতি নিন।", video: "https://files.catbox.moe/zzm2xo.mp4" },
    "12:00 PM": { text: "🕌 যোহরের আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।\n🌸 আল্লাহ আমাদের আমল কবুল করুন।", video: "https://files.catbox.moe/g8d1av.mp4" },
    "01:00 PM": { text: "🍛 ভাত খেয়ে বলবি '৫ মিনিট ঘুমাই'...\nতারপর উঠবি বিকেল ৫টায়! 🤣", video: "https://files.catbox.moe/ypt7au.mp4" },
    "02:00 PM": { text: "এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো?🍛🌤️", video: "https://files.catbox.moe/nstu8b.mp4" },
    "03:00 PM": { text: "এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো,🧑🔧☀️", video: "https://files.catbox.moe/xmrujv.mp4" },
    "04:00 PM": { text: "এখন বিকাল ৪টা বাজে❥︎আসরের নামাজ পড়ে নাও,🙇🥀", video: "https://files.catbox.moe/jndni6.mp4" },
    "05:00 PM": { text: "এখন বিকাল ৫টা বাজে❥︎একতু বিশ্রাম নাও,🙂↕️🌆", video: "https://files.catbox.moe/dv3qv4.mp4" },
    "06:00 PM": { text: "এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও,😍🌇", video: "https://files.catbox.moe/au2yk5.mp4" },
    "07:00 PM": { text: "এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো,❤️🌃", video: "https://files.catbox.moe/4v4uyv.mp4" },
    "08:00 PM": { text: "এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো,🧖🙂↕️", video: "https://files.catbox.moe/ltspa4.mp4" },
    "09:00 PM": { text: "এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও,😴🌙", video: "https://files.catbox.moe/sxs5io.mp4" },
    "10:00 PM": { text: "এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে,😴🙂↕️", video: "https://files.catbox.moe/0e4s7h.mp4" },
    "11:00 PM": { text: "এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো,🥰🌌", video: "https://files.catbox.moe/ndbhtu.mp4" }
  };

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.ensureDirSync(cacheDir);
  }

  if (!global.__sentMap) global.__sentMap = {};

  const checkTimeAndSend = async () => {
    try {
      const timeZone = "Asia/Dhaka";
      const now = moment().tz(timeZone).format("hh:mm A");
      if (!timerData[now]) return;

      const currentMinute = moment().tz(timeZone).format("HH:mm");
      if (global.__sentMap[currentMinute]) return;

      const statusMap = getStatusMap();
      
      let allThreads = [];
      try {
        allThreads = await api.getThreadList(100, null, ["INBOX"]);
      } catch (err) {
        console.error("[AUTOTIMER] Error getting thread list:", err.message);
        return;
      }
      
      if (!allThreads || allThreads.length === 0) return;

      const groupThreads = allThreads.filter(thread => thread.isGroup);
      if (groupThreads.length === 0) return;

      const currentHourData = timerData[now];
      const currentDate = moment().tz(timeZone).format("DD-MM-YYYY");
      const currentShortTime = moment().tz(timeZone).format("hh:mm A");

      const formattedMessage = 
        `◢◤━━━━━━━━━━━━━━━━◥◣\n` +
        `🕒>ᴛɪᴍᴇ: ${currentShortTime}\n` +
        `⌚┆${currentHourData.text}\n` +
        `◥◣━━━━━━━━━━━━━━━━◢◤\n` +
        `📅>...ᴅᴀᴛᴇ: ${currentDate}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁:- ᴀᴋᴀsʜ-ᴄʜᴏᴡᴅʜᴜʀʏ\n` +
        `━━━━━━━━━━━━━━━━━━━━`;

      let attachmentPath = null;
      if (currentHourData.video) {
        try {
          const ext = path.extname(currentHourData.video.split('?')[0]) || '.mp4';
          attachmentPath = path.join(cacheDir, `timer_media_${currentMinute.replace(':', '_')}${ext}`);
          
          const response = await axios({
            method: 'get',
            url: currentHourData.video,
            responseType: 'stream'
          });
          
          const writer = fs.createWriteStream(attachmentPath);
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
        } catch (downloadErr) {
          console.error(`[AUTOTIMER] Failed to download media for ${now}:`, downloadErr.message);
          attachmentPath = null; 
        }
      }

      global.__sentMap[currentMinute] = true;

      for (const thread of groupThreads) {
        const threadID = thread.threadID;
        const key = threadID.toString();
        if (statusMap[key] === false) continue; // ডিফল্ট অন বা ট্রু থাকলে মেসেজ যাবে

        const msgPayload = { body: formattedMessage };
        if (attachmentPath && fs.existsSync(attachmentPath)) {
          msgPayload.attachment = fs.createReadStream(attachmentPath);
        }

        api.sendMessage(msgPayload, threadID, (err) => {
          if (err) console.error(`[AUTOTIMER] Error sending to ${threadID}:`, err.message);
        });
      }

      setTimeout(() => {
        if (attachmentPath && fs.existsSync(attachmentPath)) {
          fs.unlink(attachmentPath, (err) => {
            if (err) console.error("[AUTOTIMER] Cache delete error:", err.message);
          });
        }
      }, 10000);

    } catch (mainErr) {
      console.error("[AUTOTIMER] Loop main error:", mainErr.message);
    }
  };

  // প্রতি ১ মিনিটে (৬০ সেকেন্ড) চেক করবে সঠিক ঘণ্টা পড়েছে কি না
  setInterval(checkTimeAndSend, 60 * 1000);
};

// বটের হ্যান্ডলারের জন্য onStart এক্সপোর্ট (যা দিয়ে কমান্ড অন/অফ কাজ করবে)
module.exports.onStart = async function({ api, event, args }) {
  const threadID = event.threadID;
  const statusMap = getStatusMap();
  const key = threadID.toString();

  if (args[0] === "on") {
    statusMap[key] = true;
    saveStatusMap(statusMap);
    return api.sendMessage("⏰ [AUTOTIMER] Auto Time message is now turned ON for this group chat. The bot will send automated hourly updates!", threadID, event.messageID);
  }

  if (args[0] === "off") {
    statusMap[key] = false;
    saveStatusMap(statusMap);
    return api.sendMessage("⏰ [AUTOTIMER] Auto Time message is now turned OFF.", threadID, event.messageID);
  }

  return api.sendMessage("Use: autotimer on / autotimer off", threadID, event.messageID);
};
