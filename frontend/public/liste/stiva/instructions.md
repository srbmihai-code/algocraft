# Stivă (stack)

O stivă este o structură de date liniară care funcționează după principiul LIFO (Last In, First Out), adică ultimul element introdus este primul care va fi scos.

Un exemplu din viața reala este un teanc de farfurii. Poți scoate farfuria de sus, poți adauga o altă farfurie sus, dar nu poți scoate farfuriile de jos.

## Cum este implementată

Stiva este deobicei implementată în mod similar cu o listă simplă înlănțuită. La fel ca în cazul listelor, clasa `Stiva` definește atributele și metodele pentru obiect. Metodele principale sunt similare cu funcțiile obișnuite, dar aparțin clasei.

## Operații principale

- **push(value)** – adaugă un element în vârful stivei.
- **pop()** – elimină și returnează elementul din vârful stivei.
- **peek()** – returnează elementul din vârful stivei fără să-l elimine.
- **isEmpty()** – verifică dacă stiva este goală.

### Performanță

Toate operațiile principale (`push`, `pop`, `peek`, `isEmpty`) au complexitate O(1), deoarece lucrează întotdeauna cu elementul din vârful stivei.

## 🎯 Sarcină

Implementează metoda **`peek`** pentru clasa `Stack`. Restul implementării este deja realizat.
Metoda trebuie să returneze:

- valoarea din vârful stivei fără a o elimina
- `null` dacă stiva este goală

Sfat: @@poți să te inspiri din modul în care `pop` accesează vârful stivei.@@
