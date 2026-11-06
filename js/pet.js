/* маскот в блоке «Давайте знакомиться»: следит глазами, моргает, мурчит от поглаживаний, подпрыгивает по клику */
(function(){
  var btn=document.getElementById('fpet');if(!btn)return;
  var say=document.getElementById('fpetSay'),eyes=btn.querySelectorAll('.eye');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lines=['Мур!','Ещё-ещё 🧡','Полина отвечает быстро','Напиши ей в Telegram 👇','Я тут главный по UX','Щекотно!'];
  var li=0,sayT,happyT,stroke=0,lastX=null,lastY=null,lastT=0,pets=0;
  /* глаза следят за курсором */
  addEventListener('pointermove',function(e){eyes.forEach(function(ey){var r=ey.getBoundingClientRect();if(!r.width)return;
    var a=Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2)),w=r.width;
    ey.style.setProperty('--ex',(w/2-2.5)+Math.cos(a)*(w/2-3)+'px');ey.style.setProperty('--ey',(r.height/2-2.5)+Math.sin(a)*(r.height/2-4)+'px')})},{passive:true});
  /* моргание */
  (function bl(){setTimeout(function(){if(!btn.classList.contains('happy')){btn.classList.add('blink');setTimeout(function(){btn.classList.remove('blink')},140)}bl()},2200+Math.random()*2600)})();
  /* облачко-приглашение: висит, пока человечка не трогают */
  var idle=['Погладь меня 🧡','Ну погладь…','Я тут, погладь меня'],ii=0,idleT;
  function hint(){say.textContent=idle[ii++%idle.length];say.classList.add('on','idle')}
  function speak(t){say.classList.remove('idle');say.textContent=t;say.classList.add('on');clearTimeout(sayT);clearTimeout(idleT);
    sayT=setTimeout(function(){say.classList.remove('on');idleT=setTimeout(hint,3500)},1800)}
  if('IntersectionObserver' in window){var shown=false;new IntersectionObserver(function(es){if(es[0].isIntersecting&&!shown){shown=true;setTimeout(hint,600)}},{threshold:.4}).observe(btn)}else hint();
  function burst(x,y,set,n,dist){if(reduce)return;for(var i=0;i<n;i++){var s=document.createElement('span');s.className='fpet-h';s.textContent=set[i%set.length];
    s.style.left=x+'px';s.style.top=y+'px';var a=-Math.PI/2+(i-(n-1)/2)*.55+(Math.random()-.5)*.3;
    s.style.setProperty('--dx',Math.cos(a)*dist+'px');s.style.setProperty('--dy',Math.sin(a)*dist+'px');s.style.setProperty('--r',(Math.random()*80-40)+'deg');
    document.body.appendChild(s);setTimeout(function(el){return function(){el.remove()}}(s),1050)}}
  /* поглаживание: водим курсором или пальцем по человечку */
  function happy(x,y){btn.classList.add('happy');clearTimeout(happyT);happyT=setTimeout(function(){btn.classList.remove('happy')},1300);
    pets++;if(pets%3===1){burst(x,y,['🧡','💛','🧡'],3,60);speak(pets>6?'Мурррр…':'Мур!')}}
  btn.addEventListener('pointermove',function(e){var now=Date.now();
    if(lastX!==null&&now-lastT<120){stroke+=Math.hypot(e.clientX-lastX,e.clientY-lastY)}else stroke=0;
    lastX=e.clientX;lastY=e.clientY;lastT=now;
    if(stroke>140){stroke=0;happy(e.clientX,e.clientY)}});
  btn.addEventListener('pointerleave',function(){lastX=null;stroke=0});
  /* клик: подпрыгивает, искры и реплика */
  btn.addEventListener('click',function(e){var r=btn.getBoundingClientRect(),x=e.clientX||r.left+r.width/2,y=e.clientY||r.top;
    btn.classList.remove('hop');void btn.offsetWidth;btn.classList.add('hop');setTimeout(function(){btn.classList.remove('hop')},900);
    burst(x,y,['✨','🧡','✦','⭐️','✨'],5,85);speak(lines[li++%lines.length])});
})();
