function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
}
document.addEventListener('DOMContentLoaded', checkAuth)