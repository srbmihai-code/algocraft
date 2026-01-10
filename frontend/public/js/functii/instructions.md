# Funcții în JavaScript

În **JavaScript**, funcțiile ne permit să grupăm cod care poate fi refolosit.
O funcție rulează **doar atunci când este apelată**.

## Ce este o funcție

Sintaxa de bază:

```javascript
function numeFunctie() {
  // codul funcției
}
```

Pentru a executa funcția:

```javascript
numeFunctie();
```

## Funcții cu parametri

Funcțiile pot primi valori din exterior, numite **parametri**.
De asemenea, pot returna o valoare înapoi.

```javascript
function aduna(a, b) {
  return a + b;
}

let rezultat = aduna(2, 3);
```

Instrucțiunea `return` trimite o valoare înapoi și oprește execuția funcției.

---

## Funcția `console.log()`

`console.log()` este **o funcție deja creată în JavaScript**.
Ea primește valori ca parametri și le afișează în consolă, pe care o poți deschide cu `Ctrl + Shift + I` sau `Cmd (⌘) + Option (⌥) + I`.


```javascript
console.log("Salut");
console.log(10);
console.log(true);
```

Funcția `console.log()` **nu returnează nimic** , este folosită pentru **afișare și debug**, adică pentru a vedea cum ne funcționează programul dacă vrem să vedem unde se întâmplă o eroare.


## 🎯 Sarcină

Editează codul de mai jos astfel încât:

1. Codul să fie pus într-o **funcție** `sum` care primește un parametru `x`
2. Funcția să returneze **suma numerelor pare de la 1 la x**
