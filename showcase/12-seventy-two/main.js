// SEVENTY-TWO — the almanac knows where you are standing.
// Dates follow the commonly published modern almanac (they drift ±1 day by year).
const KO = [
  // 立春 Risshun — Beginning of spring
  ['02-04','東風解凍','Harukaze kōri o toku','East wind melts the ice','立春','Risshun','Beginning of spring',0],
  ['02-09','黄鶯睍睆','Kōō kenkan su','Bush warblers start singing in the hills','立春','Risshun','Beginning of spring',0],
  ['02-14','魚上氷','Uo kōri o izuru','Fish emerge from the ice','立春','Risshun','Beginning of spring',0],
  // 雨水 Usui — Rainwater
  ['02-19','土脉潤起','Tsuchi no shō uruoi okoru','Rain moistens the soil','雨水','Usui','Rainwater',0],
  ['02-24','霞始靆','Kasumi hajimete tanabiku','Mist starts to linger','雨水','Usui','Rainwater',0],
  ['03-01','草木萌動','Sōmoku mebae izuru','Grass sprouts, trees bud','雨水','Usui','Rainwater',0],
  // 啓蟄 Keichitsu — Insects awaken
  ['03-06','蟄虫啓戸','Sugomori mushi to o hiraku','Hibernating insects open their doors','啓蟄','Keichitsu','Insects awaken',0],
  ['03-11','桃始笑','Momo hajimete saku','First peach blossoms — the trees “smile”','啓蟄','Keichitsu','Insects awaken',0],
  ['03-16','菜虫化蝶','Namushi chō to naru','Caterpillars become butterflies','啓蟄','Keichitsu','Insects awaken',0],
  // 春分 Shunbun — Spring equinox
  ['03-21','雀始巣','Suzume hajimete sukū','Sparrows start to nest','春分','Shunbun','Spring equinox',0],
  ['03-26','櫻始開','Sakura hajimete saku','First cherry blossoms open','春分','Shunbun','Spring equinox',0],
  ['03-31','雷乃発声','Kaminari sunawachi koe o hassu','Distant thunder finds its voice','春分','Shunbun','Spring equinox',0],
  // 清明 Seimei — Pure and clear
  ['04-05','玄鳥至','Tsubame kitaru','Swallows return','清明','Seimei','Pure and clear',0],
  ['04-10','鴻雁北','Kōgan kaeru','Wild geese fly north','清明','Seimei','Pure and clear',0],
  ['04-15','虹始見','Niji hajimete arawaru','First rainbow of the year','清明','Seimei','Pure and clear',0],
  // 穀雨 Kokuu — Grain rain
  ['04-20','葭始生','Ashi hajimete shōzu','Reeds begin to sprout','穀雨','Kokuu','Grain rain',0],
  ['04-25','霜止出苗','Shimo yamite nae izuru','Last frost; rice seedlings grow','穀雨','Kokuu','Grain rain',0],
  ['04-30','牡丹華','Botan hana saku','Peonies bloom','穀雨','Kokuu','Grain rain',0],
  // 立夏 Rikka — Beginning of summer
  ['05-05','蛙始鳴','Kawazu hajimete naku','Frogs start singing','立夏','Rikka','Beginning of summer',1],
  ['05-10','蚯蚓出','Mimizu izuru','Earthworms surface','立夏','Rikka','Beginning of summer',1],
  ['05-15','竹笋生','Takenoko shōzu','Bamboo shoots appear','立夏','Rikka','Beginning of summer',1],
  // 小満 Shōman — Lesser ripening
  ['05-21','蚕起食桑','Kaiko okite kuwa o hamu','Silkworms wake and feast on mulberry','小満','Shōman','Lesser ripening',1],
  ['05-26','紅花栄','Benibana sakau','Safflowers flourish','小満','Shōman','Lesser ripening',1],
  ['05-31','麦秋至','Mugi no toki itaru','Wheat ripens — its own small autumn','小満','Shōman','Lesser ripening',1],
  // 芒種 Bōshu — Grain in ear
  ['06-06','螳螂生','Kamakiri shōzu','Praying mantises hatch','芒種','Bōshu','Grain in ear',1],
  ['06-11','腐草為螢','Kusaretaru kusa hotaru to naru','Rotten grass becomes fireflies','芒種','Bōshu','Grain in ear',1],
  ['06-16','梅子黄','Ume no mi kibamu','Plums turn yellow','芒種','Bōshu','Grain in ear',1],
  // 夏至 Geshi — Summer solstice
  ['06-21','乃東枯','Natsukarekusa karuru','The self-heal herb withers','夏至','Geshi','Summer solstice',1],
  ['06-26','菖蒲華','Ayame hana saku','Irises bloom','夏至','Geshi','Summer solstice',1],
  ['07-01','半夏生','Hange shōzu','The crow-dipper sprouts','夏至','Geshi','Summer solstice',1],
  // 小暑 Shōsho — Lesser heat
  ['07-07','温風至','Atsukaze itaru','Warm winds arrive','小暑','Shōsho','Lesser heat',1],
  ['07-12','蓮始開','Hasu hajimete hiraku','First lotus blossoms open','小暑','Shōsho','Lesser heat',1],
  ['07-17','鷹乃学習','Taka sunawachi waza o narau','Young hawks learn to fly','小暑','Shōsho','Lesser heat',1],
  // 大暑 Taisho — Greater heat
  ['07-23','桐始結花','Kiri hajimete hana o musubu','Paulownia trees set their seeds','大暑','Taisho','Greater heat',1],
  ['07-28','土潤溽暑','Tsuchi uruōte mushi atsushi','Earth is damp, air is humid','大暑','Taisho','Greater heat',1],
  ['08-02','大雨時行','Taiu tokidoki furu','Great rains sometimes fall','大暑','Taisho','Greater heat',1],
  // 立秋 Risshū — Beginning of autumn
  ['08-08','涼風至','Suzukaze itaru','Cool winds arrive','立秋','Risshū','Beginning of autumn',2],
  ['08-13','寒蝉鳴','Higurashi naku','Evening cicadas sing','立秋','Risshū','Beginning of autumn',2],
  ['08-18','蒙霧升降','Fukaki kiri matō','Thick fog descends','立秋','Risshū','Beginning of autumn',2],
  // 処暑 Shosho — Manageable heat
  ['08-23','綿柎開','Wata no hana shibe hiraku','Cotton bolls open','処暑','Shosho','Heat finally relents',2],
  ['08-28','天地始粛','Tenchi hajimete samushi','Heaven and earth start to cool','処暑','Shosho','Heat finally relents',2],
  ['09-02','禾乃登','Kokumono sunawachi minoru','Rice ripens','処暑','Shosho','Heat finally relents',2],
  // 白露 Hakuro — White dew
  ['09-08','草露白','Kusa no tsuyu shiroshi','Dew glistens white on grass','白露','Hakuro','White dew',2],
  ['09-13','鶺鴒鳴','Sekirei naku','Wagtails sing','白露','Hakuro','White dew',2],
  ['09-18','玄鳥去','Tsubame saru','Swallows leave','白露','Hakuro','White dew',2],
  // 秋分 Shūbun — Autumn equinox
  ['09-23','雷乃収声','Kaminari sunawachi koe o osamu','Thunder lowers its voice','秋分','Shūbun','Autumn equinox',2],
  ['09-28','蟄虫坏戸','Mushi kakurete to o fusagu','Insects seal up their doors','秋分','Shūbun','Autumn equinox',2],
  ['10-03','水始涸','Mizu hajimete karuru','Paddies are drained of water','秋分','Shūbun','Autumn equinox',2],
  // 寒露 Kanro — Cold dew
  ['10-08','鴻雁来','Kōgan kitaru','Wild geese return','寒露','Kanro','Cold dew',2],
  ['10-13','菊花開','Kiku no hana hiraku','Chrysanthemums bloom','寒露','Kanro','Cold dew',2],
  ['10-18','蟋蟀在戸','Kirigirisu to ni ari','Crickets chirp at the door','寒露','Kanro','Cold dew',2],
  // 霜降 Sōkō — Frost falls
  ['10-23','霜始降','Shimo hajimete furu','First frost falls','霜降','Sōkō','Frost falls',2],
  ['10-28','霎時施','Kosame tokidoki furu','Light rains pass through','霜降','Sōkō','Frost falls',2],
  ['11-02','楓蔦黄','Momiji tsuta kibamu','Maples and ivy turn gold','霜降','Sōkō','Frost falls',2],
  // 立冬 Rittō — Beginning of winter
  ['11-07','山茶始開','Tsubaki hajimete hiraku','Camellias begin to bloom','立冬','Rittō','Beginning of winter',3],
  ['11-12','地始凍','Chi hajimete kōru','The ground starts to freeze','立冬','Rittō','Beginning of winter',3],
  ['11-17','金盞香','Kinsenka saku','Daffodils scent the air','立冬','Rittō','Beginning of winter',3],
  // 小雪 Shōsetsu — Lesser snow
  ['11-22','虹蔵不見','Niji kakurete miezu','Rainbows go into hiding','小雪','Shōsetsu','Lesser snow',3],
  ['11-27','朔風払葉','Kitakaze konoha o harau','North wind strips the leaves','小雪','Shōsetsu','Lesser snow',3],
  ['12-02','橘始黄','Tachibana hajimete kibamu','Mandarin oranges turn gold','小雪','Shōsetsu','Lesser snow',3],
  // 大雪 Taisetsu — Greater snow
  ['12-07','閉塞成冬','Sora samuku fuyu to naru','The sky closes; winter is made','大雪','Taisetsu','Greater snow',3],
  ['12-12','熊蟄穴','Kuma ana ni komoru','Bears retire to their dens','大雪','Taisetsu','Greater snow',3],
  ['12-17','鱖魚群','Sake no uo muragaru','Salmon gather and swim upstream','大雪','Taisetsu','Greater snow',3],
  // 冬至 Tōji — Winter solstice
  ['12-22','乃東生','Natsukarekusa shōzu','The self-heal herb sprouts','冬至','Tōji','Winter solstice',3],
  ['12-27','麋角解','Sawashika no tsuno otsuru','Deer shed their antlers','冬至','Tōji','Winter solstice',3],
  ['01-01','雪下出麦','Yuki watarite mugi nobiru','Wheat sprouts under the snow','冬至','Tōji','Winter solstice',3],
  // 小寒 Shōkan — Lesser cold
  ['01-05','芹乃栄','Seri sunawachi sakau','Water dropwort flourishes','小寒','Shōkan','Lesser cold',3],
  ['01-10','水泉動','Shimizu atataka o fukumu','Springs thaw beneath the ice','小寒','Shōkan','Lesser cold',3],
  ['01-15','雉始雊','Kiji hajimete naku','Pheasants start to call','小寒','Shōkan','Lesser cold',3],
  // 大寒 Daikan — Greater cold
  ['01-20','款冬華','Fuki no hana saku','Butterburs put out buds','大寒','Daikan','Greater cold',3],
  ['01-25','水沢腹堅','Sawamizu kōri tsumeru','Mountain streams freeze solid','大寒','Daikan','Greater cold',3],
  ['01-30','鶏始乳','Niwatori hajimete toya ni tsuku','Hens begin laying','大寒','Daikan','Greater cold',3],
];
const SEASON_NOTES = {
  '立春':'the year opens its eyes.', '雨水':'snow remembers how to be rain.',
  '啓蟄':'everything underground changes its mind.', '春分':'day and night shake hands.',
  '清明':'the air is rinsed clean.', '穀雨':'rain learns agriculture.',
  '立夏':'the light turns confident.', '小満':'everything is almost enough.',
  '芒種':'the planting cannot wait.', '夏至':'the longest light.',
  '小暑':'the year leans into summer.', '大暑':'the air holds its breath.',
  '立秋':'autumn arrives on paper first.', '処暑':'the heat signs its resignation.',
  '白露':'mornings turn silver.', '秋分':'the year balances, briefly.',
  '寒露':'the dew gets serious.', '霜降':'the first white warnings.',
  '立冬':'winter states its intention.', '小雪':'the sky rehearses.',
  '大雪':'the rehearsals end.', '冬至':'the deepest dark, and the turn.',
  '小寒':'cold with a waiting list.', '大寒':'the coldest name of the year.'
};
const PALETTES = [
  {accent:'#C4707F', ink:'#2A2320', wash:'#F7F0E9'},  // spring
  {accent:'#39796B', ink:'#1F2622', wash:'#F2F4EA'},  // summer
  {accent:'#BC6B2E', ink:'#2A211A', wash:'#F7EFE2'},  // autumn
  {accent:'#5B7A99', ink:'#20242B', wash:'#F0F2F4'},  // winter
];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- date logic ---------- */
const MS_DAY = 864e5;
function koDate(md, refYear) { // date of a MM-DD in almanac order starting Feb 4 refYear
  const [m, d] = md.split('-').map(Number);
  const y = (m === 1) ? refYear + 1 : refYear;  // Jan entries belong to the following calendar year
  return new Date(y, m - 1, d);
}
function currentIndex(now = new Date()) {
  // almanac year starts Feb 4
  let refYear = now.getFullYear();
  if (now < new Date(refYear, 1, 4)) refYear -= 1;
  let idx = 0;
  for (let i = 0; i < KO.length; i++) {
    if (now >= koDate(KO[i][0], refYear) - 0) idx = i; else break;
  }
  return {idx, refYear};
}
function rangeText(i, refYear) {
  const a = koDate(KO[i][0], refYear);
  const b = new Date(koDate(KO[(i + 1) % KO.length][0], refYear) - MS_DAY);
  if (b < a) b.setFullYear(b.getFullYear() + 1);
  const f = d => d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase();
  return `${f(a)} — ${f(b)}`;
}

/* ---------- render ---------- */
const $ = id => document.getElementById(id);
const {idx: TODAY_IDX, refYear} = currentIndex();
let shown = TODAY_IDX;

function setPalette(seasonI) {
  const p = PALETTES[seasonI];
  const r = document.documentElement.style;
  r.setProperty('--accent', p.accent);
  r.setProperty('--ink', p.ink);
  r.setProperty('--wash', p.wash);
}
function show(i, animate = true) {
  shown = i;
  const [md, jp, romaji, en, sekki, sekkiRo, sekkiEn, seasonI] = KO[i];
  setPalette(seasonI);
  $('nowIdx').textContent = `第${String(i + 1).padStart(2, '0')}候 · ${i + 1} OF 72`;
  $('nowJp').textContent = jp;
  $('nowRomaji').textContent = romaji;
  $('nowEn').textContent = en;
  $('nowDates').textContent = rangeText(i, refYear);
  $('nowSekki').innerHTML =
    `<span lang="ja">${sekki}</span> ${sekkiRo} · “${sekkiEn}” — ${SEASON_NOTES[sekki] || ''}`;
  $('todayBtn').hidden = i === TODAY_IDX;
  document.querySelectorAll('.card').forEach((c, k) => {
    c.classList.toggle('is-now', k === TODAY_IDX);
    c.classList.toggle('is-shown', k === i);
  });
  if (animate && !reduced) {
    const f = $('nowJp');
    [$('nowJp'), $('nowEn'), $('nowRomaji')].forEach((el, k) => {
      el.animate(
        [{filter: 'blur(8px)', opacity: 0}, {filter: 'blur(0px)', opacity: 1}],
        {duration: 700 + k * 150, easing: 'ease-out'}
      );
    });
  }
}

/* the river */
const river = $('river');
KO.forEach((k, i) => {
  const [md, jp, romaji, en, sekki, , , seasonI] = k;
  const el = document.createElement('button');
  el.className = 'card';
  el.type = 'button';
  el.style.setProperty('--c', PALETTES[seasonI].accent);
  el.innerHTML = `
    <span class="c-no">${String(i + 1).padStart(2, '0')}</span>
    <span class="c-jp" lang="ja">${jp}</span>
    <span class="c-en">${en}</span>`;
  el.setAttribute('aria-label', `Season ${i + 1}: ${en}`);
  el.addEventListener('click', () => {
    show(i);
    document.querySelector('.now').scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'center'});
  });
  river.appendChild(el);
});
$('todayBtn').addEventListener('click', () => show(TODAY_IDX));
show(TODAY_IDX, false);
// scroll the river to today
requestAnimationFrame(() => {
  const nowCard = river.children[TODAY_IDX];
  if (nowCard) river.scrollLeft = nowCard.offsetLeft - river.clientWidth / 2 + 70;
});

/* ---------- seasonal drift particles ---------- */
const cv = $('drift'), cx = cv.getContext('2d');
let W, H;
const rs = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
rs(); addEventListener('resize', rs);
const P = Array.from({length: 26}, () => ({
  x: Math.random(), y: Math.random(), r: 2 + Math.random() * 3.6,
  vx: .00004 + Math.random() * .00012, vy: .00005 + Math.random() * .00016,
  ph: Math.random() * 7
}));
(function drift(t) {
  requestAnimationFrame(drift);
  if (document.hidden) return;
  cx.clearRect(0, 0, W, H);
  const seasonI = KO[shown][7];
  cx.fillStyle = PALETTES[seasonI].accent + '55';
  P.forEach(p => {
    if (!reduced) {
      p.y += p.vy * 16; p.x += Math.sin(t / 3000 + p.ph) * .0004 + p.vx;
      if (p.y > 1.03) { p.y = -.03; p.x = Math.random(); }
      if (p.x > 1.03) p.x = -.03;
    }
    cx.beginPath();
    if (seasonI === 3) { cx.arc(p.x * W, p.y * H, p.r * .7, 0, 7); } // snow
    else { cx.ellipse(p.x * W, p.y * H, p.r, p.r * .62, p.ph + t / 2500, 0, 7); } // petals/leaves
    cx.fill();
  });
})(0);
