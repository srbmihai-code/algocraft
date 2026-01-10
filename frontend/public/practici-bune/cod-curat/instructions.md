# Cod curat

În acest capitol vei învăța niște practici bune pentru a-ți menține un cod curat, care este ușor de citit și modificat.
Acest lucru este important în mod special atunci când lucrezi cu alte persoane.

Un prim pas este organizarea codului astfel încât formatarea să fie coerentă, adică codul trebuie:

- să fie indentat corect
- să fie un număr consistent de spații înainte de anumiți operatori
- acoladele de deschidere să fie pe același rând cu instrucțiunea care le deschide
- etc.

**Exemplu (înainte):**

```js
function suma(a,b){
if(a> b){
return a+b;
}else{
return a -b;
}
}
```

**Exemplu (după):**

```js
function suma(a, b) {
  if (a > b) {
    return a + b;
  } else {
    return a - b;
  }
}
```

### 🎯 Sarcină

Curata codul de mai jos sa respecte regulile din exemplu
