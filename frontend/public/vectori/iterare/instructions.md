# Vectori (Arrays)

În JavaScript, un **vector (array)** este o **structură de date** foarte des folosită, care constă într-o listă de elemente (numere, șiruri de caractere etc).

## Exemplu de declarare

```js
const vector = [1, 3, 5, 3, 6];
```

Această declarație înseamnă că în `vector` se găsesc numerele la următoarele **poziții (indexuri)**
(indexarea începe de la **0**):

| Index   |   Valoare |
| -----   |   ------- |
| 0       |   1       |
| 1       |   3       |
| 2       |   5       |
| 3       |   3       |
| 4       |   6       |


---

## Iterarea printr-un vector

Cel mai des folosit mod de a itera prin toate elementele unui vector este folosind un **loop `for`**:

```js
for (let i = 0; i < vector.length; i++) {
  console.log(vector[i]); // afișează: 1 3 5 3 6
}
```

### Ce se întâmplă aici

1. Se inițializează o variabilă `i` care începe cu valoarea `0`
2. Se afișează elementul din vector aflat la indexul `i`
3. `i` crește cu `1` pentru a trece la următorul element
4. Bucla se oprește când `i` ajunge la final, adică atunci când depășește numărul de elemente din vector (`vector.length`)

---

### 🎯 Sarcină

Iterează prin vectorul cu numere și, pentru **fiecare număr**, adaugă în pagină un element `<p>` cu clasa `numar`.
