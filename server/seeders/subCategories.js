const { createCategory } = require('./helpers');

// Sub Categories (Level 2) - 5 subcategories for each main category
const subCategories = [
  // Fruits & Vegetables
  {
    name: "Fresh Fruits",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239607/imgi_13_close-up-delicious-apple_23-2151868338_bi6uih.jpg",
    level: 2,
    parentCategory: "Fruits & Vegetables",
    sortOrder: 1
  },
  {
    name: "Fresh Vegetables",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_167_fresh-cilantro-bunch-vibrant-green-herb_632498-25488_kyoigs.jpg",
    level: 2,
    parentCategory: "Fruits & Vegetables",
    sortOrder: 2
  },
  {
    name: "Seasonal Fruits",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239607/imgi_13_close-up-delicious-apple_23-2151868338_bi6uih.jpg",
    level: 2,
    parentCategory: "Fruits & Vegetables",
    sortOrder: 3
  },
  {
    name: "Organic Vegetables",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_167_fresh-cilantro-bunch-vibrant-green-herb_632498-25488_kyoigs.jpg",
    level: 2,
    parentCategory: "Fruits & Vegetables",
    sortOrder: 4
  },
  {
    name: "Exotic Fruits",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239607/imgi_13_close-up-delicious-apple_23-2151868338_bi6uih.jpg",
    level: 2,
    parentCategory: "Fruits & Vegetables",
    sortOrder: 5
  },

  // Fish & Meats
  {
    name: "Fresh Fish",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_14_realistic-flavored-chocolate-bar-pack-template-with-orange-nuts-picture-vector-illustration_1284-68296-removebg-preview_lboeyh.png",
    level: 2,
    parentCategory: "Fish & Meats",
    sortOrder: 1
  },
  {
    name: "Fresh Chicken",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Fish & Meats",
    sortOrder: 2
  },
  {
    name: "Fresh Beef",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Fish & Meats",
    sortOrder: 3
  },
  {
    name: "Frozen Fish",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_14_realistic-flavored-chocolate-bar-pack-template-with-orange-nuts-picture-vector-illustration_1284-68296-removebg-preview_lboeyh.png",
    level: 2,
    parentCategory: "Fish & Meats",
    sortOrder: 4
  },
  {
    name: "Processed Meat",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Fish & Meats",
    sortOrder: 5
  },

  // Snacks & Beverages
  {
    name: "Soft Drinks",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752240555/imgi_14_refreshing-orange-soda-can-design-cold-drink-summer-beverage_84443-38586-removebg-preview_nsoae7.png",
    level: 2,
    parentCategory: "Snacks & Beverages",
    sortOrder: 1
  },
  {
    name: "Chips & Crisps",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752240550/imgi_60_cheese-chips-bag-design-realistic-vector-illustration_1240525-127876_q2ooce.jpg",
    level: 2,
    parentCategory: "Snacks & Beverages",
    sortOrder: 2
  },
  {
    name: "Energy Drinks",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752240555/imgi_14_refreshing-orange-soda-can-design-cold-drink-summer-beverage_84443-38586-removebg-preview_nsoae7.png",
    level: 2,
    parentCategory: "Snacks & Beverages",
    sortOrder: 3
  },
  {
    name: "Nuts & Dry Fruits",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752240550/imgi_60_cheese-chips-bag-design-realistic-vector-illustration_1240525-127876_q2ooce.jpg",
    level: 2,
    parentCategory: "Snacks & Beverages",
    sortOrder: 4
  },
  {
    name: "Juices & Smoothies",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752240555/imgi_14_refreshing-orange-soda-can-design-cold-drink-summer-beverage_84443-38586-removebg-preview_nsoae7.png",
    level: 2,
    parentCategory: "Snacks & Beverages",
    sortOrder: 5
  },

  // Bakery & Biscuits
  {
    name: "Fresh Bread",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/download-removebg-preview_pobolq.png",
    level: 2,
    parentCategory: "Bakery & Biscuits",
    sortOrder: 1
  },
  {
    name: "Cookies & Biscuits",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Bakery & Biscuits",
    sortOrder: 2
  },
  {
    name: "Cakes & Pastries",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/download-removebg-preview_pobolq.png",
    level: 2,
    parentCategory: "Bakery & Biscuits",
    sortOrder: 3
  },
  {
    name: "Rusk & Toast",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/download-removebg-preview_pobolq.png",
    level: 2,
    parentCategory: "Bakery & Biscuits",
    sortOrder: 4
  },
  {
    name: "Baking Ingredients",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/download-removebg-preview_pobolq.png",
    level: 2,
    parentCategory: "Bakery & Biscuits",
    sortOrder: 5
  },

  // Personal Care
  {
    name: "Hair Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Personal Care",
    sortOrder: 1
  },
  {
    name: "Skin Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Personal Care",
    sortOrder: 2
  },
  {
    name: "Oral Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Personal Care",
    sortOrder: 3
  },
  {
    name: "Body Care",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Personal Care",
    sortOrder: 4
  },
  {
    name: "Men's Grooming",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
    level: 2,
    parentCategory: "Personal Care",
    sortOrder: 5
  },

  // Pet Care
  {
    name: "Dog Food",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
    level: 2,
    parentCategory: "Pet Care",
    sortOrder: 1
  },
  {
    name: "Cat Food",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
    level: 2,
    parentCategory: "Pet Care",
    sortOrder: 2
  },
  {
    name: "Pet Accessories",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
    level: 2,
    parentCategory: "Pet Care",
    sortOrder: 3
  },
  {
    name: "Pet Hygiene",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
    level: 2,
    parentCategory: "Pet Care",
    sortOrder: 4
  },
  {
    name: "Pet Toys",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
    level: 2,
    parentCategory: "Pet Care",
    sortOrder: 5
  },

  // Baby Care
  {
    name: "Baby Food",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
    level: 2,
    parentCategory: "Baby Care",
    sortOrder: 1
  },
  {
    name: "Baby Diapers",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
    level: 2,
    parentCategory: "Baby Care",
    sortOrder: 2
  },
  {
    name: "Baby Care Products",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
    level: 2,
    parentCategory: "Baby Care",
    sortOrder: 3
  },
  {
    name: "Baby Toys",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
    level: 2,
    parentCategory: "Baby Care",
    sortOrder: 4
  },
  {
    name: "Baby Clothing",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
    level: 2,
    parentCategory: "Baby Care",
    sortOrder: 5
  },

  // Dairy & Eggs
  {
    name: "Fresh Milk",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
    level: 2,
    parentCategory: "Dairy & Eggs",
    sortOrder: 1
  },
  {
    name: "Fresh Eggs",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
    level: 2,
    parentCategory: "Dairy & Eggs",
    sortOrder: 2
  },
  {
    name: "Curd & Yogurt",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
    level: 2,
    parentCategory: "Dairy & Eggs",
    sortOrder: 3
  },
  {
    name: "Butter & Ghee",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
    level: 2,
    parentCategory: "Dairy & Eggs",
    sortOrder: 4
  },
  {
    name: "Cheese & Paneer",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
    level: 2,
    parentCategory: "Dairy & Eggs",
    sortOrder: 5
  },

  // Snacks
  {
    name: "Namkeen & Mixture",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Snacks",
    sortOrder: 1
  },
  {
    name: "Popcorn & Puffs",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Snacks",
    sortOrder: 2
  },
  {
    name: "Chocolates & Candies",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_14_realistic-flavored-chocolate-bar-pack-template-with-orange-nuts-picture-vector-illustration_1284-68296-removebg-preview_lboeyh.png",
    level: 2,
    parentCategory: "Snacks",
    sortOrder: 3
  },
  {
    name: "Nuts & Seeds",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Snacks",
    sortOrder: 4
  },
  {
    name: "Traditional Snacks",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Snacks",
    sortOrder: 5
  },

  // Sweets
  {
    name: "Traditional Sweets",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sweets",
    sortOrder: 1
  },
  {
    name: "Chocolates",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_14_realistic-flavored-chocolate-bar-pack-template-with-orange-nuts-picture-vector-illustration_1284-68296-removebg-preview_lboeyh.png",
    level: 2,
    parentCategory: "Sweets",
    sortOrder: 2
  },
  {
    name: "Ice Cream",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sweets",
    sortOrder: 3
  },
  {
    name: "Candies & Toffees",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sweets",
    sortOrder: 4
  },
  {
    name: "Dessert Mixes",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sweets",
    sortOrder: 5
  },

  // Rice, Dal, Atta
  {
    name: "Rice Varieties",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Rice, Dal, Atta",
    sortOrder: 1
  },
  {
    name: "Lentils & Pulses",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Rice, Dal, Atta",
    sortOrder: 2
  },
  {
    name: "Flour & Atta",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Rice, Dal, Atta",
    sortOrder: 3
  },
  {
    name: "Grains & Cereals",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Rice, Dal, Atta",
    sortOrder: 4
  },
  {
    name: "Organic Grains",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Rice, Dal, Atta",
    sortOrder: 5
  },

  // Cleaning
  {
    name: "Floor Cleaners",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Cleaning",
    sortOrder: 1
  },
  {
    name: "Bathroom Cleaners",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Cleaning",
    sortOrder: 2
  },
  {
    name: "Kitchen Cleaners",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Cleaning",
    sortOrder: 3
  },
  {
    name: "Laundry Detergents",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Cleaning",
    sortOrder: 4
  },
  {
    name: "Dishwashing",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Cleaning",
    sortOrder: 5
  },

  // Home Care
  {
    name: "Air Fresheners",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Home Care",
    sortOrder: 1
  },
  {
    name: "Pest Control",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Home Care",
    sortOrder: 2
  },
  {
    name: "Paper Products",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Home Care",
    sortOrder: 3
  },
  {
    name: "Kitchen Essentials",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Home Care",
    sortOrder: 4
  },
  {
    name: "Storage Solutions",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Home Care",
    sortOrder: 5
  },

  // Tea & Coffee
  {
    name: "Black Tea",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Tea & Coffee",
    sortOrder: 1
  },
  {
    name: "Green Tea",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Tea & Coffee",
    sortOrder: 2
  },
  {
    name: "Coffee",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Tea & Coffee",
    sortOrder: 3
  },
  {
    name: "Herbal Tea",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Tea & Coffee",
    sortOrder: 4
  },
  {
    name: "Tea & Coffee Accessories",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
    level: 2,
    parentCategory: "Tea & Coffee",
    sortOrder: 5
  },

  // Instant Food
  {
    name: "Instant Noodles",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Instant Food",
    sortOrder: 1
  },
  {
    name: "Ready to Cook",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Instant Food",
    sortOrder: 2
  },
  {
    name: "Frozen Foods",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Instant Food",
    sortOrder: 3
  },
  {
    name: "Canned Foods",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Instant Food",
    sortOrder: 4
  },
  {
    name: "Breakfast Cereals",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Instant Food",
    sortOrder: 5
  },

  // Pharma
  {
    name: "Pain Relief",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Pharma",
    sortOrder: 1
  },
  {
    name: "Vitamins & Supplements",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Pharma",
    sortOrder: 2
  },
  {
    name: "First Aid",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Pharma",
    sortOrder: 3
  },
  {
    name: "Health Monitors",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Pharma",
    sortOrder: 4
  },
  {
    name: "Ayurvedic Products",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Pharma",
    sortOrder: 5
  },

  // Sauces
  {
    name: "Tomato Sauces",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sauces",
    sortOrder: 1
  },
  {
    name: "Soy Sauces",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sauces",
    sortOrder: 2
  },
  {
    name: "Chutneys & Pickles",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sauces",
    sortOrder: 3
  },
  {
    name: "Mayonnaise & Dips",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sauces",
    sortOrder: 4
  },
  {
    name: "Vinegar & Dressings",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Sauces",
    sortOrder: 5
  },

  // Masala, Oils & More
  {
    name: "Cooking Oils",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Masala, Oils & More",
    sortOrder: 1
  },
  {
    name: "Whole Spices",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Masala, Oils & More",
    sortOrder: 2
  },
  {
    name: "Ground Spices",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Masala, Oils & More",
    sortOrder: 3
  },
  {
    name: "Spice Mixes",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Masala, Oils & More",
    sortOrder: 4
  },
  {
    name: "Ghee & Butter",
    imageUrl: "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
    level: 2,
    parentCategory: "Masala, Oils & More",
    sortOrder: 5
  }
];

// Create formatted subcategories using helper function
const formattedSubCategories = subCategories.map(cat => createCategory(cat));

module.exports = formattedSubCategories;
