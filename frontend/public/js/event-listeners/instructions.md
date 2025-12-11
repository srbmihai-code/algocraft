# Event Listeners în JavaScript

Un event listener permite JavaScript-ului să reacționeze la acțiunile utilizatorului (click, tastatură, mouse etc.).

## Ce este un event

Un event este o acțiune, de exemplu:

- click pe un buton
- apăsarea unei taste
- încărcarea paginii

## addEventListener

Sintaxă de bază:

```javascript
element.addEventListener("event", functie);
```

Exemplu:

```javascript
const btn = document.querySelector("button");

btn.addEventListener("click", function () {
  console.log("Buton apăsat");
});
```
Funcția se execută de fiecare dată când evenimentul are loc.

## 🎯 Sarcină

- Creează un buton în HTML cu textul „Adaugă”
- La fiecare apăsare pe buton valoarea din `<p>` trebuie să crească cu `1`

Notă: Folosește funcția Number() pentru a converti textul din `<p>` într-un număr atunci când citești valoarea inițială.
