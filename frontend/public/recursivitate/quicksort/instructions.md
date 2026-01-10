# Algoritmul Quicksort

QuickSort este un algoritm de sortare care folosește **recursivitatea** pentru a sorta un vector. Ideea de bază este **divide et impera**: împarți problema mare (sortarea unui vector) în probleme mai mici (sortarea sub-vectorilor).


## Cum funcționează

1. **Alege un pivot** – alege un element din vector ca pivot.
2. **Împarte vectorul** – creează două sub-vectoruri unul cu numere mai mici și mai mari decât pivotul.
3. **Sortarea recursivă** – aplică QuickSort recursiv pe fiecare sub-vector.
4. **Combinarea rezultatelor** – unește sub-vectorurile sortate cu pivotul.


## Exemplu

Vector inițial: `[5, 2, 8, 3]`

- Alegem pivotul `5`
- Mai mic: `[2, 3]`
- Mai mare: `[8]`
- Recursiv sortăm `[2, 3]` → `[2, 3]`
- Recursiv sortăm `[8]` → `[8]`

Vector final (sortat): `[2, 3, 5, 8]`

## 🎯 Sarcină

Majoritatea codului este deja implementat, trebuie doar sa combini pivotul și cei doi vectori
