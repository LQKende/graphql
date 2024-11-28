document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Supprimer le JWT du localStorage
            localStorage.removeItem('jwt');

            // Rediriger vers la page d'accueil (index.html)
            window.location.href = '/index.html';
        });
    }
});
