/**
 * featured_units.js
 * Central database for the "Unidades Destacadas" (Featured Units) section.
 * Updated: 2026-05-04 - New 7 Featured Units with /auto/ structure
 */

const FEATURED_UNITS = [
    {
        id: "mazda-cx-5-signature-2-5turbo",
        title: "Mazda CX-5 Signature 2.5 Turbo",
        year: "2022",
        price: "$498,000",
        specs: "75,000 km • Automática",
        specs_en: "75,000 km • Automatic",
        tag: "Premium SUV",
        tag_en: "Premium SUV",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/11-Mazda-CX-5-signature-2.5Turbo-2022-75mil-km-69df22e26f9c8.jpeg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/mazda-cx-5-signature-2-5turbo/"
    },
    {
        id: "jeep-renegade-latitude",
        title: "Jeep Renegade Latitude",
        year: "2022",
        price: "$328,000",
        specs: "99,000 km • Automática",
        specs_en: "99,000 km • Automatic",
        tag: "Icono Jeep",
        tag_en: "Jeep Icon",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/79fcb24b-a973-4899-af12-2c789dfab5fe-1-68a4a59b31b98.jpg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/jeep-renegade-latitude/"
    },
    {
        id: "gac-emzoom-gb-lite-ta",
        title: "Gac EmZoom GB Lite TA",
        year: "2024",
        price: "$360,000",
        specs: "24,355 km • Automática",
        specs_en: "24,355 km • Automatic",
        tag: "Diseño Futuro",
        tag_en: "Future Design",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/1-Gac-EmZoom-GB-LITE-TA-2024-69af06ea4f7a8.jpeg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/gac-emzoom-gb-lite-ta/"
    },
    {
        id: "nissan-frontier-pro-4x4",
        title: "Nissan Frontier PRO 4×4",
        year: "2024",
        price: "$608,000",
        specs: "69,030 km • Automática",
        specs_en: "69,030 km • Automatic",
        tag: "Aventura 4X4",
        tag_en: "4X4 Adventure",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/7-Nissan-Frontier-PRO-4x4-2024-69b3463c7e8cd.jpeg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/nissan-frontier-pro-4x4/"
    },
    {
        id: "volkswagen-tiguan-trendline-plus",
        title: "Volkswagen Tiguan Trendline Plus",
        year: "2019",
        price: "$335,000",
        specs: "94,033 km • Automática",
        specs_en: "94,033 km • Automatic",
        tag: "Familiar Elite",
        tag_en: "Elite Family",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/1-Volkswagen-Tiguan-TRENDLINE-PLUS-2019-335mil-6939b2546220d.jpeg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/volkswagen-tiguan-trendline-plus/"
    },
    {
        id: "mg-3-style-tm",
        title: "MG 3 Style TM",
        year: "2025",
        price: "$245,000",
        specs: "12,000 km • Manual",
        specs_en: "12,000 km • Manual",
        tag: "Compacto Style",
        tag_en: "Compact Style",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/opt-4-MG-3-Style-TM-2025-698278990dd1c.jpeg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/mg-3-style-tm/"
    },
    {
        id: "mg-5-elegance-ta-2",
        title: "MG 5 Elegance TA",
        year: "2024",
        price: "$258,000",
        specs: "84,000 km • Automática",
        specs_en: "84,000 km • Automatic",
        tag: "Sedán Elegance",
        tag_en: "Elegant Sedan",
        image: "https://autoservallarta.com/seminuevos/wp-content/uploads/fea-submissions/6-Mg-5-Elegance-TA-2024-69ee52f87a3bb.jpeg",
        url: "https://autoservallarta.com/seminuevos/seminuevo/mg-5-elegance-ta-2/"
    }
];
