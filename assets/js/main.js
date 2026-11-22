/* ============================================================
   Dark Mode Toggle
   ============================================================ */
(function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  var icon  = toggle.querySelector('.toggle-icon');
  var label = toggle.querySelector('.toggle-label');

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    var isDark = theme === 'dark';
    if (icon)  icon.textContent  = isDark ? '☀' : '☾';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  applyTheme(getTheme());

  toggle.addEventListener('click', function () {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
})();

/* ============================================================
   Footer year
   ============================================================ */
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* ============================================================
   Gallery Lightbox
   Each .gallery-link points at the large image, so the gallery
   still works (opens the image directly) if this doesn't run.
   ============================================================ */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery-link'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML =
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</figure>' +
    '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">&#8249;</button>' +
    '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">&#8250;</button>';
  document.body.appendChild(dialog);

  var img     = dialog.querySelector('.lightbox-img');
  var caption = dialog.querySelector('.lightbox-caption');
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    var link  = links[current];
    var thumb = link.querySelector('img');
    var cap   = link.closest('figure').querySelector('figcaption');
    img.src = link.href;
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = cap ? cap.textContent : '';
    caption.hidden = !caption.textContent;
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

  // Click on the dark backdrop (not the image or buttons) closes the viewer
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Return focus to the photo the viewer ended on
  dialog.addEventListener('close', function () { links[current].focus(); });
})();
