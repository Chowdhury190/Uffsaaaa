const m moment = require("moment-timezone");

module.exports.config = {
 nameversion: "3.4",
 role: 0,
 author: "EryXdescription: "Hourly auto message with time greto all groups (24-hour system)",
 category: "AutoTime",
 countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
 setTimeout(async () => {
 const timerData = {
  "12:00:00 AM": "🌙 কিরে! ing sent to all groups (24-hour system)",
 category: "AutoTime",
 countDown: 3,
};

module.exports.onLoad = asyncription: "Hourly auto message with time greeting sent to all groupstime",
 version: ");

module.exports.config = {
 name: "autotime",
 version: "3.4",
 role: 0,
 author: "EryXenX",
 description: "Hourly auto message with time greeting sent to all groups (24-hour system)",
 category: "AutoTime",
 countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
 setTimeout(async () => {
 const timerData = {
  "12:00:00 AM": "🌙 কিরে! এখন ১২টা বাজে! 😴\nতোর বউ নাই ভাই... এবার ঘুমা! 😂",

  "01:00:00 AM": "👀 এখনও অনলাইনে নাকি?\nক্রাশ রিপ্লাই দিবে না ভাই, এবার ঘুমা! 🤣",

  "02:00:00 AM": "🌌 রাত ২টা বাজে!\nএত রাতে জেগে থাকলে ভূতও বলবে—'ভাই আগে আপনি ঘুমান!' 👻😂",

  "03:00:00 AM": "🤲 তাহাজ্জুদের সময়।\n🕌 সুযোগ থাকলে দুই রাকাত নফল নামাজ আদায় করুন এবং বেশি বেশি ইস্তিগফার করুন।",

  "04:00:00 AM": "🌅 ফজরের সময় প্রায় হয়ে এসেছে।\n💧 অজু করে নামাজের প্রস্তুতি নিন।",

  "05:00:00 AM": "🕌 ফজরের আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।\n✨ আল্লাহ আপনার দিনটি বরকতময় করুন।",

  "06:00:00 AM": "☀️ শুভ সকাল!\nযারা এখনও ঘুমাচ্ছে, তাদের জন্য ১০টা অ্যালার্মও কম! 😂",

  "07:00:00 AM": "🍳 নাস্তা কর ভাই!\nখালি প্রেম করলে পেট ভরবে না! 🤭",

  "08:00:00 AM": "💼 কাজে যা!\nবেতন কিন্তু 'Seen' দিয়ে আসে না! 😂💸",

  "09:00:00 AM": "☕ এক কাপ চা খা!\nচা না খেলে মুখের সফটওয়্যার আপডেট হয় না! 🤣",

  "10:00:00 AM": "💧 একটু পানি খা!\nশুধু চা খেয়ে মানুষ বাঁচে না ভাই! 😂",

  "11:00:00 AM": "🕌 যোহরের সময় ঘনিয়ে এসেছে।\n🤲 সবাই নামাজের প্রস্তুতি নিন।",

  "12:00:00 PM": "🕌 যোহরের আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।\n🌸 আল্লাহ আমাদের আমল কবুল করুন।",

  "01:00:00 PM": "🍛 ভাত খেয়ে বলবি '৫ মিনিট ঘুমাই'...\nতারপর উঠবি বিকেল ৫টায়! 🤣",

  "02:00:00 PM": "😪 ঘুম আসছে?\nবস দেখলে বলবি—ধ্যান করতেছিলাম! 😂",

  "03:00:00 PM": "🕌 আসরের আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।",

  "04:00:00 PM": "🌤️ বিকেল হয়ে গেছে!\nকাজ করছো, নাকি শুধু অনলাইনে সবুজ বাতি জ্বালিয়ে রাখছো? 🤣",

  "05:00:00 PM": "🌇 সূর্য ডুবতে চলেছে!\n🕌 মাগরিবের নামাজের জন্য প্রস্তুতি নিন।",

  "06:00:00 PM": "🕌 মাগরিবের আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।",

  "07:00:00 PM": "👨‍👩‍👧 পরিবারের সাথে একটু গল্প করো।\nসারাদিন মোবাইলের সাথেই প্রেম করলে চলবে? 🤣",

  "08:00:00 PM": "🍽️ রাতের খাবার খেয়ে নাও!\nপ্লেটটা নিজে ধুলে আম্মু খুশি হবে! 😂",

  "09:00:00 PM": "🕌 এশার আজানের সময় হয়েছে!\n🤲 সবাই নামাজ আদায় করুন।\n🌙 আল্লাহ আমাদের সবাইকে হেফাজত করুন।",

  "10:00:00 PM": "🌙 ঘুমানোর আগে আয়াতুল কুরসি ও ঘুমের দোয়া পড়ে নিন।\n😴 তারপর মোবাইলটাকেও ছুটি দিন! 😂",

  "11:00:00 PM": "📱 আর কত স্ক্রল করবি?\nFacebook শেষ হবে না, কিন্তু তোর ঘুম শেষ হয়ে যাবে! 🤣"
};

 const checkTimeAndSend = async () => {
 const now = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
 const messageText = timerData[now];

 if (messageText) {
 const timeFormatted = moment().tz("Asia/Dhaka").format("hh:mm A");
 const todayDate = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");
 const hour = parseInt(moment().tz("Asia/Dhaka").format("HH"));
 let period = "";

 if (hour === 0) period = "Midnight";
 else if (hour >= 1 && hour < 4) period = "Late Night";
 else if (hour >= 4 && hour < 12) period = "Morning";
 else if (hour >= 12 && hour < 17) period = "Afternoon";
 else if (hour >= 17 && hour < 20) period = "Evening";
 else period = "Night";

 const finalMessage = `🕒 ${timeFormatted} - ${period}

${messageText}

━━━━━━━━━━━━━━━
📅 ${todayDate}
⚡ Powered by: Akash`;

 try {
 const allThreads = await api.getThreadList(100, null, ["INBOX"]);
 const groupThreads = allThreads.filter(t => t.isGroup);

 for (const thread of groupThreads) {
 await api.sendMessage(finalMessage, thread.threadID);
 }
 } catch (err) {
 console.error("AutoTime Error:", err);
 }
 }
 };

 setInterval(checkTimeAndSend, 1000);
 }, 5000);
};

module.exports.onStart = () => {};
