/* Motion comes from authored video frames. Posters are never warped. */
(() => {
  'use strict';
  const players = [], images = new Map();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const keys = ['actias-luna','standby','aurelius','maximus'];
  let clips = {};
  const paused = () => document.body.classList.contains('paused') || reducedMotion.matches;
  const keyFor = node => node.dataset.character === 'project' ? keys[Number(node.dataset.pose || 0)] : node.dataset.character;
  function image(src) {
    if (!images.has(src)) images.set(src,new Promise((resolve,reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src;
    }));
    return images.get(src);
  }
  async function poster(item) {
    const {node,canvas} = item, kind = node.dataset.character;
    const src = kind === 'wave' ? 'assets/character.png' : kind === 'project' ? 'assets/character-projects.png' : kind === 'typing' ? 'assets/character-desk.png' : 'assets/character-letter.png';
    try {
      const img = await image(src), ctx = canvas.getContext('2d');
      if (!ctx) return;
      const pose = Number(node.dataset.pose || 0);
      const w = kind === 'project' ? img.width / 2 : img.width;
      const h = kind === 'project' ? img.height / 2 : img.height;
      const x = kind === 'project' ? (pose % 2) * w : 0;
      const y = kind === 'project' ? Math.floor(pose / 2) * h : 0;
      const scale = Math.min(canvas.width / w,canvas.height / h);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,x,y,w,h,(canvas.width-w*scale)/2,(canvas.height-h*scale)/2,w*scale,h*scale);
      node.dataset.ready = 'true';
    } catch { node.dataset.ready = 'false'; }
  }
  function stop(item) {
    item.video.pause(); item.node.dataset.running = 'false';
    if (item.imageSource) {
      item.loopImage.removeAttribute('src'); item.imageSource = '';
      item.node.dataset.playing = 'false'; item.node.dataset.renderer = 'still';
    }
  }
  function update(item) {
    const {node,video} = item, sources = clips[keyFor(node)];
    if (!sources || !item.visible || paused() || document.hidden) { stop(item); return; }
    // Animated WebP preserves transparency on browsers without alpha video.
    if (sources.webp && (!sources.webm || navigator.vendor.startsWith('Apple'))) {
      if (item.imageSource !== sources.webp) {
        item.video.pause(); item.node.dataset.playing = 'false';
        item.imageSource = sources.webp; item.loopImage.src = sources.webp;
      }
      return;
    }
    const src = sources.webm && video.canPlayType('video/webm') ? sources.webm : sources.mp4;
    if (!src) { stop(item); return; }
    if (item.source !== src) {
      stop(item); item.source = src; node.dataset.playing = 'false'; node.dataset.renderer = 'still';
      video.src = src; video.load();
    }
    const generation = item.generation;
    video.play().then(() => {
      if (generation !== item.generation || !item.visible || paused() || document.hidden) { stop(item); return; }
      node.dataset.running = 'true'; node.dataset.playing = 'true'; node.dataset.renderer = 'video';
    }).catch(() => { node.dataset.running = 'false'; node.dataset.playing = 'false'; node.dataset.renderer = 'still'; });
  }
  document.querySelectorAll('[data-character]').forEach(node => {
    const canvas = node.querySelector('canvas'), video = document.createElement('video');
    const loopImage = document.createElement('img');
    loopImage.className = 'character-loop-image'; loopImage.alt = '';
    loopImage.setAttribute('aria-hidden','true');
    video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
    video.setAttribute('aria-hidden','true'); video.setAttribute('disablepictureinpicture',''); video.tabIndex = -1;
    node.append(video,loopImage);
    const item = {node,canvas,video,loopImage,visible:false,generation:0,source:'',imageSource:''}; players.push(item);
    node.dataset.renderer = 'still'; node.dataset.running = 'false'; poster(item);
    video.addEventListener('error',() => { stop(item); node.dataset.playing = 'false'; node.dataset.renderer = 'still'; });
    loopImage.addEventListener('load',() => {
      if (!item.imageSource || item.imageSource !== clips[keyFor(node)]?.webp) return;
      if (!item.visible || paused() || document.hidden) { stop(item); return; }
      node.dataset.renderer = 'animated-image'; node.dataset.running = 'true'; node.dataset.playing = 'true';
    });
    loopImage.addEventListener('error',() => { node.dataset.playing = 'false'; node.dataset.renderer = 'still'; node.dataset.running = 'false'; });
    new IntersectionObserver(([entry]) => { item.visible = entry.isIntersecting; update(item); }).observe(node);
  });
  document.addEventListener('portfolio:projectchange',() => {
    players.filter(item => item.node.dataset.character === 'project').forEach(item => {
      item.generation++; stop(item); item.node.dataset.playing = 'false'; item.node.dataset.renderer = 'still';
      item.source = ''; item.imageSource = ''; item.loopImage.removeAttribute('src');
      item.video.removeAttribute('src'); item.video.load(); poster(item); update(item);
    });
  });
  for (const event of ['portfolio:motionchange','visibilitychange']) document.addEventListener(event,() => players.forEach(update));
  reducedMotion.addEventListener('change',() => players.forEach(update));
  fetch('assets/character-clips.json').then(r => r.ok ? r.json() : {}).then(manifest => {
    clips = manifest; players.forEach(update);
  }).catch(() => {});
})();

