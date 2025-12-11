# Manipularea DOM în JavaScript

DOM (Document Object Model) reprezintă **structura paginii web**.
Cu JavaScript poți **citi, modifica și crea elemente** pe pagină.


## Selectarea elementelor

### Cu ID

```javascript
const title = document.getElementById("title");
```

### Cu `class`

```javascript
const boxes = document.getElementsByClassName("box");
```

### Cu selector CSS

```javascript
const firstBox = document.querySelector(".box");
const allBoxes = document.querySelectorAll(".box");
```


## Modificarea conținutului

```javascript
const title = document.getElementById("title");
title.textContent = "Hello World!";
```


## Modificarea stilului

```javascript
title.style.color = "red";
title.style.fontSize = "24px";
```


## Crearea și adăugarea unui element

```javascript
const newDiv = document.createElement("div");
newDiv.textContent = "Sunt un element nou!";
document.body.appendChild(newDiv);
```


## 🎯 Sarcină

1. Creează un element `<p>` cu textul `"Salut din JavaScript!"`
2. Adaugă-l în `<body>` folosind `appendChild`
3. Modifică stilul elementului dându-i un `font-size` de `25px`.
(Nu trebuie să modifici HTML-ul)

