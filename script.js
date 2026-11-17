const projects = [
  { theme:'luna', label:'actias-luna / room awareness', stack:'React · Python · ESP32 · Gemini', art:"<div class=\"actias-gallery\"><a class=\"actias-fullsize\" href=\"assets/actias-interface.jpg\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open full-size Actias 3D room screenshot\"><img class=\"actias-screenshot\" src=\"assets/actias-interface.jpg\" alt=\"Actias live 3D room dashboard showing a person's estimated position using Wi-Fi sensing\" width=\"806\" height=\"453\"></a><div class=\"actias-gallery-nav\" role=\"group\" aria-label=\"Actias project screenshots\"><button type=\"button\" data-actias-shot=\"0\" aria-pressed=\"true\" aria-label=\"Show 3D room dashboard\"><img src=\"assets/actias-interface.jpg\" alt=\"\" width=\"806\" height=\"453\"></button><button type=\"button\" data-actias-shot=\"1\" aria-pressed=\"false\" aria-label=\"Show voice assistant walkthrough\"><img src=\"assets/actias-room.jpg\" alt=\"\" width=\"806\" height=\"453\" loading=\"lazy\"></button><button type=\"button\" data-actias-shot=\"2\" aria-pressed=\"false\" aria-label=\"Show Actias title artwork\"><img src=\"assets/actias-title.jpg\" alt=\"\" width=\"806\" height=\"453\" loading=\"lazy\"></button></div><p class=\"actias-gallery-caption\" aria-live=\"polite\"><span>Live 3D room dashboard</span><span class=\"actias-gallery-count\">01 / 03</span></p></div>" },
  { theme:'standby', label:'standby / voice-powered travel', stack:'Python · Node.js · Snowflake · OpenAI', art:'<div class="art-kicker">STANDBY</div><h3>One sentence.<br>Your whole trip.</h3><div class="globe" aria-hidden="true"></div><span class="concept-label">Concept illustration · Voice-powered travel briefings</span>' },
  { theme:'aurelius', label:'aurelius / find your focus', stack:'React · Python · FastAPI · Arduino', art:'<div class="art-kicker">AURELIUS</div><h3>A little help<br>staying focused.</h3><div class="focus-ring" aria-hidden="true"><strong>25:00</strong><small>FOCUS SESSION</small></div><span class="concept-label">Concept illustration · AI-powered study focus system</span>' },
  { theme:'maximus', label:'maximus / build a better everyday', stack:'SwiftUI · MVVM · SwiftData', art:'<div class="art-kicker">MAXIMUS · IN DEVELOPMENT</div><h3>Make room<br>for progress.</h3><div class="phone" aria-hidden="true"><small>YOUR EVERYDAY, TOGETHER</small><strong>MAXIMUS</strong><div class="phone-line">◉ Habits</div><div class="phone-line">↗ Personal finance</div><div class="phone-line">✦ AI advisor</div><div class="phone-line">◎ Goals</div></div><span class="concept-label">Concept illustration · Personal finance & life tracking</span>' }
];
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.project);
    document.querySelectorAll('.project').forEach((article, i) => {
      const selected = i === index;
      article.classList.toggle('active', selected);
      article.querySelector('button').setAttribute('aria-expanded', String(selected));
      article.querySelector('.project-description').hidden = !selected;
      article.querySelector('.plus').textContent = selected ? '−' : '+';
    });
    const selected = projects[index];
    document.querySelector('#project-art').className = `art ${selected.theme}`;
    document.querySelector('#project-art').innerHTML = selected.art;
    document.querySelector('#visual-label').textContent = selected.label;
    document.querySelector('#visual-stack').textContent = selected.stack;
    document.querySelector('.project-counter').textContent = `0${index + 1} / 04`;
    const mascot = document.querySelector('[data-character="project"]');
    mascot.dataset.pose = String(index);
    mascot.classList.remove('pose-enter');
    void mascot.offsetWidth;
    mascot.classList.add('pose-enter');
    document.dispatchEvent(new CustomEvent('portfolio:projectchange'));
  });
});
const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused) {
  document.body.classList.toggle('paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume animations' : 'Pause animations';
  document.dispatchEvent(new CustomEvent('portfolio:motionchange'));
}
setMotion(reducedMotion.matches);
motionToggle.addEventListener('click', () => setMotion(!document.body.classList.contains('paused')));
reducedMotion.addEventListener('change', event => setMotion(event.matches));

const actiasShots = [
  {src:'assets/actias-interface.jpg', title:'Live 3D room dashboard', alt:"Actias live 3D room dashboard showing a person's estimated position using Wi-Fi sensing"},
  {src:'assets/actias-room.jpg', title:'Voice assistant · Phone-call walkthrough', alt:'Actias voice assistant phone-call walkthrough for checking room activity'},
  {src:'assets/actias-title.jpg', title:'Actias · Project artwork', alt:'Actias lettering formed from white moths over a green nature-inspired background'}
];
document.querySelector('#project-art').addEventListener('click', event => {
  const button = event.target.closest('[data-actias-shot]');
  if (!button) return;
  const index = Number(button.dataset.actiasShot), shot = actiasShots[index];
  if (!shot) return;
  const gallery = button.closest('.actias-gallery');
  const image = gallery.querySelector('.actias-screenshot');
  image.src = shot.src; image.alt = shot.alt;
  const link = gallery.querySelector('.actias-fullsize');
  link.href = shot.src; link.setAttribute('aria-label', 'Open full-size ' + shot.title);
  gallery.querySelectorAll('[data-actias-shot]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  gallery.querySelector('.actias-gallery-caption span').textContent = shot.title;
  gallery.querySelector('.actias-gallery-count').textContent = '0' + (index + 1) + ' / 03';
});
