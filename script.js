const projects = [
  { theme:'luna', label:'actias-luna / room awareness', stack:'React · Python · ESP32 · Gemini', art:'<div class="art-kicker">ACTIAS LUNA</div><h3>A room that<br>understands.</h3><div class="room"><div class="room-grid"></div><span class="sensor s1"></span><span class="sensor s2"></span><span class="sensor s3"></span><img class="moth" src="assets/moth.png" alt="Actias Luna moth artwork" width="160" height="160"></div><span class="concept-label">Concept illustration · Camera-free Wi-Fi sensing</span>' },
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
