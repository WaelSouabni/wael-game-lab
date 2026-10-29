/**
 * FunisLearn — moteur commun de progression (sans dépendance).
 *
 * Intégration dans une page de jeu :
 *   <link rel="stylesheet" href="../assets/css/funis-progression.css">
 *   <script src="../assets/js/funis-progression.js" defer></script>
 *   const progress = FunisProgress.init('formes', { totalLevels: 5 });
 *   const level = progress.getCurrentLevel();
 *   // Après la vraie réussite du niveau :
 *   progress.completeLevel({ score: 100, maxScore: 100 });
 *
 * Les pages doivent appeler completeLevel uniquement après une réussite réelle.
 * Aucune donnée n'est envoyée au serveur.
 */
(function (window, document) {
  'use strict';

  const STORAGE_KEY = 'funislearn-progress-v1';
  const DEFAULT_LEVELS = 5;
  const GAME_IDS = new Set([
    'formes', 'suite', 'robot', 'ombre', 'compte', 'lettres', 'ordre',
    'humeur', 'compliments', 'lettres-mots', 'calcul', 'memoire-tunisie',
    'environnement'
  ]);

  const COPY = {
    fr: {
      level: 'Niveau', of: 'sur', stars: 'Étoiles', next: 'Niveau suivant',
      replay: 'Rejouer ce niveau', complete: 'Bravo ! Niveau réussi !',
      allDone: 'Incroyable ! Tous les niveaux sont terminés !',
      reward: 'Récompense gagnée !', close: 'Continuer', badge: 'Petit champion',
      reset: 'Recommencer la progression'
    },
    ar: {
      level: 'المستوى', of: 'من', stars: 'النجوم', next: 'المستوى التالي',
      replay: 'أعد هذا المستوى', complete: 'أحسنت! نجحت في المستوى!',
      allDone: 'رائع! أكملت كل المستويات!',
      reward: 'لقد حصلت على مكافأة!', close: 'متابعة', badge: 'بطل صغير',
      reset: 'إعادة التقدم من البداية'
    }
  };

  function readStore() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function writeStore(store) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return true;
    } catch (_) {
      return false;
    }
  }

  function clamp(value, min, max) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
  }

  function starsFor(score, maxScore) {
    if (maxScore <= 0) return 1;
    const ratio = clamp(score / maxScore, 0, 1);
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.6) return 2;
    return 1;
  }

  function getGameRecord(gameId, totalLevels) {
    const store = readStore();
    const old = store[gameId] && typeof store[gameId] === 'object' ? store[gameId] : {};
    const completed = Array.isArray(old.completed)
      ? [...new Set(old.completed.map(n => Math.floor(Number(n))).filter(n => n >= 1 && n <= totalLevels))]
      : [];
    const starMap = old.stars && typeof old.stars === 'object' ? old.stars : {};
    const stars = {};
    completed.forEach(level => { stars[level] = clamp(starMap[level], 0, 3); });
    return {
      completed,
      stars,
      unlocked: clamp(old.unlocked || 1, 1, totalLevels),
      bestScore: old.bestScore && typeof old.bestScore === 'object' ? old.bestScore : {},
      updatedAt: typeof old.updatedAt === 'string' ? old.updatedAt : null
    };
  }

  function saveGameRecord(gameId, record) {
    const store = readStore();
    store[gameId] = Object.assign({}, record, { updatedAt: new Date().toISOString() });
    return writeStore(store);
  }

  function getLanguage() {
    const lang = document.documentElement.lang || 'fr';
    return lang.toLowerCase().startsWith('ar') ? 'ar' : 'fr';
  }

  function init(gameId, options) {
    if (!GAME_IDS.has(gameId)) {
      throw new Error('[FunisProgress] Identifiant de jeu inconnu : ' + gameId);
    }
    const opts = options || {};
    const totalLevels = Math.floor(clamp(opts.totalLevels || DEFAULT_LEVELS, 1, 20));
    const record = getGameRecord(gameId, totalLevels);
    let currentLevel = record.unlocked;
    let host = null;
    let lastDialog = null;

    function text(key) { return COPY[getLanguage()][key]; }

    function ensureHost() {
      if (host && host.isConnected) return host;
      host = document.createElement('section');
      host.className = 'funis-progress';
      host.setAttribute('aria-label', 'FunisLearn progress');
      host.innerHTML =
        '<div class="funis-progress__top">' +
          '<span class="funis-progress__label"></span>' +
          '<span class="funis-progress__count"></span>' +
        '</div>' +
        '<div class="funis-progress__track" role="progressbar" aria-valuemin="1" aria-valuemax="' + totalLevels + '">' +
          '<span class="funis-progress__fill"></span>' +
        '</div>' +
        '<div class="funis-progress__levels"></div>' +
        '<p class="funis-progress__stars" aria-live="polite"></p>';
      const anchor = opts.mount && document.querySelector(opts.mount);
      (anchor || document.querySelector('header') || document.body).insertAdjacentElement(anchor ? 'afterend' : 'beforeend', host);
      render();
      return host;
    }

    function render() {
      if (!host) return;
      const completedCount = record.completed.length;
      const totalStars = Object.values(record.stars).reduce((sum, n) => sum + n, 0);
      host.querySelector('.funis-progress__label').textContent = text('level');
      host.querySelector('.funis-progress__count').textContent = currentLevel + ' ' + text('of') + ' ' + totalLevels;
      host.querySelector('.funis-progress__fill').style.width = (completedCount / totalLevels * 100) + '%';
      const track = host.querySelector('.funis-progress__track');
      track.setAttribute('aria-valuenow', String(completedCount));
      host.querySelector('.funis-progress__levels').innerHTML = Array.from({ length: totalLevels }, (_, i) => {
        const level = i + 1;
        const done = record.completed.includes(level);
        const locked = level > record.unlocked;
        const current = level === currentLevel;
        return '<span class="funis-progress__level' + (done ? ' is-done' : '') +
          (locked ? ' is-locked' : '') + (current ? ' is-current' : '') +
          '" aria-label="' + text('level') + ' ' + level + '">' +
          (done ? '✓' : locked ? '🔒' : level) + '</span>';
      }).join('');
      host.querySelector('.funis-progress__stars').textContent = '⭐ ' + totalStars + ' ' + text('stars');
    }

    function closeDialog() {
      if (lastDialog && lastDialog.isConnected) lastDialog.remove();
      lastDialog = null;
    }

    function celebrate(level, earnedStars) {
      closeDialog();
      const dialog = document.createElement('div');
      dialog.className = 'funis-celebration';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'funis-celebration-title');
      const finished = level >= totalLevels;
      dialog.innerHTML =
        '<div class="funis-celebration__backdrop"></div>' +
        '<div class="funis-celebration__card">' +
          '<div class="funis-celebration__burst" aria-hidden="true">🎉 ✨ ⭐ 🎊</div>' +
          '<div class="funis-celebration__trophy" aria-hidden="true">' + (finished ? '🏆' : '🌟') + '</div>' +
          '<h2 id="funis-celebration-title"></h2>' +
          '<p class="funis-celebration__reward"></p>' +
          '<p class="funis-celebration__earned" aria-label="' + text('stars') + '"></p>' +
          '<button type="button" class="funis-celebration__button"></button>' +
        '</div>';
      dialog.querySelector('h2').textContent = finished ? text('allDone') : text('complete');
      dialog.querySelector('.funis-celebration__reward').textContent = text('reward') + ' ' + text('badge') + ' 🥇';
      dialog.querySelector('.funis-celebration__earned').textContent = '⭐'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
      const button = dialog.querySelector('button');
      button.textContent = finished ? text('close') : text('next');
      button.addEventListener('click', function () {
        closeDialog();
        if (!finished) {
          currentLevel = Math.min(level + 1, totalLevels);
          render();
          window.dispatchEvent(new CustomEvent('funis:level-changed', {
            detail: { gameId, level: currentLevel, totalLevels }
          }));
        } else {
          window.dispatchEvent(new CustomEvent('funis:all-levels-complete', {
            detail: { gameId, totalLevels, stars: Object.assign({}, record.stars) }
          }));
        }
      });
      dialog.querySelector('.funis-celebration__backdrop').addEventListener('click', closeDialog);
      document.body.appendChild(dialog);
      lastDialog = dialog;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const burst = dialog.querySelector('.funis-celebration__burst');
        burst.classList.add('is-animated');
      }
      button.focus();
    }

    function completeLevel(result) {
      const data = result || {};
      const level = Math.floor(clamp(data.level || currentLevel, 1, totalLevels));
      if (level > record.unlocked) return { ok: false, reason: 'locked' };
      const score = Number(data.score ?? 1);
      const maxScore = Number(data.maxScore ?? 1);
      const earnedStars = starsFor(score, maxScore);
      if (!record.completed.includes(level)) record.completed.push(level);
      record.completed.sort((a, b) => a - b);
      record.stars[level] = Math.max(record.stars[level] || 0, earnedStars);
      record.bestScore[level] = Math.max(Number(record.bestScore[level] || 0), Number.isFinite(score) ? score : 0);
      record.unlocked = Math.min(totalLevels, Math.max(record.unlocked, level + 1));
      saveGameRecord(gameId, record);
      currentLevel = level;
      render();
      if (data.celebrate !== false) celebrate(level, earnedStars);
      window.dispatchEvent(new CustomEvent('funis:level-completed', {
        detail: { gameId, level, totalLevels, stars: earnedStars, score }
      }));
      return { ok: true, level, stars: earnedStars, unlocked: record.unlocked };
    }

    function selectLevel(level) {
      const n = Math.floor(Number(level));
      if (!Number.isInteger(n) || n < 1 || n > record.unlocked) return false;
      currentLevel = n;
      render();
      window.dispatchEvent(new CustomEvent('funis:level-changed', {
        detail: { gameId, level: currentLevel, totalLevels }
      }));
      return true;
    }

    function reset() {
      record.completed = [];
      record.stars = {};
      record.bestScore = {};
      record.unlocked = 1;
      currentLevel = 1;
      saveGameRecord(gameId, record);
      closeDialog();
      render();
    }

    ensureHost();
    window.addEventListener('languagechange', render);
    return {
      gameId,
      totalLevels,
      getCurrentLevel: () => currentLevel,
      getProgress: () => JSON.parse(JSON.stringify(record)),
      selectLevel,
      completeLevel,
      reset,
      refresh: render,
      destroy: () => { closeDialog(); if (host) host.remove(); host = null; }
    };
  }

  window.FunisProgress = Object.freeze({
    init,
    getAllProgress: readStore,
    getGameIds: () => Array.from(GAME_IDS),
    storageKey: STORAGE_KEY
  });
})(window, document);
