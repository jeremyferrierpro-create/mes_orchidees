// Ce fichier est une fausse base de données d'utilisateurs (en attendant le PHP + Supabase)
// Plus tard, ces 3 personnes viendront d'une vraie table SQL, pas d'un fichier JS
// Chaque objet = une personne

export const usersDatabase = [
    {
        id: 1, // numéro unique
        nom: "Dupont", // nom de famille
        prenom: "Jean-Marc", // prénom
        email: "admin@mesorchidees.fr", // adresse pour se connecter
        password: "demouser", // mot de passe FAUX (en vrai on ne met jamais un mot de passe en clair)
        role: "user", // rôle : simple utilisateur
        created: "15/01/2026", // date de création
        modified: "01/04/2026" // date de dernière modif
    },
    {
        id: 2, // deuxième personne
        nom: "FERRIER",
        prenom: "Jeremy",
        email: "jeremy.ferrierpro@gmail.com",
        password: "demoadmin", // mot de passe FAUX
        role: "admin", // rôle admin (peut aller sur la page Administration)
        created: "15/01/2026",
        modified: "01/04/2026"
    },
    {
        id: 3,
        nom: "Martin",
        prenom: "Jessica",
        email: "jessica.amateur@gmail.com",
        password: "demouser",
        role: "user",
        created: "03/02/2026",
        modified: "10/05/2026"
    }
];
