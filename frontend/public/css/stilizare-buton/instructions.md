# 🎨 Stilizarea input-ului și a butonului

Pentru a avea o interfață coerentă, elementele de tip **input** și **button** trebuie să aibă un stil de bază similar: spațiere interioară, chenar vizibil și colțuri rotunjite.

## Pseudo-selectorul `:hover`

Pseudo-selectorul `:hover` se folosește pentru a schimba stilul unui element atunci când mouse-ul este deasupra lui.

Sintaxa este:

```css
selector:hover {
  proprietate: valoare;
}
```

### 🎯 Sarcină

- Stilizează input-ul `#nume` cu `padding`, `border` și `border-radius`
- Stilizează butonul `#btn-action` cu aceleași proprietăți, având `#nume, #btn-action` în fața stilului pentru a nu repeta codul
- Setează un `background-color` pentru buton
- Adaugă un selector `#btn-action:hover` care schimbă `background-color` cu o altă nuanță
