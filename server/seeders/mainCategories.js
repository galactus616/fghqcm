const { createCategory } = require('./helpers');

// Main Categories (Level 1)
const mainCategories = [
  {
    name: "Fruits & Vegetables",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239607/imgi_13_close-up-delicious-apple_23-2151868338_bi6uih.jpg",
    level: 1,
    sortOrder: 1
  },
  {
    name: "Fish & Meats",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_14_realistic-flavored-chocolate-bar-pack-template-with-orange-nuts-picture-vector-illustration_1284-68296-removebg-preview_lboeyh.png",
    level: 1,
    sortOrder: 2
  },
  {
    name: "Snacks & Beverages",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752240550/imgi_60_cheese-chips-bag-design-realistic-vector-illustration_1240525-127876_q2ooce.jpg",
    level: 1,
    sortOrder: 3
  },
  {
    name: "Bakery & Biscuits",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/download-removebg-preview_pobolq.png",
    level: 1,
    sortOrder: 4
  },
  {
    name: "Personal Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 1,
    sortOrder: 5
  },
  {
    name: "Pet Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
    level: 1,
    sortOrder: 6
  },
  {
    name: "Baby Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
    level: 1,
    sortOrder: 7
  },
  {
    name: "Dairy & Eggs",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
    level: 1,
    sortOrder: 8
  },
  {
    name: "Snacks",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 1,
    sortOrder: 9
  },
  {
    name: "Sweets",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 10
  },
  {
    name: "Rice, Dal, Atta",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 11
  },
  {
    name: "Cleaning",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 12
  },
  {
    name: "Home Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 13
  },
  {
    name: "Tea & Coffee",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 14
  },
  {
    name: "Instant Food",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 15
  },
  {
    name: "Pharma",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 16
  },
  {
    name: "Sauces",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 17
  },
  {
    name: "Masala, Oils & More",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 1,
    sortOrder: 18
  },

];

// Create formatted categories using helper function
const formattedMainCategories = mainCategories.map(cat => createCategory(cat));

module.exports = formattedMainCategories;
