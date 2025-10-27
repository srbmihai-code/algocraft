# Nivel Binary Search

În acest nivel vei implementa o **funcție de căutare binară**.

**Sarcină**:

- Scrie `findClosestName(names, target)` care:
  - Primește un **array sortat de nume**.
  - Returnează **cel mai apropiat nume alfabetic** de `target`.

**Exemplu**:

```js
const names = ["matxx", "maty", "matzy"];
findClosestName(names, "matxy"); // returnează "matxx"
```

Idiciu:
<span class="spoiler"> Poți folosi două variabile low și high pentru limitele căutării și să reduci treptat intervalul. </span>