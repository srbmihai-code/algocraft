# Căutare liniară

Un lucru frecvent în programare este să verificăm dacă un element există într-un **vector (array)**.
O metodă simplă este **căutarea liniară**, care constă în a verifica fiecare element până găsim elementul dorit.
Când găsești elementul, se folosește instrucțiunea `break`, care termină bucla `for` și cautarea în sine.

### 🎯 Sarcină

La apăsarea butonului, verifică dacă numărul introdus există în vector și schimbă culoarea pătratului corespunzător în darkred.

### Recomandări

- Creează o funcție care caută elementele din vector folosind `for (let i=0;i<11;i++)` și returnează indexul elementului găsit sau -1 dacă nu există.
- Folosește funcția care returnează pătratul din DOM corespunzător unui index pentru a-i schimba **culoarea de fundal**.
- Reutilizează funcțiile de la nivelurile anterioare pentru iterare și manipulare DOM.
