# Box model (margin, padding, border)

Fiecare element HTML este tratat ca o cutie. Cele trei proprietăți principale care definesc spațiul sunt:

- **conținut**: conținutul propriu zis: un text, imagine, buton etc
- **padding**: spațiul interior, între conținut și conturul elementului
- **border**: conturul elementului, vizibil între padding și margin
- **margin**: spațiul exterior, între element și alte elemente

![Imagine box model](/css/box-model/borderbox.gif)

Dacă aplicăm mai multe proprietăți CSS la un selector, trebuie să le desparțim prin punct și virgulă `;`.
Pentru a le seta, ne trebuie o **unitate de măsură** pentru a seta mărimea, în acest caz **pixelii**, notați cu **px**.

La **border** trebuie și specificat modul în care este dispus, cel mai des folosit este **solid**, care arată un **contur neîntrerupt** și o **culoare a conturului**.

Cele trei proprietăți **NU** se despart prin **virgulă**.

### 🎯 Sarcină
Adaugă `padding`, `margin` și `border` pentru container, înlocuind 0px cu o valoare nenulă.
