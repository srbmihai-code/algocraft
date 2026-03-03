# Condițiile în JavaScript și operatorii logici

În **JavaScript**, condițiile ne permit să luăm decizii: dacă o afirmație este adevărată, facem un lucru, iar dacă este falsă, facem altul.
Pentru asta folosim instrucțiunea **`if`** (dacă) și opțional **`else`** (altfel).

### Cum funcționează un `if`

Sintaxa de bază:

```javascript
if (conditie) {
  // cod executat dacă condiția este adevărată
} else {
  // cod executat dacă condiția este falsă
  // blocul else poate fi omis dacă nu avem nevoie de el
}
```

### Operatorii logici folosiți în condiții

Ca să formăm condițiile, folosim **operatori logici**, care compară valori.

| Operator | Ce face (descriere)                                             | Exemplu                                   |
| -------- | --------------------------------------------------------------- | ----------------------------------------- |
| `===`    | Egalitate strictă (compara valoarea **și** tipul)               | `5 === 5` → `true`; `"5" === 5` → `false` |
| `!==`    | Diferit strict (valoare sau tip diferit)                        | `"a" !== "b"` → `true`                    |
| `==`     | Egalitate (se pot compara tipuri diferite): *nerecomandat*      | `"5" == 5` → `true`                       |
| `!=`     | Diferit (se pot compara tipuri diferite): *nerecomandat*        | `"5" != 6` → `true`                       |
| `>`      | Mai mare decât                                                  | `x > 10`                                  |
| `<`      | Mai mic decât                                                   | `x < 0`                                   |
| `>=`     | Mai mare sau egal                                               | `score >= 50`                             |
| `<=`     | Mai mic sau egal                                                | `age <= 18`                               |
| `&&`     | Și logic: ambele condiții trebuie să fie adevărate              | `x > 0 && x < 10`                         |
| `\|\|`   | Sau logic: cel puțin una din condiții trebuie să fie adevărată  | `color === "red" \|\| color === "blue"`   |
| `!`      | Negare" inversează valoarea booleană (o condiție).              | `!isLoggedIn`                             |


### Exemple

### Pentru a verifica dacă un număr este pozitiv:

```javascript
if (x > 0) {
  console.log("Numărul este pozitiv");
} else {
  console.log("Numărul nu este pozitiv");
}
```

### `&&` (Și) pentru a verifica daca numărul este într-un interval:

```javascript
if (age >= 18 && age <= 65) {
  console.log("Persoana este adult activ");
}
```

### `||` (Sau):

```javascript
if (color === "red" || color === "blue") {
  console.log("Culoarea este acceptată");
}
```

### `!` (NU):

```javascript
if (!isLoggedIn) {
  console.log("Trebuie să te autentifici");
}
```

---

### 🎯 Sarcină

Scrie o condiție care verifică dacă nota **x este mai mare decât 4** și **mai mică sau egală decât 10**, și dacă da seteaza valoarea promovat `true` altfel `false`
