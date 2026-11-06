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
/* десктоп: кнопка темы — в конец строки контактов, чтобы не теснить имя */
addEventListener('load',function(){
  if(!matchMedia('(min-width:761px)').matches)return;
  var b=document.querySelector('.intro .me .theme-btn'),c=document.querySelector('.intro .contacts');
  if(b&&c){b.classList.add('in-contacts');c.appendChild(b)}
});
