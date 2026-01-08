# Coadă (queue)

O coadă este o structură de date liniară care funcționează după principiul **FIFO – First In, First Out**, adică primul element introdus este primul care va fi scos.

Un exemplu din viața reală este o coadă la casă într-un magazin. Persoana care ajunge prima la rând este și prima servită. Poți adăuga persoane la coadă, dar nu poți servi persoanele care sunt la mijloc sau la final înaintea celor din față.

## Cum este implementată

Coada poate fi implementată folosind un array sau o listă simplă înlănțuită. La fel ca în cazul stivei, clasa `Coadă` definește atributele și metodele pentru obiect. Metodele principale descriu operațiile care pot fi realizate asupra cozii și aparțin clasei.

## Operații principale

- **enqueue(value)** – adaugă un element la finalul cozii.
- **dequeue()** – elimină și returnează elementul din fața cozii.
- **peek()** – returnează elementul din fața cozii fără să-l elimine.
- **isEmpty()** – verifică dacă coada este goală.

### Performanță

Toate operațiile principale (`enqueue`, `dequeue`, `peek`, `isEmpty`) au complexitate **O(1)** atunci când coada este implementată cu listă înlănțuită și se păstrează referințe către primul și ultimul nod.


### 🎯 Sarcină

Implementează metoda **`peek`** pentru clasa `Queue`. Restul implementării este deja realizat.
Metoda trebuie să returneze:

- valoarea din fața cozii fără a o elimina
- `null` dacă coada este goală

Sfat: @@poți să te inspiri din modul în care `dequeue` accesează primul element al cozii.@@
