fetch('navbar.html')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
    })
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
    })
    .catch(error => {
        console.error('Wystąpił problem z załadowaniem nawigacji:', error);
    });
function logout() {
        // Logika wylogowania, np. usunięcie tokena z localStorage
        localStorage.removeItem('token');
        // Przekierowanie na stronę logowania
        window.location.href = 'login.html'; 
}