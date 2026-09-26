(function(){
  "use strict";

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeNav(){
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function(){
    var open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeNav();
  });

  // Scroll-spy active nav link
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window && sections.length){
    var map = {};
    navLinks.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          navLinks.forEach(function(a){ a.classList.remove('active'); });
          var link = map[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function(s){ observer.observe(s); });
  }

  // Contact form -> mailto / WhatsApp
  var form = document.getElementById('contactForm');
  var nameField = document.getElementById('name');
  var emailField = document.getElementById('email');
  var messageField = document.getElementById('message');

  document.getElementById('sendEmail').addEventListener('click', function(){
    if (!form.reportValidity()) return;
    var subject = 'Portfolio enquiry from ' + nameField.value;
    var body = messageField.value + '\n\n— ' + nameField.value + ' (' + emailField.value + ')';
    window.location.href = 'mailto:yash99227744@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  });

  document.getElementById('sendWhatsapp').addEventListener('click', function(){
    if (!form.reportValidity()) return;
    var text = 'Hi Yash, I\'m ' + nameField.value + ' (' + emailField.value + ').\n\n' + messageField.value;
    window.open('https://wa.me/917290971368?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  // ---- Casual deterrents against right-click / devtools shortcuts ----
  // Note: these are speed bumps, not real protection — anyone can still
  // reach dev tools from the browser menu, so don't rely on this alone.
  document.addEventListener('contextmenu', function(e){
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e){
    var key = e.key;
    var blocked =
      key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].indexOf(key) !== -1) || // Win/Linux devtools
      (e.metaKey && e.altKey && ['I','i','J','j','C','c'].indexOf(key) !== -1) ||   // Mac devtools
      (e.ctrlKey && (key === 'U' || key === 'u'));                                   // view-source
    if (blocked){
      e.preventDefault();
    }
  });
})();
