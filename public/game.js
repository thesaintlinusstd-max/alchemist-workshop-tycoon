/* ==========================================================================
   HOGWARTS ADVANCED POTION-MAKING ENGINE (Harry Potter Lore & Canon Recipes)
   ========================================================================== */

// --- 1. Sound Engine (Web Audio API) ---
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

document.getElementById('audioToggleBtn').addEventListener('click', () => {
  initAudio();
  soundEnabled = !soundEnabled;
  document.getElementById('audioLabel').textContent = soundEnabled ? 'صدا: روشن' : 'صدا: خاموش';
  document.getElementById('audioToggleBtn').style.opacity = soundEnabled ? '1' : '0.6';
  if (soundEnabled) playTone(440, 0.05);
});

function playTone(freq, duration) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) { console.warn(e); }
}

function playPourSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.14);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.14);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(now);
  } catch (e) { console.warn(e); }
}

function playBubbleSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const baseFreq = 240 + Math.random() * 340;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.07);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) { console.warn(e); }
}

function playFlameSound(heatLevel) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const freq = heatLevel === 'high' ? 140 : (heatLevel === 'med' ? 190 : 260);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) { console.warn(e); }
}

function playStirSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(480, now + 0.1);
    osc.frequency.linearRampToValueAtTime(260, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch (e) { console.warn(e); }
}

function playBottlingSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [300, 380, 480].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = now + idx * 0.16;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.12);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(start);
      osc.stop(start + 0.14);
    });

    const corkOsc = audioCtx.createOscillator();
    const corkGain = audioCtx.createGain();
    corkOsc.type = 'triangle';
    corkOsc.frequency.setValueAtTime(620, now + 0.52);
    corkOsc.frequency.exponentialRampToValueAtTime(220, now + 0.64);
    corkGain.gain.setValueAtTime(0.28, now + 0.52);
    corkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    corkOsc.connect(corkGain);
    corkGain.connect(audioCtx.destination);
    corkOsc.start(now + 0.52);
    corkOsc.stop(now + 0.65);
  } catch (e) { console.warn(e); }
}

function playSuccessChime() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.28), idx * 80);
    });
  } catch (e) { console.warn(e); }
}

function playFailBuzz() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.35);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) { console.warn(e); }
}

// --- 2. INGREDIENTS DATABASE WITH HP CANON & LORE ---
const INGREDIENTS = {
  // Bases (Solvents)
  pure_water: {
    id: 'pure_water',
    name: 'آب چشمه دریاچه سیاه',
    category: 'base',
    icon: '🚰',
    sub: 'حلال خنثی و زلال هاگوارتز',
    price: 5,
    unlocked: true,
    lore: 'آبی تصفیه‌شده از اعماق دریاچه سیاه هاگوارتز؛ زیستگاه ماهی مرکب غول‌پیکر و پری‌های دریایی. پایه‌ای پایدار برای معجون‌های درمانی و ابتدایی سال اولی‌ها.'
  },
  moon_dew: {
    id: 'moon_dew',
    name: 'شبنم ماه کامل',
    category: 'base',
    icon: '🌙',
    sub: 'پایه معجون‌های خواب و شانس',
    price: 15,
    unlocked: true,
    lore: 'قطرات شبنم جمع‌آوری شده در شب‌های ماه کامل از گل‌های جادویی جنگل ممنوعه. حلال پایه برای معجون‌های با خلوص بالا مثل مرگ زنده و فیلیکس فلیسیس.'
  },

  // Tier 1 Herbs & Flora (Early Game)
  wiggentree_bark: {
    id: 'wiggentree_bark',
    name: 'پوست درخت ویگن (Wiggentree)',
    category: 'herbs',
    icon: '🪵',
    sub: 'التیام‌بخش جراحات جادویی',
    price: 8,
    unlocked: true,
    lore: 'درخت جادویی که شاخه‌هایش توسط لکه‌بین‌ها (Bowtruckles) محافظت می‌شود. پوست آن داروی اصلی معجون حیات‌بخش ویگن‌ولد است.'
  },
  dittany: {
    id: 'dittany',
    name: 'علف پونه کوهی جادویی (Dittany)',
    category: 'herbs',
    icon: '🌿',
    sub: 'ترمیم فوری زخم و بافت',
    price: 10,
    unlocked: true,
    lore: 'گیاهی بسیار کمیاب در گلخانه شماره ۲ پروفسور اسپراوت. یک قطره از عصاره آن روی زخم باز می‌تواند خونریزی را در چند ثانیه متوقف کند.'
  },
  chili_wart: {
    id: 'chili_wart',
    name: 'فلفل آتشفشانی (Bouncing Bulb)',
    category: 'herbs',
    icon: '🌶️',
    sub: 'حرارت‌بخش و خروج دود از گوش',
    price: 8,
    unlocked: true,
    lore: 'میوه تند گل‌های جهنده که دمای بدن را بلافاصله بالا می‌برد و بخار گرم را از مجاری گوش به بیرون هدایت می‌کند.'
  },
  flork_flower: {
    id: 'flork_flower',
    name: 'شیره گل زهرآگین (Flork)',
    category: 'herbs',
    icon: '🥀',
    sub: 'علف‌کش قوی برای گیاهان هرز',
    price: 12,
    unlocked: true,
    lore: 'شیره استخراج شده از گیاهان گزنده گلخانه هاگوارتز که برای از بین بردن بوته‌های مزاحم و دفع طلسم‌های گیاهی به کار می‌رود.'
  },

  // Tier 2 & Tier 3 Advanced Materials (Unlockable via Progress / Shop)
  mandrake_root: {
    id: 'mandrake_root',
    name: 'ریشه مهرگیاه (Mandrake)',
    category: 'herbs',
    icon: '🪴',
    sub: 'تثبیت بافت و کالبد بیولوژیک',
    price: 20,
    unlocked: false,
    unlockLevel: 2,
    lore: 'ریشه انسان‌نمایی که فریاد نوزادی آن کشنده است! برای معجون‌های تثبیت‌کننده و بازگرداندن افراد خشک‌شده توسط باسیلیسک ضروری است.'
  },
  fluxweed: {
    id: 'fluxweed',
    name: 'علف ماه کامل (Fluxweed)',
    category: 'herbs',
    icon: '🌾',
    sub: 'عامل تغییر ساختار ظاهری بدن',
    price: 25,
    unlocked: false,
    unlockLevel: 2,
    lore: 'علفی که فقط باید در شب ماه کامل چیده شود تا خاصیت ژنتیکی آن برای دگرگونی فرم انسان به کار رود. رکن اصلی پلی‌جوس.'
  },
  wormwood: {
    id: 'wormwood',
    name: 'افسنطین تلخ (Wormwood)',
    category: 'herbs',
    icon: '🍃',
    sub: 'عصاره خواب مرگبار عمیق',
    price: 30,
    unlocked: false,
    unlockLevel: 3,
    lore: 'گیاهی تلخ و تاریک. سوال معروف اسنیپ از هری در اولین جلسه معجون‌سازی: افزودن پودر ریشه گل سوسن به عصاره افسنطین معجون مرگ زنده می‌سازد!'
  },
  sopophorous_bean: {
    id: 'sopophorous_bean',
    name: 'دانه خواب‌آور سوپوفوروس',
    category: 'creatures',
    icon: '🫘',
    sub: 'عصاره مرگ زنده و خلسه',
    price: 35,
    unlocked: false,
    unlockLevel: 3,
    lore: 'دانه‌ای لغزنده و نقره‌ای. کتاب چاپ قدیم می‌گوید آن را برش بزنید، اما دست‌نوشته شاهزاده دورگه توصیه می‌کند آن را با لبه چاقو له کنید تا تمام آب آن خارج شود!'
  },
  boomslang_skin: {
    id: 'boomslang_skin',
    name: 'پوست مار درختی (Boomslang)',
    category: 'creatures',
    icon: '🐍',
    sub: 'کمیاب در انبار خصوصی اسنیپ',
    price: 40,
    unlocked: false,
    unlockLevel: 2,
    lore: 'پوست انداخته‌شده مار زهرآگین آفریقایی. به قدری کمیاب است که هرمیون در سال دوم مجبور شد از کمد قفل‌شده اسنیپ آن را کش برود!'
  },
  ashwinder_egg: {
    id: 'ashwinder_egg',
    name: 'تخم مار آتشی (Ashwinder Egg)',
    category: 'creatures',
    icon: '🥚',
    sub: 'تخم آتشین شانس ناب طلایی',
    price: 50,
    unlocked: false,
    unlockLevel: 3,
    lore: 'تخم‌های گداخته و سوزان مار آتشی که در صورت یخ‌زدن با افسون انجماد، ماده اولیه معجون شانس خالص فیلیکس فلیسیس می‌شوند.'
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: 'پودر فلس اژدهای مجارستانی',
    category: 'creatures',
    icon: '🐉',
    sub: 'حرارت پایدار و ضدسرما',
    price: 15,
    unlocked: true,
    lore: 'فلس‌های ریز خردشده اژدهای دم‌شاخ مجارستانی که به طور طبیعی انرژی گرمایی فراوانی را در محلول ذخیره می‌کنند.'
  }
};

// --- 3. 6 HARRY POTTER CANON RECIPES WITH REAL LORE ---
const RECIPES = [
  // 1. Wiggenweld Potion (Level 1 Unlock)
  {
    id: 'wiggenweld',
    name: 'معجون حیات‌بخش ویگن‌ولد (Wiggenweld)',
    fandomName: 'Wiggenweld Potion',
    colorClass: 'wiggenweld',
    price: 45,
    unlocked: true,
    requiredLevel: 1,
    solvent: 'pure_water',
    ingredients: ['wiggentree_bark', 'dittany'],
    heat: 'low',
    stirs: 1,
    minTime: 6,
    maxTime: 11,
    liquidColor: '#00b894',
    particleColor: '#55efc4',
    usage: 'التیام‌بخش سریع جراحات و بیدارکننده افرادی که تحت طلسم خواب مصنوعی قرار گرفته‌اند؛ معجون استاندارد سال اول هاگوارتز.',
    loreNote: 'نکته اسنیپ: حرارت ملایم باعث آزاد شدن پکتین گیاه پونه بدون سوختن پوست درخت ویگن می‌شود.'
  },

  // 2. Pepperup Potion (Level 1 Unlock)
  {
    id: 'pepperup',
    name: 'معجون فلفل‌ساز (Pepperup Potion)',
    fandomName: 'Pepperup Potion',
    colorClass: 'pepperup',
    price: 60,
    unlocked: true,
    requiredLevel: 1,
    solvent: 'pure_water',
    ingredients: ['chili_wart', 'dragon_scale'],
    heat: 'high',
    stirs: 1,
    minTime: 5,
    maxTime: 9,
    liquidColor: '#d63031',
    particleColor: '#ff7675',
    usage: 'اختراع شده توسط گلوور هیپوورث در قرن هفدهم؛ درمان فوری سرماخوردگی فصلی همراه با خروج دودهای قرمز از هر دو گوش!',
    loreNote: 'مادام پامفری در درمانگاه هاگوارتز در فصل زمستان برای دانش‌آموزان به وفور از این معجون تجویز می‌کند.'
  },

  // 3. Herbicide Potion (Level 1 Unlock)
  {
    id: 'herbicide',
    name: 'معجون علف‌کش جادویی (Herbicide Potion)',
    fandomName: 'Herbicide Potion',
    colorClass: 'herbicide',
    price: 75,
    unlocked: true,
    requiredLevel: 1,
    solvent: 'pure_water',
    ingredients: ['flork_flower', 'dittany'],
    heat: 'med',
    stirs: 2,
    minTime: 7,
    maxTime: 12,
    liquidColor: '#e17055',
    particleColor: '#fdcb6e',
    usage: 'از بین برنده علف‌های هرز سمی و بوته‌های گزنده گلخانه‌های پروفسور اسپراوت بدون آسیب رساندن به خاک.',
    loreNote: 'رنگ مایع هنگام جوشیدن از قرمز تند به نارنجی فسفری مایل به زرد تغییر می‌کند.'
  },

  // 4. Polyjuice Potion (Level 2 Unlock)
  {
    id: 'polyjuice',
    name: 'معجون تغییر شکل (Polyjuice Potion)',
    fandomName: 'Polyjuice Potion',
    colorClass: 'polyjuice',
    price: 130,
    unlocked: false,
    requiredLevel: 2,
    solvent: 'pure_water',
    ingredients: ['fluxweed', 'boomslang_skin'],
    heat: 'low',
    stirs: 1,
    minTime: 7,
    maxTime: 13,
    liquidColor: '#2ecc71',
    particleColor: '#a8e063',
    usage: 'تغییر دادن کامل ظاهر فیزیکی فرد به شخصی دیگر برای مدت ۱ ساعت؛ مایعی غلیظ و جوشان با بافت لجنی سبز زمردی.',
    loreNote: 'دستورالعمل محرمانه بخش ممنوعه کتابخانه هاگوارتز در کتاب معجون‌های بسیار قدرتمند (Moste Potente Potions).'
  },

  // 5. Draught of Living Death (Level 3 Unlock)
  {
    id: 'draught',
    name: 'معجون مرگ زنده (Living Death)',
    fandomName: 'Draught of Living Death',
    colorClass: 'draught',
    price: 180,
    unlocked: false,
    requiredLevel: 3,
    solvent: 'moon_dew',
    ingredients: ['wormwood', 'sopophorous_bean'],
    heat: 'high',
    stirs: 3,
    minTime: 11,
    maxTime: 17,
    liquidColor: '#8e44ad',
    particleColor: '#c471ed',
    usage: 'قوی‌ترین داروی خواب جهان که فرد را در خواب عمیقی شبیه به مرگ فرو می‌برد؛ فقط با پادزهر گیاه بیدمشک باطل می‌شود.',
    loreNote: 'دست‌نوشته شاهزاده دورگه: بر خلاف کتاب بورج، ۳ بار در جهت عقربه‌های ساعت و یک بار خلاف جهت هم بزنید تا شفاف شود.'
  },

  // 6. Felix Felicis (Level 3 Unlock - Masterpiece)
  {
    id: 'felix',
    name: 'معجون شانس مایع (Felix Felicis)',
    fandomName: 'Felix Felicis',
    colorClass: 'felix',
    price: 220,
    unlocked: false,
    requiredLevel: 3,
    solvent: 'moon_dew',
    ingredients: ['ashwinder_egg', 'mandrake_root'],
    heat: 'med',
    stirs: 2,
    minTime: 9,
    maxTime: 15,
    liquidColor: '#f39c12',
    particleColor: '#ffe066',
    usage: 'اعطای شانس خالص در تمام تلاش‌ها تا چند ساعت؛ قطرات طلایی مذاب که حباب‌های آن مانند ماهی زرین به هوا جهش می‌کنند.',
    loreNote: 'زیگمونت باج (Zygmunt Budge) مخترع آن هشدار می‌دهد: مصرف بیش از حد آن موجب غرور کاذب و بی‌احتیاطی مرگبار می‌شود!'
  }
];

// --- 4. GAME STATE ---
const gameState = {
  gold: 50,
  reputation: 0,
  level: 1,
  inventory: {
    wiggenweld: 0,
    pepperup: 0,
    herbicide: 0,
    polyjuice: 0,
    draught: 0,
    felix: 0
  },
  ingredientStock: {
    pure_water: 10,
    moon_dew: 5,
    wiggentree_bark: 6,
    dittany: 6,
    chili_wart: 6,
    flork_flower: 6,
    dragon_scale: 5,
    mandrake_root: 0,
    fluxweed: 0,
    wormwood: 0,
    sopophorous_bean: 0,
    boomslang_skin: 0,
    ashwinder_egg: 0
  },
  unlockedIngredients: {
    pure_water: true,
    moon_dew: true,
    wiggentree_bark: true,
    dittany: true,
    chili_wart: true,
    flork_flower: true,
    dragon_scale: true,
    mandrake_root: false,
    fluxweed: false,
    wormwood: false,
    sopophorous_bean: false,
    boomslang_skin: false,
    ashwinder_egg: false
  },
  cauldron: {
    solvent: null,
    ingredients: [],
    heat: 'off',
    stirs: 0,
    boilTime: 0,
    isBoiling: false,
    state: 'empty', // empty, brewing, completed, ruined
    matchedRecipe: null
  },
  activeOrders: [],
  selectedRecipeTab: 'wiggenweld'
};

// Customer Avatars & Dialogue Lines
const HP_CUSTOMERS = [
  { name: 'هری پاتر (Gryffindor)', avatar: '⚡', speech: 'برای بازی کوئیدیچ فردا مقابل اسلیترین به شانس یا انرژی نیاز دارم!' },
  { name: 'هرمیون گرنجر (Gryffindor)', avatar: '📚', speech: 'تحقیق بخش ممنوعه نیاز به تغییر شکل یا داروی تقویت تمرکز دارد.' },
  { name: 'رون ویزلی (Gryffindor)', avatar: '🍗', speech: 'سرما خوردم و گوش‌هام یخ کرده، یه فلفل‌ساز می‌خوام!' },
  { name: 'دراکو مالفوی (Slytherin)', avatar: '🐍', speech: 'اسنیپ از کیفیت کار شما تعریف کرده، زود معجون منو آماده کن!' },
  { name: 'نویل لانگ‌باتم (Gryffindor)', avatar: '🪴', speech: 'توی گلخانه گیاهان مهاجم به بوته‌های مالتین حمله کردن!' },
  { name: 'پروفسور لوپین (Defense Against Dark Arts)', avatar: '🐺', speech: 'یک معجون مقوی برای رفع خستگی شب‌های ماه کامل لازم دارم.' },
  { name: 'لونا لاوگود (Ravenclaw)', avatar: '👓', speech: 'نارگل‌ها امروز خیلی زیاد شدن، شاید یه معجون ویگن‌ولد کمک کنه!' }
];

// --- 5. INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  renderInventoryBar();
  renderIngredientsShelf();
  renderRecipeTabs();
  showRecipeTab(gameState.selectedRecipeTab);
  renderShopModal();
  updateStatsUI();

  // Setup Initial Customer Orders
  spawnOrder();
  spawnOrder();

  // Continuous Customer Arrival Loop (Every 10 - 25 seconds)
  setInterval(() => {
    if (gameState.activeOrders.length < 3) {
      spawnOrder();
    }
  }, Math.floor(Math.random() * 15000) + 10000);

  // Setup Canvas & Animation Loop
  initCauldronCanvas();
});

// Setup Reset Button
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('آیا می‌خواهید کارگاه معجون‌سازی را از ابتدا آغاز کنید؟')) {
    gameState.gold = 50;
    gameState.reputation = 0;
    gameState.level = 1;
    Object.keys(gameState.inventory).forEach(k => gameState.inventory[k] = 0);
    Object.keys(gameState.ingredientStock).forEach(k => {
      gameState.ingredientStock[k] = INGREDIENTS[k].category === 'base' ? 8 : (INGREDIENTS[k].unlocked ? 5 : 0);
    });
    gameState.unlockedIngredients = {
      pure_water: true,
      moon_dew: true,
      wiggentree_bark: true,
      dittany: true,
      chili_wart: true,
      flork_flower: true,
      dragon_scale: true,
      mandrake_root: false,
      fluxweed: false,
      wormwood: false,
      sopophorous_bean: false,
      boomslang_skin: false,
      ashwinder_egg: false
    };
    dumpCauldron();
    gameState.activeOrders = [];
    spawnOrder();
    spawnOrder();
    renderInventoryBar();
    renderIngredientsShelf();
    renderRecipeTabs();
    showRecipeTab('wiggenweld');
    renderShopModal();
    updateStatsUI();
  }
});

// --- 6. STATS & LEVEL PROGRESSION ---
function getRankTitle(level) {
  if (level === 1) return 'سال اولی (شاگرد اسنیپ)';
  if (level === 2) return 'معجون‌ساز پیشرفته (سال پنجم)';
  return 'استاد کیمیاگری هاگوارتز (Master Brewer)';
}

function updateStatsUI() {
  document.getElementById('goldText').textContent = gameState.gold;
  document.getElementById('repLevelText').textContent = `سطح ${gameState.level}`;
  document.getElementById('repTitleText').textContent = getRankTitle(gameState.level);
  const shopGold = document.getElementById('shopGoldText');
  if (shopGold) shopGold.textContent = gameState.gold;
}

function addReputation(points) {
  gameState.reputation += points;
  const oldLevel = gameState.level;
  if (gameState.reputation >= 250 && gameState.level < 3) {
    gameState.level = 3;
  } else if (gameState.reputation >= 100 && gameState.level < 2) {
    gameState.level = 2;
  }

  if (gameState.level > oldLevel) {
    playSuccessChime();
    showOutcomeBanner(
      `🎉 ارتقای سطح به ${gameState.level}!`,
      `تبریک! شما به مقام «${getRankTitle(gameState.level)}» رسیدید. دستورالعمل‌ها و مواد جدید باز شدند!`,
      true
    );
    // Unlock new recipes according to level
    RECIPES.forEach(r => {
      if (r.requiredLevel <= gameState.level) r.unlocked = true;
    });
    renderRecipeTabs();
    renderIngredientsShelf();
    renderShopModal();
  }
  updateStatsUI();
}

// --- 7. INVENTORY RENDERING ---
function renderInventoryBar() {
  const container = document.getElementById('inventoryContainer');
  container.innerHTML = '';

  RECIPES.forEach(recipe => {
    const count = gameState.inventory[recipe.id] || 0;
    const slot = document.createElement('div');
    slot.className = 'inventory-bottle-slot';
    slot.id = `slot-${recipe.id}`;
    slot.title = recipe.name;

    slot.innerHTML = `
      <div class="mini-bottle-glass">
        <div class="mini-bottle-cork"></div>
        <div class="mini-liquid-fill ${recipe.colorClass}" style="height: ${count > 0 ? '75%' : '0%'}"></div>
      </div>
      <span>${recipe.fandomName}:</span>
      <span class="count-tag" id="invCount-${recipe.id}">${count}</span>
    `;
    container.appendChild(slot);
  });
}

function updateOrdersDeliverStatus() {
  gameState.activeOrders.forEach(order => {
    const card = document.getElementById(`order-${order.id}`);
    if (!card) return;
    const hasPotion = (gameState.inventory[order.recipe.id] || 0) > 0;
    const btn = card.querySelector('.btn-deliver-order');
    if (btn) {
      btn.disabled = !hasPotion;
      btn.innerHTML = hasPotion ? '🎁 تحویل معجون و دریافت گالیون' : '⏳ معجون در انبار موجود نیست';
    }
  });
}

function updateInventoryUI(recipeId) {
  const countTag = document.getElementById(`invCount-${recipeId}`);
  if (countTag) {
    countTag.textContent = gameState.inventory[recipeId] || 0;
  }
  const slot = document.getElementById(`slot-${recipeId}`);
  if (slot) {
    const liquid = slot.querySelector('.mini-liquid-fill');
    if (liquid) {
      liquid.style.height = (gameState.inventory[recipeId] > 0) ? '75%' : '0%';
    }
    slot.classList.remove('just-added');
    void slot.offsetWidth;
    slot.classList.add('just-added');
  }
  // Immediately update customer delivery buttons
  updateOrdersDeliverStatus();
}

// --- 8. INGREDIENTS SHELF & LORE TOOLTIP ---
const loreTooltip = document.getElementById('loreTooltip');

function showLoreTooltip(e, ingKey) {
  const ing = INGREDIENTS[ingKey];
  if (!ing) return;
  document.getElementById('tooltipIcon').textContent = ing.icon;
  document.getElementById('tooltipName').textContent = ing.name;
  document.getElementById('tooltipLore').textContent = ing.lore;
  const isUnlocked = gameState.unlockedIngredients[ingKey];
  const stock = gameState.ingredientStock[ingKey] || 0;
  document.getElementById('tooltipFooter').textContent = isUnlocked 
    ? `موجودی در قفسه: ${stock} عدد (قیمت خرید: ${ing.price} گالیون)` 
    : `🔒 قفل است • نیازمند سطح ${ing.unlockLevel || 2} یا خرید از کوچه دیاگون`;

  loreTooltip.classList.add('active');
  updateTooltipPosition(e);
}

function updateTooltipPosition(e) {
  let x = e.clientX + 16;
  let y = e.clientY + 16;
  if (x + 280 > window.innerWidth) x = e.clientX - 290;
  if (y + 180 > window.innerHeight) y = e.clientY - 190;
  loreTooltip.style.left = `${x}px`;
  loreTooltip.style.top = `${y}px`;
}

function hideLoreTooltip() {
  loreTooltip.classList.remove('active');
}

function renderIngredientsShelf() {
  const shelf = document.getElementById('ingredientsShelfList');
  shelf.innerHTML = '';

  const categories = [
    { key: 'base', title: '💧 مایعات و حلال‌های پایه:' },
    { key: 'herbs', title: '🌱 گیاهان و ریشه‌های هاگوارتز:' },
    { key: 'creatures', title: '✨ موجودات جادویی و بلورها:' }
  ];

  categories.forEach(cat => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="ingredient-category-title">${cat.title}</div>`;

    const grid = document.createElement('div');
    grid.className = 'ingredients-grid';

    Object.keys(INGREDIENTS).forEach(ingKey => {
      const ing = INGREDIENTS[ingKey];
      if (ing.category !== cat.key) return;

      const isUnlocked = gameState.unlockedIngredients[ingKey] || false;
      const stock = gameState.ingredientStock[ingKey] || 0;

      const btn = document.createElement('button');
      btn.className = `btn-ingredient ${!isUnlocked ? 'locked' : (stock <= 0 ? 'out-of-stock' : '')}`;
      btn.innerHTML = `
        <span class="ing-stock-badge">${isUnlocked ? stock : '🔒'}</span>
        <span class="ing-icon">${ing.icon}</span>
        <span class="ing-name">${ing.name}</span>
        <span class="ing-sub">${isUnlocked ? (stock > 0 ? ing.sub : 'اتمام موجودی! خرید از شاپ') : `نیازمند سطح ${ing.unlockLevel || 2}`}</span>
      `;

      btn.addEventListener('mouseenter', (e) => showLoreTooltip(e, ingKey));
      btn.addEventListener('mousemove', (e) => updateTooltipPosition(e));
      btn.addEventListener('mouseleave', hideLoreTooltip);

      btn.addEventListener('click', () => {
        if (!isUnlocked) {
          showFloatingText(btn, `🔒 این ماده هنوز قفل است!`, '#e74c3c');
          playTone(200, 0.15);
          return;
        }
        if (stock <= 0) {
          showFloatingText(btn, `موجودی تمام شده! از کوچه دیاگون بخرید 🛒`, '#e67e22');
          playTone(220, 0.15);
          return;
        }
        addIngredientToCauldron(ingKey);
      });

      grid.appendChild(btn);
    });

    wrap.appendChild(grid);
    shelf.appendChild(wrap);
  });
}

// --- 9. CAULDRON ACTIONS & LOGIC ---
function addIngredientToCauldron(ingKey) {
  initAudio();
  const ing = INGREDIENTS[ingKey];
  if (!ing) return;

  if (gameState.cauldron.state === 'ruined') {
    showOutcomeBanner('دیگ کثیف است!', 'معجون خراب شده است؛ ابتدا دیگ را شستشو دهید.', false);
    return;
  }

  // Deduct 1 from stock
  gameState.ingredientStock[ingKey]--;
  renderIngredientsShelf();

  if (ing.category === 'base') {
    if (gameState.cauldron.solvent) {
      showFloatingText(document.getElementById('cauldronCanvas'), 'حلال پایه قبلاً اضافه شده!', '#e74c3c');
      return;
    }
    gameState.cauldron.solvent = ingKey;
    playPourSound();
    showFloatingText(document.getElementById('cauldronCanvas'), `+ ریختن ${ing.name}`, '#74b9ff');
    triggerLiquidSplash(ingKey);
  } else {
    if (!gameState.cauldron.solvent) {
      showFloatingText(document.getElementById('cauldronCanvas'), 'ابتدا حلال پایه (آب/شبنم) بریزید!', '#f39c12');
      return;
    }
    gameState.cauldron.ingredients.push(ingKey);
    playPourSound();
    showFloatingText(document.getElementById('cauldronCanvas'), `+ افزودن ${ing.name}`, '#55efc4');
    triggerLiquidSplash(ingKey);
  }

  updateCauldronStatusUI();
}

function setHeat(level) {
  initAudio();
  gameState.cauldron.heat = level;
  document.querySelectorAll('.btn-heat').forEach(b => {
    b.classList.toggle('active', b.dataset.heat === level);
  });
  playFlameSound(level);

  if (level !== 'off' && gameState.cauldron.solvent) {
    gameState.cauldron.isBoiling = true;
  } else {
    gameState.cauldron.isBoiling = false;
  }
}

function stirCauldron() {
  initAudio();
  if (!gameState.cauldron.solvent) {
    showFloatingText(document.getElementById('cauldronCanvas'), 'دیگ خالی است!', '#bdc3c7');
    return;
  }
  gameState.cauldron.stirs++;
  document.getElementById('liveStirCount').textContent = gameState.cauldron.stirs;
  playStirSound();
  showFloatingText(document.getElementById('cauldronCanvas'), `🥄 هم زدن (${gameState.cauldron.stirs})`, '#f4c430');
  stirVortexVelocity += 1.8;
}

function dumpCauldron() {
  initAudio();
  gameState.cauldron = {
    solvent: null,
    ingredients: [],
    heat: 'off',
    stirs: 0,
    boilTime: 0,
    isBoiling: false,
    state: 'empty',
    matchedRecipe: null
  };
  setHeat('off');
  document.getElementById('liveStirCount').textContent = '۰';
  document.getElementById('boilTimerText').textContent = '0.0 ثانیه';
  updateCauldronStatusUI();
  playPourSound();
  showFloatingText(document.getElementById('cauldronCanvas'), '🧹 دیگ شسته و پاکیزه شد', '#dfe6e9');
}

function updateCauldronStatusUI() {
  const statusEl = document.getElementById('cauldronLiquidStatus');
  const logEl = document.getElementById('ingredientsListText');

  if (!gameState.cauldron.solvent) {
    statusEl.textContent = 'دیگ خالی است (آماده شروع پخت)';
    statusEl.style.color = '#f4c430';
    logEl.textContent = '(دیگ خالی است)';
    return;
  }

  const solventName = INGREDIENTS[gameState.cauldron.solvent].name;
  const ingNames = gameState.cauldron.ingredients.map(k => INGREDIENTS[k].name).join(' + ');

  statusEl.textContent = `حلال: ${solventName} | مواد: ${gameState.cauldron.ingredients.length} عدد | هم‌زدن: ${gameState.cauldron.stirs}`;
  statusEl.style.color = '#70d6ff';

  logEl.textContent = `${solventName}${ingNames ? ' + ' + ingNames : ''}`;
}

// Finish & Pour Into Bottle Animation Trigger
function finishBrew() {
  initAudio();
  if (!gameState.cauldron.solvent) {
    showOutcomeBanner('دیگ خالی است!', 'برای ساخت معجون ابتدا حلال و مواد اولیه اضافه کنید.', false);
    return;
  }

  const { solvent, ingredients, heat, stirs, boilTime } = gameState.cauldron;

  // Diagnostic Check Against All Recipes
  let matched = null;
  let reason = '';

  for (const r of RECIPES) {
    if (!r.unlocked) continue;

    // Check Solvent
    if (r.solvent !== solvent) continue;

    // Check Ingredients (Same elements regardless of order)
    const reqSorted = [...r.ingredients].sort();
    const currSorted = [...ingredients].sort();
    if (reqSorted.length !== currSorted.length) continue;
    const sameIngs = reqSorted.every((val, idx) => val === currSorted[idx]);
    if (!sameIngs) continue;

    // Found Target Recipe - Now evaluate process conditions
    if (stirs !== r.stirs) {
      reason = `تعداد هم‌زدن نادرست است! ${r.name} نیاز به ${r.stirs} بار هم زدن داشت، ولی شما ${stirs} بار هم زدید.`;
      break;
    }

    if (heat !== r.heat) {
      const heatFa = r.heat === 'low' ? 'کم' : (r.heat === 'med' ? 'متوسط' : 'زیاد');
      reason = `درجه شعله نامناسب بود! باید با شعله «${heatFa}» حرارت می‌دید.`;
      break;
    }

    if (boilTime < r.minTime) {
      reason = `زمان جوشیدن ناکافی بود! حداقل ${r.minTime} ثانیه جوشیدن لازم بود (شما ${boilTime.toFixed(1)} ثانیه جوشاندید).`;
      break;
    }

    if (boilTime > r.maxTime) {
      reason = `معجون بیش از حد جوشید و ته گرفت! حداکثر زمان مجاز ${r.maxTime} ثانیه بود.`;
      break;
    }

    // Full Success!
    matched = r;
    break;
  }

  if (matched) {
    startBottlingSequence(matched);
  } else {
    playFailBuzz();
    showOutcomeBanner('ترکیب ناموفق و دود سیاه!', reason || 'ترکیب مواد، درجه حرارت یا زمان پخت با هیچ دستورالعمل مجازی همخوانی نداشت.', false);
    gameState.cauldron.state = 'ruined';
    triggerRuinedSmoke();
  }
}

// Cinematic Bottling Sequence
let bottlingAnimation = null;

function startBottlingSequence(recipe) {
  playBottlingSound();
  bottlingAnimation = {
    progress: 0,
    recipe: recipe,
    streamX: 0,
    streamY: 0
  };

  showFloatingText(document.getElementById('cauldronCanvas'), `🧪 ریختن در بطری شیشه‌ای...`, '#2ecc71');

  setTimeout(() => {
    playSuccessChime();
    gameState.inventory[recipe.id] = (gameState.inventory[recipe.id] || 0) + 1;
    updateInventoryUI(recipe.id);
    addReputation(20);

    showOutcomeBanner(
      `✨ ${recipe.name} با موفقیت در بطری ریخته شد!`,
      `معجون با بالاترین کیفیت و درخشش درون بطری ذخیره شد و به انبار اضافه گردید. (+۲۰ امتیاز شهرت)`,
      true
    );

    dumpCauldron();
    bottlingAnimation = null;
  }, 1600);
}

// --- 10. RECIPE BOOK RENDERING ---
function renderRecipeTabs() {
  const tabsContainer = document.getElementById('recipeTabsContainer');
  tabsContainer.innerHTML = '';

  RECIPES.forEach(r => {
    const btn = document.createElement('button');
    btn.className = `recipe-tab-btn ${r.unlocked ? '' : 'locked'} ${gameState.selectedRecipeTab === r.id ? 'active' : ''}`;
    btn.innerHTML = `${r.unlocked ? '' : '🔒 '}${r.fandomName}`;
    btn.onclick = () => {
      if (!r.unlocked) {
        showOutcomeBanner('دستور قفل است!', `این معجون در سطح ${r.requiredLevel} یا با پیشرفت در هاگوارتز باز می‌شود.`, false);
        return;
      }
      showRecipeTab(r.id);
    };
    tabsContainer.appendChild(btn);
  });
}

function showRecipeTab(recipeId) {
  gameState.selectedRecipeTab = recipeId;
  renderRecipeTabs();

  const recipe = RECIPES.find(r => r.id === recipeId);
  const area = document.getElementById('recipeContentArea');
  if (!recipe) return;

  const solventObj = INGREDIENTS[recipe.solvent];
  const heatName = recipe.heat === 'low' ? 'کم 🔥' : (recipe.heat === 'med' ? 'متوسط 🔥🔥' : 'زیاد 🔥🔥🔥');

  area.innerHTML = `
    <div class="recipe-title-banner">
      <span>✨ ${recipe.name}</span>
      <span style="font-size: 0.85rem; color: #b7791f; font-weight: 800;">${recipe.price} 🪙</span>
    </div>

    <div class="recipe-meta-tags">
      <span class="meta-tag">شعله: ${heatName}</span>
      <span class="meta-tag">هم زدن: ${recipe.stirs} بار 🥄</span>
      <span class="meta-tag">پخت: ${recipe.minTime} الی ${recipe.maxTime} ثانیه ⏱️</span>
    </div>

    <ol class="recipe-step-list">
      <li class="recipe-step-item">
        <span class="step-num">۱</span>
        <span><strong>حلال پایه:</strong> ۱ بار <strong>«${solventObj.name}»</strong> ${solventObj.icon} اضافه کنید.</span>
      </li>
      <li class="recipe-step-item">
        <span class="step-num">۲</span>
        <span><strong>مواد لازم:</strong> ${recipe.ingredients.map(k => `<strong>«${INGREDIENTS[k].name}»</strong> ${INGREDIENTS[k].icon}`).join(' و ')} را در دیگ بریزید.</span>
      </li>
      <li class="recipe-step-item">
        <span class="step-num">۳</span>
        <span><strong>هم زدن:</strong> دقیقاً <strong>${recipe.stirs} بار</strong> با قاشق چوبی هم بزنید.</span>
      </li>
      <li class="recipe-step-item">
        <span class="step-num">۴</span>
        <span><strong>پخت نهایی:</strong> شعله را روی <strong>«${heatName}»</strong> تنظیم کرده و بین <strong>${recipe.minTime} تا ${recipe.maxTime} ثانیه</strong> بجوشانید، سپس دکمه ریختن در بطری را بزنید.</span>
      </li>
    </ol>

    <div class="recipe-usage-box">
      📖 <strong>کاربرد در هاگوارتز:</strong> ${recipe.usage}
    </div>

    <div class="recipe-lore-note">
      🖋️ <strong>حاشیه شاهزاده دورگه:</strong> ${recipe.loreNote}
    </div>
  `;
}

// --- 11. DIAGON ALLEY SHOP MODAL ---
const shopModal = document.getElementById('shopModal');
document.getElementById('shopModalBtn').addEventListener('click', () => {
  renderShopModal();
  shopModal.classList.add('open');
});

function closeShopModal() {
  shopModal.classList.remove('open');
}

function renderShopModal() {
  const grid = document.getElementById('shopItemsGrid');
  grid.innerHTML = '';
  document.getElementById('shopGoldText').textContent = gameState.gold;

  Object.keys(INGREDIENTS).forEach(ingKey => {
    const ing = INGREDIENTS[ingKey];
    const isUnlocked = gameState.unlockedIngredients[ingKey];
    const currentStock = gameState.ingredientStock[ingKey] || 0;
    const unlockCost = ing.price * 3;

    const card = document.createElement('div');
    card.className = 'shop-item-card';

    card.innerHTML = `
      <div class="shop-item-top">
        <div class="shop-item-icon">${ing.icon}</div>
        <div class="shop-item-info">
          <div class="shop-item-name">${ing.name}</div>
          <div class="shop-item-desc">${ing.lore}</div>
        </div>
      </div>

      <div class="shop-item-bottom">
        <span class="shop-price-tag">
          ${!isUnlocked ? `🔒 بازگشایی: ${unlockCost} 🪙` : `بسته ۳ عددی: ${ing.price * 2} 🪙 (موجودی: ${currentStock})`}
        </span>
        <button class="btn-buy-stock" id="buyBtn-${ingKey}">
          ${!isUnlocked ? '🔓 باز کردن ماده' : '🛒 خرید ۳ عدد'}
        </button>
      </div>
    `;

    const btn = card.querySelector(`#buyBtn-${ingKey}`);
    btn.onclick = () => {
      initAudio();
      if (!isUnlocked) {
        if (gameState.gold >= unlockCost) {
          gameState.gold -= unlockCost;
          gameState.unlockedIngredients[ingKey] = true;
          gameState.ingredientStock[ingKey] = 3;
          playSuccessChime();
          showFloatingText(btn, `🔓 باز شد + ۳ عدد اضافه شد!`, '#2ecc71');
          updateStatsUI();
          renderIngredientsShelf();
          renderShopModal();
        } else {
          playTone(200, 0.2);
          showFloatingText(btn, `گالیون کافی نیست!`, '#e74c3c');
        }
      } else {
        const packPrice = ing.price * 2;
        if (gameState.gold >= packPrice) {
          gameState.gold -= packPrice;
          gameState.ingredientStock[ingKey] += 3;
          playTone(550, 0.15);
          showFloatingText(btn, `+۳ عدد خریداری شد!`, '#2ecc71');
          updateStatsUI();
          renderIngredientsShelf();
          renderShopModal();
        } else {
          playTone(200, 0.2);
          showFloatingText(btn, `گالیون کافی نیست!`, '#e74c3c');
        }
      }
    };

    grid.appendChild(card);
  });
}

// --- 12. CUSTOMER ORDERS ENGINE ---
let orderIdCounter = 1;

function spawnOrder() {
  if (gameState.activeOrders.length >= 3) return;

  const unlockedRecipes = RECIPES.filter(r => r.unlocked);
  if (unlockedRecipes.length === 0) return;

  const recipe = unlockedRecipes[Math.floor(Math.random() * unlockedRecipes.length)];
  const cust = HP_CUSTOMERS[Math.floor(Math.random() * HP_CUSTOMERS.length)];
  const totalTime = 60 + Math.floor(Math.random() * 30); // 60-90s patience

  const newOrder = {
    id: orderIdCounter++,
    customer: cust,
    recipe: recipe,
    reward: recipe.price,
    totalTime: totalTime,
    timeLeft: totalTime
  };

  gameState.activeOrders.push(newOrder);
  renderOrdersUI();
}

function renderOrdersUI() {
  const grid = document.getElementById('ordersGrid');
  grid.innerHTML = '';

  gameState.activeOrders.forEach(order => {
    const hasPotion = (gameState.inventory[order.recipe.id] || 0) > 0;
    const pct = Math.max(0, (order.timeLeft / order.totalTime) * 100);

    const card = document.createElement('div');
    card.className = 'customer-order-card';
    card.id = `order-${order.id}`;

    card.innerHTML = `
      <div class="order-top">
        <div class="customer-avatar">${order.customer.avatar}</div>
        <div class="customer-details">
          <div class="customer-name">${order.customer.name}</div>
          <div class="customer-speech">«${order.customer.speech}»</div>
        </div>
      </div>

      <div class="order-requested-potion">
        <span>سفارش: <strong>${order.recipe.name}</strong></span>
        <span style="color: #b7791f; font-weight: 800;">+${order.reward} 🪙</span>
      </div>

      <div class="patience-info-row">
        <span>صبر مشتری:</span>
        <span class="timer-counter">${Math.ceil(order.timeLeft)} ثانیه</span>
      </div>

      <div class="order-patience-track">
        <div class="order-patience-fill" style="width: ${pct}%; background-color: ${pct < 25 ? '#e74c3c' : (pct < 50 ? '#f39c12' : '#27ae60')};"></div>
      </div>

      <button class="btn-deliver-order" ${hasPotion ? '' : 'disabled'} onclick="deliverOrder(${order.id})">
        ${hasPotion ? '🎁 تحویل معجون و دریافت گالیون' : '⏳ معجون در انبار موجود نیست'}
      </button>
    `;

    grid.appendChild(card);
  });
}

function deliverOrder(orderId) {
  initAudio();
  const idx = gameState.activeOrders.findIndex(o => o.id === orderId);
  if (idx === -1) return;

  const order = gameState.activeOrders[idx];
  if ((gameState.inventory[order.recipe.id] || 0) <= 0) return;

  // Deduct potion & give reward
  gameState.inventory[order.recipe.id]--;
  updateInventoryUI(order.recipe.id);

  gameState.gold += order.reward;
  playSuccessChime();
  showFloatingText(document.getElementById(`order-${orderId}`), `+${order.reward} گالیون طلایی! 🪙`, '#ffd700');

  addReputation(15);
  gameState.activeOrders.splice(idx, 1);
  renderOrdersUI();
  updateStatsUI();

  // Next order in 6-12s
  setTimeout(() => spawnOrder(), Math.floor(Math.random() * 6000) + 6000);
}

// Order Patience Countdown Timer
setInterval(() => {
  let changed = false;
  for (let i = gameState.activeOrders.length - 1; i >= 0; i--) {
    const o = gameState.activeOrders[i];
    o.timeLeft -= 0.5;
    if (o.timeLeft <= 0) {
      gameState.activeOrders.splice(i, 1);
      changed = true;
      // Show mini non-intrusive toast in bottom-left corner
      showToast('مشتری هاگوارتز رفت!', `${o.customer.name} به دلیل انتظار سفارش را لغو کرد.`, 'warning', '🚪');
    }
  }
  if (changed || gameState.activeOrders.length > 0) {
    // Update live bars and delivery button readiness
    updateOrdersDeliverStatus();
    gameState.activeOrders.forEach(o => {
      const card = document.getElementById(`order-${o.id}`);
      if (card) {
        const pct = Math.max(0, (o.timeLeft / o.totalTime) * 100);
        const fill = card.querySelector('.order-patience-fill');
        const timer = card.querySelector('.timer-counter');
        if (fill) {
          fill.style.width = `${pct}%`;
          fill.style.backgroundColor = pct < 25 ? '#e74c3c' : (pct < 50 ? '#f39c12' : '#27ae60');
        }
        if (timer) timer.textContent = `${Math.ceil(o.timeLeft)} ثانیه`;
      }
    });
  }
}, 500);

// --- 13. INTERACTIVE CANVAS & VISUAL EFFECTS ENGINE ---
let canvas, ctx;
let stirVortexAngle = 0;
let stirVortexVelocity = 0;
let liquidWavePhase = 0;
let particles = [];
let splashRipples = [];
let vaporParticles = [];
let flameEmbers = [];

function initCauldronCanvas() {
  canvas = document.getElementById('cauldronCanvas');
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  requestAnimationFrame(animationLoop);
}

function triggerLiquidSplash(ingKey) {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.44;
  const isBase = INGREDIENTS[ingKey].category === 'base';

  for (let i = 0; i < 24; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 50,
      y: cy + (Math.random() - 0.5) * 15,
      vx: (Math.random() - 0.5) * 7,
      vy: -Math.random() * 8 - 3,
      radius: Math.random() * 4 + 2,
      color: isBase ? '#74b9ff' : '#ffeaa7',
      life: 1,
      type: 'splash'
    });
  }
  splashRipples.push({
    radius: 4,
    maxRadius: 75,
    opacity: 0.95
  });
}

function triggerRuinedSmoke() {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.44;
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 90,
      y: cy + 10,
      vx: (Math.random() - 0.5) * 3.5,
      vy: -Math.random() * 4.5 - 1.5,
      radius: Math.random() * 14 + 6,
      color: 'rgba(25, 25, 25, 0.85)',
      life: 1,
      type: 'smoke'
    });
  }
}

// Main 60FPS Render Loop
let lastTime = performance.now();

function animationLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height * 0.44; // elevated center to leave ample space for hearth & flames

  // 1. Draw Hearth Foundation & Cooking Grate
  drawHearthBase(cx, cy);

  // 2. Draw Active Animated Flame Beneath & Around Cauldron
  drawHearthAndFlames(cx, cy, dt);

  // 3. Cauldron Outer Pot Geometry & Handles
  drawCauldronBody(cx, cy);

  // 4. Liquid Interior with Textures, Ripples & Boiling Bubbles
  drawCauldronLiquid(cx, cy, dt);

  // 5. Particles, Steaming Vapor & Embers
  updateAndDrawParticles(dt, cx, cy);

  // 6. Cinematic Bottling Stream Animation
  if (bottlingAnimation) {
    drawBottlingStream(cx, cy, dt);
  }

  // Live Timer Accumulation
  if (gameState.cauldron.isBoiling) {
    gameState.cauldron.boilTime += dt;
    document.getElementById('boilTimerText').textContent = `${gameState.cauldron.boilTime.toFixed(1)} ثانیه`;
    if (Math.random() < 0.08) playBubbleSound();
  }

  requestAnimationFrame(animationLoop);
}

// Draw Stone Hearth Base & Iron Grate
function drawHearthBase(cx, cy) {
  ctx.save();

  // Hearth Stone Floor / Platform
  const hearthY = cy + 92;
  const gradFloor = ctx.createLinearGradient(cx - 140, hearthY, cx + 140, hearthY);
  gradFloor.addColorStop(0, '#100a06');
  gradFloor.addColorStop(0.3, '#2a170d');
  gradFloor.addColorStop(0.7, '#24140b');
  gradFloor.addColorStop(1, '#0e0804');

  ctx.fillStyle = gradFloor;
  ctx.beginPath();
  ctx.ellipse(cx, hearthY + 18, 130, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4a2b16';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Stone Bricks details
  ctx.strokeStyle = 'rgba(74, 43, 22, 0.6)';
  ctx.lineWidth = 1.5;
  for (let i = -100; i <= 100; i += 40) {
    ctx.beginPath();
    ctx.moveTo(cx + i, hearthY + 6);
    ctx.lineTo(cx + i + 10, hearthY + 28);
    ctx.stroke();
  }

  // Hot Embers / Ash Bed
  const heat = gameState.cauldron.heat;
  const emberGrad = ctx.createRadialGradient(cx, hearthY + 6, 5, cx, hearthY + 6, 80);
  if (heat === 'high') {
    emberGrad.addColorStop(0, '#ff3838');
    emberGrad.addColorStop(0.5, '#c0392b');
    emberGrad.addColorStop(1, '#2c120a');
  } else if (heat === 'med') {
    emberGrad.addColorStop(0, '#f39c12');
    emberGrad.addColorStop(0.6, '#d35400');
    emberGrad.addColorStop(1, '#2c120a');
  } else if (heat === 'low') {
    emberGrad.addColorStop(0, '#00cec9');
    emberGrad.addColorStop(0.5, '#0984e3');
    emberGrad.addColorStop(1, '#112233');
  } else {
    emberGrad.addColorStop(0, '#3a3a3a');
    emberGrad.addColorStop(1, '#1a1a1a');
  }

  ctx.fillStyle = emberGrad;
  ctx.beginPath();
  ctx.ellipse(cx, hearthY + 6, 75, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iron Grate Bars
  ctx.strokeStyle = '#181818';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let gx = -70; gx <= 70; gx += 20) {
    ctx.beginPath();
    ctx.moveTo(cx + gx, hearthY - 4);
    ctx.lineTo(cx + gx * 0.9, hearthY + 14);
    ctx.stroke();
  }
  // Crossbar
  ctx.beginPath();
  ctx.moveTo(cx - 75, hearthY + 5);
  ctx.lineTo(cx + 75, hearthY + 5);
  ctx.stroke();

  ctx.restore();
}

// Flame Render - Prominent, Dynamic, Vibrant underbelly flames
function drawHearthAndFlames(cx, cy, dt) {
  const heat = gameState.cauldron.heat;
  if (heat === 'off') return;

  const time = Date.now() * 0.005;
  const hearthY = cy + 90;
  const flameHeight = heat === 'high' ? 62 : (heat === 'med' ? 44 : 26);
  const flameCount = heat === 'high' ? 12 : (heat === 'med' ? 8 : 5);

  ctx.save();

  // 1. Ambient Underglow Reflection on Bottom of Cauldron
  const underGlow = ctx.createRadialGradient(cx, hearthY - 20, 10, cx, hearthY - 20, 95);
  if (heat === 'high') {
    underGlow.addColorStop(0, 'rgba(255, 71, 87, 0.7)');
    underGlow.addColorStop(0.6, 'rgba(235, 94, 40, 0.35)');
    underGlow.addColorStop(1, 'transparent');
  } else if (heat === 'med') {
    underGlow.addColorStop(0, 'rgba(243, 156, 18, 0.65)');
    underGlow.addColorStop(0.6, 'rgba(211, 84, 0, 0.3)');
    underGlow.addColorStop(1, 'transparent');
  } else {
    underGlow.addColorStop(0, 'rgba(0, 206, 201, 0.6)');
    underGlow.addColorStop(0.6, 'rgba(9, 132, 227, 0.3)');
    underGlow.addColorStop(1, 'transparent');
  }
  ctx.fillStyle = underGlow;
  ctx.beginPath();
  ctx.ellipse(cx, hearthY - 20, 100, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Animated Flame Tongues (Behind and around the pot bottom)
  for (let i = 0; i < flameCount; i++) {
    const spread = (i - flameCount / 2 + 0.5) * (140 / flameCount);
    const fx = cx + spread;
    const wave1 = Math.sin(time * 3 + i * 1.7) * 8;
    const wave2 = Math.cos(time * 4.2 + i * 2.3) * 6;
    const curHeight = flameHeight + wave1 + (Math.sin(time * 2 + i) * 10);
    const fy = hearthY + 2;

    const grad = ctx.createLinearGradient(fx, fy, fx + wave2, fy - curHeight);

    if (heat === 'high') {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#ffdd59');
      grad.addColorStop(0.55, '#ff5e57');
      grad.addColorStop(0.9, '#c0392b');
      grad.addColorStop(1, 'transparent');
    } else if (heat === 'med') {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, '#ffeaa7');
      grad.addColorStop(0.65, '#f39c12');
      grad.addColorStop(0.9, '#d35400');
      grad.addColorStop(1, 'transparent');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, '#81ecec');
      grad.addColorStop(0.65, '#00cec9');
      grad.addColorStop(0.9, '#0984e3');
      grad.addColorStop(1, 'transparent');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(fx - 14, fy);
    ctx.quadraticCurveTo(fx - 7 + wave2 * 0.5, fy - curHeight * 0.5, fx + wave2, fy - curHeight);
    ctx.quadraticCurveTo(fx + 7 + wave2 * 0.5, fy - curHeight * 0.5, fx + 14, fy);
    ctx.closePath();
    ctx.fill();
  }

  // 3. Spawn Rising Flame Ember Sparks
  if (Math.random() < (heat === 'high' ? 0.6 : (heat === 'med' ? 0.35 : 0.15))) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 110,
      y: hearthY - Math.random() * 20,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -Math.random() * 4 - 2,
      radius: Math.random() * 2.5 + 1.2,
      color: heat === 'high' ? '#fffa65' : (heat === 'med' ? '#ffd32a' : '#70a1ff'),
      life: 1,
      type: 'ember'
    });
  }

  ctx.restore();
}

// Cauldron Pot Geometry & Bronze Bands
function drawCauldronBody(cx, cy) {
  ctx.save();

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;

  // 1. Cauldron Legs (Tripod)
  ctx.fillStyle = '#141414';
  [-68, 0, 68].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(cx + lx - 8, cy + 45);
    ctx.lineTo(cx + lx * 1.15 - 12, cy + 92);
    ctx.lineTo(cx + lx * 1.15 + 12, cy + 92);
    ctx.lineTo(cx + lx + 8, cy + 45);
    ctx.closePath();
    ctx.fill();

    // Leg claw foot
    ctx.beginPath();
    ctx.arc(cx + lx * 1.15, cy + 91, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Cast Iron Pot Belly
  const potGrad = ctx.createRadialGradient(cx - 20, cy + 10, 10, cx, cy + 20, 110);
  potGrad.addColorStop(0, '#353535');
  potGrad.addColorStop(0.4, '#242424');
  potGrad.addColorStop(0.8, '#181818');
  potGrad.addColorStop(1, '#0d0d0d');

  ctx.fillStyle = potGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 24, 100, 64, 0, 0, Math.PI);
  ctx.fill();

  // 3. Side Hanging Rings / Ear Handles
  [-100, 100].forEach((hx, idx) => {
    // Handle Mount
    ctx.fillStyle = '#6e4420';
    ctx.beginPath();
    ctx.arc(cx + hx, cy - 2, 7, 0, Math.PI * 2);
    ctx.fill();

    // Bronze Ring
    ctx.strokeStyle = '#c58b43';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx + hx + (idx === 0 ? -6 : 6), cy + 10, 11, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 4. Middle Bronze Reinforcement Belt & Rivets
  ctx.strokeStyle = '#6e4420';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 97, 24, 0, 0, Math.PI);
  ctx.stroke();

  // Rivets
  ctx.fillStyle = '#f4c430';
  for (let rx = -80; rx <= 80; rx += 25) {
    ctx.beginPath();
    ctx.arc(cx + rx, cy + 20 + Math.abs(rx * 0.1), 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Cauldron Bronze Rim Top
  const rimGrad = ctx.createLinearGradient(cx - 105, cy - 22, cx + 105, cy - 22);
  rimGrad.addColorStop(0, '#3e2714');
  rimGrad.addColorStop(0.3, '#784d28');
  rimGrad.addColorStop(0.5, '#c58b43');
  rimGrad.addColorStop(0.7, '#784d28');
  rimGrad.addColorStop(1, '#2b1709');

  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 18, 100, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#e0a957';
  ctx.stroke();

  ctx.restore();
}

// Liquid Texture, Color Gradients, Vortex, Froth & Bubbling
function drawCauldronLiquid(cx, cy, dt) {
  if (!gameState.cauldron.solvent) return;

  ctx.save();

  // Liquid Color determination
  let baseColor = '#2980b9';
  let glowColor = '#74b9ff';
  let foamColor = '#dfe6e9';

  if (gameState.cauldron.state === 'ruined') {
    baseColor = '#2d3436';
    glowColor = '#636e72';
    foamColor = '#7f8c8d';
  } else if (gameState.cauldron.ingredients.length > 0) {
    const hasChili = gameState.cauldron.ingredients.includes('chili_wart');
    const hasDragon = gameState.cauldron.ingredients.includes('dragon_scale');
    const hasFlux = gameState.cauldron.ingredients.includes('fluxweed');
    const hasWormwood = gameState.cauldron.ingredients.includes('wormwood');
    const hasAshwinder = gameState.cauldron.ingredients.includes('ashwinder_egg');
    const hasWiggen = gameState.cauldron.ingredients.includes('wiggentree_bark');

    if (hasAshwinder) {
      baseColor = '#d35400'; glowColor = '#ffe066'; foamColor = '#fff3cd';
    } else if (hasWormwood) {
      baseColor = '#6c2c8f'; glowColor = '#c471ed'; foamColor = '#f3d9fa';
    } else if (hasFlux) {
      baseColor = '#1e824c'; glowColor = '#a8e063'; foamColor = '#d4edda';
    } else if (hasChili || hasDragon) {
      baseColor = '#962d00'; glowColor = '#ff7675'; foamColor = '#f8d7da';
    } else if (hasWiggen) {
      baseColor = '#008b70'; glowColor = '#55efc4'; foamColor = '#e6fffa';
    } else {
      baseColor = '#c0392b'; glowColor = '#fdcb6e'; foamColor = '#fff3cd';
    }
  }

  // Clip liquid strictly inside the inner rim
  ctx.beginPath();
  ctx.ellipse(cx, cy - 18, 90, 22, 0, 0, Math.PI * 2);
  ctx.clip();

  // Deep Glossy Liquid Fill
  liquidWavePhase += dt * 3.5;
  const liqGrad = ctx.createRadialGradient(cx, cy - 18, 6, cx, cy - 18, 92);
  liqGrad.addColorStop(0, glowColor);
  liqGrad.addColorStop(0.5, baseColor);
  liqGrad.addColorStop(1, '#050c18');

  ctx.fillStyle = liqGrad;
  ctx.fill();

  // Swirling Vortex Rings & Currents
  stirVortexVelocity *= 0.97;
  stirVortexAngle += (1.0 + stirVortexVelocity) * dt * 3.5;

  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1.8;
  for (let r = 16; r < 80; r += 14) {
    ctx.save();
    ctx.translate(cx, cy - 18);
    ctx.rotate(stirVortexAngle * (r % 2 === 0 ? 1 : -1));
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.25, 0, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();
  }

  // Dynamic Wave Ripples on Liquid Surface
  for (let i = splashRipples.length - 1; i >= 0; i--) {
    const rip = splashRipples[i];
    rip.radius += dt * 45;
    rip.opacity -= dt * 1.2;

    if (rip.opacity <= 0) {
      splashRipples.splice(i, 1);
      continue;
    }

    ctx.strokeStyle = `rgba(255, 255, 255, ${rip.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 18, rip.radius, rip.radius * 0.24, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Boiling Bubbles (Dense, Varied, Popping)
  if (gameState.cauldron.isBoiling) {
    const spawnRate = gameState.cauldron.heat === 'high' ? 0.75 : (gameState.cauldron.heat === 'med' ? 0.5 : 0.25);
    if (Math.random() < spawnRate) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 140,
        y: cy - 18 + (Math.random() - 0.5) * 24,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.random() * 3.5 - 2,
        radius: Math.random() * 6 + 2.5,
        color: foamColor,
        glow: glowColor,
        life: 1,
        type: 'bubble'
      });
    }

    // Froth Foam Edge around Rim
    ctx.strokeStyle = foamColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 18, 88 + Math.sin(liquidWavePhase) * 1.5, 21, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Steaming Mist Clouds rising from cauldron
    if (Math.random() < 0.3) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: cy - 22,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3.2 - 1.5,
        radius: Math.random() * 12 + 8,
        color: glowColor,
        life: 1,
        type: 'steam'
      });
    }

    // Magic Sparkle Stars floating upwards
    if (Math.random() < 0.2) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 100,
        y: cy - 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2.5 - 1.5,
        radius: Math.random() * 3 + 1.5,
        color: '#ffffff',
        life: 1,
        type: 'sparkle'
      });
    }
  }

  ctx.restore();
}

function updateAndDrawParticles(dt, cx, cy) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.type === 'steam' || p.type === 'smoke') {
      p.radius += dt * 8; // expand as it rises
      p.life -= dt * 0.9;
    } else if (p.type === 'bubble') {
      p.radius *= 1.01;
      p.life -= dt * 1.8;
    } else {
      p.life -= dt * 1.4;
    }

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);

    if (p.type === 'bubble') {
      // Draw 3D glossy bubble with highlight
      ctx.fillStyle = p.glow || p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Specular glare
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'sparkle') {
      // 4-point star sparkle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ember') {
      // Fire ember glowing
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // General particle / steam / smoke
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Cinematic Bottling Stream Draw
function drawBottlingStream(cx, cy, dt) {
  const bottleX = cx + 135;
  const bottleY = cy - 20;

  ctx.save();

  // 1. Draw Target Glass Phial / Flask
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.strokeStyle = '#f4c430';
  ctx.lineWidth = 2;

  // Glass Flask Body
  ctx.beginPath();
  ctx.moveTo(bottleX - 12, bottleY - 35);
  ctx.lineTo(bottleX + 12, bottleY - 35);
  ctx.lineTo(bottleX + 12, bottleY - 15);
  ctx.lineTo(bottleX + 28, bottleY + 35);
  ctx.lineTo(bottleX - 28, bottleY + 35);
  ctx.lineTo(bottleX - 12, bottleY - 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Liquid stream curving from cauldron to flask
  ctx.beginPath();
  ctx.moveTo(cx, cy - 20);
  ctx.quadraticCurveTo(cx + 60, cy - 85, bottleX, bottleY - 25);
  ctx.strokeStyle = bottlingAnimation.recipe.liquidColor;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Glowing core
  ctx.beginPath();
  ctx.moveTo(cx, cy - 20);
  ctx.quadraticCurveTo(cx + 60, cy - 85, bottleX, bottleY - 25);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3. Liquid level rising in flask
  ctx.fillStyle = bottlingAnimation.recipe.liquidColor;
  ctx.beginPath();
  ctx.moveTo(bottleX - 22, bottleY + 33);
  ctx.lineTo(bottleX + 22, bottleY + 33);
  ctx.lineTo(bottleX + 16, bottleY + 5);
  ctx.lineTo(bottleX - 16, bottleY + 5);
  ctx.closePath();
  ctx.fill();

  // Floating sparkle stars
  ctx.fillStyle = bottlingAnimation.recipe.particleColor;
  ctx.beginPath();
  ctx.arc(bottleX + (Math.random() - 0.5) * 20, bottleY + (Math.random() - 0.5) * 30, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// --- 14. FLOATING FEEDBACK TEXT, TOAST NOTIFICATIONS & POPUP MODALS ---
function showFloatingText(targetEl, text, color = '#f4c430') {
  if (!targetEl) return;
  const el = document.createElement('div');
  el.className = 'floating-effect';
  el.textContent = text;
  el.style.color = color;

  const rect = targetEl.getBoundingClientRect();
  el.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px`;
  el.style.top = `${rect.top + rect.height / 2}px`;

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

// Mini Non-Intrusive Bottom-Left Toast
function showToast(title, desc, type = 'warning', icon = '⏳') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const card = document.createElement('div');
  card.className = `toast-card toast-${type}`;
  card.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
  `;

  container.appendChild(card);
  requestAnimationFrame(() => card.classList.add('show'));

  setTimeout(() => {
    card.classList.remove('show');
    setTimeout(() => card.remove(), 350);
  }, 4200);
}

function showOutcomeBanner(title, desc, isSuccess) {
  const pop = document.getElementById('outcomePopup');
  const titleEl = document.getElementById('outcomeTitle');
  const descEl = document.getElementById('outcomeDesc');

  pop.className = isSuccess ? 'success show' : 'failed show';
  titleEl.textContent = title;
  descEl.textContent = desc;

  setTimeout(() => {
    pop.classList.remove('show');
  }, 3200);
}

