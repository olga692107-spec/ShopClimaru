// Favorites (избранное) - simple localStorage-backed toggle
(function(){
  const KEY = 'climaru_favorites_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; }
  }
  function save(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }
  function isFav(arr, id){ return arr.indexOf(String(id)) !== -1; }

  function updateHeaderCount() {
    const el = document.getElementById('favorites-count');
    if(!el) return;
    const arr = load();
    el.textContent = arr.length;
    if(arr.length === 0) el.classList.add('d-none'); else el.classList.remove('d-none');
  }

  function initFavoriteButtons() {
    const favs = load();
    
    document.querySelectorAll('.favorite-toggle').forEach(btn=>{
      // Пропустить, если уже инициализирована
      if(btn.dataset.initialized) return;
      btn.dataset.initialized = 'true';
      
      const id = btn.getAttribute('data-id');
      if(!id) return;
      
      // set initial state
      if(isFav(favs, id)) {
        btn.classList.add('favorited');
        const icon = btn.querySelector('i'); if(icon){ icon.classList.remove('far'); icon.classList.add('fas'); }
      }

      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        if(!id) return;
        let arr = load();
        if(isFav(arr, id)){
          arr = arr.filter(x=>x !== String(id));
          this.classList.remove('favorited');
          const icon = this.querySelector('i'); if(icon){ icon.classList.remove('fas'); icon.classList.add('far'); }
        } else {
          arr.push(String(id));
          this.classList.add('favorited');
          const icon = this.querySelector('i'); if(icon){ icon.classList.remove('far'); icon.classList.add('fas'); }
        }
        save(arr);
        updateHeaderCount();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateHeaderCount();
    initFavoriteButtons();
  });

  // Экспорт функции для использования после динамической загрузки товаров
  window.initFavoriteButtons = initFavoriteButtons;
})();
