(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var total=slides.length, cur=0;
  var ftText=document.body.getAttribute('data-ft')||'';
  var brandText=document.body.getAttribute('data-brand')||'ISAAC STUDIO FILMS';
  slides.forEach(function(s,i){
    var st=s.querySelector('.stage'); if(!st||!st.hasAttribute('data-part'))return;
    var hd=document.createElement('div'); hd.className='hd';
    hd.innerHTML='<span><b>'+st.getAttribute('data-part')+'</b></span><span>'+brandText+'</span>';
    var rule=document.createElement('div'); rule.className='rule';
    var ft=document.createElement('div'); ft.className='ft';
    ft.innerHTML='<span>'+ftText+'</span><span class="pg"><b>'+String(i+1).padStart(2,'0')+'</b> / '+total+'</span>';
    st.appendChild(hd); st.appendChild(rule); st.appendChild(ft);
  });
  var print=/[?&]print=1/.test(location.search);
  if(print){document.body.classList.add('print');}

  function fit(){
    var s=Math.min(window.innerWidth/1920, window.innerHeight/1080);
    document.documentElement.style.setProperty('--s', print?1:s);
  }
  fit(); window.addEventListener('resize',fit);

  // counters
  function count(el){
    var to=parseFloat(el.getAttribute('data-count')), dec=(el.getAttribute('data-dec')|0), suf=el.getAttribute('data-suf')||'', pre=el.getAttribute('data-pre')||'';
    var t0=null, dur=1500;
    function step(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/dur); p=1-Math.pow(1-p,3);
      el.textContent=pre+(to*p).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,',')+suf; if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if(print){
    slides.forEach(function(s){s.classList.add('in');});
    document.querySelectorAll('[data-count]').forEach(function(el){
      var to=parseFloat(el.getAttribute('data-count')), dec=(el.getAttribute('data-dec')|0);
      el.textContent=(el.getAttribute('data-pre')||'')+to.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,',')+(el.getAttribute('data-suf')||'');
    });
    return;
  }

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting && e.intersectionRatio>0.5){
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]:not(.done)').forEach(function(el){el.classList.add('done');count(el);});
        e.target.querySelectorAll('video.bg').forEach(function(v){v.play&&v.play().catch(function(){});});
        cur=slides.indexOf(e.target); update();
      }else{
        e.target.querySelectorAll('video.bg').forEach(function(v){v.pause&&v.pause();});
      }
    });
  },{threshold:[0.55]});
  slides.forEach(function(s){io.observe(s);});

  var prog=document.querySelector('.progress'), ctr=document.querySelector('.counter');
  function update(){
    if(prog)prog.style.width=((cur+1)/total*100)+'%';
    if(ctr)ctr.textContent=String(cur+1).padStart(2,'0')+' / '+total;
    if(history.replaceState)history.replaceState(null,'','#s'+(cur+1));
  }
  function go(i){ i=Math.max(0,Math.min(total-1,i)); slides[i].scrollIntoView({behavior:'smooth'}); }
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(cur+1);}
    if(e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(cur-1);}
    if(e.key==='Home')go(0); if(e.key==='End')go(total-1);
  });
  var pv=document.querySelector('.nav .prev'), nx=document.querySelector('.nav .next');
  if(pv)pv.onclick=function(){go(cur-1);}; if(nx)nx.onclick=function(){go(cur+1);};
  var m=location.hash.match(/#s(\d+)/); if(m){setTimeout(function(){slides[Math.min(total,+m[1])-1].scrollIntoView();},50);}
  update();
})();
