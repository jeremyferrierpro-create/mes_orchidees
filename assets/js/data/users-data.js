// FICHIER DE DONNÉES UTILISATEURS (MOCK BDD)
// ==========================================
// Remplace provisoirement le backend PHP / Supabase.

export const usersDatabase = [
    {
        id: 1,
        nom: "Dupont",
        prenom: "Jean-Marc",
        email: "admin@mesorchidees.fr",
        password: "demouser", // Mot de passe fictif (ne jamais faire ça en prod)
        role: "user",
        created: "15/01/2026",
        modified: "01/04/2026"
    },
    {
        id: 2,
        nom: "FERRIER",
        prenom: "Jeremy",
        email: "jeremy.ferrierpro@gmail.com",
        password: "demoadmin", // Mot de passe fictif (ne jamais faire ça en prod)
        role: "admin",
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
