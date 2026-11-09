// 如果你看到这段文字了，你懂我什么意思吧。
'use strict';

/* ============================================================
   配置：平时改内容只需要动这里
   ============================================================ */

const CONFIG = {
  // 生日（YYYY-MM-DD），用来自动计算年龄；留空则不显示年龄
  birthday: '2003-01-01',

  // 首页大标题，随机显示一条（<br> 表示换行）
  slogans: [
    '希望能成为<br>有趣的人！',
    '给时光以生命，<br>给岁月以文明。',
    '你好，<br>请多指教！',
    '当你在凝视着网页的时候，<br>网页也正在凝视着你。',
    '平凡的日常<br>正奇迹的发生着',
    'さあ、<br>ゲームを始めよう',
    '敬畏之心！',
    '赞美之心！',
    '我很好奇！',
    '*舒缓的现代音乐*',
  ],

  // 你都来这里翻代码看所有标签了，看来是真爱。
  tags: [
    // 定义
    'INFP-T', '中性（各种意义上的）', '混乱善良',
    // 生活
    '熬夜大赛季军', '躺平爱好者', '一般通过路人', '怪话Po主',
    // 动画 & 游戏
    '一般东方Project关注者',
    // 技术
    'Adobe 用户', 'VSCode 用户', 'SublimeText as Notepad 用户',
    '在该用 Linux 的时候使用 Linux', 'Windows 用户', 'macOS 用户',
    // 职业
    '业余偷懒设计师', '愿望是每种工作都能尝试做一周',
    // 文化
    '二次元（？）', '在亚文化海洋一边游泳一边喝水', '多元思维推崇者',
    '自我意识过剩', '批判的新自由主义', '非二元', '非对立', '爱与和平', '爱好和平',
    '反向思维', '什么类型都可以吃一点',
    // 设备 & 工具
    '可口可乐红队', '麦当劳而非KFC', 'ITX主机用户',
    '米粉', '对Apple理念持负面评价的Apple用户', '微软大法好',
    '垃圾佬', '二手爱好者', '洋垃圾爱好者', '魔改硬件爱好者',
    // 短句
    '你记住我了吗，当你试着多roll几个标签的时候，我就赢了',
    '刚刚走神了，这个不算，再roll一个',
    '你很幸运，roll到了这个毫无意义的标签，请再roll一个',
  ],

  // 友链：{ name, url, avatar, desc }，avatar 可以是 ./assets/img/ 下的文件或外链
  friends: [
    // { name: '名字', url: 'https://example.com/', avatar: './assets/img/friend.jpg', desc: '一句话介绍' },
  ],
};

/* ============================================================
   工具函数
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   年龄
   ============================================================ */

function renderAge() {
  const el = $('#age');
  if (!el || !CONFIG.birthday) return;
  const [y, m, d] = CONFIG.birthday.split('-').map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  if (age > 0) el.textContent = `，${age}岁`;
}

/* ============================================================
   标语
   ============================================================ */

function renderSlogan() {
  $('#slogan').innerHTML = pick(CONFIG.slogans);
}

/* ============================================================
   Roll 标签：越转越慢，最后停在一个标签上
   ============================================================ */

let rolling = false;
let lastTag = null;

function showTag(box) {
  let tag;
  do { tag = pick(CONFIG.tags); } while (tag === lastTag && CONFIG.tags.length > 1);
  lastTag = tag;

  box.querySelectorAll('span:not(.leaving)').forEach((old) => {
    old.classList.add('leaving');
    old.addEventListener('animationend', () => old.remove(), { once: true });
    setTimeout(() => old.remove(), 200); // 兜底
  });

  const span = document.createElement('span');
  span.textContent = tag;
  box.append(span);
}

async function rollTag() {
  if (rolling) return;
  rolling = true;
  const box = $('#roll-tag');
  box.hidden = false;

  if (reduceMotion) {
    showTag(box);
  } else {
    // [间隔 ms, 持续 ms]
    const stages = [[20, 400], [40, 400], [80, 400], [140, 400], [240, 240]];
    for (const [interval, duration] of stages) {
      for (let t = 0; t < duration; t += interval) {
        showTag(box);
        await sleep(interval);
      }
    }
  }
  rolling = false;
}

/* ============================================================
   友链
   ============================================================ */

function renderFriends() {
  const list = $('#friends-list');
  const friends = CONFIG.friends;

  $('#friends-empty').hidden = friends.length > 0;
  list.hidden = friends.length === 0;

  for (const f of friends) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'friend';
    a.href = f.url;
    a.target = '_blank';
    a.rel = 'noopener';

    const img = document.createElement('img');
    img.src = f.avatar || './assets/img/avatar.jpg';
    img.alt = '';
    img.loading = 'lazy';

    const info = document.createElement('span');
    info.className = 'info';
    const name = document.createElement('strong');
    name.textContent = f.name;
    const desc = document.createElement('small');
    desc.textContent = f.desc || '';
    info.append(name, desc);

    a.append(img, info);
    li.append(a);
    list.append(li);
  }

  const btn = $('#friends-btn');
  const panel = $('#friends');
  btn.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    btn.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  });
}

/* ============================================================
   背景星轨
   以屏幕右上角为圆心，不断旋转一张预先画好的星空图，
   并周期性地叠一层半透明黑色，形成拖尾的星轨效果。
   ============================================================ */

function startTrack() {
  const canvas = $('#startrack');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const STAR_COUNT = 5000;
  const MAX_CACHE = 4096;                // 缓存画布边长上限，避免大屏占用过多显存
  const SPEED = 0.025 * Math.PI / 180;   // 每帧旋转角度
  const FADE_AFTER = 400;                // 多少帧之后开始淡化拖尾

  const cache = document.createElement('canvas');
  const cctx = cache.getContext('2d');

  let w, h, longSide, drawSize, frame, rafId = null;

  function setup() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    longSide = Math.max(w, h);

    // 星空图需要覆盖以右上角为圆心、半径为屏幕对角线的圆
    drawSize = Math.ceil(longSide * 2.6);
    const size = Math.min(drawSize, MAX_CACHE);
    const scale = drawSize / size;
    cache.width = cache.height = size;

    cctx.clearRect(0, 0, size, size);
    const r = Math.max(0.6, 1.2 / scale);
    for (let i = 0; i < STAR_COUNT; i++) {
      cctx.beginPath();
      cctx.arc(randInt(0, size), randInt(0, size), r, 0, Math.PI * 2);
      cctx.fillStyle = `rgba(${randInt(120, 255)},${randInt(120, 255)},${randInt(120, 255)},${randInt(30, 100) / 100})`;
      cctx.fill();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, 0, w, h);
    ctx.translate(w, 0);
    frame = 0;
  }

  function draw() {
    ctx.drawImage(cache, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  }

  function tick() {
    draw();
    frame++;
    if (frame > FADE_AFTER && frame % 8 === 0) {
      ctx.fillStyle = 'rgba(0,0,0,.04)';
      ctx.fillRect(-longSide * 3, -longSide * 3, longSide * 6, longSide * 6);
    }
    ctx.rotate(SPEED);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(rafId);
    setup();
    if (reduceMotion) draw();
    else tick();
  }

  start();

  // 宽度变化时重建；手机滚动时地址栏伸缩只改变高度，忽略以免星轨被清空
  let lastWidth = canvas.offsetWidth;
  let timer = null;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (canvas.offsetWidth === lastWidth) return;
      lastWidth = canvas.offsetWidth;
      start();
    }, 250);
  });
}

/* ============================================================
   启动
   ============================================================ */

renderSlogan();
renderAge();
renderFriends();
$('#roll-btn').addEventListener('click', rollTag);
startTrack();

console.log("OriyukiAkari's Akari.Fun Homepage");
