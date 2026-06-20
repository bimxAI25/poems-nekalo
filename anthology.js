/* NOHCHICHO - sliding-window reader engine.
   Reads window.FALLBACK_POEMS / window.SUPABASE_URL / window.SUPABASE_ANON_KEY
   from poems.js. You normally don't need to edit this file. */
(function () {
  function $(id) { return document.getElementById(id); }
  var track = $('poemTrack'), dotsBox = $('poemDots'), emptyBox = $('poemEmpty');
  var tagsBox = $('poemTags'), titleEl = $('poemTitle'), authorEl = $('poemAuthor');
  var metaEl = $('poemMeta'), ctxEl = $('poemContext');
  var prevBtn = $('prevBtn'), nextBtn = $('nextBtn');

  var POEMS = window.FALLBACK_POEMS || [];
  var view = POEMS.slice();
  var idx = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function slideHtml(p) {
    var body = '';
    var stanzas = p.stanzas || [];
    for (var i = 0; i < stanzas.length; i++) {
      var last = (i === stanzas.length - 1);
      var lines = stanzas[i].map(esc).join('<br/>');
      body += '<p class="' + (last ? 'italic opacity-90' : '') + '">' + lines + '</p>';
      if (i === 2 && stanzas.length > 4) {
        body += '<div class="my-10 flex items-center justify-center">'
              + '<div class="w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>'
              + '<span class="material-symbols-outlined mx-6 text-secondary" style="font-variation-settings:\'FILL\' 1;">stat_3</span>'
              + '<div class="w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>'
              + '</div>';
      }
    }
    return '<div class="w-full flex-shrink-0 p-8 md:p-12 relative min-h-[500px] flex flex-col justify-center">'
         + '<div class="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">'
         + '<span class="material-symbols-outlined" style="font-size:200px">' + esc(p.motif || 'terrain') + '</span></div>'
         + '<div class="relative z-10 space-y-8 font-poem-body text-poem-body leading-relaxed text-on-surface/90">'
         + body + '</div></div>';
  }

  function render() {
    if (view.length === 0) {
      track.classList.add('hidden');
      emptyBox.classList.remove('hidden');
      dotsBox.innerHTML = '';
      tagsBox.innerHTML = '';
      titleEl.textContent = 'No results';
      authorEl.textContent = '';
      metaEl.textContent = '';
      ctxEl.textContent = '';
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }
    track.classList.remove('hidden');
    emptyBox.classList.add('hidden');
    var multi = view.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
    track.innerHTML = view.map(slideHtml).join('');
    var dots = '';
    for (var i = 0; i < view.length; i++) {
      dots += '<button data-i="' + i + '" class="w-2 h-2 rounded-full transition-all ' + (i === idx ? 'bg-secondary' : 'bg-secondary/30') + '"></button>';
    }
    dotsBox.innerHTML = dots;
    update();
  }

  function update() {
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    for (var i = 0; i < dotsBox.children.length; i++) {
      dotsBox.children[i].className = 'w-2 h-2 rounded-full transition-all ' + (i === idx ? 'bg-secondary' : 'bg-secondary/30');
    }
    var p = view[idx];
    tagsBox.innerHTML = (p.tags || []).map(function (t) {
      return '<span class="px-3 py-1 bg-surface-container-high text-on-tertiary-container rounded-lg font-ui-label-sm text-ui-label-sm uppercase">' + esc(t) + '</span>';
    }).join('');
    titleEl.textContent = p.title || '';
    authorEl.textContent = p.author || '';
    metaEl.textContent = p.meta || '';
    ctxEl.textContent = p.context || '';
  }

  function go(n) {
    if (view.length === 0) return;
    idx = (n + view.length) % view.length;
    update();
  }

  prevBtn.addEventListener('click', function () { go(idx - 1); });
  nextBtn.addEventListener('click', function () { go(idx + 1); });
  dotsBox.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    go(parseInt(b.getAttribute('data-i'), 10));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });
  $('poemSearch').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase();
    view = POEMS.filter(function (p) {
      if (!q) return true;
      var hay = (p.title + ' ' + p.author + ' ' + (p.stanzas || []).map(function (s) { return s.join(' '); }).join(' ')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    idx = 0;
    render();
  });

  var isFocusMode = false;
  $('focusBtn').addEventListener('click', function () {
    isFocusMode = !isFocusMode;
    var els = [
      document.querySelector('header'),
      document.querySelector('footer'),
      document.querySelector('main > section:first-of-type'),
      document.querySelector('main > section:last-of-type')
    ];
    els.forEach(function (el) {
      if (!el) return;
      if (isFocusMode) { el.style.opacity = '0.05'; el.style.pointerEvents = 'none'; el.style.transition = 'opacity 0.8s ease'; }
      else { el.style.opacity = '1'; el.style.pointerEvents = 'auto'; }
    });
    this.querySelector('span').innerText = isFocusMode ? 'visibility_off' : 'visibility';
  });

  $('audioControl').addEventListener('click', function () {
    var icon = this.querySelector('span');
    var label = this.querySelector('span:last-child');
    if (icon.innerText === 'play_circle') {
      icon.innerText = 'pause_circle'; label.innerText = 'Playing';
      this.classList.add('bg-secondary', 'text-on-secondary');
      this.classList.remove('bg-primary-container', 'text-primary');
    } else {
      icon.innerText = 'play_circle'; label.innerText = 'Listen';
      this.classList.remove('bg-secondary', 'text-on-secondary');
      this.classList.add('bg-primary-container', 'text-primary');
    }
  });

  function boot(list) {
    if (list && list.length) POEMS = list;
    view = POEMS.slice();
    var param = parseInt(new URLSearchParams(location.search).get('p'), 10);
    idx = (!isNaN(param) && param >= 0 && param < POEMS.length) ? param : 0;
    render();
  }

  function mapRow(r) {
    return { title: r.title, author: r.author, meta: r.meta, tags: r.tags || [], motif: r.motif || 'terrain', context: r.context, stanzas: r.stanzas || [] };
  }

  var url = window.SUPABASE_URL, key = window.SUPABASE_ANON_KEY;
  if (url && key) {
    fetch(url.replace(/\/+$/, '') + '/rest/v1/poems?select=*&order=sort_order.asc', {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function (rows) { boot(rows.map(mapRow)); })
      .catch(function () { boot(window.FALLBACK_POEMS); });
  } else {
    boot(window.FALLBACK_POEMS);
  }
})();
