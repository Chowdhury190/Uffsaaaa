const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "5.1",
  role: 0,
  author: "Akash Chowdhury",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে (Ultra Optimized)",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  // 🔒 author lock check
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author নাম পরিবর্তন করা হয়েছে। ফাইল চলবে না।");
    return process.exit(1);
  }

  const timerData = {
    "12:00 AM": { text: "⌚┆এখন রাত ১২টা বাজে❥︎খাউয়া দাউয়া করে নেউ,🍽️🍛",         video: "https://files.catbox.moe/8btwbx.mp4" },
    "01:00 AM": { text: "⌚┆এখন রাত ১টা বাজে❥︎সবাই শুয়ে পড়ো,🌌💤",               video: "https://files.catbox.moe/9iq1ki.mp4" },
    "02:00 AM": { text: "⌚┆এখন রাত ২টা বাজে❥︎প্রেম না কইরা যাইয়া ঘুমা বেক্কল,😾🌠",    video: "https://files.catbox.moe/g9zf5c.mp4" },
    "03:00 AM": { text: "⌚┆এখন রাত ৩টা বাজে❥︎যারা ছ্যাকা খাইছে তারা জেগে আছে,🫠🌃", video: "https://files.catbox.moe/siojtf.mp4" },
    "04:00 AM": { text: "⌚┆এখন রাত ৪টা বাজে❥︎ফজরের প্রস্তুতি নাও,🌄",               video: "https://files.catbox.moe/siojtf.mp4" },
    "05:00 AM": { text: "⌚┆এখন সকাল ৫টা বাজে❥︎নামাজ পড়ছো তো?🌅☀️",             video: "https://files.catbox.moe/5v4nxi.mp4" },
    "06:00 AM": { text: "⌚┆এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই,🌞☕",           video: "https://files.catbox.moe/q9rf0f.mp4" },
    "07:00 AM": { text: "⌚┆এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও,🍞",               video: "https://files.catbox.moe/ztnm6a.mp4" },
    "08:00 AM": { text: "⌚┆এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে,🌤️✨",         video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 AM": { text: "⌚┆এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই!🕘",                 video: "https://files.catbox.moe/2mi5oo.mp4" },
    "10:00 AM": { text: "⌚┆এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি,🌞☀️",             video: "https://files.catbox.moe/q2vg9i.mp4" },
    "11:00 AM": { text: "⌚┆এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও!😌",                 video: "https://files.catbox.moe/zzm2xo.mp4" },
    "12:00 PM": { text: "⌚┆এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে,❤️",            video: "https://files.catbox.moe/g8d1av.mp4" },
    "01:00 PM": { text: "⌚┆এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও,🙇🤲",           video: "https://files.catbox.moe/ypt7au.mp4" },
    "02:00 PM": { text: "⌚┆এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো?🍛🌤️",           video: "https://files.catbox.moe/nstu8b.mp4" },
    "03:00 PM": { text: "⌚┆এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো,🧑🔧☀️",               video: "https://files.catbox.moe/xmrujv.mp4" },
    "04:00 PM": { text: "⌚┆এখন বিকাল ৪টা বাজe❥︎আসরের নামাজ পড়ে নাও,🙇🥀",           video: "https://files.catbox.moe/jndni6.mp4" },
    "05:00 PM": { text: "⌚┆এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও,🙂↕️🌆",                  video: "https://files.catbox.moe/dv3qv4.mp4" },
    "06:00 PM": { text: "⌚┆এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও,😍🌇",                video: "https://files.catbox.moe/au2yk5.mp4" },
    "07:00 PM": { text: "⌚┆এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো,❤️🌃",                  video: "https://files.catbox.moe/4v4uyv.mp4" },
    "08:00 PM": { text: "⌚┆এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো,🧖🙂↕️",              video: "https://files.catbox.moe/ltspa4.mp4" },
    "09:00 PM": { text: "⌚┆এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও,😴🌙",                    video: "https://files.catbox.moe/sxs5io.mp4" },
    "10:00 PM": { text: "⌚┆এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে,😴🙂↕️",           video: "https://files.catbox.moe/0e4s7h.mp4" },
    "11:00 PM": { text: "⌚┆এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো,🥰🌌",                    video: "https://files.catbox.moe/ndbhtu.mp4" }
  };

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // 🔥 FIX: per group + per time tracking
  if (!global.__sentMap) global.__sentMap = {};

  let isChecking = false;

  const checkTimeAndSend = async () => {
    if (isChecking) return;
    isChecking = true;

    try {
      const now = moment().tz("Asia/Dhaka").format("hh:mm A");

      // If the current time isn't in our active schedule list, skip
      if (!timerData[now]) {
        isChecking = false;
        return;
      }

      const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
      const { text, video } = timerData[now];

      // Cleanup previous dates' tracking data from memory
      for (const key of Object.keys(global.__sentMap)) {
        if (key !== todayDate) {
          delete global.__sentMap[key];
        }
      }

      // Initialize structures if they don't exist
      if (!global.__sentMap[todayDate]) {
        global.__sentMap[todayDate] = {};
      }
      if (!global.__sentMap[todayDate][now]) {
        global.__sentMap[todayDate][now] = [];
      }

      // Remaining code logic continues here...
    } catch (error) {
      console.error(error);
    } finally {
      isChecking = false;
    }
  };

  // Set interval to check every second or minute depending on your implementation
  setInterval(checkTimeAndSend, 30000); 
};
