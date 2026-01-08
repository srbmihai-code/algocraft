# Recursivitate: Șirul lui Fibonacci

Recursivitatea este o tehnică prin care o funcție se apelează pe ea însăși pentru a rezolva o problemă mai mare. Ideea principală este că problema se repetă sub aceeași formă, dar cu date mai simple, până când ajunge la un caz ușor de rezolvat.

O funcție recursivă are întotdeauna două părți esențiale. Prima este cazul de bază, care oprește recursivitatea. A doua este cazul recursiv, în care funcția se apelează din nou.

## Ce este șirul lui Fibonacci

Șirul lui Fibonacci este un exemplu clasic unde recursivitatea apare natural. Fiecare număr din șir este suma celor două numere anterioare. Astfel, pentru a calcula un termen, ai nevoie să calculezi alți doi termeni mai mici.

Șirul lui Fibonacci începe astfel:

0, 1, 1, 2, 3, 5, 8, 13, ...

Regula este următoarea:

- `Fibonacci(0) = 0`
- `Fibonacci(1) = 1`
- `Fibonacci(n) = Fibonacci(n − 1) + Fibonacci(n − 2)`

## 🎯 Sarcină

Implementează funcția **`fibonacci(n)`** recursiv. (Nu folosi bucle. Rezolvarea trebuie să fie exclusiv recursivă)

Funcția trebuie să:

- returneze `0` pentru `n = 0`
- returneze `1` pentru `n = 1`
- returneze valoarea corectă pentru orice `n >= 2`


