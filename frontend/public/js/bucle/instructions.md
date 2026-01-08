# Bucla while în JavaScript

În **JavaScript**, buclele ne permit să repetăm codul cât timp o condiție este adevărată.

### 🔍 Bucla `while`

Sintaxa de bază:

```javascript
while (condiție) {
  // cod executat cât timp condiția e adevărată
}
```

Condiția se verifică **la începutul fiecărei iteratii**.
Dacă condiția este falsă de la început, bucla nu se execută deloc.

### Exemplu

```javascript
let i = 0; // inițializare
while (i < 5) { // condiție
  console.log(i);
  i++; // pas: modificăm variabila de control
}
```

---

# Bucla `for` în JavaScript

Buclele `for` sunt utile când știm **de câte ori vrem să repetăm codul**.

### 🔍 Cum funcționează `for`

Sintaxa:

```javascript
for (inițializare; condiție; pas) {
  // cod executat de fiecare dată cât timp condiția e adevărată
}
```

- **Inițializare**: se execută **o singură dată**, înainte de a începe bucla. De obicei definim variabila de control aici (`let i = 0`).
- **Condiție**: se verifică înainte de fiecare iterație. Dacă devine `false`, bucla se oprește.
- **Pas**: o instrucțiune repetată la finalul fiecărei iterații, aici modificăm variabila de control după fiecare iterație (`i++` sau `i += 2` etc).

### Exemplu

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // afișează 0,1,2,3,4
}
```



### 🎯 Sarcină

Folosește o buclă `for` pentru a aduna toate **numerele pare de la 1 la 1000** într-o variabilă `sum`.
