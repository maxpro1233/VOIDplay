/* ═══════════════════════════════════════════════════
   VØIDplay — script.js  v5
   Features: i18n (uk/ru/en) · themes · volume · auth
   ═══════════════════════════════════════════════════ */

/* ── i18n ─────────────────────────────────────────── */
const LANG = {
  uk: {
    nav_home:'🏠 Головна', nav_bets:'🎯 Ставки', nav_crash:'💥 Crash',
    nav_cases:'🎁 Кейси', nav_wheel:'🎡 Колесо',
    pd_profile:'👤 Мій профіль', pd_logout:'🚪 Вийти',
    arena:'Gaming Arena', tab_reg:'Реєстрація', tab_login:'Увійти',
    lbl_first:"Ім'я", lbl_last:'Прізвище', lbl_login:'Логін',
    lbl_birth:'Рік народження', lbl_pass:'Пароль',
    ph_first:'Іван', ph_last:'Петренко',
    btn_reg:'Зареєструватися →', btn_login:'Увійти →',
    err_year:'Введіть правильний рік', err_age:'❌ Реєстрація з 13 років',
    err_user:'Логін мінімум 3 символи', err_pass:'Пароль мінімум 4 символи',
    err_taken:'Логін вже зайнятий', err_notfound:'Користувача не знайдено',
    err_wrong:'Невірний пароль', ok_reg:'✅ Акаунт створено!', ok_login:'✅ Вхід успішний!',
    prof_title:'Мій профіль', prof_nickname:'Нікнейм', prof_save:'Зберегти',
    prof_friends:'Друзі', prof_codes:'Коди', prof_danger:'Небезпечна зона',
    prof_add_friend:'Додати друга', prof_friend_ph:'Логін гравця',
    prof_code_ph:'Введіть код...', prof_activate:'Активувати',
    prof_no_friends:'У тебе поки немає друзів 👋',
    prof_del_coins:'Видалити всі монети',
    prof_del_confirm:'⚠️ Підтвердити видалення монет',
    prof_del_warn:'Ця дія видалить всі твої монети без можливості відновлення!',
    prof_coins_deleted:'✅ Монети видалено',
    prof_mod_give:'Видати монети (MOD)',
    prof_hourly:'⏱ Нагорода за онлайн',
    prof_hourly_desc:'Ти отримуєш 50 монет щогодини за перебування онлайн.',
    prof_perks:'Активні привілеї',
    prof_no_perks:'Немає активованих привілеїв',
    prof_registered:'Зареєстровано',
    prof_balance:'Баланс',
    snd_title:'🔊 Гучність', snd_music:'Фонова музика', snd_fx:'Звукові ефекти',
    theme_dark:'🌑 Dark', theme_light:'☀️ Light',
    coins:'монет', lbl_remove_av:'Видалити аватар',
  },
  ru: {
    nav_home:'🏠 Главная', nav_bets:'🎯 Ставки', nav_crash:'💥 Crash',
    nav_cases:'🎁 Кейсы', nav_wheel:'🎡 Колесо',
    pd_profile:'👤 Мой профиль', pd_logout:'🚪 Выйти',
    arena:'Gaming Arena', tab_reg:'Регистрация', tab_login:'Войти',
    lbl_first:'Имя', lbl_last:'Фамилия', lbl_login:'Логин',
    lbl_birth:'Год рождения', lbl_pass:'Пароль',
    ph_first:'Иван', ph_last:'Петренко',
    btn_reg:'Зарегистрироваться →', btn_login:'Войти →',
    err_year:'Введите правильный год', err_age:'❌ Регистрация с 13 лет',
    err_user:'Логин минимум 3 символа', err_pass:'Пароль минимум 4 символа',
    err_taken:'Логин уже занят', err_notfound:'Пользователь не найден',
    err_wrong:'Неверный пароль', ok_reg:'✅ Аккаунт создан!', ok_login:'✅ Вход выполнен!',
    prof_title:'Мой профиль', prof_nickname:'Никнейм', prof_save:'Сохранить',
    prof_friends:'Друзья', prof_codes:'Коды', prof_danger:'Опасная зона',
    prof_add_friend:'Добавить друга', prof_friend_ph:'Логин игрока',
    prof_code_ph:'Введите код...', prof_activate:'Активировать',
    prof_no_friends:'У тебя пока нет друзей 👋',
    prof_del_coins:'Удалить все монеты',
    prof_del_confirm:'⚠️ Подтвердить удаление монет',
    prof_del_warn:'Это действие удалит все твои монеты без возможности восстановления!',
    prof_coins_deleted:'✅ Монеты удалены',
    prof_mod_give:'Выдать монеты (MOD)',
    prof_hourly:'⏱ Награда за онлайн',
    prof_hourly_desc:'Ты получаешь 50 монет каждый час за пребывание онлайн.',
    prof_perks:'Активные привилегии',
    prof_no_perks:'Нет активированных привилегий',
    prof_registered:'Зарегистрирован',
    prof_balance:'Баланс',
    snd_title:'🔊 Громкость', snd_music:'Фоновая музыка', snd_fx:'Звуковые эффекты',
    theme_dark:'🌑 Dark', theme_light:'☀️ Light',
    coins:'монет', lbl_remove_av:'Удалить аватар',
  },
  en: {
    nav_home:'🏠 Home', nav_bets:'🎯 Bets', nav_crash:'💥 Crash',
    nav_cases:'🎁 Cases', nav_wheel:'🎡 Wheel',
    pd_profile:'👤 My Profile', pd_logout:'🚪 Log Out',
    arena:'Gaming Arena', tab_reg:'Register', tab_login:'Log In',
    lbl_first:'First name', lbl_last:'Last name', lbl_login:'Username',
    lbl_birth:'Birth year', lbl_pass:'Password',
    ph_first:'John', ph_last:'Smith',
    btn_reg:'Register →', btn_login:'Log In →',
    err_year:'Enter a valid year', err_age:'❌ Must be 13+ to register',
    err_user:'Username min 3 chars', err_pass:'Password min 4 chars',
    err_taken:'Username already taken', err_notfound:'User not found',
    err_wrong:'Wrong password', ok_reg:'✅ Account created!', ok_login:'✅ Logged in!',
    prof_title:'My Profile', prof_nickname:'Nickname', prof_save:'Save',
    prof_friends:'Friends', prof_codes:'Codes', prof_danger:'Danger Zone',
    prof_add_friend:'Add friend', prof_friend_ph:"Player's username",
    prof_code_ph:'Enter code...', prof_activate:'Activate',
    prof_no_friends:"You don't have friends yet 👋",
    prof_del_coins:'Delete all coins',
    prof_del_confirm:'⚠️ Confirm coin deletion',
    prof_del_warn:'This action will permanently delete all your coins!',
    prof_coins_deleted:'✅ Coins deleted',
    prof_mod_give:'Give coins (MOD)',
    prof_hourly:'⏱ Online reward',
    prof_hourly_desc:'You earn 50 coins every hour for being online.',
    prof_perks:'Active perks',
    prof_no_perks:'No active perks',
    prof_registered:'Registered',
    prof_balance:'Balance',
    snd_title:'🔊 Volume', snd_music:'Background music', snd_fx:'Sound effects',
    theme_dark:'🌑 Dark', theme_light:'☀️ Light',
    coins:'coins', lbl_remove_av:'Remove avatar',
  }
};

let currentLang = localStorage.getItem('vp_lang') || 'uk';
function t(k) { return (LANG[currentLang] || LANG.uk)[k] || k; }
function setLang(l) {
  currentLang = l;
  localStorage.setItem('vp_lang', l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  applyLang();
  // rebuild navbar to refresh translated strings
  const activePage = document.querySelector('.nav-link.active');
  if (activePage) {
    const page = [...activePage.classList].find(c => c !== 'nav-link' && c !== 'active') || '';
    buildNavbar(document.body.dataset.page || '');
  }
}
function applyLang() {
  document.querySelectorAll('[data-i]').forEach(el => {
    const v = t(el.getAttribute('data-i'));
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-ph]').forEach(el => {
    const v = t(el.getAttribute('data-ph'));
    if (v) el.placeholder = v;
  });
}

/* ── THEME ────────────────────────────────────────── */
function getTheme() { return localStorage.getItem('vp_theme') || 'dark'; }
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('vp_theme', theme);
  document.querySelectorAll('.theme-btn, .theme-toggle-btn').forEach(btn => {
    btn.title = theme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
    btn.textContent = theme === 'dark' ? '☀️' : '🌑';
  });
}
function toggleTheme() { applyTheme(getTheme() === 'dark' ? 'light' : 'dark'); }
/* Apply theme before anything renders */
(function() { applyTheme(getTheme()); })();

/* ── STORAGE ──────────────────────────────────────── */
function getUsers() { try { return JSON.parse(localStorage.getItem('vp_users') || '{}'); } catch(e) { return {}; } }
function saveUsers(u) { localStorage.setItem('vp_users', JSON.stringify(u)); }
function getActiveUser() { return localStorage.getItem('vp_active') || null; }
function setActiveUser(u) { localStorage.setItem('vp_active', u); }
function getMe() { const u = getActiveUser(); if (!u) return null; return getUsers()[u] || null; }
function patchMe(fields) {
  const u = getActiveUser(); if (!u) return;
  const users = getUsers(); if (!users[u]) return;
  Object.assign(users[u], fields); saveUsers(users);
}

/* ── BALANCE ──────────────────────────────────────── */
function getBalance() { const m = getMe(); return m ? (m.balance ?? 500) : 0; }
function setBalance(val) {
  const v = Math.max(0, Math.round(val));
  patchMe({ balance: v });
  document.querySelectorAll('.js-coins').forEach(el => el.textContent = v);
}

/* ── ROLES ────────────────────────────────────────── */
const MOD_CODES = ['XM7AS62', 'Q9KPLX8'];
function getRole() { const m = getMe(); return m ? (m.role || 'user') : 'user'; }
function isMod() { return getRole() === 'moderator'; }
function tryActivateCode(code) {
  if (MOD_CODES.includes((code || '').trim().toUpperCase())) {
    patchMe({ role: 'moderator' });
    return { ok: true, msg: '✅ Роль MODERATOR активована!' };
  }
  return { ok: false, msg: '❌ Невірний код' };
}

/* ── AVATAR ───────────────────────────────────────── */
function getAvatar(username) { return localStorage.getItem('vp_av_' + username) || null; }
function saveAvatar(username, dataUrl) { try { localStorage.setItem('vp_av_' + username, dataUrl); } catch(e) {} }

/* ── FRIENDS ──────────────────────────────────────── */
function getFriends(u) { try { return JSON.parse(localStorage.getItem('vp_fr_' + u) || '[]'); } catch(e) { return []; } }
function saveFriends(u, arr) { localStorage.setItem('vp_fr_' + u, JSON.stringify(arr)); }

/* ── HISTORY ──────────────────────────────────────── */
function getCaseHistory() {
  const u = getActiveUser() || 'g';
  try { return JSON.parse(localStorage.getItem('vp_hist_' + u) || '[]'); } catch(e) { return []; }
}
function addCaseHistory(entry) {
  const u = getActiveUser() || 'g';
  const h = getCaseHistory(); h.unshift(entry);
  if (h.length > 50) h.pop();
  localStorage.setItem('vp_hist_' + u, JSON.stringify(h));
}

/* ── AUTH ─────────────────────────────────────────── */
function requireAuth() { if (!getActiveUser()) window.location.replace('register2.html'); }
function redirectIfLoggedIn() { if (getActiveUser()) window.location.replace('index.html'); }
function doLogout() { localStorage.removeItem('vp_active'); window.location.href = 'register2.html'; }

/* ── HOURLY ONLINE REWARD ─────────────────────────── */
const HOURLY_AMOUNT = 50;
function checkHourlyReward() {
  const me = getMe(); if (!me) return null;
  const key = 'vp_hourly_' + me.user;
  const now = Date.now();
  const last = parseInt(localStorage.getItem(key) || '0', 10);
  if (!last) { localStorage.setItem(key, String(now)); return null; }
  const hours = Math.floor((now - last) / 3600000);
  if (hours < 1) return null;
  const earned = hours * HOURLY_AMOUNT;
  setBalance(getBalance() + earned);
  localStorage.setItem(key, String(last + hours * 3600000));
  return earned;
}
function getHourlyMs() {
  const me = getMe(); if (!me) return 0;
  const last = parseInt(localStorage.getItem('vp_hourly_' + me.user) || '0', 10);
  if (!last) return 0;
  return Math.max(0, last + 3600000 - Date.now());
}

/* ── VOLUME ───────────────────────────────────────── */
function getMusicVol()  { return parseFloat(localStorage.getItem('vp_vol_music') ?? '0.3'); }
function getFxVol()     { return parseFloat(localStorage.getItem('vp_vol_fx')    ?? '0.5'); }
function setMusicVol(v) { v = parseFloat(v); localStorage.setItem('vp_vol_music', v); if (_bgm) _bgm.volume = v; }
function setFxVol(v)    { localStorage.setItem('vp_vol_fx', parseFloat(v)); }

/* ── SOUND POPUP ──────────────────────────────────── */
function openSoundPopup() {
  closeSoundPopup();
  const popup = document.createElement('div');
  popup.id = 'vp-sound-popup';
  popup.innerHTML = `
    <div onclick="closeSoundPopup()" style="position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.65);backdrop-filter:blur(5px);"></div>
    <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9001;
      background:var(--surface,#111114);border:1px solid rgba(255,107,0,.3);border-radius:18px;
      padding:28px 30px;min-width:300px;max-width:92vw;
      box-shadow:0 20px 60px rgba(0,0,0,.7);animation:fadeUp .25s ease both;">
      <div style="font-size:16px;font-weight:900;margin-bottom:22px;color:var(--text,#f0f0f0);">${t('snd_title')}</div>
      <div style="margin-bottom:18px;">
        <div style="font-size:11px;font-weight:700;color:var(--muted,#606070);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px;">${t('snd_music')}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:16px;">🎵</span>
          <input type="range" id="snd-music-range" min="0" max="100" value="${Math.round(getMusicVol()*100)}"
            style="flex:1;accent-color:#ff6b00;height:4px;"
            oninput="setMusicVol(this.value/100);document.getElementById('snd-music-val').textContent=this.value+'%'">
          <span id="snd-music-val" style="font-size:13px;font-weight:700;color:#ff8c00;min-width:38px;text-align:right;">${Math.round(getMusicVol()*100)}%</span>
        </div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:var(--muted,#606070);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px;">${t('snd_fx')}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:16px;">🔔</span>
          <input type="range" id="snd-fx-range" min="0" max="100" value="${Math.round(getFxVol()*100)}"
            style="flex:1;accent-color:#ff6b00;height:4px;"
            oninput="setFxVol(this.value/100);document.getElementById('snd-fx-val').textContent=this.value+'%'">
          <span id="snd-fx-val" style="font-size:13px;font-weight:700;color:#ff8c00;min-width:38px;text-align:right;">${Math.round(getFxVol()*100)}%</span>
        </div>
      </div>
      <button onclick="closeSoundPopup()" style="width:100%;padding:12px;background:linear-gradient(135deg,#ff6b00,#ff9200);
        border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">OK</button>
    </div>`;
  document.body.appendChild(popup);
}
function closeSoundPopup() {
  const p = document.getElementById('vp-sound-popup');
  if (p) p.remove();
}

/* ── NAVBAR ───────────────────────────────────────── */
function buildNavbar(activePage) {
  const el = document.getElementById('navbar'); if (!el) return;
  const me = getMe();
  const bal = me ? (me.balance ?? 500) : 0;
  const av  = me ? getAvatar(me.user) : null;
  const role = me ? (me.role || 'user') : 'user';

  const links = [
    { key: 'nav_home',  href: 'index.html', page: 'home'  },
    { key: 'nav_bets',  href: 'bets.html',  page: 'bets'  },
    { key: 'nav_crash', href: 'crash.html', page: 'crash' },
    { key: 'nav_cases', href: 'cases.html', page: 'cases' },
    { key: 'nav_wheel', href: 'wheel.html', page: 'wheel' },
  ];

  const avatarHtml = av
    ? `<img src="${av}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">`
    : `<div class="profile-avatar">${me ? (((me.first || '?')[0]) + ((me.last || '')[0] || '')).toUpperCase() : '?'}</div>`;

  const modBadge = role === 'moderator' ? `<span class="mod-badge-sm">MOD</span>` : '';

  el.innerHTML = `
    <a href="index.html" class="nav-logo">
      <span class="nav-logo-title">VØIDᴘʟᴀʏ</span>
      <span class="nav-logo-sub" data-i="arena">${t('arena')}</span>
    </a>
    <nav class="nav-links">
      ${links.map(l => `<a href="${l.href}" class="nav-link${activePage === l.page ? ' active' : ''}"><span class="nav-link-text" data-i="${l.key}">${t(l.key)}</span></a>`).join('')}
    </nav>
    <div class="nav-right">
      <button class="lang-btn${currentLang==='uk'?' active':''}" data-lang="uk" onclick="setLang('uk')">🇺🇦</button>
      <button class="lang-btn${currentLang==='ru'?' active':''}" data-lang="ru" onclick="setLang('ru')">🇷🇺</button>
      <button class="lang-btn${currentLang==='en'?' active':''}" data-lang="en" onclick="setLang('en')">🇬🇧</button>
      ${me ? `
      <div class="nav-coins">🪙 <span class="js-coins">${bal}</span></div>
      <div class="profile-wrap" id="profile-wrap">
        <button class="profile-toggle" onclick="toggleProfileDrop()">
          ${avatarHtml}
          <span class="profile-name">${me.nickname || (me.first || me.user)}</span>
          ${modBadge}
          <svg class="profile-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="pd-head">
            <div class="pd-fullname">${me.nickname || ((me.first||'')+(me.last?' '+me.last:''))}</div>
            <div class="pd-username">@${me.user}${role==='moderator'?' <span class="mod-badge-sm">MOD</span>':''}</div>
            <div class="pd-coins">🪙 <span class="js-coins">${bal}</span> монет</div>
          </div>
          <button class="pd-item" onclick="location.href='profile.html'" data-i="pd_profile">${t('pd_profile')}</button>
          <button class="pd-item" onclick="location.href='cases.html'">🎁 Кейси</button>
          <button class="pd-item" onclick="location.href='wheel.html'">🎡 Колесо</button>
          <button class="pd-item" onclick="location.href='crash.html'">💥 Crash</button>
          <button class="pd-item" onclick="location.href='bets.html'">🎯 Ставки</button>
          <div class="pd-sep"></div>
          <button class="pd-item" onclick="openSoundPopup()">🔊 Звук</button>
          <button class="pd-item" onclick="toggleTheme()">🌓 Тема</button>
          <div class="pd-sep"></div>
          <button class="pd-item danger" onclick="doLogout()" data-i="pd_logout">${t('pd_logout')}</button>
        </div>
      </div>` : ''}
      <button class="music-btn" id="music-btn" onclick="toggleMusic()" title="Music">🔊</button>
      <button class="theme-btn" onclick="toggleTheme()" title="Theme">${getTheme()==='dark'?'☀️':'🌑'}</button>
    </div>`;

  // close dropdown on outside click
  setTimeout(() => {
    document.addEventListener('click', function closeDD(e) {
      const w = document.getElementById('profile-wrap');
      if (w && !w.contains(e.target)) w.classList.remove('open');
    });
  }, 0);

  applyLang();
  syncMusicBtn();
}

function toggleProfileDrop() {
  const w = document.getElementById('profile-wrap');
  if (w) w.classList.toggle('open');
}

/* ── MUSIC ────────────────────────────────────────── */
let _bgm = null;
function initMusic() {
  if (_bgm) return;
  _bgm = new Audio('menu.mp3');
  _bgm.loop = true;
  _bgm.volume = getMusicVol();
  if (localStorage.getItem('vp_muted') === '1') { syncMusicBtn(); return; }
  _bgm.play().catch(() => {
    document.addEventListener('click', () => {
      if (_bgm && localStorage.getItem('vp_muted') !== '1') _bgm.play().catch(() => {});
    }, { once: true });
  });
  syncMusicBtn();
}
function toggleMusic() {
  if (!_bgm) { initMusic(); return; }
  if (_bgm.paused) { _bgm.play().catch(() => {}); localStorage.removeItem('vp_muted'); }
  else { _bgm.pause(); localStorage.setItem('vp_muted', '1'); }
  syncMusicBtn();
}
function syncMusicBtn() {
  const btn = document.getElementById('music-btn'); if (!btn) return;
  const off = _bgm ? _bgm.paused : (localStorage.getItem('vp_muted') === '1');
  btn.textContent = off ? '🔇' : '🔊';
}

/* ── REVEAL ───────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── COUNTERS ─────────────────────────────────────── */
function animCounter(el, target, dur) {
  let s = null;
  const fmt = n => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? Math.round(n/1e3)+'K' : String(n);
  const step = ts => {
    if (!s) s = ts;
    const p = Math.min((ts-s)/dur, 1), v = 1 - Math.pow(1-p, 3);
    el.textContent = fmt(Math.round(v*target));
    if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
  };
  requestAnimationFrame(step);
}
function initCounters() {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => animCounter(el, parseInt(el.dataset.count), 1800));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.counters-group').forEach(g => obs.observe(g));
}

/* ── COIN RAIN ────────────────────────────────────── */
function coinRain(count) {
  for (let i = 0; i < count; i++) setTimeout(() => {
    const c = document.createElement('div');
    c.textContent = '🪙';
    c.style.cssText = `position:fixed;font-size:${20+Math.random()*16}px;left:${20+Math.random()*60}%;top:-40px;z-index:9999;pointer-events:none;animation:coinFall ${0.8+Math.random()*0.8}s ease-in forwards;`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }, i * 60);
}

/* ── SOUND FX ─────────────────────────────────────── */
function playSpin() {
  try {
    const vol = getFxVol(); if (vol === 0) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 30; i++) {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.frequency.value = 300 + Math.random() * 400;
      const tt = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.07 * vol, tt);
      g.gain.exponentialRampToValueAtTime(0.001, tt + 0.14);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(tt); osc.stop(tt + 0.16);
    }
  } catch(e) {}
}
