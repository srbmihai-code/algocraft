# Inserare în vector

Există două moduri de a insera un element:

* La un anumit index cu sintaxa pe care o știi deja: `v[0] = 0`
* Folosind `.push(valoare)` pentru a insera la coadă (după ultimul element) sau `.unshift(valoare)` pentru a insera în față (înainte de primul element)

## Exemplu

```js
const vector = [1, 3, 5, 3, 6];
vector.push(0); // [1, 3, 5, 3, 6, 0]
```

### 🎯 Sarcină

Folosește-te de `.push` pentru a adăuga în vector puterile lui doi de la 1 (2^0) până la 1024 (2^10).
Apoi, afișează-le pe ecran ca la nivelul trecut.
