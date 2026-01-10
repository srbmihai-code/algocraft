# Căutarea binară

Căutarea binară este o metodă eficientă pentru a găsi un element într-un vector sortat.

Cum funcționează:

1. Începem cu primul și ultimul index din vector (`low` și `high`).
2. Luăm indexul din mijloc (`mid`) și comparăm elementul de la acel index cu valoarea căutată.
3. Dacă elementul de la `mid` este exact ceea ce căutăm, l-am găsit și putem opri căutarea.
4. Dacă valoarea căutată este mai mică decât `vector[mid]`, continuăm căutarea doar în jumătatea din stânga, deoarece toate numerele din dreapta sunt mai mari decât ce ne interesează.
5. Dacă valoarea căutată este mai mare decât `vector[mid]`, continuăm căutarea doar în jumătatea din dreapta, deoarece toate numerele din stânga sunt mai mici decât ce ne interesează.
6. Repetăm pașii 2–5 până când găsim elementul sau zona de căutare devine invalidă (`low > high`).

Astfel, mărimea vectorului pe care trebuie să îl verificăm se înjumătățește de fiecare dată, deci întrebarea nu mai este câte numere trebuie să verificăm (`O(n)`), ci de câte ori trebuie să înjumătățim (`O(log n)`).

### 🎯 Sarcină

Completează codul de căutare binară.

Notă: dacă rulezi testul fără sa completezi codul fereastra se va bloca din cauza buclei `while` care merge la infinit.
