# Sumă recursivă

Recursivitatea poate fi folosită pentru a aduna elementele unui vector fără a folosi bucle. Poți aduna primul element cu suma vectorului care rămâne, apelând aceeași funcție pentru vector rămas.

## Cum funcționează

- **Cazul de bază:** vectorul este gol → suma este 0.
- **Cazul recursiv:** suma vectorului este primul element + suma vectorului care rămâne.

De exemplu, pentru `[1, 2, 3]`:
`sum([1, 2, 3]) = 1 + sum([2, 3]) = 1 + 2 + sum([3]) = 1 + 2 + 3 + sum([]) = 6`.


## 🎯 Sarcină

Implementează funcția **`sum`** folosind **recursivitate**.
Funcția trebuie să:

- returneze `0` pentru un vector gol
- returneze suma corectă pentru orice vector de numere
- nu folosească bucle (`for`, `while`)
Folosește `numere.slice(1)` pentru a apela funcția cu restul vectorului (fără primul element).

Sfat: @@Poți vedea dacă vectorul este gol cu `numere.length`@@