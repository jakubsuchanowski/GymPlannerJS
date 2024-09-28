document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Wywołanie API do logowania
  login(email, password);
});

function login(email, password) {
  fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email:email, password: password })
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          alert('Błędne dane logowania');
      }
  })
  .then(data => {
    // Oczekujemy, że dane będą zawierały email i token
    const email = data.email;  // Zmiana z data.email na data.username
    const accessToken = data.accessToken;

    // Przechowywanie tokenu i emaila w lokalnej pamięci
    localStorage.setItem('email', email);
    localStorage.setItem('token', accessToken);
    

    // Przekierowanie do dashboardu
    window.location.href = 'dashboard.html';
})
.catch(error => {
  alert(error.message);
  console.error('Błąd:', error);
});
}