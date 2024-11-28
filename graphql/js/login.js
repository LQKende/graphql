const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let usern = document.getElementById("username").value;
    let passw = document.getElementById("password").value;

    login(usern, passw);
});

async function login(username, password) {
    console.log('Tentative de connexion...');  // Log lorsque la fonction login est appelée

    try {
        const response = await fetch('https://zone01normandie.org/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),  // Encode les credentials
                'Content-Type': 'application/json'
            }
        });

        // Log pour voir la réponse brute de l'API avant tout traitement
        console.log('Réponse brute du serveur:', response);

        // Vérifie si la réponse est correcte (statut HTTP 200)
        if (!response.ok) {
            throw new Error('Échec de l\'authentification : Identifiants incorrects');
        }

        const data = await response.json();

        // Log la réponse parsée de l'API pour voir son contenu
        console.log('Données reçues de l\'API:', data);

        if (data) {
            // Stocke le JWT dans le localStorage
            localStorage.setItem('jwt', data);
            console.log('JWT stocké:', data);  // Confirmation que le JWT a été stocké

            // Redirige vers la page du tableau de bord
            console.log('Redirection vers le tableau de bord...');
            window.location.href = './graphql/templates/dashboard.html';
        } else {
            throw new Error('Erreur: Le JWT est manquant dans la réponse.');
        }
    } catch (error) {
        // Log l'erreur
        console.error('Erreur lors de la connexion:', error);

        // Affiche un message d'erreur à l'utilisateur
        document.getElementById('error').textContent = "Erreur de connexion : Identifiants incorrects.";
    }
}
