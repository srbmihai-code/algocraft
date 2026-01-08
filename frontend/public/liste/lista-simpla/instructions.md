# Listă simplă (linked list)

## Introducere

O listă simplă înlănțuită, numită și linked list, este o structură de date alcătuită din noduri. Fiecare nod conține o valoare și o referință către următorul nod din listă.

Spre deosebire de un array, elementele unei liste înlănțuite nu sunt stocate în memorie în mod continuu. Legătura dintre ele se face prin referințe, ceea ce permite inserări și ștergeri mai flexibile.

---

## Ce este un nod

Un nod este un element al listei. El conține datele propriu-zise și o referință către următorul nod. Lista începe cu un nod special, numit head, care indică primul element.

## Cum este implementată și ce este o clasă

O clasă este un șablon după care sunt create obiectele care sunt variabile speciale. Ea definește ce date și ce comportamente va avea un obiect.

Atributele unei clase sunt variabilele care descriu starea obiectului. Metodele sunt funcții definite în interiorul clasei și descriu ce poate face obiectul. Metodele sunt similare cu funcțiile obișnuite, dar ele aparțin unei clase.

În contextul listelor înlănțuite, clasa LinkedList descrie structura listei, iar metodele precum `add`, `remove` sau `search` descriu operațiile care pot fi efectuate asupra listei.

## Cum este folosită o listă înlănțuită

O listă înlănțuită este folosită atunci când ai nevoie de o structură de date cu dimensiune dinamică. Inserarea unui element la începutul listei este foarte rapidă, deoarece presupune doar modificarea unei referințe. Inserarea la final sau ștergerea unui element necesită parcurgerea listei.

## Performanță și complexitate

Inserarea la început are complexitatea O(1). Inserarea la final, ștergerea și căutarea au complexitatea O(n), deoarece este necesară parcurgerea listei.

Listele înlănțuite oferă avantajul inserărilor rapide și al unei dimensiuni flexibile, dar dezavantajul accesului lent la elemente, deoarece nu există indexare directă.


## 🎯 Sarcină

Implemează metoda **`search`** pentru clasa ListaSimpla (restul implementării este deja realizat).
Metoda trebuie să returneze:
- `true` dacă valoarea există în listă
- `false` în caz contrar

Sfat: @@te poți uita la metoda `remove` deoarece procedeul este similar.@@
