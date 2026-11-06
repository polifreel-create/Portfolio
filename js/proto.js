/* прототип: мягкое появление картинок, «обновлён N минут назад» из GitHub */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce)document.querySelectorAll('.feed img, .photos img, .logos img').forEach(function(img){
    if(img.closest('.tm-cv'))return;
    if(img.complete&&img.naturalWidth)return;
    img.classList.add('bu');
    img.addEventListener('load',function(){img.classList.add('in')},{once:true});
    img.addEventListener('error',function(){img.classList.add('in')},{once:true});
  });
  var el=document.getElementById('upd');
  if(el)fetch('https://api.github.com/repos/polifreel-create/Portfolio/commits?per_page=1').then(function(r){return r.json()}).then(function(d){
    var t=new Date(d[0].commit.committer.date),m=Math.round((Date.now()-t)/60000),txt;
    if(m<1)txt='обновлён только что';else if(m<60)txt='обновлён '+m+' мин назад';else if(m<60*24)txt='обновлён '+Math.round(m/60)+' ч назад';else txt='обновлён '+Math.round(m/1440)+' дн назад';
    el.textContent=txt}).catch(function(){});
})();
/* десктоп: кнопка темы — отдельно, в правом нижнем углу экрана */
addEventListener('load',function(){
  if(!matchMedia('(min-width:761px)').matches)return;
  var b=document.querySelector('.intro .me .theme-btn');
  if(b){b.classList.add('floating');document.body.appendChild(b)}
});
/* время в Москве под именем */
(function(){var els=document.querySelectorAll('.mclk');if(!els.length)return;
  function t(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Moscow'})),p=function(n){return(n<10?'0':'')+n};
    var v=p(d.getHours())+':'+p(d.getMinutes());els.forEach(function(e){e.textContent=v})}
  t();setInterval(t,10000)})();
/* одна кнопка «Контакты» — открывает попап с каналами */
(function(){var b=document.getElementById('cbtn'),pop=document.getElementById('cpop');if(!b||!pop)return;
  document.body.appendChild(pop);
  function place(){var r=b.getBoundingClientRect();pop.style.left=r.left+'px';pop.style.top=(r.bottom+8)+'px';pop.style.minWidth=Math.max(r.width,280)+'px'}
  function open(){place();pop.hidden=false;requestAnimationFrame(function(){pop.classList.add('on')});b.setAttribute('aria-expanded','true')}
  function close(){pop.classList.remove('on');b.setAttribute('aria-expanded','false');setTimeout(function(){if(!pop.classList.contains('on'))pop.hidden=true},200)}
  b.addEventListener('click',function(e){e.stopPropagation();pop.hidden?open():close()});
  document.addEventListener('click',function(e){if(!pop.hidden&&!pop.contains(e.target))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pop.hidden){close();b.focus()}});
  addEventListener('resize',function(){if(!pop.hidden)place()});
  var side=document.querySelector('.side');if(side)side.addEventListener('scroll',function(){if(!pop.hidden)close()});
  addEventListener('scroll',function(){if(!pop.hidden)place()},{passive:true});
})();
