const images = import.meta.glob("../../assets/images/adverts/*.{jpg,jpeg,png,webp}",{
    eager:true,
    import:"default",
});

const img = (name) => images[`../../assets/images/adverts/${name}`];

export const adsNpckg = [
    {
        id: 1,
        name: "Father's Day",
        image: img("Fathers_day.png"),
        subtitle: "Father's Day ArcAsa Package",
        active: "off",
        month: 106
      },
      {
        id: 2,
        name: "Mother's Day",
        image: img("MothersDaynew.jpg"),
        subtitle: "Mother's Day ArcAsa Package",
        active: "off",
        month: 105
      },
      {
        id: 3,
        name: "Savitri",
        image: img("Savitri_new.jpg"),
        subtitle: "Sivitri Offer ArcAsa Package",
        active: "off",
        month: 115
      },
      {
        id: 4,
        name: "Summer Men",
        image: img("summer26men.png"),
        subtitle: "Summer Mens' Offer ArcAsa Package",
        active: "off",
        month: 103
      },
      {
        id: 5,
        name: "Summer Women",
        image: img("summer26women.png"),
        subtitle: "Summer Womens' Offer ArcAsa Package",
        active: "off",
        month: 103
      },
      {
        id: 6,
        name: "Men's Upto 50% Off",
        image: img("g_50_percn.png"),
        subtitle: "ArcAsa Mens' Package",
        active: "on",
        month: 100
      },
      {
        id: 6,
        name: "Women's Upto 50% Off",
        image: img("l_50_percn.png"),
        subtitle: "ArcAsa Mens' Package",
        active: "on",
        month: 100
      },
      {
        id: 7,
        name: "Monsoon Offer",
        image: img("monsoon_offer.jpg"),
        subtitle: "ArcAsa Monsoon Package",
        active: "off",
        month: 107
      },
      {
        id: 7,
        name: "Monsoon Offer",
        image: img("monsoon_offer.jpg"),
        subtitle: "ArcAsa Monsoon Package",
        active: "off",
        month: 107
      },


]
