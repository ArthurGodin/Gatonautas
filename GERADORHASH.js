const bcrypt = require('bcrypt');
const saltRounds = 10;
const passwordToHash = '1310';

bcrypt.hash(passwordToHash, saltRounds, function(err, hash) {
    if (err) {
        console.error('Erro ao gerar hash:', err);
        return;
    }
    console.log('Senha:', passwordToHash);
    console.log('Hash Gerado:', hash);
});