import { fetchUserData } from './query.js';
import { parseJwt } from './jwt.js';
console.log("Page en cours :", document.location.pathname);

document.addEventListener('DOMContentLoaded', async () => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        window.location.href = '/index.html'; // Redirige vers la page de connexion si non connecté
        return;
    }

    const decodedToken = parseJwt(jwt);
    const userId = decodedToken ? decodedToken.sub : null;

    if (!userId) {
        console.error("Impossible de récupérer l'ID utilisateur à partir du JWT.");
        document.getElementById('userData').textContent = "Erreur : utilisateur non authentifié.";
        return;
    }

    try {
        const userData = await fetchUserData(userId, jwt);

        if (userData) {
            // Filtre les données pour le graphique
            const relevantSkills = [
                'skill_prog', 'skill_algo', 'skill_front-end',
                'skill_back-end', 'skill_stats', 'skill_game', 'skill_tcp'
            ];
            const filteredData = userData.transactions
                .filter(tx => relevantSkills.includes(tx.type))
                .reduce((acc, tx) => {
                    acc[tx.type] = tx.amount;
                    return acc;
                }, {});

            const dataForGraph = [
                filteredData['skill_prog'] || 0,
                filteredData['skill_algo'] || 0,
                filteredData['skill_front-end'] || 0,
                filteredData['skill_back-end'] || 0,
                filteredData['skill_stats'] || 0,
                filteredData['skill_game'] || 0,
                filteredData['skill_tcp'] || 0
            ];

        } else {
            throw new Error('Données utilisateur manquantes ou incorrectes');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        document.getElementById('userData').textContent = "Erreur lors du chargement des données.";
    }
});
const currentPage = document.body.getAttribute('data-page');

if (currentPage === "graph") {
    const svgContainer = document.getElementById('svgContainer');
    if (svgContainer) {
        createGraph([50, 38, 45, 50, 10, 15, 30]);
    }
}
