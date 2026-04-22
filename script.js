/* ═══════════════════════════════════════════════════
   VØIDplay — script.js  v3
   Session key : vp_active  (username string)
   User data   : vp_users   (JSON object map)
   ═══════════════════════════════════════════════════ */

/* ── LANG ── */
const LANG={
  uk:{nav_home:'🏠 Головна',nav_bets:'🎯 Ставки',nav_tasks:'📋 Завдання',nav_mini:'🕹 Міні-ігри',nav_cases:'🎁 Кейси',nav_wheel:'🎡 Колесо',pd_profile:'👤 Мій профіль',pd_logout:'🚪 Вийти',arena:'Gaming Arena',tab_reg:'Реєстрація',tab_login:'Увійти',lbl_first:"Ім'я",lbl_last:'Прізвище',lbl_login:'Логін',lbl_birth:'Рік народження',lbl_pass:'Пароль',ph_first:'Іван',ph_last:'Петренко',btn_reg:'Зареєструватися →',btn_login:'Увійти →',err_year:'Введіть правильний рік',err_age:'❌ Реєстрація з 13 років',err_user:'Логін мінімум 3 символи',err_pass:'Пароль мінімум 4 символи',err_taken:'Логін вже зайнятий',err_notfound:'Користувача не знайдено',err_wrong:'Невірний пароль',ok_reg:'✅ Акаунт створено!',ok_login:'✅ Вхід успішний!'},
  ru:{nav_home:'🏠 Главная',nav_bets:'🎯 Ставки',nav_tasks:'📋 Задания',nav_mini:'🕹 Мини-игры',nav_cases:'🎁 Кейсы',nav_wheel:'🎡 Колесо',pd_profile:'👤 Мой профиль',pd_logout:'🚪 Выйти',arena:'Gaming Arena',tab_reg:'Регистрация',tab_login:'Войти',lbl_first:'Имя',lbl_last:'Фамилия',lbl_login:'Логин',lbl_birth:'Год рождения',lbl_pass:'Пароль',ph_first:'Иван',ph_last:'Петренко',btn_reg:'Зарегистрироваться →',btn_login:'Войти →',err_year:'Введите правильный год',err_age:'❌ Регистрация с 13 лет',err_user:'Логин минимум 3 символа',err_pass:'Пароль минимум 4 символа',err_taken:'Логин уже занят',err_notfound:'Пользователь не найден',err_wrong:'Неверный пароль',ok_reg:'✅ Аккаунт создан!',ok_login:'✅ Вход выполнен!'}
};
let currentLang=localStorage.getItem('vp_lang')||'uk';
function t(k){return(LANG[currentLang]||LANG.uk)[k]||k;}
function setLang(l){currentLang=l;localStorage.setItem('vp_lang',l);document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));applyLang();}
function applyLang(){
  document.querySelectorAll('[data-i]').forEach(el=>{const v=t(el.getAttribute('data-i'));if(v)el.textContent=v;});
  document.querySelectorAll('[data-ph]').forEach(el=>{const v=t(el.getAttribute('data-ph'));if(v)el.placeholder=v;});
}

/* ── STORAGE ── */
function getUsers(){try{return JSON.parse(localStorage.getItem('vp_users')||'{}');}catch(e){return {};}}
function saveUsers(u){localStorage.setItem('vp_users',JSON.stringify(u));}
function getActiveUser(){return localStorage.getItem('vp_active')||null;}
function setActiveUser(u){localStorage.setItem('vp_active',u);}
function getMe(){const u=getActiveUser();if(!u)return null;return getUsers()[u]||null;}
function patchMe(fields){
  const u=getActiveUser();if(!u)return;
  const users=getUsers();if(!users[u])return;
  Object.assign(users[u],fields);saveUsers(users);
}

/* ── BALANCE ── */
function getBalance(){const m=getMe();return m?(m.balance??500):0;}
function setBalance(val){
  patchMe({balance:val});
  document.querySelectorAll('.js-coins').forEach(el=>el.textContent=val);
}

/* ── AVATAR ── */
function getAvatar(username){return localStorage.getItem('vp_av_'+username)||null;}
function saveAvatar(username,dataUrl){try{localStorage.setItem('vp_av_'+username,dataUrl);}catch(e){}}

/* ── FRIENDS ── */
function getFriends(u){try{return JSON.parse(localStorage.getItem('vp_fr_'+u)||'[]');}catch(e){return [];}}
function saveFriends(u,arr){localStorage.setItem('vp_fr_'+u,JSON.stringify(arr));}

/* ── HISTORY ── */
function getCaseHistory(){const u=getActiveUser()||'g';try{return JSON.parse(localStorage.getItem('vp_hist_'+u)||'[]');}catch(e){return [];}}
function addCaseHistory(entry){const u=getActiveUser()||'g';const h=getCaseHistory();h.unshift(entry);if(h.length>50)h.pop();localStorage.setItem('vp_hist_'+u,JSON.stringify(h));}

/* ── AUTH ── */
function requireAuth(){if(!getActiveUser())window.location.replace('register2.html');}
function redirectIfLoggedIn(){if(getActiveUser())window.location.replace('index.html');}
function doLogout(){localStorage.removeItem('vp_active');window.location.href='register2.html';}

/* ── NAVBAR ── */
function buildNavbar(activePage){
  const el=document.getElementById('navbar');if(!el)return;
  const me=getMe();
  const bal=me?(me.balance??500):0;
  const av=me?getAvatar(me.user):null;
  const links=[{key:'nav_home',href:'index.html',page:'home'},{key:'nav_bets',href:'#',page:'bets'},{key:'nav_tasks',href:'#',page:'tasks'},{key:'nav_mini',href:'#',page:'mini'},{key:'nav_cases',href:'cases.html',page:'cases'},{key:'nav_wheel',href:'wheel.html',page:'wheel'}];
  const avatarHtml=av?`<img src="${av}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">`:`<div class="profile-avatar">${me?(((me.first||'?')[0])+((me.last||'')[0]||'')).toUpperCase():'?'}</div>`;
  el.innerHTML=`
    <a href="index.html" class="nav-logo"><span class="nav-logo-title">VØIDᴘʟᴀʏ</span><span class="nav-logo-sub" data-i="arena">Gaming Arena</span></a>
    <nav class="nav-links">${links.map(l=>`<a href="${l.href}" class="nav-link${activePage===l.page?' active':''}"><span class="nav-link-text" data-i="${l.key}">${t(l.key)}</span></a>`).join('')}</nav>
    <div class="nav-right">
      <button class="lang-btn${currentLang==='uk'?' active':''}" data-lang="uk" onclick="setLang('uk')">🇺🇦 УКР</button>
      <button class="lang-btn${currentLang==='ru'?' active':''}" data-lang="ru" onclick="setLang('ru')">🇷🇺 РУС</button>
      ${me?`
      <div class="nav-coins">🪙 <span class="js-coins">${bal}</span></div>
      <div class="profile-wrap" id="profile-wrap">
        <button class="profile-toggle" onclick="toggleProfileDrop()">
          ${avatarHtml}
          <span class="profile-name">${me.nickname||(me.first||me.user)}</span>
          <svg class="profile-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="pd-head">
            <div class="pd-fullname">${me.nickname||((me.first||'')+(me.last?' '+me.last:''))}</div>
            <div class="pd-username">@${me.user}</div>
            <div class="pd-coins">🪙 <span class="js-coins">${bal}</span> монет</div>
          </div>
          <button class="pd-item" onclick="location.href='profile.html'">${t('pd_profile')}</button>
          <button class="pd-item" onclick="location.href='cases.html'">🎁 Кейси</button>
          <button class="pd-item" onclick="location.href='wheel.html'">🎡 Колесо</button>
          <div class="pd-sep"></div>
          <button class="pd-item danger" onclick="doLogout()">${t('pd_logout')}</button>
        </div>
      </div>`:''}
      <button class="music-btn" id="music-btn" onclick="toggleMusic()" title="Музика">🔊</button>
    </div>`;
  document.addEventListener('click',e=>{const w=document.getElementById('profile-wrap');if(w&&!w.contains(e.target))w.classList.remove('open');});
  applyLang();syncMusicBtn();
}
function toggleProfileDrop(){const w=document.getElementById('profile-wrap');if(w)w.classList.toggle('open');}

/* ── MUSIC ── */
let _bgm=null;
function initMusic(){
  if(_bgm)return;
  _bgm=new Audio('menu.mp3');
  _bgm.loop=true;_bgm.volume=0.3;
  if(localStorage.getItem('vp_muted')==='1'){syncMusicBtn();return;}
  _bgm.play().catch(()=>{
    document.addEventListener('click',()=>{if(_bgm&&localStorage.getItem('vp_muted')!=='1')_bgm.play().catch(()=>{});},{once:true});
  });
  syncMusicBtn();
}
function toggleMusic(){
  if(!_bgm){initMusic();return;}
  if(_bgm.paused){_bgm.play().catch(()=>{});localStorage.removeItem('vp_muted');}
  else{_bgm.pause();localStorage.setItem('vp_muted','1');}
  syncMusicBtn();
}
function syncMusicBtn(){
  const btn=document.getElementById('music-btn');if(!btn)return;
  const off=_bgm?_bgm.paused:(localStorage.getItem('vp_muted')==='1');
  btn.textContent=off?'🔇':'🔊';
}

/* ── REVEAL ── */
function initReveal(){
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ── COUNTERS ── */
function animCounter(el,target,dur){
  let s=null;
  const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?Math.round(n/1e3)+'K':String(n);
  const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1),v=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(v*target));if(p<1)requestAnimationFrame(step);else el.textContent=fmt(target);};
  requestAnimationFrame(step);
}
function initCounters(){
  const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('[data-count]').forEach(el=>animCounter(el,parseInt(el.dataset.count),1800));obs.unobserve(e.target);}});},{threshold:0.2});
  document.querySelectorAll('.counters-group').forEach(g=>obs.observe(g));
}

/* ── COIN RAIN ── */
function coinRain(count){
  for(let i=0;i<count;i++)setTimeout(()=>{
    const c=document.createElement('div');c.textContent='🪙';
    c.style.cssText=`position:fixed;font-size:${20+Math.random()*16}px;left:${20+Math.random()*60}%;top:-40px;z-index:9999;pointer-events:none;animation:coinFall ${0.8+Math.random()*0.8}s ease-in forwards;`;
    document.body.appendChild(c);setTimeout(()=>c.remove(),1600);
  },i*60);
}

/* ── SOUND FX ── */
function playClick(){try{const a=new Audio();a.volume=0.4;/* silent fallback */}catch(e){}}
function playSpin(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const buf=ctx.createBuffer(1,ctx.sampleRate*0.15,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.05));
    const src=ctx.createBufferSource();src.buffer=buf;
    const g=ctx.createGain();g.gain.value=0.3;
    src.connect(g);g.connect(ctx.destination);src.start();
  }catch(e){}
}
