const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const configPath = path.join(cacheDir, "autotimer_config.json");

if (!fs.existsSync(cacheDir)) {
  fs.ensureDirSync(cacheDir);
}

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
  version: "10.5",
  role: 0,
  author: "Akash Chowdhury",
  description: "⏰ ঢাকা সময় অনুযায়ী কাস্টম ডিজাইন ও ভিডিও সহ অটো মেসেজ পাঠাবে।",
  category: "AutoTime",
  countDown: 3,
  hasPermssion: 0
};

// On/Off কমান্ড
module.exports.onStart = async function({ api, event, args }) {
  const threadID = event.threadID;
  const statusMap = getStatusMap();
  const key = threadID.toString();

  if (args[0] === "on") {
    statusMap[key] = true;
    saveStatusMap(statusMap);
    return api.sendMessage("⏰ [AUTOTIMER] चालू হলো! এখন থেকে প্রতি ঘণ্টার ০৫ মিনিটে মেসেজ যাবে।\n👤 Owner: Akash Chowdhury", threadID);
  }

  if (args[0] === "off") {
    statusMap[key] = false;
    saveStatusMap(statusMap);
    return api.sendMessage("⏰ [AUTOTIMER] বন্ধ করা হলো।", threadID);
  }

  return api.sendMessage("ব্যবহার করতে লিখুন: autotimer on অথবা autotimer off", threadID);
};

// ব্যাকগ্রাউন্ড লুপ
module.exports.onLoad = async function ({ api }) {
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author name has been changed!");
    return process.exit(1);
  }

  console.log("[AUTOTIMER] সফলভাবে লোড হয়েছে এবং ব্যাকগ্রাউন্ডে টাইম চেক করছে...");

  const timeZone = "Asia/Dhaka";
  
  const timerData = {
    "12:00 AM": { text: "রাত ১২টা বাজে! দিন শেষ, রাত শুরু। এখনও চ্যাট করছিস? ঘুমা জলদি! 😂", video: "https://files.catbox.moe/8btwbx.mp4" },
    "01:00 AM": { text: "রাত ১টা! এই সময়ে যারা জেগে থাকে তারা নির্ঘাত প্রেমে পড়েছে নয়তো ছ্যাঁকা খেয়েছে! 🤣", video: "https://files.catbox.moe/9iq1ki.mp4" },
    "02:00 AM": { text: "রাত ২টা! চারপাশ নিঝুম। ভূত দেখার আগে চোখ বন্ধ করে ঘুমিয়ে যা ভাই! 👻", video: "https://files.catbox.moe/g9zf5c.mp4" },
    "03:00 AM": { text: "তাহাজ্জুদের সময় (রাত ৩টা)। আল্লাহর কাছে চাওয়ার শ্রেষ্ঠ সময়। দোয়া করুন। ✨", video: "https://files.catbox.moe/siojtf.mp4" },
    "04:00 AM": { text: "ভোর ৪টা বাজে! সেহরি বা ফজরের প্রস্তুতির সময়। পবিত্র হয়ে নিন। 🌸", video: "https://files.catbox.moe/siojtf.mp4" },
    "05:00 AM": { text: "ফজরের আযান! নামাজের দিকে আসুন, নামাজের মধ্যেই রয়েছে পরম শান্তি। 🕌", video: "https://files.catbox.moe/5v4nxi.mp4" },
    "06:00 AM": { text: "শুভ সকাল! সকাল ৬টা বাজে। অলসতা ছেড়ে সুন্দর একটা দিন সুন্দর করো! 💪", video: "https://files.catbox.moe/q9rf0f.mp4" },
    "07:00 AM": { text: "সকাল ৭টা! ঘুম থেকে উঠে হাত-মুখ ধুয়ে নাস্তা খেয়ে নাও জলদি। ☕", video: "https://files.catbox.moe/ztnm6a.mp4" },
    "08:00 AM": { text: "সকাল ৮টা! স্কুল-কলেজ আর কোচিংয়ে যাওয়ার সময় হয়ে গেছে, ব্যাগ গোছাও! 🎒", video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 AM": { text: "সকাল ৯টা! ক্লাসে স্যার ঢোকার আগে জলদি বেঞ্চে গিয়ে বসো, নাইলে খবর আছে! 📖", video: "https://files.catbox.moe/2mi5oo.mp4" },
    "10:00 AM": { text: "সকাল ১০টা! ক্লাসের ফাঁকে বন্ধুদের সাথে টিফিন ভাগ করে খাওয়ার মজাই আলাদা। 🍎", video: "https://files.catbox.moe/q2vg9i.mp4" },
    "11:00 AM": { text: "সকাল ১১টা! রোদের তাতিয়ে উঠছে। college ফাঁকি দিয়ে মামার দোকানে আড্ডা দিচ্ছো না তো? 🧐", video: "https://files.catbox.moe/zzm2xo.mp4" },
    "12:00 PM": { text: "দুপুর ১২টা! যোহরের আযান হতে চললো। ক্লাসের ক্লান্তি শেষে নামাজের প্রস্তুতি নাও। ❤️", video: "https://files.catbox.moe/g8d1av.mp4" },
    "01:00 PM": { text: "দুপুর ১টা! স্কুল-কলেজ ছুটি বা দুপুরের খাবার খাওয়ার পারфেক্ট সময়। পেট পুজো করো! 🍛", video: "https://files.catbox.moe/ypt7au.mp4" },
    "02:00 PM": { text: "দুপুর ২টা! এই টাইমে ভাত খাওয়ার পর যে ঘুমটা আসে, ওটা অমৃত! 💤", video: "https://files.catbox.moe/nstu8b.mp4" },
    "03:00 PM": { text: "বিকাল ৩টা! অলসতা ঝেড়ে আবার একটু পড়াশোনায় মন দাও অথবা একটু রিল্যাক্স করো। 🔥", video: "https://files.catbox.moe/xmrujv.mp4" },
    "04:00 PM": { text: "আসরের সময় (বিকাল ৪টা)। পবিত্র হয়ে আল্লাহর দরবারে হাজিরা দিন। 🌻", video: "https://files.catbox.moe/jndni6.mp4" },
    "05:00 PM": { text: "বিকাল ৫টা! পড়ন্ত বিকেল। বন্ধুদের সাথে মাঠে গিয়ে একটু ফুটবল বা আড্ডা দেওয়ার সময়। ⚽", video: "https://files.catbox.moe/dv3qv4.mp4" },
    "06:00 PM": { text: "মাগরিবের আযান (সন্ধ্যা ৬টা)। আড্ডা বন্ধ করে জলদি ঘরে ফেরো এবং নামাজ পড়ো। 🕌", video: "https://files.catbox.moe/au2yk5.mp4" },
    "07:00 PM": { text: "সন্ধ্যা ৭টা বাজে! এশার নামাজ পড়ো অথবা পড়তে বসো। অলসতা করো না। ❤️🌃", video: "https://files.catbox.moe/au2yk5.mp4" },
    "08:00 PM": { text: "রাত ৮টা! ফেসবুক স্ক্রল করা বন্ধ করে একটু বই খাতা খুলে বসো তো দেখি! 📚", video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 PM": { text: "রাত ৯টা! রাতের খাবারের সময় হয়ে গেছে। গরম গরম খাবার খেয়ে নাও। 🍲", video: "https://files.catbox.moe/tb5xef.mp4" },
    "10:00 PM": { text: "রাত ১০টা! আড্ডা বা পড়াশোনা শেষ করে এবার একটু নিজের জন্য সময় নাও। 🌟", video: "https://files.catbox.moe/tb5xef.mp4" },
    "11:00 PM": { text: "রাত ১১টা! বিছানায় যাওয়ার আগে সারাদিনের ভুলত্রুটির জন্য আল্লাহর কাছে ক্ষমা চেয়ে নাও। 🌙", video: "https://files.catbox.moe/tb5xef.mp4" }
  };

  let lastSentHour = -1;

  setInterval(async () => {
    const now = moment().tz(timeZone);
    const currentHour = now.hour();
    const currentMinute = now.minute();

    if (currentMinute === 5 && currentHour !== lastSentHour) {
      
      const statusMap = getStatusMap();
      const activeThreads = Object.keys(statusMap).filter(id => statusMap[id] === true);
      
      if (activeThreads.length === 0) return;

      lastSentHour = currentHour;
      const targetTimeStr = now.clone().minute(0).format("hh:00 A");
      const matchedData = timerData[targetTimeStr];

      if (!matchedData) return;

      // মেসেজের নিচে ওনারের নাম যোগ করা হলো
      const finalMessage = `${matchedData.text}\n\n👤 Owner: Akash Chowdhury`;

      for (const threadID of activeThreads) {
        try {
          const videoPath = path.join(cacheDir, `temp_${threadID}_${Date.now()}.mp4`);
          
          const response = await axios({
            method: "get",
            url: matchedData.video,
            responseType: "stream"
          });

          const writer = fs.createWriteStream(videoPath);
          response.data.pipe(writer);

          writer.on("finish", () => {
            api.sendMessage({
              body: finalMessage,
              attachment: fs.createReadStream(videoPath)
            }, threadID, (err) => {
              if (err) console.error(`[AUTOTIMER] Send error to ${threadID}:`, err);
              if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath); 
            });
          });

          writer.on("error", (err) => {
            console.error("[AUTOTIMER] File write error:", err);
            api.sendMessage(finalMessage, threadID); 
          });

        } catch (error) {
          console.error(`[AUTOTIMER] Request error for ${threadID}:`, error.message);
          api.sendMessage(finalMessage, threadID);
        }
      }
    }
  }, 30000); 
};
