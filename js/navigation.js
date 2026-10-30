(function(){
  const nav=document.querySelector('nav[aria-label="Primary"]');
  const toggle=nav?.querySelector('.mobile-menu-toggle');
  const links=nav?.querySelector('.links');
  if(!nav||!toggle||!links)return;
  function close(){nav.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu')}
  toggle.addEventListener('click',function(){
    const opening=!nav.classList.contains('menu-open');
    nav.classList.toggle('menu-open',opening);
    toggle.setAttribute('aria-expanded',String(opening));
    toggle.setAttribute('aria-label',opening?'Close navigation menu':'Open navigation menu');
  });
  links.addEventListener('click',function(event){if(event.target.closest('a'))close()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&nav.classList.contains('menu-open')){close();toggle.focus()}});
  document.addEventListener('click',function(event){if(!nav.contains(event.target))close()});
  window.addEventListener('resize',function(){if(window.innerWidth>760)close()});
})();
