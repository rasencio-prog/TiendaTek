const bcrypt = require('bcryptjs');

const password = 'prueba1234'; // <--- CAMBIA ESTO

const saltRounds = 10;

console.log(`Generando hash para la contraseña: "${password}"`);

const hash = bcrypt.hashSync(password, saltRounds);

console.log('Hash generado:');

console.log(hash);
