import { fetchUserData } from './query.js';

document.addEventListener('DOMContentLoaded', async () => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        console.error("Utilisateur non authentifié. Redirection...");
        window.location.href = '/index.html';
        return;
    }

    const userId = getUserIdFromJwt(jwt);
    if (!userId) {
        console.error("ID utilisateur introuvable dans le JWT.");
        return;
    }

    try {
        const userData = await fetchUserData(userId, jwt);
        if (userData) {
            displayUserInformation(userData);
            displaySkills(userData.transactions);
        } else {
            console.error("Les données utilisateur sont manquantes ou incorrectes.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
    }
});

// Fonction pour extraire l'ID utilisateur du JWT
function getUserIdFromJwt(jwt) {
    try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        return payload.sub;
    } catch (e) {
        console.error("Erreur lors du parsing du JWT :", e);
        return null;
    }
}

// Fonction pour afficher les informations utilisateur (nom, email, etc.)
function displayUserInformation(userData) {
    const userDataElement = document.getElementById('userData');
    if (userDataElement) {
        userDataElement.innerHTML = `
            <p><strong>Nom :</strong> ${userData.firstName} ${userData.lastName}</p>
            <p><strong>Email :</strong> ${userData.email}</p>
            <p><strong>Login :</strong> ${userData.login}</p>
            <p><strong>Audit Ratio :</strong> ${userData.auditRatio}</p>
        `;
    }
}

// Fonction pour afficher les compétences et les technologies
function displaySkills(transactions) {
    const skillCategories = {
        technicalSkills: ['prog', 'algo', 'front-end', 'back-end', 'stats', 'game', 'tcp'],
        technologies: ['go', 'docker', 'css', 'html', 'js', 'unix']
    };

    // Trier les compétences dans les catégories
    const technicalSkills = transactions.filter(tx =>
        skillCategories.technicalSkills.includes(tx.type.replace('skill_', ''))
    );
    const technologies = transactions.filter(tx =>
        skillCategories.technologies.includes(tx.type.replace('skill_', ''))
    );

    // Afficher les compétences techniques
    const technicalSkillsElement = document.getElementById('technicalSkills');
    if (technicalSkillsElement) {
        technicalSkillsElement.innerHTML = `
            <h3>Technical Skills:</h3>
            <ul>
                ${technicalSkills.map(skill => `<li>${skill.type.replace('skill_', '')}: ${skill.amount}</li>`).join('')}
            </ul>
        `;
    }

    // Afficher les technologies
    const technologiesElement = document.getElementById('technologies');
    if (technologiesElement) {
        technologiesElement.innerHTML = `
            <h3>Technologies:</h3>
            <ul>
                ${technologies.map(tech => `<li>${tech.type.replace('skill_', '')}: ${tech.amount}</li>`).join('')}
            </ul>
        `;
    }
}
