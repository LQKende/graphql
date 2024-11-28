import { fetchUserData } from './query.js';
import { parseJwt } from './jwt.js';

document.addEventListener('DOMContentLoaded', async () => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        console.error("Utilisateur non authentifié.");
        document.getElementById('svgContainer1').textContent = "Vous devez vous connecter pour voir les graphiques.";
        document.getElementById('svgContainer2').textContent = "Vous devez vous connecter pour voir les graphiques.";
        return;
    }

    const userId = parseJwt(jwt)?.sub;
    if (!userId) {
        console.error("ID utilisateur introuvable dans le JWT.");
        document.getElementById('svgContainer1').textContent = "Erreur lors de l'authentification.";
        document.getElementById('svgContainer2').textContent = "Erreur lors de l'authentification.";
        return;
    }

    try {
        const userData = await fetchUserData(userId, jwt);
        if (userData && userData.transactions) {
            const userTransactions = userData.transactions;

            // Premier graphique - Compétences générales
            const relevantSkills = [
                'skill_prog', 'skill_algo', 'skill_front-end',
                'skill_back-end', 'skill_stats', 'skill_game', 'skill_tcp'
            ];
            const filteredData1 = userTransactions
                .filter(tx => relevantSkills.includes(tx.type))
                .reduce((acc, tx) => {
                    acc[tx.type] = tx.amount;
                    return acc;
                }, {});

            const dataForGraph1 = [
                filteredData1['skill_prog'] || 0,
                filteredData1['skill_algo'] || 0,
                filteredData1['skill_front-end'] || 0,
                filteredData1['skill_back-end'] || 0,
                filteredData1['skill_stats'] || 0,
                filteredData1['skill_game'] || 0,
                filteredData1['skill_tcp'] || 0
            ];

            createSvgGraph1(dataForGraph1);

            // Deuxième graphique - Technologies spécifiques
            const relevantTechnologies = [
                'skill_unix', 'skill_js', 'skill_html',
                'skill_go', 'skill_docker', 'skill_css'
            ];
            const filteredData2 = userTransactions
                .filter(tx => relevantTechnologies.includes(tx.type))
                .reduce((acc, tx) => {
                    acc[tx.type] = tx.amount;
                    return acc;
                }, {});

            const dataForGraph2 = [
                filteredData2['skill_unix'] || 0,
                filteredData2['skill_js'] || 0,
                filteredData2['skill_html'] || 0,
                filteredData2['skill_go'] || 0,
                filteredData2['skill_docker'] || 0,
                filteredData2['skill_css'] || 0
            ];

            createSvgGraph2(dataForGraph2);

        } else {
            console.error("Les données utilisateur sont absentes ou mal formatées.");
            document.getElementById('svgContainer1').textContent = "Erreur lors du chargement des données.";
            document.getElementById('svgContainer2').textContent = "Erreur lors du chargement des données.";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        document.getElementById('svgContainer1').textContent = "Une erreur est survenue.";
        document.getElementById('svgContainer2').textContent = "Une erreur est survenue.";
    }
});

// Fonction générique pour créer un graphique circulaire avec traits et labels
// Fonction générique pour créer un graphique circulaire avec traits et labels
// Fonction générique pour créer un graphique circulaire avec traits et labels
// Fonction générique pour créer un graphique circulaire avec traits et labels
// Fonction générique pour créer un graphique circulaire avec traits et labels
function createCircularGraph(data, containerId, labels) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", 600);
    svg.setAttribute("height", 600);
    svg.setAttribute("viewBox", "0 0 600 600");

    const centerX = 300;
    const centerY = 300;
    const radius = 150;
    const labelOffset = 40; // Espace supplémentaire pour les labels

    // Ajout du cercle principal
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke", "black");
    circle.setAttribute("fill", "none");
    svg.appendChild(circle);

    const angleStep = (2 * Math.PI) / data.length; // Angle entre chaque point

    let points = [];

    data.forEach((value, index) => {
        const normalizedValue = Math.min(Math.max(value, 0), 100); // Limite entre 0 et 100
        const angle = index * angleStep; // Calcul de l'angle pour chaque point

        // Position du point
        const pointX = centerX + (normalizedValue / 100) * radius * Math.cos(angle);
        const pointY = centerY - (normalizedValue / 100) * radius * Math.sin(angle);

        // Position pour le bord du trait
        const endX = centerX + radius * Math.cos(angle);
        const endY = centerY - radius * Math.sin(angle);

        // Ajout du trait passant par le point et atteignant le bord
        const line = document.createElementNS(svgNamespace, "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", "black");
        svg.appendChild(line);

        // Position pour le label (20px au-delà du cercle)
        const labelX = centerX + (radius + labelOffset) * Math.cos(angle);
        const labelY = centerY - (radius + labelOffset) * Math.sin(angle);

        // Ajout du label
        const label = document.createElementNS(svgNamespace, "text");
        label.setAttribute("x", labelX); // Position X avec décalage
        label.setAttribute("y", labelY); // Position Y avec décalage
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("alignment-baseline", "middle");
        label.textContent = labels[index];
        label.setAttribute("font-size", "12px");
        label.setAttribute("fill", "black");
        svg.appendChild(label);

        // Ajout du point
        const point = document.createElementNS(svgNamespace, "circle");
        point.setAttribute("cx", pointX);
        point.setAttribute("cy", pointY);
        point.setAttribute("r", 5);
        point.setAttribute("fill", "blue");
        svg.appendChild(point);

        // Stocker les coordonnées du point
        points.push({ x: pointX, y: pointY });
    });

    // Ajouter les lignes entre les points (polygone fermé)
    for (let i = 0; i < points.length; i++) {
        const startPoint = points[i];
        const endPoint = points[(i + 1) % points.length];

        const connectingLine = document.createElementNS(svgNamespace, "line");
        connectingLine.setAttribute("x1", startPoint.x);
        connectingLine.setAttribute("y1", startPoint.y);
        connectingLine.setAttribute("x2", endPoint.x);
        connectingLine.setAttribute("y2", endPoint.y);
        connectingLine.setAttribute("stroke", "gray");
        connectingLine.setAttribute("stroke-dasharray", "4 2");
        svg.appendChild(connectingLine);
    }

    // Ajout au conteneur
    const svgContainer = document.getElementById(containerId);
    if (svgContainer) {
        svgContainer.innerHTML = ""; // Nettoie l'ancien contenu
        svgContainer.appendChild(svg); // Ajoute le nouveau SVG
        console.log(`Graphique circulaire ajouté dans #${containerId} avec succès !`);
    } else {
        console.error(`Conteneur #${containerId} introuvable !`);
    }
}





// Création des deux graphiques
function createSvgGraph1(data) {
    const labels = [
        'Programmation', 'Algorithmique', 'Front-end',
        'Back-end', 'Statistiques', 'Jeux', 'TCP/IP'
    ];
    createCircularGraph(data, "svgContainer1", labels);
}

function createSvgGraph2(data) {
    const labels = [
        'Unix', 'JavaScript', 'HTML',
        'Go', 'Docker', 'CSS'
    ];
    createCircularGraph(data, "svgContainer2", labels);
}
