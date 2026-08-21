// FICHIER DE DONNÉES CONSEILS DE CULTURE
// ========================================
// Ce fichier contient les fiches-conseils utilisées par la page conseils.
// Chaque objet représente un conseil classé par thème, type de plante et niveau.
// Pour la démonstration orale, il est chargé en dur.
// Lors de la migration PHP + Supabase, il sera remplacé par un appel API.

window.conseilsDatabase = [
    {
        id: "arrosage-phal-debutant",
        title: "Arroser une Phalaenopsis",
        theme: "Arrosage",
        plantType: "Phalaenopsis",
        level: "Débutant",
        icon: "fa-droplet",
        content: "La Phalaenopsis préfère l'arrosage par trempage. Laissez sécher le substrat en surface entre deux arrosages. En hiver, réduisez la fréquence."
    },
    {
        id: "lumiere-cattleya-intermediaire",
        title: "Exposition d'une Cattleya",
        theme: "Lumière",
        plantType: "Cattleya",
        level: "Intermédiaire",
        icon: "fa-sun",
        content: "Les Cattleya aiment une lumière vive sans soleil direct de l'après-midi. Un rideau voile est souvent nécessaire en été."
    },
    {
        id: "hygrometrie-vanda-expert",
        title: "Hygrométrie pour Vanda",
        theme: "Hygrométrie",
        plantType: "Vanda",
        level: "Expert",
        icon: "fa-wind",
        content: "Vanda demande une hygrométrie de 60 à 80 %. Un bac de graviers humides ou un humidificateur est recommandé dans les pièces chauffées."
    },
    {
        id: "temperature-miltonia-debutant",
        title: "Température pour Miltonia",
        theme: "Température",
        plantType: "Miltonia",
        level: "Débutant",
        icon: "fa-temperature-half",
        content: "Miltonia se plaît entre 15 et 22 °C. Évitez les coups de chaud et les descentes brusques en dessous de 12 °C."
    },
    {
        id: "rempotage-dendrobium-expert",
        title: "Rempoter un Dendrobium",
        theme: "Rempotage",
        plantType: "Dendrobium",
        level: "Expert",
        icon: "fa-seedling",
        content: "Rempotez après la floraison dans un mélange d'écorces grossières et de perlite. Ne rempotez jamais en pleine floraison."
    },
    {
        id: "fertilisation-paphiopedilum-intermediaire",
        title: "Fertiliser un Paphiopedilum",
        theme: "Fertilisation",
        plantType: "Paphiopedilum",
        level: "Intermédiaire",
        icon: "fa-leaf",
        content: "Utilisez un engrais équilibré dilué à 50 %, environ toutes les 3 à 4 semaines de mars à septembre."
    },
    {
        id: "arrosage-cattleya-expert",
        title: "Arrosage du repos hivernal",
        theme: "Arrosage",
        plantType: "Cattleya",
        level: "Expert",
        icon: "fa-droplet",
        content: "Pendant la période de repos, réduisez fortement l'arrosage et arrêtez la fertilisation pour favoriser la future floraison."
    },
    {
        id: "lumiere-phalaenopsis-debutant",
        title: "Où placer une Phalaenopsis ?",
        theme: "Lumière",
        plantType: "Phalaenopsis",
        level: "Débutant",
        icon: "fa-sun",
        content: "Une fenêtre Est ou Nord-Est convient parfaitement. Évitez le soleil de midi qui jaunit les feuilles."
    },
    {
        id: "hygrometrie-paphiopedilum-intermediaire",
        title: "Maintenir l'hygrométrie",
        theme: "Hygrométrie",
        plantType: "Paphiopedilum",
        level: "Intermédiaire",
        icon: "fa-wind",
        content: "Paphiopedilum aime 50 à 70 % d'hygrométrie. Ne vaporisez pas les feuilles : cela favorise les champignons."
    },
    {
        id: "temperature-dendrobium-intermediaire",
        title: "Gradient thermique",
        theme: "Température",
        plantType: "Dendrobium",
        level: "Intermédiaire",
        icon: "fa-temperature-half",
        content: "De nombreux Dendrobium ont besoin d'une baisse nocturne de température de 5 °C pour déclencher la floraison."
    },
    {
        id: "rempotage-phalaenopsis-debutant",
        title: "Quand rempoter ?",
        theme: "Rempotage",
        plantType: "Phalaenopsis",
        level: "Débutant",
        icon: "fa-seedling",
        content: "Rempotez tous les 2 à 3 ans, ou quand le substrat se décompose. Utilisez un mélange spécial orchidée."
    },
    {
        id: "fertilisation-vanda-expert",
        title: "Fertilisation foliaire Vanda",
        theme: "Fertilisation",
        plantType: "Vanda",
        level: "Expert",
        icon: "fa-leaf",
        content: "Les Vanda apprécient une fertilisation hebdomadaire diluée lors de chaque trempage. Pensez à rincer à l'eau claire une fois par mois."
    }
];
