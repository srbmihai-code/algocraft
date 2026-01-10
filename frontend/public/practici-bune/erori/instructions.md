# Gestionarea erorilor

În final, o bună practică în programare este gestionarea erorilor cu instrucțiunile `try` și `catch`.

În blocul `try { }` introducem cod care poate cauza o eroare.

Cu blocul `catch(e) {}` captăm eroarea în variabila `e` dacă apare și o putem analiza/afișa cu `e.message`.

### 🎯 Sarcină

Folosește-te de funcția `divide` care poate cauza o eroare la împărțirea la zero pentru a programa funcția `calculeazaMedie`.
În cazul în care `divide` cauzează o eroare, afișeaz-o în HTML.
