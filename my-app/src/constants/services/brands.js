const images = import.meta.glob("../../assets/images/adverts/brandimage/*.{jpg,jpeg,png,webp}",{
    eager:true,
    import:"default",
});

const img = (name) => images[`../../assets/images/adverts/brandimage/${name}`];

export const brAnds = [
    {
        id: 101,
        name: "3TenX",
        image: img("3tenx.png"),
        subtitle: "3TenX ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 102,
        name: "Floractive",
        image: img("floractive.webp"),
        subtitle: "Floractive ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 103,
        name: "L'Oreal",
        image: img("loreal.png"),
        subtitle: "L'Oreal ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 104,
        name: "Schwarzkopf",
        image: img("schwarzkopf.png"),
        subtitle: "Schwarzkopf ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 105,
        name: "Modish7",
        image: img("modish7.png"),
        subtitle: "Modish7 ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 106,
        name: "Keralooks",
        image: img("keralooks.webp"),
        subtitle: "Keralooks ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 107,
        name: "GK Hair",
        image: img("gkhair.webp"),
        subtitle: "GK Hair ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 108,
        name: "MAC Cosmetics",
        image: img("mac.png"),
        subtitle: "MAC Cosmetics ArcAsa",
        type: "Makeup Brand",
        csid: "MC"
    },
    {
        id: 109,
        name: "Maybelline",
        image: img("maybelline.png"),
        subtitle: "Maybelline ArcAsa",
        type: "Makeup Brand",
        csid: "MC"
    },
    {
        id: 110,
        name: "Kryolan",
        image: img("kryolan.png"),
        subtitle: "Kryolan ArcAsa",
        type: "Makeup Brand",
        csid: "MC"
    },
    {
        id: 111,
        name: "Huda Beauty",
        image: img("hudabe.png"),
        subtitle: "Huda Beauty Makeup ArcAsa",
        type: "Makeup Brand",
        csid: "MC"
    },
    {
        id: 112,
        name: "YAANMAN Makeup",
        image: img("yaanman.png"),
        subtitle: "YAANMAN Makeup ArcAsa",
        type: "Makeup Brand",
        csid: "MC"
    },
    {
        id: 113,
        name: "Aroma Magic",
        image: img("aromamag.png"),
        subtitle: "Aroma Magic ArcAsa",
        type: "Skin Brand",
        csid: "SC"
    },
    {
        id: 114,
        name: "Cheryls Cosmetics",
        image: img("cheryls.png"),
        subtitle: "Cheryls ArcAsa",
        type: "Skin Brand",
        csid: "SC"
    },
    {
        id: 115,
        name: "Lotus Professional",
        image: img("lotus.png"),
        subtitle: "Lotus Professional ArcAsa",
        type: "Skin Brand",
        csid: "SC"
    },
    {
        id: 116,
        name: "RICA",
        image: img("rica.png"),
        subtitle: "RICA ArcAsa",
        type: "Skin Brand",
        csid: "SC"
    },
    {
        id: 117,
        name: "O3+",
        image: img("o3plus.png"),
        subtitle: "O3+ ArcAsa",
        type: "Skin Brand",
        csid: "SC"
    },
    {
        id: 118,
        name: "Raaga",
        image: img("raaga.webp"),
        subtitle: "Raaga ArcAsa",
        type: "Skin Brand",
        csid: "SC"
    },
    {
        id: 119,
        name: "Moehair",
        image: img("moehair.png"),
        subtitle: "Moehair ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
    {
        id: 120,
        name: "Olaplex",
        image: img("olaplex.png"),
        subtitle: "Olaplex ArcAsa",
        type: "Hair Brand",
        csid: "HR"
    },
]