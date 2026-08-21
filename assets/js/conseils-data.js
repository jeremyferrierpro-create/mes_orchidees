// FICHIER DE DONNÉES CONSEILS DE CULTURE
// ========================================
// Ce fichier contient les fiches-conseils utilisées par la page conseils.
// Chaque conseil est classé par rubrique (category), type de plante et niveau.
// Les rubriques correspondent aux 6 cartes maquette de la page Conseils.
// Pour la démonstration orale, il est chargé en dur.
// Lors de la migration PHP + Supabase, il sera remplacé par un appel API.

window.conseilsDatabase = [
    {
        id: "arrosage-phal-debutant",
        title: "Arroser une Phalaenopsis",
        category: "Conseils de base",
        theme: "Arrosage",
        plantType: "Phalaenopsis",
        level: "Débutant",
        icon: "fa-droplet",
        content: "La Phalaenopsis préfère l'arrosage par trempage. Laissez sécher le substrat en surface entre deux arrosages. En hiver, réduisez la fréquence pour éviter la pourriture des racines.",
        source: "Guide de culture SFO"
    },
    {
        id: "exposition-cattleya",
        title: "Exposition d'une Cattleya",
        category: "Pour les hémi-épiphytes",
        theme: "Lumière",
        plantType: "Cattleya",
        level: "Intermédiaire",
        icon: "fa-sun",
        content: "Les Cattleya aiment une lumière vive sans soleil direct de l'après-midi. Un voilage est souvent nécessaire en été pour éviter les brûlures foliaires.",
        source: "Guide de culture SFO"
    },
    {
        id: "hygrometrie-vanda",
        title: "Hygrométrie pour Vanda",
        category: "Pour les épiphytes",
        theme: "Hygrométrie",
        plantType: "Vanda",
        level: "Expert",
        icon: "fa-wind",
        content: "Vanda demande une hygrométrie de 60 à 80 %. Un bac de graviers humides ou un humidificateur est recommandé dans les pièces chauffées. L'air doit rester en mouvement.",
        source: "Guide de culture SFO"
    },
    {
        id: "temperature-miltonia",
        title: "Température pour Miltonia",
        category: "Conseils de base",
        theme: "Température",
        plantType: "Miltonia",
        level: "Débutant",
        icon: "fa-temperature-half",
        content: "Miltonia se plaît entre 15 et 22 °C. Évitez les coups de chaud et les descentes brusques en dessous de 12 °C. Une baisse nocturne de 3 à 5 °C favorise la floraison.",
        source: "Guide de culture SFO"
    },
    {
        id: "rempotage-dendrobium",
        title: "Rempoter un Dendrobium",
        category: "Pour les épiphytes",
        theme: "Rempotage",
        plantType: "Dendrobium",
        level: "Expert",
        icon: "fa-seedling",
        content: "Rempotez après la floraison dans un mélange d'écorces grossières et de perlite. Ne rempotez jamais en pleine floraison et respectez une période de repos plus sèche en hiver.",
        source: "Guide de culture SFO"
    },
    {
        id: "fertilisation-paphiopedilum",
        title: "Fertiliser un Paphiopedilum",
        category: "Pour les terrestres",
        theme: "Fertilisation",
        plantType: "Paphiopedilum",
        level: "Intermédiaire",
        icon: "fa-leaf",
        content: "Utilisez un engrais équilibré dilué à 50 %, environ toutes les 3 à 4 semaines de mars à septembre. Les racines sensibles supportent mal un excès de sel.",
        source: "Guide de culture SFO"
    },
    {
        id: "arrosage-hivernal-cattleya",
        title: "Arrosage hivernal du Cattleya",
        category: "Pour les hémi-épiphytes",
        theme: "Arrosage",
        plantType: "Cattleya",
        level: "Expert",
        icon: "fa-droplet",
        content: "Pendant la période de repos, réduisez fortement l'arrosage et arrêtez la fertilisation. Cette sécheresse relative est nécessaire pour déclencher la future floraison.",
        source: "Guide de culture SFO"
    },
    {
        id: "lumiere-phalaenopsis",
        title: "Où placer une Phalaenopsis ?",
        category: "Conseils de base",
        theme: "Lumière",
        plantType: "Phalaenopsis",
        level: "Débutant",
        icon: "fa-sun",
        content: "Une fenêtre Est ou Nord-Est convient parfaitement. Évitez le soleil de midi qui jaunit les feuilles. Une lumière indirecte vive toute la journée est l'idéal.",
        source: "Guide de culture SFO"
    },
    {
        id: "hygrometrie-paphiopedilum",
        title: "Maintenir l'hygrométrie",
        category: "Pour les terrestres",
        theme: "Hygrométrie",
        plantType: "Paphiopedilum",
        level: "Intermédiaire",
        icon: "fa-wind",
        content: "Paphiopedilum aime 50 à 70 % d'hygrométrie. Ne vaporisez pas les feuilles : cela favorise les champignons. Préférez un humidificateur silencieux ou un bac à graviers.",
        source: "Guide de culture SFO"
    },
    {
        id: "temperature-dendrobium",
        title: "Gradient thermique du Dendrobium",
        category: "Pour les épiphytes",
        theme: "Température",
        plantType: "Dendrobium",
        level: "Intermédiaire",
        icon: "fa-temperature-half",
        content: "De nombreux Dendrobium ont besoin d'une baisse nocturne de température de 5 °C pour déclencher la floraison. Variez la température entre 12 °C la nuit et 22 °C le jour.",
        source: "Guide de culture SFO"
    },
    {
        id: "rempotage-phalaenopsis",
        title: "Quand rempoter une Phalaenopsis ?",
        category: "Conseils de base",
        theme: "Rempotage",
        plantType: "Phalaenopsis",
        level: "Débutant",
        icon: "fa-seedling",
        content: "Rempotez tous les 2 à 3 ans, ou quand le substrat se décompose. Utilisez un mélange spécial orchidée drainant : écorces petites, perlite, tourbe blonde.",
        source: "Guide de culture SFO"
    },
    {
        id: "fertilisation-vanda",
        title: "Fertilisation foliaire Vanda",
        category: "Pour les épiphytes",
        theme: "Fertilisation",
        plantType: "Vanda",
        level: "Expert",
        icon: "fa-leaf",
        content: "Les Vanda apprécient une fertilisation hebdomadaire diluée lors de chaque trempage. Pensez à rincer à l'eau claire une fois par mois pour éviter l'accumulation de sels.",
        source: "Guide de culture SFO"
    },
    {
        id: "sortie-flask",
        title: "Sortie de flask",
        category: "Sortie de flask",
        theme: "Culture avancée",
        plantType: "Toutes",
        level: "Intermédiaire",
        icon: "fa-flask",
        content: "Sortez le plant de la fiole en laboratoire. Rincez délicatement le gel à l'eau tiède. Repiquez immédiatement dans un substrat stérile (tourbe, perlite, charbon) et maintenez une humidité élevée sans soleil direct.",
        source: "Guide de culture SFO"
    },
    {
        id: "apres-achat",
        title: "Après l'achat",
        category: "Après achat",
        theme: "Acclimatation",
        plantType: "Toutes",
        level: "Débutant",
        icon: "fa-bag-shopping",
        content: "Laissez l'orchidée s'acclimater 48 h avant tout rempotage. Inspectez les racines et retirez le bourre de sphaigne surnuméraire. Placez-la à l'abri du soleil direct et arrosez modérément.",
        source: "Guide de culture SFO"
    }
];
