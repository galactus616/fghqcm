const { createCategory } = require('./helpers');

// Main Categories (Level 1)
const mainCategories =  [
  {
    "name": "Fruits & Vegetables",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951426/fresh-fruit-and-vegetable_foskin.jpg",
    "level": 1,
    "sortOrder": 1
  },
  {
    "name": "Fish & Meats",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951424/fish_meat_t99mvr.jpg",
    "level": 1,
    "sortOrder": 2
  },
  {
    "name": "Snacks & Beverages",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951430/snacks_beverages_bbvlmq.jpg",
    "level": 1,
    "sortOrder": 3
  },
  {
    "name": "Bakery & Biscuits",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951422/bakery_biscuits_mmtyld.jpg",
    "level": 1,
    "sortOrder": 4
  },
  {
    "name": "Personal Care",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951427/personal_care_qnp1gl.jpg",
    "level": 1,
    "sortOrder": 5
  },
  {
    "name": "Pet Care",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951428/pet_care_nwhvmh.jpg",
    "level": 1,
    "sortOrder": 6
  },
  {
    "name": "Baby Care",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951421/baby_care_mxamim.jpg",
    "level": 1,
    "sortOrder": 7
  },
  {
    "name": "Dairy & Eggs",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951270/dairy_eggs_sos5mv.jpg",
    "level": 1,
    "sortOrder": 8
  },
  {
    "name": "Snacks",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951431/snacks_aolz6e.png",
    "level": 1,
    "sortOrder": 9
  },
  {
    "name": "Sweets",
    "imageUrl": "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    "level": 1,
    "sortOrder": 10
  },
  {
    "name": "Rice, Dal, Atta",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951428/rice_dal_atta_xmfqsp.jpg",
    "level": 1,
    "sortOrder": 11
  },
  {
    "name": "Cleaning",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951269/cleaning_products_lvpxng.jpg",
    "level": 1,
    "sortOrder": 12
  },
  {
    "name": "Feminine Care",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951270/feminine_care_nq1v7v.jpg",
    "level": 1,
    "sortOrder": 13
  },
  {
    "name": "Tea & Coffee",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951433/TEA_COFFEE_wuya9l.jpg",
    "level": 1,
    "sortOrder": 14
  },
  {
    "name": "Instant Food",
    "imageUrl": "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    "level": 1,
    "sortOrder": 15
  },
  {
    "name": "Pharma",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951427/medicines_q62xcw.jpg",
    "level": 1,
    "sortOrder": 16
  },
  {
    "name": "Sauces",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951429/sauce_brbyda.jpg",
    "level": 1,
    "sortOrder": 17
  },
  {
    "name": "Masala, Oils & More",
    "imageUrl": "https://res.cloudinary.com/dke11dwwc/image/upload/v1753951432/spices_gcraiv.png",
    "level": 1,
    "sortOrder": 18
  }
];

// Create formatted categories using helper function
const formattedMainCategories = mainCategories.map(cat => createCategory(cat));

module.exports = formattedMainCategories;
