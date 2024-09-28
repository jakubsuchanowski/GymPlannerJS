document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Wywołanie API do rejestracji
  register(email, password);
});

function register(email, password) {
  fetch('http://localhost:8080/auth/registration', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password})
  })
  .then(response => {
      if (response.ok) {
          alert('Rejestracja zakończona sukcesem. Możesz się teraz zalogować.');
      } else {
          alert('Błąd rejestracji');
      }
  })
  .catch(error => {
      console.error('Błąd:', error);
  });
}