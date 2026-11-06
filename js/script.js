(function(){
 var r=document.documentElement,t=document.getElementById('tg'),app=document.getElementById('app'),nav=document.querySelector('.nav');
 var menuToggle=nav.querySelector('.menu-toggle'),menuLinks=nav.querySelectorAll('.nav-links a');
 function setMenuOpen(open){
  nav.classList.toggle('menu-open',open);
  menuToggle.setAttribute('aria-expanded',open);
  menuToggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
 }
 menuToggle.addEventListener('click',function(){setMenuOpen(menuToggle.getAttribute('aria-expanded')!=='true')});
 menuLinks.forEach(function(link){link.addEventListener('click',function(){setMenuOpen(false)})});
 addEventListener('keydown',function(e){if(e.key==='Escape')setMenuOpen(false)});
 addEventListener('resize',function(){if(innerWidth>760)setMenuOpen(false)});
 var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,busy=false;
 function updateNav(){nav.classList.toggle('scrolled',window.scrollY>8)}
 addEventListener('scroll',updateNav,{passive:true});updateNav();
 var contactsLink=nav.querySelector('a[href="#contact-talk"]'),contactTalk=document.getElementById('contact-talk'),contactHighlightTimer;
 if(contactsLink&&contactTalk){
  contactsLink.addEventListener('click',function(e){
   e.preventDefault();
   contactTalk.scrollIntoView({behavior:rm?'auto':'smooth',block:'center'});
   contactTalk.classList.remove('contact-highlight');
   void contactTalk.offsetWidth;
   contactTalk.classList.add('contact-highlight');
   clearTimeout(contactHighlightTimer);
   contactHighlightTimer=setTimeout(function(){contactTalk.classList.remove('contact-highlight')},rm?4000:2400);
  });
 }
 try{var s=localStorage.getItem('theme');if(s)r.setAttribute('data-theme',s)}catch(e){}
 function apply(n){r.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}}
 t.addEventListener('click',function(){
  if(busy)return;
  var n=r.getAttribute('data-theme')==='dark'?'light':'dark';
  if(rm||!document.body.animate){apply(n);return}
  if(document.startViewTransition){
   var q=t.getBoundingClientRect(),qx=q.left+q.width/2,qy=q.top+q.height/2;
   r.style.setProperty('--cx',qx+'px');r.style.setProperty('--cy',qy+'px');
   r.style.setProperty('--cr',(Math.hypot(Math.max(qx,innerWidth-qx),Math.max(qy,innerHeight-qy))+4)+'px');
   t.querySelector('svg').animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:700,easing:'ease-in-out'});
   busy=true;
   var vt=document.startViewTransition(function(){apply(n)});
   vt.finished.then(function(){busy=false},function(){busy=false});
   return;
  }
  busy=true;
  var b=t.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2,sy=window.scrollY,w=r.clientWidth,h=innerHeight;
  var ov=document.createElement('div');ov.className='ov';ov.setAttribute('data-theme',n);
  ov.style.clipPath='circle(0px at '+x+'px '+y+'px)';
  var inn=document.createElement('div');inn.className='ovin';inn.style.width=w+'px';inn.style.transform='translateY('+(-sy)+'px)';
  inn.appendChild(app.cloneNode(true));
  var nv=inn.querySelector('.nav');if(nv){nv.style.position='absolute';nv.style.top=sy+'px';nv.style.left='0';nv.style.right='0'}
  ov.appendChild(inn);document.body.appendChild(ov);
  t.querySelector('svg').animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:700,easing:'ease-in-out'});
  var d=Math.hypot(Math.max(x,w-x),Math.max(y,h-y))+2;
  var a=ov.animate([{clipPath:'circle(0px at '+x+'px '+y+'px)'},{clipPath:'circle('+d+'px at '+x+'px '+y+'px)'}],{duration:700,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'});
  a.onfinish=function(){apply(n);requestAnimationFrame(function(){ov.remove();busy=false})};
 });
 var bs=document.querySelectorAll('.sw button'),pill=document.querySelector('.sw i'),pw=document.getElementById('pw'),tok=0;
 function place(){var a=document.querySelector('.sw button[aria-pressed="true"]');if(!a||!pill)return;pill.style.width=a.offsetWidth+'px';pill.style.transform='translateX('+a.offsetLeft+'px)'}
 pill.style.transition='none';place();void pill.offsetWidth;pill.style.transition='';
 addEventListener('resize',function(){pill.style.transition='none';place();void pill.offsetWidth;pill.style.transition=''});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){pill.style.transition='none';place();void pill.offsetWidth;pill.style.transition=''});
 function swap(to){
  var my=++tok,nxt=document.getElementById(to),cur=pw.querySelector('.cards:not([hidden])');
  if(!cur){nxt.hidden=false;return}
  if(cur===nxt){cur.classList.remove('out');pw.style.height='';pw.style.overflow='';return}
  if(rm){cur.hidden=true;nxt.hidden=false;return}
  pw.style.height=pw.offsetHeight+'px';pw.style.overflow='hidden';
  cur.classList.add('out');
  setTimeout(function(){
   if(my!==tok)return;
   cur.hidden=true;cur.classList.remove('out');
   nxt.classList.add('pre');nxt.hidden=false;
   pw.style.height=nxt.offsetHeight+'px';
   void nxt.offsetWidth;
   nxt.classList.remove('pre');
   setTimeout(function(){if(my===tok){pw.style.height='';pw.style.overflow=''}},900);
  },210);
 }
 bs.forEach(function(b){b.addEventListener('click',function(){
  bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});place();swap(b.dataset.p);
 })});
 document.querySelectorAll('.th video').forEach(function(video){
  var card=video.closest('.th');
  if(!card)return;
  video.addEventListener('play',function(){
   document.querySelectorAll('.th video').forEach(function(other){
    if(other!==video)other.pause();
   });
  });
  video.addEventListener('playing',function(){card.classList.add('is-playing')});
  video.addEventListener('pause',function(){card.classList.remove('is-playing')});
  video.addEventListener('ended',function(){card.classList.remove('is-playing')});
  card.addEventListener('click',function(e){
   e.preventDefault();
   if(video.paused){
    video.play().catch(function(error){
     video.controls=true;
     console.error('Video playback failed:',error);
    });
   }else{
    video.pause();
   }
  });
 });
})();
