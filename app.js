const cfg = window.BIRTHDAY;
const q = new URLSearchParams(location.search);
cfg.to = q.get('to')?.trim() || cfg.to;
cfg.from = q.get('from')?.trim() || cfg.from;

const $ = (s) => document.querySelector(s);
const total = cfg.prizes.reduce((s, p) => s + (p.count ?? 1), 0);
const fill = (s = '') => s.replaceAll('{to}', cfg.to).replaceAll('{from}', cfg.from).replaceAll('{total}', total);
// URL 값이 들어가므로 innerHTML 금지, textContent만 사용
const setText = (sel, text) => document.querySelectorAll(sel).forEach((el) => (el.textContent = text));

document.title = fill(cfg.pageTitle);
setText('[data-to]', cfg.to);
setText('[data-from]', cfg.from);
setText('#letter', fill(cfg.letter));

/* ---------- 폭죽 ---------- */
const PARTY = ['🎉', '🎊', '💖', '⭐', '🎈', '✨', '🩷'];
function confetti(n = 40, emojis = PARTY) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span');
    el.className = 'confetti';
    el.textContent = emojis[(Math.random() * emojis.length) | 0];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 16 + Math.random() * 20 + 'px';
    el.style.animationDuration = 2 + Math.random() * 2 + 's';
    el.style.animationDelay = Math.random() * 0.4 + 's';
    el.addEventListener('animationend', () => el.remove());
    document.body.append(el);
  }
}

/* ---------- 하트·별 폭죽 (canvas) ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx = $('#fx');
const ctx = fx.getContext('2d');
const COLORS = ['#FF7EB3', '#E8558F', '#F2C14E', '#C8A8F0', '#A8E6D4', '#FFD9E8'];
let parts = [];
let raf = 0;
function sizeFx() {
  const d = Math.min(devicePixelRatio || 1, 2);
  fx.width = innerWidth * d;
  fx.height = innerHeight * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
}
addEventListener('resize', sizeFx);
sizeFx();

function shape(p) {
  const r = p.r;
  ctx.beginPath();
  if (p.kind === 0) {
    ctx.moveTo(0, r * 0.3);
    ctx.bezierCurveTo(-r, -r * 0.3, -r * 0.45, -r, 0, -r * 0.45);
    ctx.bezierCurveTo(r * 0.45, -r, r, -r * 0.3, 0, r * 0.3);
  } else if (p.kind === 1) {
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const len = i % 2 ? r * 0.42 : r;
      ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
    }
  } else {
    ctx.rect(-r / 2, -r / 5, r, r / 2.5);
  }
  ctx.fill();
}
function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += 0.15;
    p.vx *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life--;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.min(1, p.life / 40);
    ctx.fillStyle = p.c;
    shape(p);
    ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}
function burst(x, y, n = 80) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 3 + Math.random() * 7;
    parts.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4,
      r: 5 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[i % COLORS.length], kind: i % 3, life: 150 + Math.random() * 60,
    });
  }
  parts = parts.slice(-700); // 저사양 폰 보호
  raf ||= requestAnimationFrame(tick);
}
function bigParty() {
  burst(innerWidth * 0.2, innerHeight * 0.5);
  setTimeout(() => burst(innerWidth * 0.8, innerHeight * 0.5), 180);
  setTimeout(() => burst(innerWidth * 0.5, innerHeight * 0.3, 120), 360);
}

/* ---------- 선물 상자 인트로 ---------- */
// 흔들림 → 빛 폭발(화이트아웃) → 축하 스테이지 → 본문 + 폭죽
const intro = $('#intro');
const stage = $('#stage');
const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
let opened = false;
history.scrollRestoration = 'manual'; // 새로고침해도 이전 스크롤 위치로 안 돌아가게

[...`HAPPY BIRTHDAY`].forEach((ch, i) => {
  const s = document.createElement('span');
  s.textContent = ch === ' ' ? ' ' : ch;
  s.style.animationDelay = 0.5 + i * 0.06 + 's';
  $('#spell').append(s);
});

async function openGift() {
  if (opened) return;
  opened = true;
  intro.classList.add('shaking');
  await wait(700);
  intro.classList.replace('shaking', 'open');
  await wait(1000);
  intro.remove();
  stage.classList.add('on');
  burst(innerWidth / 2, innerHeight * 0.4, 120);
  await wait(3000);
  stage.classList.add('out');
  document.body.classList.remove('locked');
  scrollTo({ top: 0, behavior: 'instant' }); // html의 smooth 스크롤 무시
  bigParty();
  await wait(700);
  stage.remove();
}
intro.addEventListener('click', openGift);
intro.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && openGift());

/* ---------- 뽑기 ---------- */
const prizes = cfg.prizes.map((p) => ({ ...p, name: fill(p.name) }));
const teasers = prizes.filter((p) => p.tease);
const deck = prizes.flatMap((p) => Array(p.count ?? 1).fill(p));
const badCells = deck.filter((p) => p.bad).length;
$('#odds').textContent = `${deck.length}칸 중 꽝은 딱 ${badCells}칸! 당첨 확률 ${Math.round((1 - badCells / deck.length) * 100)}% 실화?`;

const list = $('#prizeList');
prizes.forEach((p) => {
  const li = document.createElement('li');
  li.textContent = `${p.rank}  ${p.emoji} ${p.name}  ×${p.count ?? 1}`;
  if (p.bad) li.className = 'bad';
  list.append(li);
});

function pickPrize(items, rand = Math.random()) {
  const total = items.reduce((s, p) => s + (p.weight ?? 0), 0);
  let r = rand * total;
  return items.find((p) => (r -= p.weight ?? 0) < 0) ?? items.at(-1);
}

const COLS = 5; // style.css .board 의 grid-template-columns 와 같아야 함
function neighbors(i, n) {
  const col = i % COLS;
  return [col > 0 ? i - 1 : -1, col < COLS - 1 ? i + 1 : -1, i - COLS, i + COLS].filter((j) => j >= 0 && j < n);
}
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

const board = $('#board');
const startBtn = $('#startBtn');
const retryBtn = $('#retryBtn');
const tease = $('#tease');
const tickets = () => [...board.children];
let draws = 0;
let pickedIdx = -1;
let picked = null;

function setFace(t, p) {
  const emoji = document.createElement('span');
  emoji.textContent = p.emoji;
  const rank = document.createElement('small');
  rank.textContent = p.rank;
  t.querySelector('.front').replaceChildren(emoji, rank);
  t.setAttribute('aria-label', `${p.rank} ${p.name}`);
}

// 처음엔 전부 앞면(상품 공개) → 시작하면 뒤집고 섞기
function buildBoard() {
  board.dataset.state = 'preview';
  board.replaceChildren(...shuffle(deck).map((p, i) => {
    const b = document.createElement('button');
    b.className = 'ticket';
    b.innerHTML = '<span class="face front"></span><span class="face back"></span>';
    b.querySelector('.back').textContent = i + 1;
    setFace(b, p);
    b.addEventListener('click', () => draw(b));
    return b;
  }));
  startBtn.hidden = false;
  [retryBtn, letterBtn, tease].forEach((el) => (el.hidden = true));
}

function startGacha() {
  startBtn.hidden = true;
  tickets().forEach((t, i) => {
    t.style.transitionDelay = i * 30 + 'ms';
    t.classList.add('flipped');
    t.setAttribute('aria-label', `${i + 1}번 칸 뽑기`);
  });
  setTimeout(() => {
    tickets().forEach((t) => (t.style.transitionDelay = ''));
    board.dataset.state = 'ready';
  }, 1200);
}

function draw(ticket) {
  if (board.dataset.state !== 'ready') return;
  board.dataset.state = 'done';
  draws++;
  pickedIdx = tickets().indexOf(ticket);
  picked = pickPrize(prizes);
  setFace(ticket, picked);
  ticket.classList.add('picked');
  ticket.classList.remove('flipped');
  setTimeout(() => showResult(picked), 800);
}

// 공개 때도 칸 구성은 처음 보여준 그대로(거짓 없음 ㅋ). 단 뽑은 칸 옆엔 1~3등을 몰아줌
function revealOthers() {
  const rest = [...deck];
  const pi = rest.indexOf(picked);
  if (pi >= 0) rest.splice(pi, 1);
  const take = (want) => {
    let i = rest.indexOf(want);
    if (i < 0) i = rest.findIndex((p) => p.tease);
    return rest.splice(Math.max(i, 0), 1)[0];
  };
  const near = shuffle(neighbors(pickedIdx, deck.length));
  const plan = new Map(near.map((j, k) => [j, take(teasers[k % teasers.length])]));
  const others = shuffle(rest);
  tickets().forEach((t, i) => {
    if (i === pickedIdx) return;
    const p = plan.get(i) ?? others.pop();
    setFace(t, p);
    t.classList.toggle('near', plan.has(i) && !!p.tease);
    t.style.transitionDelay = Math.random() * 400 + 'ms';
    t.classList.remove('flipped');
  });
  tease.hidden = false;
  confetti(30, ['🤣', '😂', '🤭', '👋']);
}

const modal = $('#result');
function showResult(p) {
  const r = cfg.rounds[Math.min(draws, cfg.rounds.length) - 1];
  $('#rRank').textContent = fill(r.rank);
  $('#rEmoji').textContent = p.emoji;
  $('#rName').textContent = p.name;
  $('#rDesc').textContent = fill(r.desc);
  tease.textContent = fill(r.tease);
  retryBtn.textContent = fill(r.retry);
  modal.hidden = false;
  $('#closeBtn').focus();
  confetti(50, ['😂', '🤣', '💩', '🎉']);
}
$('#closeBtn').addEventListener('click', () => {
  modal.hidden = true;
  revealOthers();
  retryBtn.hidden = draws >= cfg.rounds.length;
  if (retryBtn.hidden) setTimeout(openLetter, 1800); // 공개된 판 잠깐 보여주고 편지
});

const letterModal = $('#letterModal');
const letterBtn = $('#letterBtn');
function openLetter() {
  letterModal.hidden = false;
  $('#letterClose').focus();
  bigParty();
}
$('#letterClose').addEventListener('click', () => {
  letterModal.hidden = true;
  letterBtn.hidden = false;
});
letterBtn.addEventListener('click', openLetter);
startBtn.addEventListener('click', startGacha);
retryBtn.addEventListener('click', buildBoard);
buildBoard();

/* ---------- 공유 ---------- */
$('#shareBtn').addEventListener('click', async (e) => {
  const data = { title: document.title, url: location.href };
  if (navigator.share) return navigator.share(data).catch(() => {});
  try {
    await navigator.clipboard.writeText(location.href);
    e.target.textContent = '링크 복사 완료! ✅';
  } catch {
    e.target.textContent = '주소창 링크를 복사해 주세요';
  }
});
