'use strict';
const iconPaths = {
  plus:'<path d="M12 5v14M5 12h14"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  list:'<path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5"/>',
  locate:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>', signal:'<path d="M2 13h4l3-8 5 14 3-8 2 2h3"/>',
  bulb:'<path d="M9 17c0-2-4-3-4-7a7 7 0 1 1 14 0c0 4-4 5-4 7zM9 20h6m-5 3h4"/>',
  handshake:'<path d="m2 10 4-5 6 1 4-1 6 5-4 6-3 2-4 1-5-4zm5-4 4 1-3 3c1 2 3 2 5 0l5 4"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h3m3 0h3"/>',
  flag:'<path d="M5 21V4c5-3 8 3 14 0v10c-6 3-9-3-14 0"/>',
  code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-15-2 20"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2"/>',
  terminal:'<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/>',
  check:'<path d="m4 12 5 5L20 6"/>'
};
function icon(name) {
  return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(iconPaths[name]||'')+'</svg>';
}
function element(tag, className, text) {
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
}
const $=selector=>document.querySelector(selector);
document.querySelectorAll('[data-icon]').forEach(node=>{node.innerHTML=icon(node.dataset.icon)});
let activeFilter='all', visibleCount=3, layout='grid', lastNonModal=location.hash.startsWith('#board')?location.hash:'', openFrom=null;
try{if(localStorage.getItem('wt-board-layout')==='list')layout='list'}catch{}
const board=$('#board'), dialog=$('#dialog'), dialogContent=$('#dialog-content');
const nav=$('#navigation'),menu=$('.menu-toggle');
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
menu.addEventListener('click',()=>{const expanded=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Close navigation':'Open navigation')});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
function artwork(post, detail=false) {
  const className=detail?'dialog-art':'card-art';
  if(post.image) {
    const image=element('img',className);
    image.src=post.image;
    image.alt=post.imageAlt||'';
    image.loading=detail?'eager':'lazy';
    return image;
  }
  const slot=element('div',className);
  slot.setAttribute('aria-hidden','true');
  return slot;
}
function card(post) {
  const link=element('a','post-card');link.href='#post/'+post.id;link.setAttribute('aria-label','View '+post.title);
  const body=element('div','card-body'), foot=element('div','post-foot'),tag=element('span','tag '+post.category,categories[post.category].tag);
  body.append(tag,element('h3','',post.title),element('p','',post.summary));
  const meta=element('span','meta'),place=element('span','place');
  meta.innerHTML=icon(post.icon);meta.append(post.meta);place.innerHTML=icon('pin');place.append(post.place);
  foot.append(meta,place);link.append(artwork(post),body,foot);return link;
}
for(const [key,cat] of Object.entries(categories)){
  const btn=element('button','filter');btn.type='button';btn.dataset.filter=key;btn.innerHTML=icon(cat.icon);btn.append(cat.label);
  btn.addEventListener('click',()=>{
    activeFilter=key;visibleCount=3;lastNonModal=key==='all'?'#board':'#board/'+key;history.replaceState(null,'',lastNonModal);renderBoard();
  });$('#filters').append(btn);
}
function renderBoard(){
  const subset=posts.filter(p=>activeFilter==='all'||activeFilter===p.category), shown=subset.slice(0,visibleCount);
  $('#post-grid').replaceChildren(...shown.map(card));$('#post-grid').classList.toggle('is-list',layout==='list');
  $('#grid-view').setAttribute('aria-pressed',String(layout==='grid'));$('#list-view').setAttribute('aria-pressed',String(layout==='list'));
  document.querySelectorAll('.filter').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.filter===activeFilter)));
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('current',a.getAttribute('href')==='#board/'+activeFilter));
  $('#more-wrap').hidden=shown.length>=subset.length;$('#board-status').textContent=shown.length+' of '+subset.length+' posts shown.';
}
for(const type of ['grid','list'])$('#'+type+'-view').addEventListener('click',()=>{layout=type;try{localStorage.setItem('wt-board-layout',type)}catch{}renderBoard()});
$('#more-posts').addEventListener('click',()=>{const firstNew=visibleCount;visibleCount+=6;renderBoard();$('#post-grid').children[firstNew]?.focus({preventScroll:true})});
function drawWire(){
  const items=[['2026-11-30','NOV 30','3d-pen-night'],['2026-12-09','DEC 09','open-maker'],['2026-12-19','DEC 15 + 19','onshape-boat-challenge'],['2027-03-13','MAR 13','wesef']];
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const upcoming=items.filter(row=>row[0]>=today).slice(0,3);
  upcoming.forEach(([,label,id])=>{const post=posts.find(p=>p.id===id), a=element('a');a.href='#post/'+id;a.append(element('b','',label),post.title);$('#wire-items').append(a)});
  if(!upcoming.length){const a=element('a','','Explore the event board');a.href='#board/events';$('#wire-items').append(a)}
}
function showDialog(){if(!dialog.open){openFrom=document.activeElement;dialog.showModal()}dialog.scrollTop=0;$('.dialog-close').focus({preventScroll:true})}
function returnFromDialog(){
  history.replaceState(null,'',lastNonModal||location.pathname+location.search);
  if(dialog.open)dialog.close();if(openFrom?.isConnected)openFrom.focus({preventScroll:true});
}
$('.dialog-close').addEventListener('click',returnFromDialog);
dialog.addEventListener('cancel',event=>{event.preventDefault();returnFromDialog()});
dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))returnFromDialog()});
function showPost(post){
  dialogContent.replaceChildren(artwork(post,true));
  const main=element('div','dialog-main'),title=element('h2','',post.title);title.id='dialog-title';
  main.append(element('span','tag '+post.category,categories[post.category].tag),title,element('p','',post.intro));
  const facts=element('dl','facts');post.details.forEach(([term,value])=>{const row=element('div');row.append(element('dt','',term),element('dd','',value));facts.append(row)});
  const action=element('a','button black',post.action);action.href=post.url||'#join/'+post.formRole;
  if(post.url){action.target='_blank';action.rel='noopener noreferrer'}
  main.append(facts,action);dialogContent.append(main);showDialog();
}
function showJoin(role){
  const current=Object.hasOwn(roles,role)?role:'student';
  dialogContent.innerHTML='<div class="dialog-main no-art"><span class="dialog-kicker">WestchesterTech.org</span><h2 id="dialog-title">Get involved</h2><p>Tell us how you’d like to take part. Your details go to the network organizers.</p><form class="join-form"><label><span class="form-label">I’m interested in</span><select name="role" required></select></label><div class="form-pair"><label><span class="form-label">Your name</span><input name="name" autocomplete="name" maxlength="80" required></label><label><span class="form-label">Email</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label></div><label><span class="form-label">School or organization <small>(optional)</small></span><input name="organization" autocomplete="organization" maxlength="120"></label><label><span class="form-label">What do you have in mind? <small>(optional)</small></span><textarea name="message" maxlength="1200" placeholder="A club to add, an event idea, or a way you can help…"></textarea></label><p class="form-status" aria-live="polite"></p><button class="button orange" type="submit">Send interest</button></form></div>';
  const form=dialogContent.querySelector('form');
  for(const [value,label] of Object.entries(roles)){const option=new Option(label,value);form.elements.role.add(option)}
  form.elements.role.value=current;
  form.addEventListener('submit',async event=>{
    event.preventDefault();const submit=form.querySelector('[type="submit"]'),status=form.querySelector('.form-status');
    if(submit.disabled)return;
    submit.disabled=true;submit.textContent='Sending…';status.textContent='';status.className='form-status';
    try{
      const data=Object.fromEntries(new FormData(form));
      const response=await fetch('/api/interests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!response.ok){const error=await response.json().catch(()=>({}));throw new Error(error.error||'Your interest could not be saved. Please try again.')}
      if(!form.isConnected)return;
      dialogContent.innerHTML='<div class="dialog-main no-art"><span class="dialog-kicker">Interest received</span><h2 id="dialog-title">Thanks for reaching out.</h2><p>Your interest has been saved for the WestchesterTech organizers.</p><br><button class="button black" id="join-done">Back to the site</button></div>';
      $('#join-done').addEventListener('click',returnFromDialog);$('#join-done').focus();
    }catch(error){status.textContent=error instanceof TypeError?'Connection interrupted. Please try again.':error.message;status.className='form-status error';submit.disabled=false;submit.textContent='Send interest'}
  });showDialog();
}
function route(){
  closeMenu();const [page,value]=location.hash.slice(1).split('/');
  if(page==='post'){const post=posts.find(p=>p.id===value);if(post){showPost(post);return}}
  if(page==='join'){showJoin(value);return}
  if(dialog.open)dialog.close();
  lastNonModal=location.hash;
  if(page==='board'){activeFilter=Object.hasOwn(categories,value)?value:'all';visibleCount=3;renderBoard();board.scrollIntoView({block:'start'})}
  if(page==='top')window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(a&&a.hash===location.hash){event.preventDefault();route()}});
drawWire();renderBoard();route();
