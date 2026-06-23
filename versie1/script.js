// =========================================
// 1. BESTAANDE KEYDOWN LISTENERS
// =========================================
// Vang pijltoetsen op en stuur ze naar de hoofdpresentatie
document.addEventListener('keydown', (e) => {
   const navKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '];
   if (navKeys.includes(e.key)) {
       e.preventDefault(); // Voorkom dat de iframe zelf gaat scrollen
       window.parent.postMessage({ type: 'iframeNav', key: e.key }, '*');
   }
});

// =========================================
// 2. DRAG AND DROP FUNCTIONALITEIT
// =========================================
const dragItems = document.querySelectorAll('.drag-item');
const dagjournaalLijst = document.getElementById('dagjournaal-lijst');
const emptyState = document.getElementById('empty-state');

dragItems.forEach(item => {
   item.addEventListener('dragstart', (e) => {
       e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
       item.classList.add('dragging');
   });

   item.addEventListener('dragend', () => {
       item.classList.remove('dragging');
   });
});

if (dagjournaalLijst) {
   dagjournaalLijst.addEventListener('dragover', (e) => {
       e.preventDefault(); // Nodig om drop toe te staan
   });

   dagjournaalLijst.addEventListener('drop', (e) => {
       e.preventDefault();
       const id = e.dataTransfer.getData('text/plain');
       const draggedElement = document.querySelector(`#blok-selectie [data-id="${id}"]`);
       
       if (draggedElement) {
           // Verberg de empty state tekst ("Sleep blokken hierheen")
           if (emptyState) {
               emptyState.style.display = 'none';
           }
           // Verplaats het geselecteerde blok naar de dagjournaal lijst
           dagjournaalLijst.appendChild(draggedElement);
       }
   });
}

// =========================================
// 3. DATUM NAVIGATIE FUNCTIONALITEIT
// =========================================
let currentDate = new Date();
const btnPrevDay = document.getElementById('btn-prev-day');
const btnNextDay = document.getElementById('btn-next-day');
const btnToday = document.getElementById('btn-today');

function updateDateDisplay() {
   if (!btnToday) return;
   
   const today = new Date();
   
   // Controleer of de geselecteerde datum vandaag is
   if (currentDate.toDateString() === today.toDateString()) {
       btnToday.textContent = 'Vandaag';
   } else {
       // Formateer naar een leesbare Nederlandse datum (bijv. "22 juni 2026")
       const options = { day: 'numeric', month: 'long', year: 'numeric' };
       btnToday.textContent = currentDate.toLocaleDateString('nl-NL', options);
   }
}

// Knop < (vorige dag)
if (btnPrevDay) {
   btnPrevDay.addEventListener('click', () => {
       currentDate.setDate(currentDate.getDate() - 1);
       updateDateDisplay();
   });
}

// Knop > (volgende dag)
if (btnNextDay) {
   btnNextDay.addEventListener('click', () => {
       currentDate.setDate(currentDate.getDate() + 1);
       updateDateDisplay();
   });
}

// Klik op de datumtekst zelf om direct terug te keren naar vandaag
if (btnToday) {
   btnToday.addEventListener('click', () => {
       currentDate = new Date();
       updateDateDisplay();
   });
}