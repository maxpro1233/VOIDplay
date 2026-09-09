/* ═══════════════════════════════════════════════════
   VØIDplay — script.js  v8
   i18n · 2 Themes · JWT Auth · Realtime DB Sync · Clean Dropdown
   ═══════════════════════════════════════════════════ */

/* ── API CLIENT ───────────────────────────────────── */
const API_BASE = localStorage.getItem('vp_api_url') || ''; // Configurable or same origin

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('vp_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(API_BASE + endpoint, {
      ...options,
      headers
    });
    
    if (res.status === 401) {
      if (!window.location.pathname.endsWith('register2.html')) {
        localStorage.removeItem('vp_token');
        localStorage.removeItem('vp_me');
        window.location.replace('register2.html');
      }
      return null;
    }

    const cType = res.headers.get('content-type') || '';
    if (!res.ok || !cType.includes('application/json')) {
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('API request skipped or offline:', endpoint);
    return null;
  }
}

/* ── i18n TRANSLATIONS ────────────────────────────── */
const LANG = {
  uk: {
    nav_home: '🏠 Головна',
    nav_cards: '🃏 Карткові ігри',
    nav_crash: '💥 Crash',
    nav_cases: '🎁 Кейси',
    nav_wheel: '🎡 Колесо',
    pd_profile: '👤 Мій профіль',
    pd_deposit: '💳 Поповнити',
    pd_withdraw: '💸 Вивести',
    pd_logout: '🚪 Вийти',
    arena: 'Gaming Arena',
    tab_reg: 'Реєстрація',
    tab_login: 'Увійти',
    lbl_first: "Ім'я",
    lbl_last: 'Прізвище',
    lbl_login: 'Логін',
    lbl_birth: 'Рік народження',
    lbl_pass: 'Пароль',
    ph_first: 'Іван',
    ph_last: 'Петренко',
    btn_reg: 'Зареєструватися →',
    btn_login: 'Увійти →',
    err_year: 'Введіть правильний рік',
    err_age: '❌ Реєстрація з 13 років',
    err_user: 'Логін мінімум 3 символи',
    err_pass: 'Пароль мінімум 4 символи',
    err_taken: 'Логін вже зайнятий',
    err_notfound: 'Користувача не знайдено',
    err_wrong: 'Невірний пароль або логін',
    ok_reg: '✅ Акаунт успішно створено!',
    ok_login: '✅ Вхід успішний!',
    
    // Profile
    prof_title: 'Мій профіль',
    prof_nickname: 'Нікнейм',
    prof_save: 'Зберегти',
    prof_friends: 'Друзі',
    prof_codes: 'Коди',
    prof_danger: 'Небезпечна зона',
    prof_add_friend: 'Додати друга',
    prof_friend_ph: 'Логін гравця',
    prof_code_ph: 'Введіть код...',
    prof_activate: 'Активувати',
    prof_no_friends: 'У тебе поки немає друзів 👋',
    prof_del_coins: 'Видалити всі монети',
    prof_del_confirm: '⚠️ Підтвердити видалення монет',
    prof_del_warn: 'Ця дія видалить всі твої монети без можливості відновлення!',
    prof_coins_deleted: '✅ Монети видалено з бази даних',
    prof_mod_give: 'Видати монети (MOD)',
    prof_registered: 'Зареєстровано',
    prof_balance: 'Баланс',
    spec_ip: 'IP-адреса',
    spec_device: 'Пристрій',
    spec_os: 'Операційна система',
    spec_browser: 'Браузер',
    spec_res: 'Екран',
    spec_cpu: 'Ядра CPU',
    spec_time: 'Дата фіксації',
    spec_download: '📄 Завантажити звіт (.txt)',
    btn_deposit: '+ Поповнити',
    btn_withdraw: 'Вивести',

    // In Dev Popups
    dev_topup_title: '💳 Поповнення балансу',
    dev_topup_desc: 'На даний момент поповнення перебуває на стадії розробки та тестування платіжних шлюзів. Дякуємо за розуміння!',
    dev_withdraw_title: '💸 Виведення коштів',
    dev_withdraw_desc: 'На даний момент виведення коштів перебуває на стадії розробки та підключення банківських шлюзів. Дякуємо за розуміння!',
    dev_game_title: '🎮 Гра в розробці',
    dev_game_desc: 'Цей ігровий режим зараз розробляється.',
    btn_got_it: 'Зрозуміло',

    // Maintenance / Rework
    maint_tag: '🛠️ НА ПЕРЕРОБЦІ',
    maint_cases_title: 'Кейси тимчасово закриті',
    maint_wheel_title: 'Колесо фортуни на переробці',
    maint_desc: 'Дана гра на переробці. Дякуємо за розуміння! Ми покращуємо анімації та коефіцієнти для вас.',
    btn_to_home: '🏠 На головну',
    btn_to_cards: '🃏 Карткові ігри',
    btn_to_crash: '💥 Грати в Crash',

    // Card Games & Cashier
    cards_hub_title: 'Картковий клуб VØID',
    cards_hub_desc: 'Обирай гру, роби ставки фішками та перемагай!',
    cashier_title: '🎩 Касир казино',
    cashier_desc: 'Курс обміну: 1 фішка = 50 монет. При виході з картярні всі фішки автоматично обміняються назад у монети!',
    btn_open_cashier: '💵 Обмінник фішок',
    chips_balance: 'Твої фішки',
    buy_chips: 'Купити фішки',
    cashout_chips: 'Обміняти всі фішки на монети',
    chips_exchanged_ok: '✅ Фішки успішно обміняно на монети!',
    no_chips_err: 'У тебе закінчилися фішки. Купи їх у касира!',
    no_coins_err: 'Недостатньо монет для купівлі фішок!',
    game_bj_name: '🃏 Блекджек (21)',
    game_bj_desc: 'Класичний блекджек проти розумного AI дилера. Збирай 21 та подвоюй ставки!',
    game_poker_name: '🎪 Crazy Time Live',
    game_poker_desc: 'Легендарне колесо фортуни з Топ-слотом та 4 бонусками: Coin Flip, Pachinko, Cash Hunt і Crazy Time!',
    game_roulette_name: '🎡 Європейська рулетка',
    game_roulette_desc: 'Класична рулетка на 37 секторів. Став на червоне/чорне, числа або дюжини!',
    game_badge_active: 'АКТИВНО',
    btn_play: 'Грати зараз →',
    
    // Blackjack
    bj_dealer: 'Дилер',
    bj_player: 'Гравець',
    bj_bet_prompt: 'Обери розмір ставки та тисни "Роздати":',
    bj_deal: '🃏 Роздати карти',
    bj_hit: '➕ Взяти (Hit)',
    bj_stand: '✋ Досить (Stand)',
    bj_double: '⚡ Подвоїти (x2)',
    bj_new: '🔄 Нова гра',
    bj_win: '🎉 Ти виграв!',
    bj_natural_bj: '🔥 БЛЕКДЖЕК! Виплата 3:2!',
    bj_bust: '💥 Перебір! Більше 21 очка.',
    bj_dealer_bust: '🎉 Дилер перебрав! Перемога!',
    bj_dealer_won: '😔 Дилер переміг.',
    bj_push: '🤝 Нічия (Push)! Ставку повернуто.',
    
    // Sound & Theme
    snd_title: '🔊 Гучність',
    snd_music: 'Фонова музика',
    snd_fx: 'Звукові ефекти',
    theme_dark: '🌑 Темна тема',
    theme_light: '☀️ Світла тема',
    coins: 'монет',
    chips: 'фішок',
    lbl_remove_av: 'Видалити аватар',
  },
  ru: {
    nav_home: '🏠 Главная',
    nav_cards: '🃏 Карточные игры',
    nav_crash: '💥 Crash',
    nav_cases: '🎁 Кейсы',
    nav_wheel: '🎡 Колесо',
    pd_profile: '👤 Мой профиль',
    pd_deposit: '💳 Пополнить',
    pd_withdraw: '💸 Вывести',
    pd_logout: '🚪 Выйти',
    arena: 'Gaming Arena',
    tab_reg: 'Регистрация',
    tab_login: 'Войти',
    lbl_first: 'Имя',
    lbl_last: 'Фамилия',
    lbl_login: 'Логин',
    lbl_birth: 'Год рождения',
    lbl_pass: 'Пароль',
    ph_first: 'Иван',
    ph_last: 'Петренко',
    btn_reg: 'Зарегистрироваться →',
    btn_login: 'Войти →',
    err_year: 'Введите правильный год',
    err_age: '❌ Регистрация с 13 лет',
    err_user: 'Логин минимум 3 символа',
    err_pass: 'Пароль минимум 4 символа',
    err_taken: 'Логин уже занят',
    err_notfound: 'Пользователь не найден',
    err_wrong: 'Неверный пароль или логин',
    ok_reg: '✅ Аккаунт создан!',
    ok_login: '✅ Вход выполнен!',
    
    // Profile
    prof_title: 'Мой профиль',
    prof_nickname: 'Никнейм',
    prof_save: 'Сохранить',
    prof_friends: 'Друзья',
    prof_codes: 'Коды',
    prof_danger: 'Опасная зона',
    prof_add_friend: 'Добавить друга',
    prof_friend_ph: 'Логин игрока',
    prof_code_ph: 'Введите код...',
    prof_activate: 'Активировать',
    prof_no_friends: 'У тебя пока нет друзей 👋',
    prof_del_coins: 'Удалить все монеты',
    prof_del_confirm: '⚠️ Подтвердить удаление монет',
    prof_del_warn: 'Это действие удалит все твои монеты без возможности восстановления!',
    prof_coins_deleted: '✅ Монеты удалены',
    prof_mod_give: 'Выдать монеты (MOD)',
    prof_registered: 'Зарегистрирован',
    prof_balance: 'Баланс',
    spec_ip: 'IP-адрес',
    spec_device: 'Устройство',
    spec_os: 'Операционная система',
    spec_browser: 'Браузер',
    spec_res: 'Экран',
    spec_cpu: 'Ядра CPU',
    spec_time: 'Дата фиксации',
    spec_download: '📄 Скачать отчет (.txt)',
    btn_deposit: '+ Пополнить',
    btn_withdraw: 'Вывести',

    // In Dev Popups
    dev_topup_title: '💳 Пополнение баланса',
    dev_topup_desc: 'Платежный шлюз сейчас находится на этапе тестирования. Пополнение скоро станет доступно!',
    dev_withdraw_title: '💸 Вывод средств',
    dev_withdraw_desc: 'Модуль вывода средств в процессе интеграции.',
    dev_game_title: '🎮 Игра в разработке',
    dev_game_desc: 'Этот игровой режим находится в разработке.',
    btn_got_it: 'Понятно',

    // Maintenance / Rework
    maint_tag: '🛠️ НА ПЕРЕРАБОТКЕ',
    maint_cases_title: 'Кейсы временно закрыты',
    maint_wheel_title: 'Колесо фортуны на переработке',
    maint_desc: 'Данная игра на переработке. Спасибо за понимание! Мы улучшаем анимации и призы для вас.',
    btn_to_home: '🏠 На главную',
    btn_to_cards: '🃏 Карточные игры',
    btn_to_crash: '💥 Играть в Crash',

    // Card Games & Cashier
    cards_hub_title: 'Карточный клуб VØID',
    cards_hub_desc: 'Выбирай игру, делай ставки фишками и побеждай!',
    cashier_title: '🎩 Кассир казино',
    cashier_desc: 'Курс обмена: 1 фишка = 50 монет. При выходе с вкладки все фишки автоматически обмениваются обратно в монеты!',
    btn_open_cashier: '💵 Обменник фишек',
    chips_balance: 'Твои фишки',
    buy_chips: 'Купить фишки',
    cashout_chips: 'Обменять все фишки на монеты',
    chips_exchanged_ok: '✅ Фишки успешно обменяны на монеты!',
    no_chips_err: 'У тебя закончились фишки. Купи их у кассира!',
    no_coins_err: 'Недостаточно монет для покупки фишек!',
    game_bj_name: '🃏 Блэкджек (21)',
    game_bj_desc: 'Классический блэкджек против умного AI дилера. Набирай 21 и удваивай ставки!',
    game_poker_name: '🎪 Crazy Time Live',
    game_poker_desc: 'Легендарное колесо фортуны с Топ-слотом и 4 бонусными играми: Coin Flip, Pachinko, Cash Hunt и Crazy Time!',
    game_roulette_name: '🎡 Европейская рулетка',
    game_roulette_desc: 'Классическая рулетка на 37 секторов. Ставь на красное/черное, числа или дюжины!',
    game_badge_active: 'АКТИВНО',
    btn_play: 'Играть сейчас →',

    // Blackjack
    bj_dealer: 'Дилер',
    bj_player: 'Игрок',
    bj_bet_prompt: 'Выбери ставку фишками и жми "Раздать":',
    bj_deal: '🃏 Раздать карты',
    bj_hit: '➕ Взять (Hit)',
    bj_stand: '✋ Хватит (Stand)',
    bj_double: '⚡ Удвоить (x2)',
    bj_new: '🔄 Новая игра',
    bj_win: '🎉 Ты выиграл!',
    bj_natural_bj: '🔥 БЛЭКДЖЕК! Выплата 3:2!',
    bj_bust: '💥 Перебор! Больше 21 очка.',
    bj_dealer_bust: '🎉 Дилер перебрал! Победа!',
    bj_dealer_won: '😔 Дилер победил.',
    bj_push: '🤝 Ничья (Push)! Ставка возвращена.',

    // Sound & Theme
    snd_title: '🔊 Громкость',
    snd_music: 'Фоновая музыка',
    snd_fx: 'Звуковые эффекты',
    theme_dark: '🌑 Темная тема',
    theme_light: '☀️ Светлая тема',
    coins: 'монет',
    chips: 'фишек',
    lbl_remove_av: 'Удалить аватар',
  },
  en: {
    nav_home: '🏠 Home',
    nav_cards: '🃏 Card Games',
    nav_crash: '💥 Crash',
    nav_cases: '🎁 Cases',
    nav_wheel: '🎡 Wheel',
    pd_profile: '👤 My Profile',
    pd_deposit: '💳 Deposit',
    pd_withdraw: '💸 Withdraw',
    pd_logout: '🚪 Log Out',
    arena: 'Gaming Arena',
    tab_reg: 'Register',
    tab_login: 'Log In',
    lbl_first: 'First name',
    lbl_last: 'Last name',
    lbl_login: 'Username',
    lbl_birth: 'Birth year',
    lbl_pass: 'Password',
    ph_first: 'John',
    ph_last: 'Smith',
    btn_reg: 'Register →',
    btn_login: 'Log In →',
    err_year: 'Enter a valid year',
    err_age: '❌ Must be 13+ to register',
    err_user: 'Username min 3 chars',
    err_pass: 'Password min 4 chars',
    err_taken: 'Username already taken',
    err_notfound: 'User not found',
    err_wrong: 'Wrong username or password',
    ok_reg: '✅ Account created!',
    ok_login: '✅ Logged in!',
    
    // Profile
    prof_title: 'My Profile',
    prof_nickname: 'Nickname',
    prof_save: 'Save',
    prof_friends: 'Friends',
    prof_codes: 'Codes',
    prof_danger: 'Danger Zone',
    prof_add_friend: 'Add friend',
    prof_friend_ph: "Player's username",
    prof_code_ph: 'Enter code...',
    prof_activate: 'Activate',
    prof_no_friends: "You don't have friends yet 👋",
    prof_del_coins: 'Delete all coins',
    prof_del_confirm: '⚠️ Confirm coin deletion',
    prof_del_warn: 'This action will permanently delete all your coins!',
    prof_coins_deleted: '✅ Coins deleted',
    prof_mod_give: 'Give coins (MOD)',
    prof_registered: 'Registered',
    prof_balance: 'Balance',
    spec_ip: 'IP Address',
    spec_device: 'Device',
    spec_os: 'Operating System',
    spec_browser: 'Browser',
    spec_res: 'Resolution',
    spec_cpu: 'CPU Cores',
    spec_time: 'Recorded at',
    spec_download: '📄 Download specs report (.txt)',
    btn_deposit: '+ Deposit',
    btn_withdraw: 'Withdraw',

    // In Dev Popups
    dev_topup_title: '💳 Deposit Coins',
    dev_topup_desc: 'Payment gateway is currently undergoing integration testing.',
    dev_withdraw_title: '💸 Withdraw Funds',
    dev_withdraw_desc: 'Withdrawal pipeline is currently in development.',
    dev_game_title: '🎮 Game In Development',
    dev_game_desc: 'This game mode is in active development.',
    btn_got_it: 'Got it',

    // Maintenance / Rework
    maint_tag: '🛠️ UNDER MAINTENANCE',
    maint_cases_title: 'Cases Under Rework',
    maint_wheel_title: 'Wheel Under Maintenance',
    maint_desc: 'This game is under maintenance. Thank you for your understanding! We are upgrading animations and payouts.',
    btn_to_home: '🏠 Back to Home',
    btn_to_cards: '🃏 Card Games',
    btn_to_crash: '💥 Play Crash',

    // Card Games & Cashier
    cards_hub_title: 'VØID Card Club',
    cards_hub_desc: 'Pick a game, place chip bets, and win big!',
    cashier_title: '🎩 Casino Cashier',
    cashier_desc: 'Exchange rate: 1 chip = 50 coins. When leaving this tab, all chips automatically convert back into coins!',
    btn_open_cashier: '💵 Chip Cashier',
    chips_balance: 'Your Chips',
    buy_chips: 'Buy Chips',
    cashout_chips: 'Cash Out All Chips to Coins',
    chips_exchanged_ok: '✅ Chips successfully converted back to coins!',
    no_chips_err: 'You ran out of chips. Buy some at the cashier!',
    no_coins_err: 'Not enough coins to buy chips!',
    game_bj_name: '🃏 Blackjack (21)',
    game_bj_desc: 'Classic blackjack vs smart AI dealer. Hit 21 and double your bets!',
    game_poker_name: '🎪 Crazy Time Live',
    game_poker_desc: 'Legendary 1win fortune wheel with Top Slot multipliers and 4 bonus games: Coin Flip, Pachinko, Cash Hunt & Crazy Time!',
    game_roulette_name: '🎡 European Roulette',
    game_roulette_desc: 'European 37-number roulette. Bet on red/black, numbers, or dozens!',
    game_badge_active: 'ACTIVE',
    btn_play: 'Play Now →',

    // Blackjack
    bj_dealer: 'Dealer',
    bj_player: 'Player',
    bj_bet_prompt: 'Choose your chip bet and press "Deal Cards":',
    bj_deal: '🃏 Deal Cards',
    bj_hit: '➕ Hit',
    bj_stand: '✋ Stand',
    bj_double: '⚡ Double (x2)',
    bj_new: '🔄 New Game',
    bj_win: '🎉 You Won!',
    bj_natural_bj: '🔥 BLACKJACK! Payout 3:2!',
    bj_bust: '💥 Bust! Over 21 points.',
    bj_dealer_bust: '🎉 Dealer Busts! Victory!',
    bj_dealer_won: '😔 Dealer Wins.',
    bj_push: '🤝 Push (Tie)! Bet returned.',

    // Sound & Theme
    snd_title: '🔊 Volume',
    snd_music: 'Background music',
    snd_fx: 'Sound effects',
    theme_dark: '🌑 Dark Theme',
    theme_light: '☀️ Light Theme',
    coins: 'coins',
    chips: 'chips',
    lbl_remove_av: 'Remove avatar',
  }
};

let currentLang = localStorage.getItem('vp_lang') || 'uk';
function t(k) { return (LANG[currentLang] || LANG.uk)[k] || k; }

function setLang(l) {
  currentLang = l;
  localStorage.setItem('vp_lang', l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  applyLang();
  
  if (document.getElementById('navbar') && window.vpActivePage) {
    buildNavbar(window.vpActivePage);
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

/* ── THEME MANAGEMENT ─────────────────────────────── */
function getTheme() { return localStorage.getItem('vp_theme') || 'dark'; }

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('vp_theme', theme);
  document.querySelectorAll('.theme-btn, .theme-toggle-btn').forEach(btn => {
    btn.title = theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
    btn.textContent = theme === 'dark' ? '☀️' : '🌑';
  });
}

function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

(function() { applyTheme(getTheme()); })();

/* ── AUTH & USER STATE ────────────────────────────── */
function getToken() { return localStorage.getItem('vp_token'); }
function setToken(token) { localStorage.setItem('vp_token', token); }

function getMe() {
  try {
    return JSON.parse(localStorage.getItem('vp_me') || 'null');
  } catch(e) {
    return null;
  }
}

function saveMeLocal(user) {
  if (user) {
    localStorage.setItem('vp_me', JSON.stringify(user));
  } else {
    localStorage.removeItem('vp_me');
  }
}

async function refreshMe() {
  if (!getToken()) return null;
  const res = await apiFetch('/api/auth/me');
  if (res && res.ok && res.user) {
    saveMeLocal(res.user);
    syncUIBalance();
    return res.user;
  }
  return null;
}

function patchMe(fields) {
  const me = getMe();
  if (me) {
    Object.assign(me, fields);
    saveMeLocal(me);
    syncUIBalance();
  }
}

function syncUIBalance() {
  const me = getMe();
  if (!me) return;
  const b = me.balance ?? 500;
  const c = me.chips ?? 0;
  document.querySelectorAll('.js-coins').forEach(el => el.textContent = b);
  document.querySelectorAll('.js-chips').forEach(el => el.textContent = c);
}

function requireAuth() {
  if (!getToken() || !getMe()) {
    const isStatic = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';
    if (isStatic) {
      const guest = {
        id: 7777,
        username: 'Гравець',
        nickname: 'Гість VIP',
        role: 'user',
        balance: 50000,
        chips: 1000,
        is_offline_mode: true
      };
      setToken('guest_' + Date.now());
      saveMeLocal(guest);
      syncUIBalance();
      return;
    }
    const curr = encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search + window.location.hash);
    window.location.replace('register2.html?redirect=' + curr);
  } else {
    refreshMe();
  }
}

function redirectIfLoggedIn() {
  if (getToken() && getMe()) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect') || 'index.html';
    window.location.replace(redirect);
  }
}

function doLogout() {
  autoCashoutChips();
  localStorage.removeItem('vp_token');
  localStorage.removeItem('vp_me');
  window.location.href = 'register2.html';
}

/* ── BALANCE (COINS) ──────────────────────────────── */
function getBalance() {
  const m = getMe();
  return m ? (m.balance ?? 500) : 0;
}

function setBalance(val) {
  const v = Math.max(0, Math.round(val));
  patchMe({ balance: v });
  apiFetch('/api/user/balance', {
    method: 'POST',
    body: JSON.stringify({ balance: v })
  });
}

/* ── CHIPS SYSTEM (1 CHIP = 50 COINS) ─────────────── */
const CHIP_RATE = 50;

function getChips() {
  const m = getMe();
  return m ? (m.chips ?? 0) : 0;
}

function setChips(val) {
  const v = Math.max(0, Math.round(val));
  patchMe({ chips: v });
  apiFetch('/api/user/chips', {
    method: 'POST',
    body: JSON.stringify({ chips: v })
  });
}

async function buyChips(chipCount) {
  const count = parseInt(chipCount, 10);
  if (isNaN(count) || count <= 0) return { ok: false, msg: 'Некоректна кількість' };
  
  const res = await apiFetch('/api/user/buy-chips', {
    method: 'POST',
    body: JSON.stringify({ chipCount: count })
  });

  if (res && res.ok) {
    patchMe({ balance: res.balance, chips: res.chips });
    playChipSound();
    return { ok: true, count: res.bought, cost: res.cost };
  }

  // Offline / GitHub Pages local fallback
  const cost = count * CHIP_RATE;
  if (getBalance() >= cost) {
    patchMe({ balance: getBalance() - cost, chips: getChips() + count });
    playChipSound();
    return { ok: true, count: count, cost: cost };
  }
  return { ok: false, msg: (res && res.detail) ? res.detail : (t('no_coins_err') || 'Недостатньо монет') };
}

async function cashoutChips() {
  const res = await apiFetch('/api/user/cashout-chips', {
    method: 'POST'
  });

  if (res && res.ok) {
    patchMe({ balance: res.balance, chips: 0 });
    playChipSound();
    return { ok: true, chips: res.cashed, coinsGain: res.gained };
  }

  // Offline / GitHub Pages local fallback
  const curChips = getChips();
  if (curChips > 0) {
    const gain = curChips * CHIP_RATE;
    patchMe({ balance: getBalance() + gain, chips: 0 });
    playChipSound();
    return { ok: true, chips: curChips, coinsGain: gain };
  }
  return { ok: false, msg: 'Помилка обміну' };
}

function autoCashoutChips() {
  const chips = getChips();
  if (chips > 0) {
    apiFetch('/api/user/cashout-chips', { method: 'POST' });
    const coinsGain = chips * CHIP_RATE;
    patchMe({ balance: getBalance() + coinsGain, chips: 0 });
  }
}

/* ── SOUND FX ─────────────────────────────────────── */
function getFxVol() { return parseFloat(localStorage.getItem('vp_vol_fx') ?? '0.5'); }
function setFxVol(v) { localStorage.setItem('vp_vol_fx', parseFloat(v)); }
function getMusicVol() { return parseFloat(localStorage.getItem('vp_vol_music') ?? '0.3'); }
function setMusicVol(v) {
  v = parseFloat(v);
  localStorage.setItem('vp_vol_music', v);
  if (_bgm) _bgm.volume = v;
}

function playChipSound() {
  try {
    const vol = getFxVol(); if (vol <= 0) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.3 * vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.09);
  } catch(e) {}
}

function playCardSound() {
  try {
    const vol = getFxVol(); if (vol <= 0) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    g.gain.value = 0.25 * vol;
    src.buffer = buf;
    src.connect(g); g.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

function playWinSound() {
  try {
    const vol = getFxVol(); if (vol <= 0) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const tStart = ctx.currentTime + idx * 0.09;
      g.gain.setValueAtTime(0.25 * vol, tStart);
      g.gain.exponentialRampToValueAtTime(0.001, tStart + 0.28);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(tStart); osc.stop(tStart + 0.3);
    });
  } catch(e) {}
}

/* ── "IN DEVELOPMENT" POPUP MODAL ─────────────────── */
function openDevModal(type) {
  closeDevModal();
  let title = t('dev_topup_title');
  let desc = t('dev_topup_desc');
  let icon = '💳';
  
  if (type === 'withdraw') {
    title = t('dev_withdraw_title');
    desc = t('dev_withdraw_desc');
    icon = '💸';
  } else if (type === 'game') {
    title = t('dev_game_title');
    desc = t('dev_game_desc');
    icon = '🎮';
  }

  const modal = document.createElement('div');
  modal.id = 'vp-dev-modal';
  modal.className = 'dev-modal-overlay';
  modal.onclick = (e) => { if (e.target === modal) closeDevModal(); };
  modal.innerHTML = `
    <div class="dev-modal">
      <div class="dev-modal-icon">${icon}</div>
      <div class="dev-modal-title">${title}</div>
      <div class="dev-modal-text">${desc}</div>
      <button class="btn btn-primary btn-full" onclick="closeDevModal()">${t('btn_got_it')}</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeDevModal() {
  const m = document.getElementById('vp-dev-modal');
  if (m) m.remove();
}

/* ── GLOBAL NAVBAR BUILDER (CLEAN NO DOUBLE EMOJIS) ── */
function buildNavbar(activePage) {
  window.vpActivePage = activePage;
  const el = document.getElementById('navbar');
  if (!el) return;
  const me = getMe();
  const bal = me ? (me.balance ?? 500) : 0;
  const av = me ? me.avatar_url : null;
  const role = me ? (me.role || 'user') : 'user';

  const links = [
    { key: 'nav_home',  href: 'index.html', page: 'home'  },
    { key: 'nav_cards', href: 'cards.html', page: 'cards' },
    { key: 'nav_crash', href: 'crash.html', page: 'crash' },
    { key: 'nav_cases', href: 'cases.html', page: 'cases' },
    { key: 'nav_wheel', href: 'wheel.html', page: 'wheel' },
  ];

  const avatarHtml = av
    ? `<img src="${av}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;">`
    : `<div class="profile-avatar">${me ? (((me.first_name || me.first || me.username || '?')[0]) + ((me.last_name || me.last || '')[0] || '')).toUpperCase() : '?'}</div>`;

  const modBadge = role === 'moderator' ? `<span class="mod-badge-sm">MOD</span>` : '';

  el.innerHTML = `
    <a href="index.html" class="nav-logo">
      <span class="nav-logo-title">VØIDᴘʟᴀʏ</span>
      <span class="nav-logo-sub" data-i="arena">${t('arena')}</span>
    </a>
    <nav class="nav-links">
      ${links.map(l => `
        <a href="${l.href}" class="nav-link${activePage === l.page ? ' active' : ''}" 
           ${(activePage === 'cards' && l.page !== 'cards') ? 'onclick="autoCashoutChips()"' : ''}>
          <span class="nav-link-text" data-i="${l.key}">${t(l.key)}</span>
        </a>
      `).join('')}
    </nav>
    <div class="nav-right">
      <button class="lang-btn${currentLang==='uk'?' active':''}" data-lang="uk" onclick="setLang('uk')">🇺🇦</button>
      <button class="lang-btn${currentLang==='ru'?' active':''}" data-lang="ru" onclick="setLang('ru')">🇷🇺</button>
      <button class="lang-btn${currentLang==='en'?' active':''}" data-lang="en" onclick="setLang('en')">🇬🇧</button>
      
      ${me ? `
      <div class="nav-coins-wrap">
        <div class="nav-coins">🪙 <span class="js-coins">${bal}</span></div>
        <button class="nav-coins-plus" title="${t('pd_deposit')}" onclick="openDevModal('topup')">+</button>
      </div>

      <div class="profile-wrap" id="profile-wrap">
        <button class="profile-toggle" onclick="toggleProfileDrop()">
          ${avatarHtml}
          <span class="profile-name">${me.nickname || me.first_name || me.username}</span>
          ${modBadge}
          <svg class="profile-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="pd-head">
            <div class="pd-fullname">${me.nickname || ((me.first_name||'')+' '+(me.last_name||''))}</div>
            <div class="pd-username">@${me.username}${role==='moderator'?' <span class="mod-badge-sm">MOD</span>':''}</div>
            <div class="pd-coins">🪙 <span class="js-coins">${bal}</span> ${t('coins')}</div>
          </div>
          <button class="pd-item" onclick="location.href='profile.html'">${t('pd_profile')}</button>
          <button class="pd-item" onclick="openDevModal('topup')">${t('pd_deposit')}</button>
          <button class="pd-item" onclick="openDevModal('withdraw')">${t('pd_withdraw')}</button>
          <div class="pd-sep"></div>
          <button class="pd-item" onclick="location.href='cards.html'">${t('nav_cards')}</button>
          <button class="pd-item" onclick="location.href='crash.html'">${t('nav_crash')}</button>
          <button class="pd-item" onclick="location.href='cases.html'">${t('nav_cases')}</button>
          <button class="pd-item" onclick="location.href='wheel.html'">${t('nav_wheel')}</button>
          <div class="pd-sep"></div>
          <button class="pd-item" onclick="openSoundPopup()">${t('snd_title')}</button>
          <button class="pd-item" onclick="toggleTheme()">${getTheme()==='dark'?'☀️ Світла тема':'🌑 Темна тема'}</button>
          <div class="pd-sep"></div>
          <button class="pd-item danger" onclick="doLogout()">${t('pd_logout')}</button>
        </div>
      </div>` : ''}
      <button class="music-btn" id="music-btn" onclick="toggleMusic()" title="Music">🔊</button>
      <button class="theme-btn" onclick="toggleTheme()" title="Theme">${getTheme()==='dark'?'☀️':'🌑'}</button>
    </div>`;

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

/* ── AVATARS & ROLES ──────────────────────────────── */
function getRole() { const m = getMe(); return m ? (m.role || 'user') : 'user'; }
function isMod() { return getRole() === 'moderator'; }

async function tryActivateCode(code) {
  const res = await apiFetch('/api/user/activate-code', {
    method: 'POST',
    body: JSON.stringify({ code })
  });
  if (res && res.ok) {
    patchMe({ role: res.role });
    return { ok: true, msg: res.msg };
  }
  return { ok: false, msg: (res && res.msg) || '❌ Невірний код' };
}

/* ── BACKGROUND MUSIC ─────────────────────────────── */
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

/* ── SOUND POPUP ──────────────────────────────────── */
function openSoundPopup() {
  closeSoundPopup();
  const popup = document.createElement('div');
  popup.id = 'vp-sound-popup';
  popup.innerHTML = `
    <div onclick="closeSoundPopup()" style="position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.65);backdrop-filter:blur(5px);"></div>
    <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9001;
      background:var(--surface);border:1px solid var(--border-primary);border-radius:18px;
      padding:28px 30px;min-width:300px;max-width:92vw;
      box-shadow:var(--shadow-card);animation:fadeUp .25s ease both;">
      <div style="font-size:16px;font-weight:900;margin-bottom:22px;color:var(--text);">${t('snd_title')}</div>
      <div style="margin-bottom:18px;">
        <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px;">${t('snd_music')}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:16px;">🎵</span>
          <input type="range" id="snd-music-range" min="0" max="100" value="${Math.round(getMusicVol()*100)}"
            style="flex:1;accent-color:var(--primary);height:4px;"
            oninput="setMusicVol(this.value/100);document.getElementById('snd-music-val').textContent=this.value+'%'">
          <span id="snd-music-val" style="font-size:13px;font-weight:700;color:var(--primary-light);min-width:38px;text-align:right;">${Math.round(getMusicVol()*100)}%</span>
        </div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px;">${t('snd_fx')}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:16px;">🔔</span>
          <input type="range" id="snd-fx-range" min="0" max="100" value="${Math.round(getFxVol()*100)}"
            style="flex:1;accent-color:var(--primary);height:4px;"
            oninput="setFxVol(this.value/100);document.getElementById('snd-fx-val').textContent=this.value+'%'">
          <span id="snd-fx-val" style="font-size:13px;font-weight:700;color:var(--primary-light);min-width:38px;text-align:right;">${Math.round(getFxVol()*100)}%</span>
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="closeSoundPopup()">OK</button>
    </div>`;
  document.body.appendChild(popup);
}
function closeSoundPopup() {
  const p = document.getElementById('vp-sound-popup');
  if (p) p.remove();
}

/* ── SCROLL REVEAL & STATS COUNTERS ── */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  function check() {
    const trigger = window.innerHeight * 0.88;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add('visible');
    });
  }
  window.addEventListener('scroll', check);
  check();
}

function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;
  let animated = false;

  function run() {
    if (animated) return;
    const first = nums[0].getBoundingClientRect().top;
    if (first < window.innerHeight * 0.9) {
      animated = true;
      nums.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 45));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString('uk-UA');
        }, 25);
      });
    }
  }
  window.addEventListener('scroll', run);
  run();
}
