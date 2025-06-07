document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('volunteerForm');
  const formMessage = document.getElementById('volunteerFormMessage');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formMessage.textContent = '';
      formMessage.className = 'form-message'; // Reset class

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const reason = form.reason.value.trim();
      const q1 = form.q1.value;
      const q2 = form.q2.value;
      const q3 = form.q3.value.trim();

      // Basic Validation
      if (!name || !email || !reason || !q1 || !q2 || !q3) {
        showMessage('Por favor, preencha todos os campos da sua aplicação, futuro comunicador!', 'error');
        return;
      }
      if (!validateEmail(email)) {
        showMessage('Esse e-mail parece de outra galáxia... que tal um formato válido?', 'error');
        form.email.focus();
        return;
      }

      const formData = {
        name,
        email,
        reason,
        testAnswers: {
          q1,
          q2,
          q3
        },
        submittedAt: new Date().toISOString()
      };

      // Pretend to send data to a new backend endpoint
      // Replace with your actual fetch call to your backend (e.g., /voluntarios)
      console.log('Dados do voluntário para enviar:', formData);
      showMessage('Processando sua candidatura intergaláctica...', 'info');

      fetch('https://gatonautas-backend.onrender.com/voluntarios', { // ADAPTAR ESTE ENDPOINT NO SEU BACKEND
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.message || 'Falha na comunicação com a nave-mãe ao enviar sua candidatura.');
          });
        }
        return res.json();
      })
      .then(data => {
        // Fun outcome based on answers (simple example)
        let funTitle = "Comunicador Terrestre Promissor";
        if (q1 === 'a' && q2 === 'a') {
          funTitle = "Mestre Zen da Comunicação Felina";
        } else if (q1 === 'b' || q2 === 'd') {
          funTitle = "Diplomata Criativo e Saboroso";
        }
        showMessage(`Obrigado, ${name}! Sua candidatura para ${funTitle} foi enviada com sucesso! Entraremos em contato.`, 'success');
        form.reset();
      })
      .catch(err => {
        showMessage(err.message || 'Erro cósmico ao enviar. Tente novamente.', 'error');
      });
    });
  }

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function showMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message'; // Reset classes
        formMessage.classList.add(type); // 'success', 'error', ou 'info'
        formMessage.style.display = 'block';
    }
  }
});