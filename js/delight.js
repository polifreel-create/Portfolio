/* тема · живой статус · подсветка и наклон карточек */
(function(){
  var root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SUN='<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON='<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function save(t){try{localStorage.setItem('theme',t)}catch(e){}}
  function label(b){b.setAttribute('aria-label',root.dataset.theme==='dark'?'Включить светлую тему':'Включить тёмную тему')}
  function toggle(e){
    var next=root.dataset.theme==='dark'?'light':'dark';
    var apply=function(){root.dataset.theme=next;save(next);document.querySelectorAll('.theme-btn').forEach(label)};
    if(reduce||!document.startViewTransition){root.classList.add('theme-anim');apply();setTimeout(function(){root.classList.remove('theme-anim')},500);return}
    var x=e&&e.clientX?e.clientX:innerWidth-40,y=e&&e.clientY?e.clientY:40,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    document.startViewTransition(apply).ready.then(function(){
      root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+R+'px at '+x+'px '+y+'px)']},{duration:650,easing:'cubic-bezier(.65,0,.35,1)',pseudoElement:'::view-transition-new(root)'})});
  }
  function makeBtn(){var b=document.createElement('button');b.type='button';b.className='theme-btn';b.innerHTML='<span class="ic">'+SUN+MOON+'</span>';label(b);b.addEventListener('click',toggle);return b}
  // кнопка темы: на главной — в карточке «о себе», в кейсах — в строке крошек
  var me=document.querySelector('.intro .me'),cr=document.querySelector('.crumbs');
  if(me)me.appendChild(makeBtn()); if(cr)cr.appendChild(makeBtn());
  // живой статус с часами — на главной под текстом
  var bio=document.querySelector('.intro .bio');
  if(bio){
    var live=document.createElement('div');live.className='live';
    live.innerHTML='<span class="chip st"><i class="dot"></i><span class="tx">Открыта к&nbsp;предложениям</span></span><span class="chip"><b class="clk">--:--:--</b>&nbsp;Москва</span>';
    bio.insertAdjacentElement('afterend',live);
    var st=live.querySelector('.st'),tx=live.querySelector('.tx'),clk=live.querySelector('.clk');
    var tick=function(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Moscow'})),p=function(n){return(n<10?'0':'')+n},h=d.getHours();
      clk.textContent=p(h)+':'+p(d.getMinutes())+':'+p(d.getSeconds());
      var night=h>=23||h<8;st.classList.toggle('night',night);tx.textContent=night?'Сплю, отвечу утром':'Открыта к предложениям'};
    tick();setInterval(tick,1000);
  }
  // карточки кейсов: подсветка за курсором + наклон + блик
  if(!matchMedia('(hover:hover) and (min-width:761px)').matches)return;
  document.querySelectorAll('.feed .case.card').forEach(function(c){
    var media=c.querySelector('.media'),raf=0,ev=null;
    function upd(){raf=0;var r=c.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width,y=(ev.clientY-r.top)/r.height;
      c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');
      if(media){var m=media.getBoundingClientRect();c.style.setProperty('--gx',(ev.clientX-m.left)+'px');c.style.setProperty('--gy',(ev.clientY-m.top)+'px')}
      if(!reduce)c.style.transform='perspective(1400px) rotateY('+((x-.5)*5).toFixed(2)+'deg) rotateX('+((.5-y)*5).toFixed(2)+'deg) translateY(-2px)'}
    c.addEventListener('pointerenter',function(){c.classList.add('is-hover')});
    c.addEventListener('pointermove',function(e){ev=e;if(!raf)raf=requestAnimationFrame(upd)});
    c.addEventListener('pointerleave',function(){c.classList.remove('is-hover');c.style.transform=''});
  });
})();
