# Obiecte în JavaScript

#### Ce este un obiect

Un **object** este o structură de date care conține **proprietăți**.

```javascript
const student = {
  name: "Ana",
  age: 20
};
```

---

#### Pass by Value

**Primitivele** (`number`, `string`, `boolean`) sunt transmise prin valoarea lor (**by value**).

Asta înseamnă că:

- se trimite o **copie**
- valoarea originală **nu se modifică**

```javascript
function addOne(x) {
  x = x + 1;
}

let a = 10;
addOne(a);

console.log(a); // 10
```

`a` rămâne neschimbat.


#### Pass by Reference

**Obiectele** sunt transmise printr-o referință (**by reference**).

Asta înseamnă că:

- funcția primește **referința** către obiect
- modificarea afectează obiectul original

```javascript
function changeName(student) {
  student.name = "Andreea";
}

const s = { name: "Andrei", age: 21 };
changeAge(s);

console.log(s.name); // "Andreea";
```

Obiectul original **a fost modificat**.


## 🎯 Sarcină

1. Creează o funcție care primește un **obiect student**
2. Obiectul are proprietățile `name` și `age`
3. Funcția trebuie să **adauge 1 la vârsta studentului**
4. Nu returna nimic – modifică direct obiectul
