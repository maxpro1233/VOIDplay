/* ═══════════════════════════════════════════
   VØIDplay — shared script.js
   ═══════════════════════════════════════════ */

const LANG = {
  uk: {
    nav_home:'🏠 Головна', nav_bets:'🎯 Ставки', nav_tasks:'📋 Завдання',
    nav_mini:'🕹 Міні-ігри', nav_cases:'🎁 Кейси', nav_wheel:'🎡 Колесо',
    pd_profile:'👤 Мій профіль', pd_logout:'🚪 Вийти', coins_label:'🪙',
    arena:'Gaming Arena', tab_reg:'Реєстрація', tab_login:'Увійти',
    lbl_first:"Ім'я", lbl_last:'Прізвище', lbl_login:'Логін',
    lbl_birth:'Рік народження', lbl_pass:'Пароль',
    ph_first:'Іван', ph_last:'Петренко',
    btn_reg:'Зареєструватися →', btn_login:'Увійти →',
    err_year:'Введіть правильний рік народження',
    err_age:'❌ Реєстрація доступна лише з 13 років',
    err_user:'Логін мінімум 3 символи', err_pass:'Пароль мінімум 4 символи',
    err_taken:'Цей логін вже зайнятий', err_notfound:'Користувача не знайдено',
    err_wrong:'Невірний пароль',
    ok_reg:'✅ Акаунт створено! Переходимо...', ok_login:'✅ Вхід успішний! Переходимо...',
  },
  ru: {
    nav_home:'🏠 Главная', nav_bets:'🎯 Ставки', nav_tasks:'📋 Задания',
    nav_mini:'🕹 Мини-игры', nav_cases:'🎁 Кейсы', nav_wheel:'🎡 Колесо',
    pd_profile:'👤 Мой профиль', pd_logout:'🚪 Выйти', coins_label:'🪙',
    arena:'Gaming Arena', tab_reg:'Регистрация', tab_login:'Войти',
    lbl_first:'Имя', lbl_last:'Фамилия', lbl_login:'Логин',
    lbl_birth:'Год рождения', lbl_pass:'Пароль',
    ph_first:'Иван', ph_last:'Петренко',
    btn_reg:'Зарегистрироваться →', btn_login:'Войти →',
    err_year:'Введите правильный год рождения',
    err_age:'❌ Регистрация доступна только с 13 лет',
    err_user:'Логин минимум 3 символа', err_pass:'Пароль минимум 4 символа',
    err_taken:'Этот логин уже занят', err_notfound:'Пользователь не найден',
    err_wrong:'Неверный пароль',
    ok_reg:'✅ Аккаунт создан! Переходим...', ok_login:'✅ Вход выполнен! Переходим...',
  }
};

let currentLang = localStorage.getItem('vp_lang') || 'uk';
function t(key) { return (LANG[currentLang] || LANG.uk)[key] || key; }
function setLang(l) {
  currentLang = l; localStorage.setItem('vp_lang', l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  applyLang();
}
function applyLang() {
  document.querySelectorAll('[data-i]').forEach(el => { const v=t(el.getAttribute('data-i')); if(v) el.textContent=v; });
  document.querySelectorAll('[data-ph]').forEach(el => { const v=t(el.getAttribute('data-ph')); if(v) el.placeholder=v; });
}

/* ── STORAGE ── */
function getUsers()    { try { return JSON.parse(localStorage.getItem('vp_users')||'{}'); } catch(e){ return {}; } }
function saveUsers(u)  { localStorage.setItem('vp_users', JSON.stringify(u)); }
function getSession()  { try { return JSON.parse(localStorage.getItem('vp_session')||'null'); } catch(e){ return null; } }
function saveSession(s){ localStorage.setItem('vp_session', JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem('vp_session'); }

function getSyncedSession() {
  const s = getSession(); if(!s) return null;
  const users = getUsers(); if(users[s.user]) return users[s.user]; return s;
}

/* ── BALANCE HELPERS ── */
function getBalance() {
  const s = getSyncedSession(); return s ? (s.balance ?? 500) : 0;
}
function setBalance(val) {
  const s = getSyncedSession(); if(!s) return;
  const users = getUsers();
  s.balance = val;
  if(users[s.user]) users[s.user].balance = val;
  saveUsers(users); saveSession(s);
  /* update all navbar coin displays live */
  document.querySelectorAll('#nav-coins-val').forEach(el => el.textContent = val);
  document.querySelectorAll('.pd-coins-val').forEach(el => el.textContent = val);
}

/* ── AVATAR HELPERS ── */
function getAvatar(username) {
  return localStorage.getItem('vp_avatar_' + username) || null;
}
function saveAvatar(username, dataUrl) {
  try { localStorage.setItem('vp_avatar_' + username, dataUrl); } catch(e) {}
}

/* ── NAVBAR ── */
function buildNavbar(activePage) {
  const s   = getSyncedSession();
  const el  = document.getElementById('navbar');
  if (!el) return;

  const links = [
    { key:'nav_home',  href:'index.html',  page:'home'  },
    { key:'nav_bets',  href:'#',           page:'bets'  },
    { key:'nav_tasks', href:'#',           page:'tasks' },
    { key:'nav_mini',  href:'#',           page:'mini'  },
    { key:'nav_cases', href:'cases.html',  page:'cases' },
    { key:'nav_wheel', href:'#',           page:'wheel' },
  ];

  const balance = s ? (s.balance ?? 500) : 0;
  const avatar  = s ? getAvatar(s.user) : null;

  /* avatar element: image or initials */
  const avatarHtml = avatar
    ? `<img src="${avatar}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">`
    : `<div class="profile-avatar" id="nav-avatar">${s ? ((s.first[0]||'')+(s.last[0]||'')).toUpperCase() : '?'}</div>`;

  el.innerHTML = `
    <a href="index.html" class="nav-logo">
      <span class="nav-logo-title">VØIDᴘʟᴀʏ</span>
      <span class="nav-logo-sub" data-i="arena">Gaming Arena</span>
    </a>
    <nav class="nav-links">
      ${links.map(l=>`<a href="${l.href}" class="nav-link${activePage===l.page?' active':''}">
        <span class="nav-link-text" data-i="${l.key}">${t(l.key)}</span></a>`).join('')}
    </nav>
    <div class="nav-right">
      <button class="lang-btn${currentLang==='uk'?' active':''}" data-lang="uk" onclick="setLang('uk')">🇺🇦 УКР</button>
      <button class="lang-btn${currentLang==='ru'?' active':''}" data-lang="ru" onclick="setLang('ru')">🇷🇺 РУС</button>
      ${s ? `
        <div class="nav-coins">🪙 <span id="nav-coins-val">${balance}</span></div>
        <div class="profile-wrap" id="profile-wrap">
          <button class="profile-toggle" onclick="toggleProfileDrop()">
            ${avatarHtml}
            <span class="profile-name" id="nav-pname">${s.first}</span>
            <svg class="profile-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <div class="profile-dropdown" id="profile-dropdown">
            <div class="pd-head">
              <div class="pd-fullname" id="pd-fullname">${s.first+' '+s.last}</div>
              <div class="pd-username">@${s.user}</div>
              <div class="pd-coins">🪙 <span class="pd-coins-val">${balance}</span> монет</div>
            </div>
            <button class="pd-item" onclick="window.location.href='profile.html'">${t('pd_profile')}</button>
            <button class="pd-item" onclick="window.location.href='cases.html'">🎁 Кейси</button>
            <div class="pd-sep"></div>
            <button class="pd-item danger" onclick="doLogout()">${t('pd_logout')}</button>
          </div>
        </div>` : ''}
    </div>`;

  document.addEventListener('click', e => {
    const w = document.getElementById('profile-wrap');
    if (w && !w.contains(e.target)) w.classList.remove('open');
  });
  applyLang();
}

function toggleProfileDrop() {
  const w = document.getElementById('profile-wrap'); if(w) w.classList.toggle('open');
}

/* ── AUTH ── */
function doLogout()          { clearSession(); window.location.href='register.html'; }
function requireAuth()       { if(!getSession()) window.location.replace('register.html'); }
function redirectIfLoggedIn(){ if(getSession())  window.location.replace('index.html'); }

/* ── REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ── COUNTERS ── */
function animCounter(el, target, dur) {
  let s=null;
  const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?Math.round(n/1e3)+'K':n.toString();
  const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1),v=1-Math.pow(1-p,3);
    el.textContent=fmt(Math.round(v*target));if(p<1)requestAnimationFrame(step);else el.textContent=fmt(target);};
  requestAnimationFrame(step);
}
function initCounters() {
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{
    if(e.isIntersecting){e.target.querySelectorAll('[data-count]').forEach(el=>animCounter(el,parseInt(el.dataset.count),1800));obs.unobserve(e.target);}
  });},{threshold:0.2});
  document.querySelectorAll('.counters-group').forEach(g=>obs.observe(g));
}

/* ── COIN RAIN ANIMATION ── */
function coinRain(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const coin = document.createElement('div');
      coin.className = 'coin-particle';
      coin.textContent = '🪙';
      coin.style.cssText = `
        position:fixed; font-size:${20+Math.random()*16}px;
        left:${20+Math.random()*60}%; top:-40px;
        z-index:9999; pointer-events:none;
        animation: coinFall ${0.8+Math.random()*0.8}s ease-in forwards;
      `;
      document.body.appendChild(coin);
      setTimeout(() => coin.remove(), 1600);
    }, i * 60);
  }
}