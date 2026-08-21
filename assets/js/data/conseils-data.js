// Ce fichier est ma fausse base de données de conseils (en attendant PHP + Supabase)
// Il y a 2 types de fiches :
//   - type "category" = les 6 grosses rubriques (base, épiphytes, terrestres, hémi, après achat, flask)
//   - type "species" = une fiche par orchidée (21 fiches) avec ses careCards (température, arrosage...)
// Plus tard je remplacerai par fetch('api/conseils.php')

export const conseilsDatabase = [ // je crée la liste de toutes les fiches
    { // FICHE 1 : rubrique Conseils de base (pour débutants)
        "id": "conseils-base", // code unique de la rubrique
        "type": "category", // c'est une rubrique, pas une orchidée précise
        "name": "Conseils de base", // nom affiché sur la carte
        "img": "./assets/images/site/base.jpg", // photo de la rubrique
        "category": "Conseils de base", // catégorie pour la recherche
        "content": "Le secret absolu : L'orchidée est une plante dite 'aérienne' dont les racines respirent. Le pire ennemi de votre nouvelle acquisition reste l'asphyxie racinaire due à un excès d'eau.\nLumière : Préférez une lumière vive tamisée, à moins d'un mètre d'une fenêtre, sans jamais de soleil direct brûlant.\nArrosage : Ne versez jamais 'un petit peu chaque jour'. Attendez que le substrat soit presque sec, puis trempez le pot 10 à 15 minutes.\nHygrométrie : Une ambiance humide (autour de 60 %) est favorable. Un bac de graviers humidifiés aide beaucoup.\nEnvironnement : Bannissez le terreau de jardin ordinaire. Utilisez un mélange d'écorces, de tourbe et de perlite bien drainant.", // long texte affiché dans la modale
        "careCards": { // les 6 petites cases en bas de la modale
            "temperature": "20 °C", // température idéale
            "arrosage": "régulier", // fréquence d'arrosage
            "hygrometrie": "65 %", // humidité
            "rempotage": "2 ans", // tous les combien rempoter
            "engrais": "1 arrosage sur 2", // engrais
            "substrats": "selon type" // substrat
        }
    },
    { // FICHE 2 : rubrique Pour les épiphytes (celles qui poussent sur les arbres)
        "id": "conseils-epiphytes",
        "type": "category",
        "name": "Pour les épiphytes",
        "img": "./assets/images/site/epiphyte.jpg",
        "category": "Pour les épiphytes",
        "content": "Le secret absolu : Dans la nature, les racines des orchidées épiphytes respirent autant qu'elles boivent. Le pire ennemi de votre plante n'est pas le manque d'eau, mais l'excès d'humidité qui asphyxie ses racines.\nLumière : Installez votre protégée tout près d'une fenêtre (à moins d'un mètre), mais sans soleil direct brûlant en été.\nArrosage : N'arrosez jamais 'un petit peu chaque jour'. Attendez que le substrat soit presque sec, puis plongez le pot dans un seau d'eau non calcaire 10 à 15 minutes.\nL'indicateur magique : Regardez les racines à travers le pot. Sont-elles grises ? L'orchidée a soif. Sont-elles vertes ? Elle a assez d'eau, attendez.\nEnvironnement : Bannissez le terreau ordinaire ! Utilisez uniquement un mélange d'écorces de pin laissant passer l'air. Ne laissez jamais d'eau stagner au fond du cache-pot.",
        "careCards": {
            "temperature": "25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 3 : rubrique Pour les terrestres (celles qui poussent dans la terre)
        "id": "conseils-terrestres",
        "type": "category",
        "name": "Pour les terrestres",
        "img": "./assets/images/site/terrestre.jpg",
        "category": "Pour les terrestres",
        "content": "Le secret absolu : Dans la nature, les racines des orchidées terrestres aiment la fraîcheur de la terre, mais elles détestent être noyées. Le pire ennemi n'est pas la sécheresse passagère, mais la terre compacte et détrempée qui asphyxie ses racines en un clin d'œil.\nLumière : Installez votre protégée dans une pièce bien éclairée, près d'une fenêtre, mais à l'abri des rayons directs.\nArrosage : N'arrosez jamais par petites gouttes quotidiennes. Attendez que le cœur du pot commence à s'alléger, puis arrosez copieusement.\nL'indicateur magique : Soulevez le pot et observez la surface. Est-il devenu très léger et le substrat sec au toucher ? L'orchidée réclame son onde.\nEnvironnement : Bannissez le terreau de jardinage ordinaire, trop lourd. Offrez-lui un mélange spécifique riche en matières drainantes.",
        "careCards": {
            "temperature": "-1 / +30 °C",
            "arrosage": "régulier",
            "hygrometrie": "50 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "organique"
        }
    },
    { // FICHE 4 : rubrique Pour les hémi-épiphytes (moitié arbre, moitié terre)
        "id": "conseils-hemi-epiphytes",
        "type": "category",
        "name": "Pour les hémi-épiphytes",
        "img": "./assets/images/site/hemiepyphite.jpg",
        "category": "Pour les hémi-épiphytes",
        "content": "Le secret absolu : Dans la nature, ces orchidées possèdent un double système : des racines qui aiment l'humus et d'autres qui grimpent dans l'air pour respirer. Le pire ennemi reste l'asphyxie. Le substrat doit être très aéré pour reproduire ce compromis parfait entre terre et écorce.\nLumière : Installez votre protégée tout près d'une fenêtre (à moins d'un mètre), sans soleil direct brûlant en été.\nArrosage : N'arrosez jamais 'un petit peu chaque jour'. Attendez que le cœur du pot commence à sécher, puis plongez le pot 10 à 15 minutes.\nL'indicateur magique : Observez le poids de la plante. Si le pot est très léger et les racines ternes, l'orchidée a soif.\nEnvironnement : Bannissez le terreau de jardinage ordinaire. Utilisez un mélange d'écorces de pin de calibre moyen enrichi d'un peu de sphaigne.",
        "careCards": {
            "temperature": "25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "fibreux"
        }
    },
    { // FICHE 5 : rubrique Après achat (que faire quand on vient d'acheter)
        "id": "conseils-apres-achat",
        "type": "category",
        "name": "Après achat",
        "img": "./assets/images/site/orchidee_apres_achat.jpg",
        "category": "Après achat",
        "content": "Le transport protégé : Les orchidées détestent les courants d'air et les chocs thermiques. Enveloppez toujours votre plante pour le trajet entre le magasin et votre demeure.\nL'emplacement idéal : Installez-la immédiatement dans une pièce lumineuse, à moins d'un mètre d'une fenêtre, sans aucun soleil direct qui brûlerait ses feuilles.\nLa quarantaine de sécurité : Par prudence, gardez la nouvelle venue isolée des autres plantes pendant deux semaines pour vérifier l'absence de parasites cachés.\nLe premier réflexe d'arrosage : N'arrosez pas tout de suite ! Attendez que les racines visibles deviennent grises.\nPas de rempotage immédiat : Ne rempotez jamais une orchidée en pleine floraison. Le stress lui ferait perdre tous ses boutons.\nLa patience pour l'engrais : Attendez la fin de la floraison et l'apparition d'une nouvelle feuille avant d'apporter de l'engrais.",
        "careCards": {
            "temperature": "20 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "selon type"
        }
    },
    { // FICHE 6 : rubrique Sortie de flask (pour les pros qui sortent les bébés du flacon)
        "id": "conseils-flask",
        "type": "category",
        "name": "Sortie de flask",
        "img": "./assets/images/site/sortie_flask.webp",
        "category": "Sortie de flask",
        "content": "CONSEIL 'SORTIE DE FLASK' : LE SAUVETAGE DES PLANTULES\nL'avis de l'expert : Sortir des plantules de leur flacon stérile est une opération délicate. Privées de leur milieu nutritif, elles passent d'une humidité saturée à l'air libre. Le choc hydrique et microbien est le principal danger.\nLe Sevrage : Sortez délicatement les plantules du flacon. Lavez-les impérativement à l'eau tiède pour éliminer toute trace de gélose.\nLe Bain Fongicide : Trempez les jeunes plantes quelques minutes dans une solution fongicide douce et biologique.\nL'Installation : Ne les rempotez pas individuellement. Installez-les ensemble en 'communauté' dans un bac communautaire.\nLe Substrat : Utilisez un mélange ultra-fin, aéré et sain : sphaigne du Chili hachée pure ou mélangée à de la fine écorce de pin.\nL'Atmosphère : Placez le bac dans une mini-serre fermée pour maintenir 90 % d'humidité. Ouvrez progressivement quelques minutes par jour sur trois semaines.\nLumière & Chaleur : Une chaleur de fond constante (22-25 °C) et une lumière vive mais tamisée sont vitales.",
        "careCards": {
            "temperature": "25 °C",
            "arrosage": "régulier",
            "hygrometrie": "90 %",
            "rempotage": "1 an",
            "engrais": "pas d'engrais",
            "substrats": "ultra fin"
        }
    },
    // À partir d'ici : 21 fiches "species" = une par orchidée, générées à partir de orchids-data.js
    { // FICHE 7 : fiche espèce Acacalis (copie de l'orchidée + conseils adaptés)
        "id": "fiche-acacalis_cyanea", // id de la fiche = "fiche-" + id orchidée
        "type": "species", // c'est une fiche espèce
        "name": "ACACALIS CYANEA", // même nom que l'orchidée
        "img": "./assets/images/orchids/acacalis_cyanea.png", // même photo
        "category": "Épiphyte", // son comportement
        "content": "ACACALIS CYANEA est une orchidée épiphyte originaire de Amérique du Sud (Bassin de l'Amazone). Découverte en John Lindley (1839).\nAcacalis cyanea demande une forte humidité ambiante (80%+), des températures chaudes et une lumière tamisée de sous-bois. Se développant très bien montée sur plaque d'écorce ou de liège, elle déteste le soleil direct et demande un arrosage régulier à l'eau douce.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 8 : Acineta
        "id": "fiche-acineta_barkerii",
        "type": "species",
        "name": "ACINETA BARKERII",
        "img": "./assets/images/orchids/acineta_barkerii.png",
        "category": "Épiphyte",
        "content": "ACINETA BARKERII est une orchidée épiphyte originaire de Mexique, Amérique Centrale. Découverte en John Lindley (1843).\nAcineta barkerii se cultive impérativement en panier suspendu car ses hampes florales traversent le substrat vers le bas. Elle exige une lumière vive sans soleil brûlant, des arrosages abondants durant la croissance de ses gros pseudobulbes et un léger repos plus sec en hiver.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 9 : Ada
        "id": "fiche-ada_aurantiaca",
        "type": "species",
        "name": "ADA AURANTIACA",
        "img": "./assets/images/orchids/ada_aurantiaca.png",
        "category": "Épiphyte",
        "content": "ADA AURANTIACA est une orchidée épiphyte originaire de Andes (Colombie, Venezuela). Découverte en John Lindley (1854).\nAda aurantiaca pousse naturally dans les forêts de nuages fraîches et humides des Andes. Elle demande des températures tempérées à fraîches, une lumière moyenne, une hygrométrie élevée et un substrat à base d'écorces fines maintenant une fraîcheur constante sans détremper.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 10 : Aerangis articulata
        "id": "fiche-aerangis_articulata",
        "type": "species",
        "name": "AERANGIS ARTICULATA",
        "img": "./assets/images/orchids/aerangis_articulata.png",
        "category": "Épiphyte",
        "content": "AERANGIS ARTICULATA est une orchidée épiphyte originaire de Madagascar, Comores. Découverte en Achille Richard (1841).\nAerangis articulata développe de magnifiques grappes pendantes très parfumées la nuit. Elle apprécie une lumière tamisée, une ambiance chaude et très humide. Idéale cultivée sur plaque ou en panier de bois aéré avec des arrosages et vaporisations très fréquents.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 11 : Aerangis fastuosa
        "id": "fiche-aerangis_fastuosa",
        "type": "species",
        "name": "AERANGIS FASTUOSA",
        "img": "./assets/images/orchids/aerangis_fastuosa.png",
        "category": "Épiphyte",
        "content": "AERANGIS FASTUOSA est une orchidée épiphyte originaire de Madagascar. Découverte en Heinrich Gustav Reichenbach (1881).\nAerangis fastuosa est une petite plante spectaculaire dont la fleur est souvent aussi grosse que le feuillage. Elle exige des températures modérées, une bonne ventilation et une humidité constante. La culture sur plaque de liège garnie de sphaigne lui convient parfaitement.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 12 : Aerangis kirkii
        "id": "fiche-aerangis_kirkii",
        "type": "species",
        "name": "AERANGIS KIRKII",
        "img": "./assets/images/orchids/aerangis_kirkii.png",
        "category": "Épiphyte",
        "content": "AERANGIS KIRKII est une orchidée épiphyte originaire de Afrique de l'Est (Kenya, Tanzanie). Découverte en Heinrich Gustav Reichenbach (1865).\nAerangis kirkii présente un feuillage très caractéristique aux extrémités bilobées. Ses fleurs blanches au long éperon apparaissent en grappes légères. Elle demande des températures chaudes, une ombre moyenne et une hygrométrie élevée toute l'année.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 13 : Aerides houlletiana
        "id": "fiche-aerides_houlletiana",
        "type": "species",
        "name": "AERIDES HOULLETIANA",
        "img": "./assets/images/orchids/aerides_houlletiana.png",
        "category": "Épiphyte",
        "content": "AERIDES HOULLETIANA est une orchidée épiphyte originaire de Asie du Sud-Est (Thaïlande, Viêt Nam). Découverte en Henri Victor Regnault (1872).\nAerides houlletiana produit d'épaisses racines aériennes et de denses grappes de fleurs jaunes/crème bordées de pourpre au parfum très doux. Proche des Vandas, elle demande une luminosité très forte, de la chaleur et des bassinages quotidiens.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Panier aéré"
        }
    },
    { // FICHE 14 : Aerides odorata
        "id": "fiche-aerides_odorata",
        "type": "species",
        "name": "AERIDES ODORATA",
        "img": "./assets/images/orchids/aerides_odorata.png",
        "category": "Épiphyte",
        "content": "AERIDES ODORATA est une orchidée épiphyte originaire de Asie tropicale et subtropicale. Découverte en Lour. (1790).\nAerides odorata est une plante vigoureuse produisant de nombreuses fleurs cireuses blanches et roses en grappes retombantes. Elle s'épanouit dans des conditions chaudes et très lumineuses. Se cultive idéalement racines nues en panier suspendu.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Panier aéré"
        }
    },
    { // FICHE 15 : Angraecum didierii
        "id": "fiche-angraecum_didierii",
        "type": "species",
        "name": "ANGRAECUM DIDIERII",
        "img": "./assets/images/orchids/angraecum_didierii.png",
        "category": "Épiphyte",
        "content": "ANGRAECUM DIDIERII est une orchidée épiphyte originaire de Madagascar. Découverte en Henri Jumelle & Henri Perrier (1915).\nAngraecum didierii est une orchidée compacte très appréciée pour ses fleurs disproportionnées par rapport à la taille de la plante. Elle aime une lumière modérée à forte, des températures tempérées-chaudes et un substrat drainant qui sèche légèrement entre deux arrosages.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 16 : Angraecum eburneum
        "id": "fiche-angraecum_eburneum",
        "type": "species",
        "name": "ANGRAECUM EBURNEUM",
        "img": "./assets/images/orchids/angraecum_eburneum.png",
        "category": "Épiphyte",
        "content": "ANGRAECUM EBURNEUM est une orchidée épiphyte originaire de Madagascar, Mascareignes. Découverte en Louis-Marie Aubert du Petit-Thouars (1822).\nAngraecum eburneum devient une grande plante aux feuilles coriaces en éventail. Ses fleurs cireuses ont un labelle blanc pur très visible orienté vers le haut. Elle nécessite de la chaleur, une très forte luminosité et de l'espace pour s'épanouir.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 17 : Angraecum sesquipedale (l'étoile de Darwin)
        "id": "fiche-angraecum_sesquipedale",
        "type": "species",
        "name": "ANGRAECUM SESQUIPEDALE",
        "img": "./assets/images/orchids/angraecum_sesquipedale.png",
        "category": "Épiphyte",
        "content": "ANGRAECUM SESQUIPEDALE est une orchidée épiphyte originaire de Madagascar. Découverte en Louis-Marie Aubert du Petit-Thouars (1822).\nAngraecum sesquipedale produit de grandes fleurs nocturnes étoilées blanches. Étudiée par Charles Darwin qui a prédit l'existence de son papillon pollinisateur, elle demande une lumière vive sans soleil direct, une ambiance chaude et une forte hygrométrie.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 18 : Anguloa clowesii (terrestre)
        "id": "fiche-anguloa_clowesii",
        "type": "species",
        "name": "ANGULOA CLOWESII",
        "img": "./assets/images/orchids/anguloa_clowesii.png",
        "category": "Terrestre / Lithophyte",
        "content": "ANGULOA CLOWESII est une orchidée terrestre / lithophyte originaire de Andes (Colombie, Venezuela). Découverte en John Lindley (1844).\nAnguloa clowesii forme d'imposants pseudobulbes et de grandes feuilles plissées. Ses fleurs en forme de tulipe abritent un labelle basculant. Elle exige des températures fraîches à tempérées, beaucoup d'eau en croissance et un repos bien marqué en hiver.",
        "careCards": {
            "temperature": "-1 / +30 °C",
            "arrosage": "régulier",
            "hygrometrie": "50 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Substrat organique"
        }
    },
    { // FICHE 19 : Anguloa virginalis
        "id": "fiche-anguloa_virginalis",
        "type": "species",
        "name": "ANGULOA VIRGINALIS",
        "img": "./assets/images/orchids/anguloa_virginalis.png",
        "category": "Terrestre / Lithophyte",
        "content": "ANGULOA VIRGINALIS est une orchidée terrestre / lithophyte originaire de Andes (Pérou, Colombie, Équateur). Découverte en John Lindley (1851).\nAnguloa virginalis pousse dans les forêts montagneuses humides. Ses fleurs massives et parfumées s'épanouissent au printemps. Elle demande un compost riche et bien drainé, une humidité constante en période de végétation et une bonne ventilation.",
        "careCards": {
            "temperature": "-1 / +30 °C",
            "arrosage": "régulier",
            "hygrometrie": "50 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Substrat organique"
        }
    },
    { // FICHE 20 : Ansellia africana (léopard)
        "id": "fiche-ansellia_africana",
        "type": "species",
        "name": "ANSELLIA AFRICANA",
        "img": "./assets/images/orchids/ansellia_africana.png",
        "category": "Épiphyte",
        "content": "ANSELLIA AFRICANA est une orchidée épiphyte originaire de Afrique subsaharienne. Découverte en John Lindley (1844).\nAnsellia africana développe de longues cannes et un système racinaire en 'nid' pour capter les feuilles mortes. Très résistante, elle réclame un maximum de lumière (soleil léger accepté), de la chaleur et des arrosages abondants suivis d'un séchage complet.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 21 : Ascocentrum
        "id": "fiche-ascocentrum_spp",
        "type": "species",
        "name": "ASCOCENTRUM SPP",
        "img": "./assets/images/orchids/ascocentrum_spp.png",
        "category": "Épiphyte",
        "content": "ASCOCENTRUM SPP est une orchidée épiphyte originaire de Asie du Sud-Est. Découverte en Carl Ludwig Blume (1825).\nLe genre Ascocentrum (désormais souvent rattaché aux Vandas) regroupe des petites plantes compactes aux floraisons éclatantes. Elles demandent des conditions similaires aux Vandas : très forte luminosité, chaleur, forte humidité et culture à racines nues ou panier aéré.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "70 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Panier aéré"
        }
    },
    { // FICHE 22 : Aspasia lunata
        "id": "fiche-aspasia_lunata",
        "type": "species",
        "name": "ASPASIA LUNATA",
        "img": "./assets/images/orchids/aspasia_lunata.png",
        "category": "Épiphyte",
        "content": "ASPASIA LUNATA est une orchidée épiphyte originaire de Brésil. Découverte en John Lindley (1836).\nAspasia lunata est originaire des forêts tropicales humides du littoral brésilien. Elle produit de charmantes fleurs parfumées et cireuses. Se cultive facilement en pot avec un mélange d'écorces moyennes, sous une ombre modérée et avec des températures tempérées-chaudes.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 23 : Aspasia principissa
        "id": "fiche-aspasia_principissa",
        "type": "species",
        "name": "ASPASIA PRINCIPISSA",
        "img": "./assets/images/orchids/aspasia_principissa.png",
        "category": "Épiphyte",
        "content": "ASPASIA PRINCIPISSA est une orchidée épiphyte originaire de Amérique Centrale (Panama, Costa Rica). Découverte en Heinrich Gustav Reichenbach (1852).\nAspasia principissa pousse dans les forêts tropicales de basse altitude. Ses fleurs sont plus grandes que la plupart des autres espèces d'Aspasia. Elle exige de la chaleur, une humidité constante tout au long de l'année et une luminosité moyenne sans soleil direct.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 24 : Barkeria
        "id": "fiche-barkeria_spectabilis",
        "type": "species",
        "name": "BARKERIA SPECTABILIS",
        "img": "./assets/images/orchids/barkeria_spectabilis.png",
        "category": "Épiphyte",
        "content": "BARKERIA SPECTABILIS est une orchidée épiphyte originaire de Amérique Centrale (Guatemala, Mexique). Découverte en John Lindley (1842).\nBarkeria spectabilis pousse accrochée aux branches dans les forêts de montagne ouvertes. Elle perd souvent ses feuilles en période de repos. Elle exige d'être montée sur écorce avec des racines très aérées, beaucoup de lumière et un repos sec et frais en hiver.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 25 : Bifrenaria
        "id": "fiche-bifrenaria_inodora",
        "type": "species",
        "name": "BIFRENARIA INODORA",
        "img": "./assets/images/orchids/bifrenaria_inodora.png",
        "category": "Épiphyte / Lithophyte",
        "content": "BIFRENARIA INODORA est une orchidée épiphyte / lithophyte originaire de Brésil (Forêt Atlantique). Découverte en John Lindley (1843).\nBifrenaria inodora développe de tétragones pseudobulbes très durs. Malgré son nom 'inodora', certaines variétés émettent un parfum léger. Elle demande une forte luminosité pour fleurir, des températures tempérées et une période de repos marquée au sec après la croissance.",
        "careCards": {
            "temperature": "20-25 °C",
            "arrosage": "régulier",
            "hygrometrie": "65 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Plaque de liège"
        }
    },
    { // FICHE 26 : Vanilla (cas spécial hémi-épiphyte)
    "id": "fiche-vanilla_planifolia",
    "type": "species",
    "name": "VANILLA PLANIFOLIA",
    "img": "./assets/images/orchids/vanilla_planifolia.jpg", // minuscule pour Linux
    "category": "Épiphyte",
    "content": "VANILLA PLANIFOLIA est une orchidée épiphyte originaire du Mexique et d'Amérique centrale. Elle est notamment cultivée pour ses gousses de vanille. Vanilla planifolia est une liane vigoureuse qui développe de longues tiges charnues et des racines aériennes. Elle apprécie une forte luminosité tamisée, une atmosphère chaude et humide ainsi qu'un substrat très drainant. Une période de repos légère peut favoriser la floraison, mais le dessèchement complet des racines doit être évité.",
    "careCards": {
        "temperature": "20-30 °C",
        "arrosage": "régulier",
        "hygrometrie": "70-80 %",
        "rempotage": "2-3 ans",
        "engrais": "1 arrosage sur 2",
        "substrats": "Écorces de pin + sphaigne"
    }
},
    { // FICHE 27 : Bletilla (terrestre rustique)
        "id": "fiche-bletilla_ochracea",
        "type": "species",
        "name": "BLETILLA OCHRACEA",
        "img": "./assets/images/orchids/bletilla_ochracea.png",
        "category": "Terrestre",
        "content": "BLETILLA OCHRACEA est une orchidée terrestre originaire de Chine. Découverte en Miquel (1873).\nBletilla ochracea est une espèce terrestre très élégante et moyennement rustique (-10°C). Elle se cultive en pleine terre dans un sol drainé, frais et humifère, à mi-ombre. Ses pseudo-bulbes entrent en dormance complète sous terre durant tout l'hiver.",
        "careCards": {
            "temperature": "-1 / +30 °C",
            "arrosage": "régulier",
            "hygrometrie": "50 %",
            "rempotage": "2 ans",
            "engrais": "1 arrosage sur 2",
            "substrats": "Substrat organique"
        }
    }
];

