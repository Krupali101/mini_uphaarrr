const blackLuxuryChocolateBouquetImage = '/images/black-luxury-chocolate-bouquet.png';
const pinkGiftBoxImage = '/images/pink-gift-box.jpg';
const kinderJoyBouquetImage = '/images/kinder-joy-bouquet.png';
const customizedGiftBouquetImage = '/images/product-customized-gift-bouquet.webp';
const pinkLilyBouquetImage = '/images/product-pink-lily-bouquet.webp';
const customizedMagazineImage = '/images/product-customized-magazine.webp';
const handmadeGreetingCardsImage = '/images/product-handmade-greeting-cards.webp';
const customizedPhotoFrameImage = '/images/product-customized-photo-frame.jpg';
const customizedBouquetImage = '/images/product-custom-premium-bouquet.jpg';
const chocolateHamperImage = '/images/product-chocolate-hamper.jpg';
const surpriseGiftBoxImage = '/images/product-surprise-gift-box.jpg';
const luxurySurpriseGiftBoxImage = '/images/product-luxury-surprise-gift-box.jpg';
const handmadeGreetingCardImage = '/images/product-handmade-greeting-card.jpg';
const homeCustomizedGiftBouquetImage = '/images/home-customized-gift-bouquet.png';
const homeBlackLuxuryChocolateBouquetImage = '/images/home-black-luxury-chocolate-bouquet.png';
const homePinkGiftBoxImage = '/images/home-pink-gift-box.jpg';
const homeHandmadeGreetingCardsImage = '/images/home-handmade-greeting-cards-collection.jpg';
const homeKinderJoyBouquetImage = '/images/home-kinder-joy-bouquet.jpg';

export const productCategories = [
  {
    id: 1,
    name: 'Customized Bouquets',
    description: 'Handcrafted floral and gift arrangements tailored to your special moments',
    image: customizedGiftBouquetImage,
    products: [
      {
        id: 101,
        name: 'Customized Gift Bouquet',
        description: 'Elegant beige and cream wrapped gift bouquet featuring premium skincare items, delicate jewelry, and floral accents',
        image: customizedGiftBouquetImage
      },
      {
        id: 102,
        name: 'Pink Lily Bouquet',
        description: 'Beautiful pink lily bouquet wrapped in soft translucent paper with delicate fairy lights for a magical glow',
        image: pinkLilyBouquetImage
      },
      {
        id: 103,
        name: 'Custom Premium Bouquet',
        description: 'Elegant customized bouquet crafted with premium gift items, soft wrapping, and delicate floral details',
        image: customizedBouquetImage
      }
    ]
  },
  {
    id: 2,
    name: 'Chocolate Hampers',
    description: 'Luxurious chocolate gift arrangements for the sweetest occasions',
    image: blackLuxuryChocolateBouquetImage,
    products: [
      {
        id: 301,
        name: 'Black Luxury Chocolate Bouquet',
        description: 'Luxurious black wrapped bouquet filled with premium chocolates, curated snacks, and tied with elegant red ribbons',
        image: blackLuxuryChocolateBouquetImage
      },
      {
        id: 302,
        name: 'Chocolate Hamper',
        description: 'Sweet chocolate hamper arranged beautifully with favorite treats for birthdays, anniversaries, and surprises',
        image: chocolateHamperImage
      }
    ]
  },
  {
    id: 3,
    name: 'Personalized Decorations',
    description: 'Custom memories and decorations to make your celebrations unforgettable',
    image: customizedPhotoFrameImage,
    products: [
      {
        id: 601,
        name: 'Customized Photo Frame',
        description: 'Black framed customized photo collage featuring multiple memorable moments arranged beautifully',
        image: customizedPhotoFrameImage
      },
      {
        id: 602,
        name: 'Customized Magazine',
        description: 'Personalized Times of India newspaper-style magazine cover for a unique birthday celebration',
        image: customizedMagazineImage
      }
    ]
  },
  {
    id: 4,
    name: 'Surprise Gift Boxes',
    description: 'Curated gift boxes filled with handpicked treasures and self-care essentials',
    image: pinkGiftBoxImage,
    products: [
      {
        id: 501,
        name: 'Pink Gift Box',
        description: 'Curated pink gift box containing matching pink tumbler, cute bow , a decorative candle, and soft flower arrangements',
        image: pinkGiftBoxImage
      },
      {
        id: 502,
        name: 'Surprise Gift Box',
        description: 'Thoughtfully packed surprise gift box with charming details for making special moments memorable',
        image: handmadeGreetingCardImage
      },
      {
        id: 503,
        name: 'Luxury Surprise Gift Box',
        description: 'Premium surprise gift box arranged with elegant wrapping, handpicked gifts, and a beautiful presentation',
        image: luxurySurpriseGiftBoxImage
      }
    ]
  },
  {
    id: 5,
    name: 'Handmade Greeting Cards',
    description: 'Personalized cards crafted with love and charming illustrations',
    image: handmadeGreetingCardsImage,
    products: [
      {
        id: 401,
        name: 'Handmade Greeting Cards Collection',
        description: 'Collection of cute handmade greeting cards featuring adorable custom illustrations and sweet messages',
        image: handmadeGreetingCardsImage
      },
      {
        id: 402,
        name: 'Handmade Greeting Card',
        description: 'Personalized handmade greeting card designed with creative details for heartfelt gifting',
        image: surpriseGiftBoxImage
      }
    ]
  },
  {
    id: 6,
    name: 'Kinder Joy Bouquets',
    description: 'Sweet chocolate bouquets that bring joy to every celebration',
    image: kinderJoyBouquetImage,
    products: [
      {
        id: 201,
        name: 'Kinder Joy Bouquet',
        description: 'Delightful Kinder Joy chocolate bouquet wrapped in vibrant pink and yellow premium paper',
        image: kinderJoyBouquetImage
      }
    ]
  }
];

export const featuredProducts = [
  {
    id: 101,
    name: 'Customized Gift Bouquet',
    description: 'White and gold accessory bouquet arranged with earrings, hair clips, a floral accent, and a lavender bow',
    image: homeCustomizedGiftBouquetImage,
    category: 'Customized Bouquets'
  },
  {
    id: 301,
    name: 'Black Luxury Chocolate Bouquet',
    description: 'Black and gold luxury bouquet filled with Ferrero-style chocolates, baby breath flowers, and a satin bow',
    image: homeBlackLuxuryChocolateBouquetImage,
    category: 'Chocolate Hampers'
  },
  {
    id: 501,
    name: 'Pink Gift Box',
    description: 'Curated pink gift box containing matching pink tumbler, kisses chocolate, a decorative candle, and soft flower arrangements',
    image: homePinkGiftBoxImage,
    category: 'Surprise Gift Boxes'
  },
  {
    id: 401,
    name: 'Handmade Greeting Cards Collection',
    description: 'Collection of cute handmade greeting cards featuring adorable custom illustrations',
    image: homeHandmadeGreetingCardsImage,
    category: 'Handmade Greeting Cards'
  },
  {
    id: 201,
    name: 'Kinder Joy Bouquet',
    description: 'Delightful Kinder Joy chocolate bouquet wrapped in vibrant pink and yellow premium paper',
    image: homeKinderJoyBouquetImage,
    category: 'Kinder Joy Bouquets'
  }
];
