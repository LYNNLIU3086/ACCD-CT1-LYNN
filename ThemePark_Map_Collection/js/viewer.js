
let maps = [];
fetch('data_maps.json').then(r=>r.json()).then(data=>{ maps=data; initList(); });
const mapList = () => document.getElementById('mapList');
const currentMap = () => document.getElementById('currentMap');
function initList(){
  const container = mapList();
  container.innerHTML = '';
  maps.forEach(m=>{
    const div = document.createElement('div');
    div.className='mapItem';
    div.innerHTML = `<strong>${m.name}</strong><small>${m.style} · ${m.region}</small>`;
    div.onclick = ()=> loadMap(m);
    container.appendChild(div);
  });
}
function loadMap(m){
  const img = currentMap();
  img.src = m.filename;
  img.alt = m.name;
  img.style.transform = 'scale(1)';
  img.dataset.scale = 1;
}
// Simple zoom and pan
let isDown=false, startX, startY, imgX=0, imgY=0;
const img = document.getElementById('currentMap') || null;
document.addEventListener('wheel', function(e){
  const im = document.getElementById('currentMap');
  if(!im.src) return;
  e.preventDefault();
  let scale = parseFloat(im.dataset.scale||1);
  scale += (e.deltaY>0) ? -0.08 : 0.08;
  scale = Math.max(0.2, Math.min(5, scale));
  im.style.transform = `scale(${scale}) translate(${imgX}px,${imgY}px)`;
  im.dataset.scale = scale;
},{passive:false});
document.addEventListener('mousedown', function(e){
  const im = document.getElementById('currentMap');
  if(!im.src) return;
  isDown=true; startX=e.clientX; startY=e.clientY;
});
document.addEventListener('mousemove', function(e){
  if(!isDown) return;
  const im = document.getElementById('currentMap');
  const dx = (e.clientX - startX)/im.dataset.scale;
  const dy = (e.clientY - startY)/im.dataset.scale;
  imgX += dx; imgY += dy;
  im.style.transform = `scale(${im.dataset.scale}) translate(${imgX}px,${imgY}px)`;
  startX = e.clientX; startY = e.clientY;
});
document.addEventListener('mouseup', function(){ isDown=false; });
document.getElementById && document.getElementById('filterStyle').addEventListener('change', function(e){
  const val = e.target.value;
  const container = mapList();
  container.innerHTML = '';
  maps.filter(m=> val==='All' ? true : m.style===val).forEach(m=>{
    const div = document.createElement('div');
    div.className='mapItem';
    div.innerHTML = `<strong>${m.name}</strong><small>${m.style} · ${m.region}</small>`;
    div.onclick = ()=> loadMap(m);
    container.appendChild(div);
  })
});
