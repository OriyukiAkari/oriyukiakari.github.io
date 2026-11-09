// 如果你看到这段文字了，你懂我什么意思吧。
window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();

$(function(){

  var c = document.getElementById('startrack');
  if (!c || !c.getContext) return;
  var ctx = c.getContext('2d');
  var cf = document.createElement("canvas");
  var cftx = cf.getContext('2d');

  // 缓存画布的像素上限：原来是长边 × 2.6，4K 屏上会到 1 万像素见方（几百 MB 显存），
  // 移动端 Safari 直接画不出来。超过上限就缩小绘制、放大贴图。
  var MAX_CACHE = 4096;
  var STAR_COUNT = 5000; // 原来 20000 颗里有 3/4 落在画布外，实际可见的约 5000 颗
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cw, ch, longside, cacheSize, cacheScale, drawTimes;

  function rand(Min,Max){
    return Min + Math.round(Math.random() * (Max - Min));
  }

  function randomColor(){
    return "rgba("+rand(120,255)+","+rand(120,255)+","+rand(120,255)+","+rand(30,100)/100+")";
  }

  function setup(){
    c.width = cw = c.offsetWidth;
    c.height = ch = c.offsetHeight;
    longside = Math.max(cw, ch);

    var logical = Math.ceil(longside * 2.6);
    cacheSize = Math.min(logical, MAX_CACHE);
    cacheScale = logical / cacheSize; // 贴图时的放大倍数
    cf.width = cf.height = cacheSize;

    // 预先把星星画到缓存画布上
    cftx.clearRect(0, 0, cacheSize, cacheSize);
    var size = Math.max(0.6, 1.2 / cacheScale);
    for (var i = 0; i < STAR_COUNT; i++) {
      cftx.beginPath();
      cftx.arc(rand(0, cacheSize), rand(0, cacheSize), size, 0, Math.PI*2, true);
      cftx.fillStyle = randomColor();
      cftx.fill();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(21,21,21,1)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.lineCap = 'round';
    ctx.translate(cw, 0); // 以右上角为旋转中心
    drawTimes = 0;
  }

  function drawfromCache(){
    var d = cacheSize * cacheScale;
    ctx.drawImage(cf, -d/2, -d/2, d, d);
  }

  function loop(){
    drawfromCache();
    drawTimes++;
    if (drawTimes > 400 && drawTimes % 8 == 0) {
      ctx.fillStyle = 'rgba(0,0,0,.04)';
      ctx.fillRect(-(longside*3), -(longside*3), longside*6, longside*6);
    }
    ctx.rotate(0.025 * Math.PI / 180);
  }

  function fireAnimate() {
    loop();
    requestAnimFrame(fireAnimate);
  }

  setup();
  if (reduceMotion) {
    drawfromCache(); // 用户偏好减少动画时只画一帧静态星空
  } else {
    fireAnimate();
  }

  // 窗口尺寸变化后重建画布，避免星空被拉伸
  var resizeTimer = null, lastW = cw;
  $(window).on('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      // 手机滚动时地址栏伸缩只改高度，忽略，免得星轨被清空
      if (c.offsetWidth === lastW && Math.abs(c.offsetHeight - ch) < 200) return;
      lastW = c.offsetWidth;
      setup();
      if (reduceMotion) drawfromCache();
    }, 250);
  });

})


function getMsg(){
	var slogan = [
	  "希望能成为<br>有趣的人！",
    "给时光以生命，<br>给岁月以文明。",
    "你好，<br>请多指教！",
    "当你在凝视着网页的时候，<br>网页也正在凝视着你。",
    "平凡的日常<br>正奇迹的发生着",
    "さあ、<br>ゲームを始めよう",
    "敬畏之心！",
    "赞美之心！",
    "我很好奇！",
    "*舒缓的现代音乐*",
  ];
	var r = random(0,slogan.length-1);
	$("#slogan").html(slogan[r])
}

// 你都来这里翻代码看所有标签了，看来是真爱。
var tags = [
  // 定义
  'INFP-T', '中性（各种意义上的）', '混乱善良',
  // 生活
  '熬夜大赛季军', '躺平爱好者', '一般通过路人', '怪话Po主', 
  // 动画 & 游戏
  '一般东方Project关注者', 
  // 技术
  'Adobe 用户', 'VSCode 用户', 'SublimeText as Notepad 用户', 
  '在该用 Linux 的时候使用 Linux','Windows 用户','macOS 用户',
  // 职业
  '业余偷懒设计师', '愿望是每种工作都能尝试做一周',
  // 文化
  '二次元（？）', '在亚文化海洋一边游泳一边喝水','多元思维推崇者',
  '自我意识过剩', '批判的新自由主义', '非二元', '非对立', '爱与和平', '爱好和平',
  '反向思维', '什么类型都可以吃一点',
  // 设备&工具
  '可口可乐红队', '麦当劳而非KFC', 'ITX主机用户',
  '米粉', '对Apple理念持负面评价的Apple用户', '微软大法好',
  '垃圾佬', '二手爱好者', '洋垃圾爱好者', '魔改硬件爱好者',
  // 短句
  '你记住我了吗，当你试着多roll几个标签的时候，我就赢了',
  '刚刚走神了，这个不算，再roll一个',
  '你很幸运，roll到了这个毫无意义的标签，请再roll一个',
];

let rollTimer = null;

function random(Min,Max){
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range);
      return num;
}

$(function(){
  getMsg();
  console.log('OriyukiAkari\'s Akari.Fun Homepage');
})

function rollATag() {
  $(".roll-tag").addClass('active');
  let el = $(".roll-tag span.ready")
  el.addClass('removing');
  setTimeout(() => {
    el.remove();
  }, 100)
  var span = $("<span></span>").text(getRandomTag());
  $(".roll-tag").append(span);
  setTimeout(() => {
    span.addClass('ready');
  }, 100)
}

function rollOnce() {
  clearInterval(rollTimer)
    rollTimer = setInterval(rollATag, 20)
  setTimeout(function() {
    clearInterval(rollTimer)
    rollTimer = setInterval(rollATag, 40)
  }, 400)
  setTimeout(function() {
    clearInterval(rollTimer)
    rollTimer = setInterval(rollATag, 80)
  }, 800)
  setTimeout(function() {
    clearInterval(rollTimer)
    rollTimer = setInterval(rollATag, 140)
  }, 1200)
  setTimeout(function() {
    clearInterval(rollTimer)
    rollTimer = setInterval(rollATag, 240)
  }, 1600)
  setTimeout(function() {
    clearInterval(rollTimer)
    rollTimer = null
  }, 1800)
}

function getRandomTag() {
  return tags[random(0, tags.length-1)];
}

function nav (page){
  switch (page) {
    case 'friends':
      $(".gate-friends").toggle();
      break;
  
    default:
      break;
  }
}