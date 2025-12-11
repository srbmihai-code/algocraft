function runTest() {
  if (typeof student === 'undefined') {
    return { pass: false, message: '❌ Obiectul student nu este definit.' };
  }

  if (typeof increaseAge !== 'function') {
    return { pass: false, message: '❌ Funcția increaseAge nu este definită.' };
  }
  student.age = 19
  const originalAge = student.age;
  increaseAge(student);

  if (student.age === originalAge + 1) {
    return { pass: true, message: `✅ Corect! Vârsta studentului a crescut de la ${originalAge} la ${student.age}.` };
  } else {
    return { pass: false, message: `❌ Greșit. Vârsta studentului trebuia să fie ${originalAge + 1}, dar este ${student.age}.` };
  }
}
