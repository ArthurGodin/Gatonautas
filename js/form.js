document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';

    const nome = form.name.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.message.value.trim();

    if (!nome) {
      formMessage.textContent = 'Por favor, informe seu nome.';
      form.name.focus();
      return;
    }
    if (!validateEmail(email)) {
      formMessage.textContent = 'Por favor, informe um e-mail válido.';
      form.email.focus();
      return;
    }
    if (!mensagem) {
      formMessage.textContent = 'Por favor, escreva uma mensagem.';
      form.message.focus();
      return;
    }

    fetch('http://localhost:3000/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao enviar mensagem.');
        return res.json();
      })
      .then(data => {
        formMessage.style.color = 'green';
        formMessage.textContent = data.message || 'Mensagem enviada com sucesso!';
        form.reset();
      })
      .catch(err => {
        formMessage.style.color = 'red';
        formMessage.textContent = err.message || 'Erro no envio da mensagem.';
      });
  });
});

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
