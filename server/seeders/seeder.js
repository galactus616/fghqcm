require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

async function clearCategories() {
  await Category.deleteMany({});
  console.log("Old categories cleared!");
}

async function seedMainCategories() {
  const mainCategoriesData = [
    { 
      name: "Groceries & Food", 
      nameBn: "মালামাল ও খাদ্যদ্রব্য",
      level: 1,
      sortOrder: 1
    },
    { 
      name: "Beauty & Personal Care", 
      nameBn: "সৌন্দর্য ও ব্যক্তিগত যত্ন",
      level: 1,
      sortOrder: 2
    },
    { 
      name: "Household Essentials", 
      nameBn: "গৃহস্থালির প্রয়োজনীয় জিনিস",
      level: 1,
      sortOrder: 3
    }
  ];
  const mainCategories = await Category.insertMany(mainCategoriesData);
  console.log("Main categories seeded!");
  return mainCategories;
}

async function seedSubCategories(mainCategories) {
  const [groceries, beauty, household] = mainCategories;
  const subCategoryImage = "https://res.cloudinary.com/dke11dwwc/image/upload/v1754559824/Frame_20_hweeax.png";
  const subCategoriesData = [
    // Groceries & Food subcategories
    { name: "Fruits & vegetables", nameBn: "ফল ও সবজি", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562140/Frame_13_kjwltz.png" },
    { name: "Atta, rice & grains", nameBn: "আটা, চাল ও শস্য", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562146/Frame_19_kdwpxl.png" },
    { name: "Dals & pulses", nameBn: "ডাল ও ডালজাতীয় খাবার", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562148/Frame_20_lw8thh.png" },
    { name: "Oil & ghee", nameBn: "তেল ও ঘি", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562151/Frame_21_nayliq.png" },
    { name: "Sugar & spices", nameBn: " চিনি ও মশলা", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562153/Frame_22_drtpjw.png" },
    { name: "Milk & dairy", nameBn: "দুধ ও দুগ্ধজাত পণ্য", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754568359/Frame_23_y4de3n.png" },
    { name: "Breads & bakery", nameBn: "রুটি ও বেকারি", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562171/Frame_29_qrjnjp.png" },
    { name: "Cereals & dry fruits", nameBn: "সিরিয়াল ও শুকনো ফল", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562176/Frame_31_zhsnny.png" },
    { name: "Tea, coffee & drink mixes", nameBn: "চা, কফি ও পানীয় মিশ্রণ", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562168/Frame_28_fydhsx.png" },
    { name: "Juices & cold drinks", nameBn: "জুস ও ঠান্ডা পানীয়", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562165/Frame_27_kuejav.png" },
    { name: "Sauces & spreads", nameBn: "সস ও স্প্রেড", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562142/Frame_16_yts1u8.png" },
    { name: "Eggs, meat & fish", nameBn: "ডিম, মাংস ও মাছ", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562144/Frame_18_crddyh.png" },
    { name: "Noodles & pasta", nameBn: "নুডলস ও পাস্তা", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562164/Frame_26_me1nrl.png" },
    { name: "Snacks & biscuits", nameBn: "স্ন্যাকস ও বিস্কুট", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562159/Frame_24_w7cuig.png" },
    { name: "Chocolates & sweets", nameBn: "চকলেট ও মিষ্টি", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562161/Frame_25_p58xhr.png" },
    { name: "Ready to eat & frozen food", nameBn: "খাওয়ার জন্য প্রস্তুত ও হিমায়িত খাবার", parentCategory: groceries._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754562174/Frame_30_qlkzug.png" },
    // Beauty & Personal Care subcategories
    { name: "Bath & body", nameBn: "স্নান ও শরীর", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563060/Frame_20_iqn9bs.png" },
    { name: "Hair care", nameBn: "চুলের যত্ন", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563070/Frame_21_eprrzr.png" },
    { name: "Skin & face", nameBn: "ত্বক ও মুখ", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563047/Frame_22_kfgmob.png" },
    { name: "Deos & perfumes", nameBn: "ডিওডোরেন্ট ও সুগন্ধি", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563054/Frame_23_kcjj15.png" },
    { name: "Feminine hygiene", nameBn: "মহিলাদের স্বাস্থ্যবিধি", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563074/Frame_20-1_gigmhd.png" },
    { name: "Men's grooming", nameBn: "পুরুষদের সাজসজ্জা", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563064/Frame_21-1_o2spzg.png" },
    { name: "Oral care", nameBn: "মুখের যত্ন", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563051/Frame_22-1_ubjxsi.png" },
    { name: "Baby care", nameBn: "শিশুর যত্ন", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563067/Frame_23-1_h71bba.png" },
    { name: "Makeup & cosmetics", nameBn: "মেকআপ ও প্রসাধনী", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563077/Frame_20-2_fwq74y.png" },
    { name: "Pharma & wellness", nameBn: "ফার্মা ও সুস্থতা", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563081/Frame_21-2_zcerju.png" },
    { name: "Diet & nutrition", nameBn: "খাদ্য ও পুষ্টি", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563057/Frame_22-2_mhs1n1.png" },
    { name: "Pet care", nameBn: "পোষা প্রাণীর যত্ন", parentCategory: beauty._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754563084/Frame_23-2_g4g7ev.png" },
    // Household Essentials subcategories
    { name: "Laundry detergents", nameBn: "কাপড় কাচার সাবান", parentCategory: household._id, level: 2, imageUrl:  "https://res.cloudinary.com/dke11dwwc/image/upload/v1754566330/Frame_20_gm7gql.png" },
    { name: "Household & toilet cleaners", nameBn: "গৃহস্থালি ও টয়লেট ক্লিনার", parentCategory: household._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754566327/Frame_21_jafhze.png" },
    { name: "Cleaning supplies", nameBn: "পরিষ্কারের সরঞ্জাম", parentCategory: household._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754566329/Frame_22_yllhhs.png" },
    { name: "Home & kitchen", nameBn: "বাড়ি ও রান্নাঘর", parentCategory: household._id, level: 2, imageUrl: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754566329/Frame_23_sq1kdl.png" },
  ];
  const subCategories = await Category.insertMany(subCategoriesData);
  console.log("Subcategories seeded!");
  return subCategories;
}

async function seedSubSubCategories(subCategories) {
  const subSubCategoryImage = "https://res.cloudinary.com/dke11dwwc/image/upload/v1754478344/Frame_20_xk3oa0.png";
  
  // Create a map of subcategory names to their IDs for easier reference
  const subCategoryMap = {};
  subCategories.forEach(cat => {
    subCategoryMap[cat.name] = cat._id;
  });

  const subSubCategoriesData = [
    // Fruits & vegetables subsubcategories
    { name: "Fresh fruits", nameBn: "তাজা ফল", parentCategory: subCategoryMap["Fruits & vegetables"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Fresh vegetables", nameBn: "তাজা সবজি", parentCategory: subCategoryMap["Fruits & vegetables"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Organic produce", nameBn: "জৈব পণ্য", parentCategory: subCategoryMap["Fruits & vegetables"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Exotic fruits", nameBn: "বিলাসী ফল", parentCategory: subCategoryMap["Fruits & vegetables"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Salad essentials", nameBn: "সালাদ প্রয়োজনীয় জিনিস", parentCategory: subCategoryMap["Fruits & vegetables"], level: 3, imageUrl: subSubCategoryImage },

    // Atta, rice & grains subsubcategories
    { name: "Wheat flour", nameBn: "গমের আটা", parentCategory: subCategoryMap["Atta, rice & grains"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Rice", nameBn: "চাল", parentCategory: subCategoryMap["Atta, rice & grains"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Millets", nameBn: "জওয়ার", parentCategory: subCategoryMap["Atta, rice & grains"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Grains", nameBn: "শস্য", parentCategory: subCategoryMap["Atta, rice & grains"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Flours & Rawa", nameBn: "আটা ও রাওয়া", parentCategory: subCategoryMap["Atta, rice & grains"], level: 3, imageUrl: subSubCategoryImage },

    // Dals & pulses subsubcategories
    { name: "Toor dal", nameBn: "তুর ডাল", parentCategory: subCategoryMap["Dals & pulses"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Moong dal", nameBn: "মুগ ডাল", parentCategory: subCategoryMap["Dals & pulses"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Masoor dal", nameBn: "মসুর ডাল", parentCategory: subCategoryMap["Dals & pulses"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Chana dal", nameBn: "ছোলা ডাল", parentCategory: subCategoryMap["Dals & pulses"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Rajma & chana", nameBn: "রাজমা ও ছোলা", parentCategory: subCategoryMap["Dals & pulses"], level: 3, imageUrl: subSubCategoryImage },

    // Oil & ghee subsubcategories
    { name: "Edible oils", nameBn: "খাদ্যতেল", parentCategory: subCategoryMap["Oil & ghee"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Mustard oil", nameBn: "সরিষার তেল", parentCategory: subCategoryMap["Oil & ghee"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Olive & sesame oil", nameBn: "জলপাই ও তিলের তেল", parentCategory: subCategoryMap["Oil & ghee"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Ghee & vanaspati", nameBn: "ঘি ও বনস্পতি", parentCategory: subCategoryMap["Oil & ghee"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Health oils", nameBn: "স্বাস্থ্য তেল", parentCategory: subCategoryMap["Oil & ghee"], level: 3, imageUrl: subSubCategoryImage },

    // Masala, sugar & spices subsubcategories
    { name: "Whole spices", nameBn: "গোটা মসলা", parentCategory: subCategoryMap["Masala, sugar & spices"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Powdered spices", nameBn: "গুঁড়ো মসলা", parentCategory: subCategoryMap["Masala, sugar & spices"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Blended spices", nameBn: "মিশ্রিত মসলা", parentCategory: subCategoryMap["Masala, sugar & spices"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Salt & sugar", nameBn: "লবণ ও চিনি", parentCategory: subCategoryMap["Masala, sugar & spices"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cooking paste", nameBn: "রান্নার পেস্ট", parentCategory: subCategoryMap["Masala, sugar & spices"], level: 3, imageUrl: subSubCategoryImage },

    // Milk & dairy subsubcategories
    { name: "Milk", nameBn: "দুধ", parentCategory: subCategoryMap["Milk & dairy"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Paneer & tofu", nameBn: "পনির ও টফু", parentCategory: subCategoryMap["Milk & dairy"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Curd & yogurt", nameBn: "দই ও দই", parentCategory: subCategoryMap["Milk & dairy"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Butter & cheese", nameBn: "মাখন ও পনির", parentCategory: subCategoryMap["Milk & dairy"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cream & buttermilk", nameBn: "ক্রিম ও মাঠা", parentCategory: subCategoryMap["Milk & dairy"], level: 3, imageUrl: subSubCategoryImage },

    // Breads & bakery subsubcategories
    { name: "Bread", nameBn: "রুটি", parentCategory: subCategoryMap["Breads & bakery"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Buns & pav", nameBn: "বান ও পাউ", parentCategory: subCategoryMap["Breads & bakery"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cakes & pastries", nameBn: "কেক ও পেস্ট্রি", parentCategory: subCategoryMap["Breads & bakery"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cookies & biscuits", nameBn: "কুকি ও বিস্কুট", parentCategory: subCategoryMap["Breads & bakery"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pizza base & wraps", nameBn: "পিজা বেস ও র্যাপ", parentCategory: subCategoryMap["Breads & bakery"], level: 3, imageUrl: subSubCategoryImage },

    // Cereals & dry fruits subsubcategories
    { name: "Breakfast cereals", nameBn: "সকালের সিরিয়াল", parentCategory: subCategoryMap["Cereals & dry fruits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Muesli & oats", nameBn: "মুসলি ও ওটস", parentCategory: subCategoryMap["Cereals & dry fruits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Nuts", nameBn: "বাদাম", parentCategory: subCategoryMap["Cereals & dry fruits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Dates & figs", nameBn: "খেজুর ও ডুমুর", parentCategory: subCategoryMap["Cereals & dry fruits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Seeds & berries", nameBn: "বীজ ও বেরি", parentCategory: subCategoryMap["Cereals & dry fruits"], level: 3, imageUrl: subSubCategoryImage },

    // Tea, coffee & drink mixes subsubcategories
    { name: "Tea leaves & bags", nameBn: "চা পাতা ও ব্যাগ", parentCategory: subCategoryMap["Tea, coffee & drink mixes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Instant coffee", nameBn: "ইনস্ট্যান্ট কফি", parentCategory: subCategoryMap["Tea, coffee & drink mixes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cold coffee", nameBn: "ঠান্ডা কফি", parentCategory: subCategoryMap["Tea, coffee & drink mixes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Health drinks", nameBn: "স্বাস্থ্য পানীয়", parentCategory: subCategoryMap["Tea, coffee & drink mixes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Juices & squashes", nameBn: "জুস ও স্কোয়াশ", parentCategory: subCategoryMap["Tea, coffee & drink mixes"], level: 3, imageUrl: subSubCategoryImage },

    // Juices & cold drinks subsubcategories
    { name: "Packaged juices", nameBn: "প্যাকেজড জুস", parentCategory: subCategoryMap["Juices & cold drinks"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Carbonated drinks", nameBn: "কার্বনেটেড পানীয়", parentCategory: subCategoryMap["Juices & cold drinks"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Energy & health drinks", nameBn: "এনার্জি ও স্বাস্থ্য পানীয়", parentCategory: subCategoryMap["Juices & cold drinks"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Syrups & squashes", nameBn: "সিরাপ ও স্কোয়াশ", parentCategory: subCategoryMap["Juices & cold drinks"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Ready-to-drink beverages", nameBn: "খাওয়ার জন্য প্রস্তুত পানীয়", parentCategory: subCategoryMap["Juices & cold drinks"], level: 3, imageUrl: subSubCategoryImage },

    // Sauces & spreads subsubcategories
    { name: "Tomato ketchup", nameBn: "টমেটো কেচআপ", parentCategory: subCategoryMap["Sauces & spreads"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Mayonnaise & dressings", nameBn: "মেয়োনিজ ও ড্রেসিং", parentCategory: subCategoryMap["Sauces & spreads"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Jams & spreads", nameBn: "জ্যাম ও স্প্রেড", parentCategory: subCategoryMap["Sauces & spreads"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Sauces & dips", nameBn: "সস ও ডিপ", parentCategory: subCategoryMap["Sauces & spreads"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Peanut butter & spreads", nameBn: "চিনাবাদাম মাখন ও স্প্রেড", parentCategory: subCategoryMap["Sauces & spreads"], level: 3, imageUrl: subSubCategoryImage },

    // Eggs, meat & fish subsubcategories
    { name: "Fresh chicken", nameBn: "তাজা মুরগি", parentCategory: subCategoryMap["Eggs, meat & fish"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Fresh fish", nameBn: "তাজা মাছ", parentCategory: subCategoryMap["Eggs, meat & fish"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Mutton & seafood", nameBn: "মাটন ও সামুদ্রিক খাবার", parentCategory: subCategoryMap["Eggs, meat & fish"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Marinades & cold cuts", nameBn: "মেরিনেড ও কোল্ড কাট", parentCategory: subCategoryMap["Eggs, meat & fish"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Eggs", nameBn: "ডিম", parentCategory: subCategoryMap["Eggs, meat & fish"], level: 3, imageUrl: subSubCategoryImage },

    // Noodles & pasta subsubcategories
    { name: "Instant noodles", nameBn: "ইনস্ট্যান্ট নুডলস", parentCategory: subCategoryMap["Noodles & pasta"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pasta & macaroni", nameBn: "পাস্তা ও ম্যাকারনি", parentCategory: subCategoryMap["Noodles & pasta"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Soups", nameBn: "সুপ", parentCategory: subCategoryMap["Noodles & pasta"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pasta sauces", nameBn: "পাস্তা সস", parentCategory: subCategoryMap["Noodles & pasta"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Rice noodles", nameBn: "চালের নুডলস", parentCategory: subCategoryMap["Noodles & pasta"], level: 3, imageUrl: subSubCategoryImage },

    // Snacks & biscuits subsubcategories
    { name: "Salty snacks", nameBn: "নোনতা স্ন্যাকস", parentCategory: subCategoryMap["Snacks & biscuits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Sweet biscuits", nameBn: "মিষ্টি বিস্কুট", parentCategory: subCategoryMap["Snacks & biscuits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cookies & crackers", nameBn: "কুকি ও ক্র্যাকার", parentCategory: subCategoryMap["Snacks & biscuits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Chocolates & candies", nameBn: "চকলেট ও ক্যান্ডি", parentCategory: subCategoryMap["Snacks & biscuits"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Wafers & namkeen", nameBn: "ওয়েফার ও নামকিন", parentCategory: subCategoryMap["Snacks & biscuits"], level: 3, imageUrl: subSubCategoryImage },

    // Chocolates & sweets subsubcategories
    { name: "Chocolate bars", nameBn: "চকলেট বার", parentCategory: subCategoryMap["Chocolates & sweets"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Indian sweets", nameBn: "ভারতীয় মিষ্টি", parentCategory: subCategoryMap["Chocolates & sweets"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Sugar-free sweets", nameBn: "চিনিমুক্ত মিষ্টি", parentCategory: subCategoryMap["Chocolates & sweets"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Gifting chocolates", nameBn: "উপহারের চকলেট", parentCategory: subCategoryMap["Chocolates & sweets"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Candies & toffees", nameBn: "ক্যান্ডি ও টফি", parentCategory: subCategoryMap["Chocolates & sweets"], level: 3, imageUrl: subSubCategoryImage },

    // Ready to eat & frozen food subsubcategories
    { name: "Frozen snacks", nameBn: "হিমায়িত স্ন্যাকস", parentCategory: subCategoryMap["Ready to eat & frozen food"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Ready-to-cook meals", nameBn: "রান্নার জন্য প্রস্তুত খাবার", parentCategory: subCategoryMap["Ready to eat & frozen food"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Frozen vegetables", nameBn: "হিমায়িত সবজি", parentCategory: subCategoryMap["Ready to eat & frozen food"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Frozen desserts", nameBn: "হিমায়িত মিষ্টি", parentCategory: subCategoryMap["Ready to eat & frozen food"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Ready-to-eat meals", nameBn: "খাওয়ার জন্য প্রস্তুত খাবার", parentCategory: subCategoryMap["Ready to eat & frozen food"], level: 3, imageUrl: subSubCategoryImage },

    // Bath & body subsubcategories
    { name: "Soaps & body wash", nameBn: "সাবান ও বডি ওয়াশ", parentCategory: subCategoryMap["Bath & body"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Body lotions & creams", nameBn: "বডি লোশন ও ক্রিম", parentCategory: subCategoryMap["Bath & body"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Hand wash & sanitizers", nameBn: "হ্যান্ড ওয়াশ ও স্যানিটাইজার", parentCategory: subCategoryMap["Bath & body"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Bathing accessories", nameBn: "স্নানের আনুষাঙ্গিক", parentCategory: subCategoryMap["Bath & body"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Body scrub & polish", nameBn: "বডি স্ক্রাব ও পলিশ", parentCategory: subCategoryMap["Bath & body"], level: 3, imageUrl: subSubCategoryImage },

    // Hair care subsubcategories
    { name: "Shampoo & conditioner", nameBn: "শ্যাম্পু ও কন্ডিশনার", parentCategory: subCategoryMap["Hair care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Hair oil", nameBn: "চুলের তেল", parentCategory: subCategoryMap["Hair care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Hair color", nameBn: "চুলের রং", parentCategory: subCategoryMap["Hair care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Hair styling products", nameBn: "চুল সাজানোর পণ্য", parentCategory: subCategoryMap["Hair care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Hair accessories", nameBn: "চুলের আনুষাঙ্গিক", parentCategory: subCategoryMap["Hair care"], level: 3, imageUrl: subSubCategoryImage },

    // Skin & face subsubcategories
    { name: "Face wash & cleansers", nameBn: "ফেস ওয়াশ ও ক্লিনজার", parentCategory: subCategoryMap["Skin & face"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Moisturizers & creams", nameBn: "ময়েশ্চারাইজার ও ক্রিম", parentCategory: subCategoryMap["Skin & face"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Sunscreen", nameBn: "সানস্ক্রিন", parentCategory: subCategoryMap["Skin & face"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Face packs & masks", nameBn: "ফেস প্যাক ও মাস্ক", parentCategory: subCategoryMap["Skin & face"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Serums & toners", nameBn: "সিরাম ও টোনার", parentCategory: subCategoryMap["Skin & face"], level: 3, imageUrl: subSubCategoryImage },

    // Deos & perfumes subsubcategories
    { name: "Deodorants", nameBn: "ডিওডোরেন্ট", parentCategory: subCategoryMap["Deos & perfumes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Perfumes", nameBn: "সুগন্ধি", parentCategory: subCategoryMap["Deos & perfumes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Body mists", nameBn: "বডি মিস্ট", parentCategory: subCategoryMap["Deos & perfumes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Air fresheners", nameBn: "বায়ু সতেজকারী", parentCategory: subCategoryMap["Deos & perfumes"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Attar", nameBn: "আতর", parentCategory: subCategoryMap["Deos & perfumes"], level: 3, imageUrl: subSubCategoryImage },

    // Feminine hygiene subsubcategories
    { name: "Sanitary pads", nameBn: "স্যানিটারি প্যাড", parentCategory: subCategoryMap["Feminine hygiene"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Tampons", nameBn: "ট্যাম্পন", parentCategory: subCategoryMap["Feminine hygiene"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Panty liners", nameBn: "প্যান্টি লাইনার", parentCategory: subCategoryMap["Feminine hygiene"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Intimate washes", nameBn: "ইনটিমেট ওয়াশ", parentCategory: subCategoryMap["Feminine hygiene"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Menstrual cups", nameBn: "মাসিক কাপ", parentCategory: subCategoryMap["Feminine hygiene"], level: 3, imageUrl: subSubCategoryImage },

    // Men's grooming subsubcategories
    { name: "Shaving cream & gel", nameBn: "কামানোর ক্রিম ও জেল", parentCategory: subCategoryMap["Men's grooming"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Razors & blades", nameBn: "রেজর ও ব্লেড", parentCategory: subCategoryMap["Men's grooming"], level: 3, imageUrl: subSubCategoryImage },
    { name: "After shave", nameBn: "কামানোর পর", parentCategory: subCategoryMap["Men's grooming"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Beard care", nameBn: "দাড়ির যত্ন", parentCategory: subCategoryMap["Men's grooming"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Men's skincare", nameBn: "পুরুষদের ত্বকের যত্ন", parentCategory: subCategoryMap["Men's grooming"], level: 3, imageUrl: subSubCategoryImage },

    // Oral care subsubcategories
    { name: "Toothpaste", nameBn: "টুথপেস্ট", parentCategory: subCategoryMap["Oral care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Toothbrushes", nameBn: "টুথব্রাশ", parentCategory: subCategoryMap["Oral care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Mouthwash", nameBn: "মাউথওয়াশ", parentCategory: subCategoryMap["Oral care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Dental floss", nameBn: "ডেন্টাল ফ্লস", parentCategory: subCategoryMap["Oral care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Tongue cleaners", nameBn: "জিহ্বা পরিষ্কারক", parentCategory: subCategoryMap["Oral care"], level: 3, imageUrl: subSubCategoryImage },

    // Baby care subsubcategories
    { name: "Baby lotions & creams", nameBn: "শিশুর লোশন ও ক্রিম", parentCategory: subCategoryMap["Baby care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Diapers & wipes", nameBn: "ডায়াপার ও ওয়াইপ", parentCategory: subCategoryMap["Baby care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Baby bath products", nameBn: "শিশুর স্নানের পণ্য", parentCategory: subCategoryMap["Baby care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Baby food", nameBn: "শিশুর খাবার", parentCategory: subCategoryMap["Baby care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Baby accessories", nameBn: "শিশুর আনুষাঙ্গিক", parentCategory: subCategoryMap["Baby care"], level: 3, imageUrl: subSubCategoryImage },

    // Makeup & cosmetics subsubcategories
    { name: "Foundation & concealer", nameBn: "ফাউন্ডেশন ও কনসিলার", parentCategory: subCategoryMap["Makeup & cosmetics"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Lipsticks & lip gloss", nameBn: "লিপস্টিক ও লিপ গ্লস", parentCategory: subCategoryMap["Makeup & cosmetics"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Eye makeup", nameBn: "চোখের মেকআপ", parentCategory: subCategoryMap["Makeup & cosmetics"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Nail polish", nameBn: "নেইল পলিশ", parentCategory: subCategoryMap["Makeup & cosmetics"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Makeup remover", nameBn: "মেকআপ রিমুভার", parentCategory: subCategoryMap["Makeup & cosmetics"], level: 3, imageUrl: subSubCategoryImage },

    // Pharma & wellness subsubcategories
    { name: "Vitamins & supplements", nameBn: "ভিটামিন ও সম্পূরক", parentCategory: subCategoryMap["Pharma & wellness"], level: 3, imageUrl: subSubCategoryImage },
    { name: "First aid", nameBn: "প্রাথমিক চিকিৎসা", parentCategory: subCategoryMap["Pharma & wellness"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pain relief", nameBn: "ব্যথা উপশম", parentCategory: subCategoryMap["Pharma & wellness"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cold & cough", nameBn: "সর্দি ও কাশি", parentCategory: subCategoryMap["Pharma & wellness"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Health devices", nameBn: "স্বাস্থ্য যন্ত্রপাতি", parentCategory: subCategoryMap["Pharma & wellness"], level: 3, imageUrl: subSubCategoryImage },

    // Diet & nutrition subsubcategories
    { name: "Protein supplements", nameBn: "প্রোটিন সম্পূরক", parentCategory: subCategoryMap["Diet & nutrition"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Weight management", nameBn: "ওজন ব্যবস্থাপনা", parentCategory: subCategoryMap["Diet & nutrition"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Health drinks & powders", nameBn: "স্বাস্থ্য পানীয় ও গুঁড়ো", parentCategory: subCategoryMap["Diet & nutrition"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Nutritional bars", nameBn: "পুষ্টিকর বার", parentCategory: subCategoryMap["Diet & nutrition"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Herbal supplements", nameBn: "ভেষজ সম্পূরক", parentCategory: subCategoryMap["Diet & nutrition"], level: 3, imageUrl: subSubCategoryImage },

    // Pet care subsubcategories
    { name: "Dog food", nameBn: "কুকুরের খাবার", parentCategory: subCategoryMap["Pet care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cat food", nameBn: "বিড়ালের খাবার", parentCategory: subCategoryMap["Pet care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pet grooming", nameBn: "পোষা প্রাণীর সাজসজ্জা", parentCategory: subCategoryMap["Pet care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pet toys", nameBn: "পোষা প্রাণীর খেলনা", parentCategory: subCategoryMap["Pet care"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Pet health", nameBn: "পোষা প্রাণীর স্বাস্থ্য", parentCategory: subCategoryMap["Pet care"], level: 3, imageUrl: subSubCategoryImage },

    // Laundry detergents subsubcategories
    { name: "Detergent powder", nameBn: "ডিটারজেন্ট পাউডার", parentCategory: subCategoryMap["Laundry detergents"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Liquid detergents", nameBn: "তরল ডিটারজেন্ট", parentCategory: subCategoryMap["Laundry detergents"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Fabric softeners", nameBn: "ফেব্রিক সফটনার", parentCategory: subCategoryMap["Laundry detergents"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Stain removers", nameBn: "দাগ সরানোর পণ্য", parentCategory: subCategoryMap["Laundry detergents"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Washing machine cleaners", nameBn: "ওয়াশিং মেশিন ক্লিনার", parentCategory: subCategoryMap["Laundry detergents"], level: 3, imageUrl: subSubCategoryImage },

    // Household & toilet cleaners subsubcategories
    { name: "Floor cleaners", nameBn: "মেঝে পরিষ্কারক", parentCategory: subCategoryMap["Household & toilet cleaners"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Toilet cleaners", nameBn: "টয়লেট ক্লিনার", parentCategory: subCategoryMap["Household & toilet cleaners"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Disinfectants", nameBn: "জীবাণুনাশক", parentCategory: subCategoryMap["Household & toilet cleaners"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Glass cleaners", nameBn: "কাচ পরিষ্কারক", parentCategory: subCategoryMap["Household & toilet cleaners"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Kitchen cleaners", nameBn: "রান্নাঘর ক্লিনার", parentCategory: subCategoryMap["Household & toilet cleaners"], level: 3, imageUrl: subSubCategoryImage },

    // Cleaning supplies subsubcategories
    { name: "Brooms & dustpans", nameBn: "ঝাড়ু ও ধুলো ঝাড়ার পাত্র", parentCategory: subCategoryMap["Cleaning supplies"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Mops & buckets", nameBn: "মপ ও বালতি", parentCategory: subCategoryMap["Cleaning supplies"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Sponges & scrubbers", nameBn: "স্পঞ্জ ও স্ক্রাবার", parentCategory: subCategoryMap["Cleaning supplies"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Cleaning gloves", nameBn: "পরিষ্কারের গ্লাভস", parentCategory: subCategoryMap["Cleaning supplies"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Garbage bags", nameBn: "ময়লা ব্যাগ", parentCategory: subCategoryMap["Cleaning supplies"], level: 3, imageUrl: subSubCategoryImage },

    // Home & kitchen subsubcategories
    { name: "Cookware", nameBn: "রান্নার পাত্র", parentCategory: subCategoryMap["Home & kitchen"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Kitchen tools & gadgets", nameBn: "রান্নাঘরের সরঞ্জাম ও গ্যাজেট", parentCategory: subCategoryMap["Home & kitchen"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Storage containers", nameBn: "সংরক্ষণের পাত্র", parentCategory: subCategoryMap["Home & kitchen"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Water bottles & flasks", nameBn: "জল বোতল ও ফ্লাস্ক", parentCategory: subCategoryMap["Home & kitchen"], level: 3, imageUrl: subSubCategoryImage },
    { name: "Dinnerware", nameBn: "খাওয়ার পাত্র", parentCategory: subCategoryMap["Home & kitchen"], level: 3, imageUrl: subSubCategoryImage },
  ];
  const subSubCategories = await Category.insertMany(subSubCategoriesData);
  console.log("Sub-subcategories seeded!");
  return subSubCategories;
}

async function seedSubSubSubCategories(subSubCategories) {
  const subSubSubCategoryImage = "https://res.cloudinary.com/dke11dwwc/image/upload/v1754478344/Frame_20_xk3oa0.png";
  // Map subsubcat name to _id
  const subSubCategoryMap = {};
  subSubCategories.forEach(cat => {
    subSubCategoryMap[cat.name] = cat._id;
  });
  const subSubSubCategoriesData = [
    // Fruits & vegetables > Exotic fruits > 5 sub-sub-subcategories
    { name: "Tropical Fruits", nameBn: "ক্রান্তীয় ফল", parentCategory: subSubCategoryMap["Exotic fruits"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Citrus Varieties", nameBn: "লেবু জাতীয় ফল", parentCategory: subSubCategoryMap["Exotic fruits"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Berries & Small Fruits", nameBn: "বেরি ও ছোট ফল", parentCategory: subSubCategoryMap["Exotic fruits"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Stone Fruits", nameBn: "পাথরের ফল", parentCategory: subSubCategoryMap["Exotic fruits"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Melons & Gourds", nameBn: "তরমুজ ও কুমড়া", parentCategory: subSubCategoryMap["Exotic fruits"], level: 4, imageUrl: subSubSubCategoryImage },

    // Dals & pulses > Toor dal
    { name: "Oily Toor Dal", nameBn: "তেলিয়ের তুর ডাল", parentCategory: subSubCategoryMap["Toor dal"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Unpolished Toor Dal", nameBn: "অনিয়ের তুর ডাল", parentCategory: subSubCategoryMap["Toor dal"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Toor Dal Powder", nameBn: "তুর ডালের পাউডার", parentCategory: subSubCategoryMap["Toor dal"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Local Variety", nameBn: "স্থানীয় বিকাশ", parentCategory: subSubCategoryMap["Toor dal"], level: 4, imageUrl: subSubSubCategoryImage },

    // Cereals & dry fruits > Breakfast cereals
    { name: "Corn Flakes", nameBn: "কারনেল ফ্লেকস", parentCategory: subSubCategoryMap["Breakfast cereals"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Muesli", nameBn: "মুসলি", parentCategory: subSubCategoryMap["Breakfast cereals"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Oats", nameBn: "ওটস", parentCategory: subSubCategoryMap["Breakfast cereals"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Kids' Cereals", nameBn: "শিশুর সিরিয়াল", parentCategory: subSubCategoryMap["Breakfast cereals"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Wholegrain Cereals", nameBn: "পুরানো গমের সিরিয়াল", parentCategory: subSubCategoryMap["Breakfast cereals"], level: 4, imageUrl: subSubSubCategoryImage },

    // Noodles & pasta > Instant noodles
    { name: "Masala Noodles", nameBn: "মসলা নুডলস", parentCategory: subSubCategoryMap["Instant noodles"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Chicken Noodles", nameBn: "মাংস নুডলস", parentCategory: subSubCategoryMap["Instant noodles"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Cup Noodles", nameBn: "কাপ নুডলস", parentCategory: subSubCategoryMap["Instant noodles"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Soupy Noodles", nameBn: "সুপি নুডলস", parentCategory: subSubCategoryMap["Instant noodles"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "International Flavors", nameBn: "আন্তর্জাতিক বিকাশ", parentCategory: subSubCategoryMap["Instant noodles"], level: 4, imageUrl: subSubSubCategoryImage },

    // Ready to eat & frozen food > Frozen snacks
    { name: "Frozen Samosas & Rolls", nameBn: "হিমায়িত সামোসা ও রোল", parentCategory: subSubCategoryMap["Frozen snacks"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Frozen Fries & Wedges", nameBn: "হিমায়িত ফ্রাইজ ও ঵েজ", parentCategory: subSubCategoryMap["Frozen snacks"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Frozen Kebabs & Tikkis", nameBn: "হিমায়িত কেবাব ও টিকি", parentCategory: subSubCategoryMap["Frozen snacks"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Frozen Parathas & Breads", nameBn: "হিমায়িত পরাঠা ও রুটি", parentCategory: subSubCategoryMap["Frozen snacks"], level: 4, imageUrl: subSubSubCategoryImage },

    // Beauty & personal care > Skin & face > Face wash & cleansers
    { name: "Gel-based Face Wash", nameBn: "জেল ভিত্তিক ফেস ওয়াশ", parentCategory: subSubCategoryMap["Face wash & cleansers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Foaming Face Wash", nameBn: "ফোমিং ফেস ওয়াশ", parentCategory: subSubCategoryMap["Face wash & cleansers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Cream-based Cleanser", nameBn: "ক্রিম ভিত্তিক ক্লিনজার", parentCategory: subSubCategoryMap["Face wash & cleansers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Face Scrub", nameBn: "ফেস স্ক্রাব", parentCategory: subSubCategoryMap["Face wash & cleansers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Charcoal Cleansers", nameBn: "কার্বন ক্লিনজার", parentCategory: subSubCategoryMap["Face wash & cleansers"], level: 4, imageUrl: subSubSubCategoryImage },

    // Bath & body > Body lotions & creams
    { name: "Moisturizing Lotions", nameBn: "ময়েশ্চারাইজার লোশন", parentCategory: subSubCategoryMap["Body lotions & creams"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Whitening & Brightening", nameBn: "সাজানোর ও উজ্জ্বলতা", parentCategory: subSubCategoryMap["Body lotions & creams"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Sun Protection", nameBn: "সানস্ক্রিন", parentCategory: subSubCategoryMap["Body lotions & creams"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Anti-aging Creams", nameBn: "বয়স বিরাম ক্রিম", parentCategory: subSubCategoryMap["Body lotions & creams"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Body Butters", nameBn: "বডি বাটার", parentCategory: subSubCategoryMap["Body lotions & creams"], level: 4, imageUrl: subSubSubCategoryImage },

    // Men's grooming > Razors & blades
    { name: "Disposable Razors", nameBn: "ব্যবহারযোগ্য রেজর", parentCategory: subSubCategoryMap["Razors & blades"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Cartridge Razors", nameBn: "কার্ট্রিজ রেজর", parentCategory: subSubCategoryMap["Razors & blades"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Safety Razors", nameBn: "সুরক্ষার রেজর", parentCategory: subSubCategoryMap["Razors & blades"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Shaving Blades", nameBn: "কামানোর ব্লেড", parentCategory: subSubCategoryMap["Razors & blades"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Electric Shavers", nameBn: "ইলেকট্রিক শ্যাভার", parentCategory: subSubCategoryMap["Razors & blades"], level: 4, imageUrl: subSubSubCategoryImage },

    // Household essentials > Laundry detergents > Detergent powder
    { name: "Front-load Machine", nameBn: "ফ্রন্ট লোড মেশিন", parentCategory: subSubCategoryMap["Detergent powder"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Top-load Machine", nameBn: "টপ লোড মেশিন", parentCategory: subSubCategoryMap["Detergent powder"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Hand Wash", nameBn: "হ্যান্ড ওয়াশ", parentCategory: subSubCategoryMap["Detergent powder"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Stain Remover Powder", nameBn: "দাগ সরানোর পাউডার", parentCategory: subSubCategoryMap["Detergent powder"], level: 4, imageUrl: subSubSubCategoryImage },

    // Home & kitchen > Storage containers
    { name: "Plastic Containers", nameBn: "প্লাস্টিক পাত্র", parentCategory: subSubCategoryMap["Storage containers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Glass Containers", nameBn: "কাচ পাত্র", parentCategory: subSubCategoryMap["Storage containers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Lunch Boxes", nameBn: "লাউন্ড বাক্স", parentCategory: subSubCategoryMap["Storage containers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Oil & Spice Dispensers", nameBn: "তেল ও মসলা ডিসেন্সার", parentCategory: subSubCategoryMap["Storage containers"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Food & Freezer Bags", nameBn: "খাবার ও ফ্রিজার ব্যাগ", parentCategory: subSubCategoryMap["Storage containers"], level: 4, imageUrl: subSubSubCategoryImage },

    // Cleaning supplies > Cleaning gloves
    { name: "Rubber Gloves", nameBn: "রিবার গ্লাভস", parentCategory: subSubCategoryMap["Cleaning gloves"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Disposable Gloves", nameBn: "ব্যবহারযোগ্য গ্লাভস", parentCategory: subSubCategoryMap["Cleaning gloves"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Heavy-Duty Gloves", nameBn: "হাইভেরডি ডিটারজেন্ট গ্লাভস", parentCategory: subSubCategoryMap["Cleaning gloves"], level: 4, imageUrl: subSubSubCategoryImage },
    { name: "Multipurpose Gloves", nameBn: "বহুলক্রিয়ামূলক গ্লাভস", parentCategory: subSubCategoryMap["Cleaning gloves"], level: 4, imageUrl: subSubSubCategoryImage },
  ];
  // Only insert those with a valid parent (in case some subsubcats are missing)
  const filtered = subSubSubCategoriesData.filter(cat => cat.parentCategory);
  if (filtered.length) {
    await Category.insertMany(filtered);
    console.log("Sub-sub-subcategories seeded!");
  } else {
    console.log("No sub-sub-subcategories to seed!");
  }
}

// -------------------- PRODUCT SEEDING --------------------
async function clearProducts() {
  await Product.deleteMany({});
  console.log("Old products cleared!");
}

function buildImageUrls(title, count = 4) {
  const urls = [];
  for (let i = 1; i <= count; i += 1) {
    urls.push(`https://res.cloudinary.com/dke11dwwc/image/upload/v1754568359/Frame_23_y4de3n.png`);
  }
  return urls;
}

function buildVariants(basePrice) {
  const v1 = Math.max(10, Math.round(basePrice));
  const v2 = Math.round(v1 * 1.8);
  const v3 = Math.round(v1 * 3.2);
  return [
    { quantityLabel: "500g", price: v1, discountedPrice: Math.round(v1 * 0.95) },
    { quantityLabel: "1kg", price: v2, discountedPrice: Math.round(v2 * 0.92) },
    { quantityLabel: "2kg", price: v3, discountedPrice: Math.round(v3 * 0.9) },
  ];
}

function createProductDoc({
  title,
  description,
  mainCategory,
  subCategory,
  subSubCategory,
  subSubSubCategory,
  basePrice,
}) {
  return {
    name: title,
    mainCategory,
    subCategory,
    subSubCategory,
    subSubSubCategory,
    imageUrl: `https://res.cloudinary.com/dke11dwwc/image/upload/v1754568359/Frame_23_y4de3n.png`,
    images: buildImageUrls(title, 4),
    variants: buildVariants(basePrice),
    description,
    isBestSeller: Math.random() < 0.15,
    isFeatured: Math.random() < 0.1,
  };
}

async function getCategoryChain(categoryId) {
  const level3 = await Category.findById(categoryId);
  if (!level3) return null;
  const level2 = level3.parentCategory ? await Category.findById(level3.parentCategory) : null;
  const level1 = level2 && level2.parentCategory ? await Category.findById(level2.parentCategory) : null;
  return { level1, level2, level3 };
}

async function getCategoryChainFromLevel4(level4Id) {
  const level4 = await Category.findById(level4Id);
  if (!level4) return null;
  const level3 = level4.parentCategory ? await Category.findById(level4.parentCategory) : null;
  const level2 = level3 && level3.parentCategory ? await Category.findById(level3.parentCategory) : null;
  const level1 = level2 && level2.parentCategory ? await Category.findById(level2.parentCategory) : null;
  return { level1, level2, level3, level4 };
}

async function seedSampleProducts() {
  // L3 terminal example: "Fresh fruits" (no level 4 children in our seeded data)
  const freshFruits = await Category.findOne({ name: "Fresh fruits", level: 3 });
  if (freshFruits) {
    const chain = await getCategoryChain(freshFruits._id);
    if (chain && chain.level1 && chain.level2) {
      const products = [];
      const count = 12; // 10-20 as per requirement; using 12 as a sample
      for (let i = 1; i <= count; i += 1) {
        const title = `Fresh Fruit ${i}`;
        products.push(
          createProductDoc({
            title,
            description: `Premium and juicy selection - ${title}. Perfect for daily nutrition and taste.`,
            mainCategory: chain.level1._id,
            subCategory: chain.level2._id,
            subSubCategory: chain.level3._id,
            subSubSubCategory: undefined,
            basePrice: 40 + i * 2,
          })
        );
      }
      if (products.length) {
        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products for L3 category: Fresh fruits`);
      }
    }
  } else {
    console.warn("L3 category 'Fresh fruits' not found. Skipping L3 sample product seeding.");
  }

  // L4 example: "Masala Noodles" under L3 "Instant noodles"
  const masalaNoodles = await Category.findOne({ name: "Masala Noodles", level: 4 });
  if (masalaNoodles) {
    const chain = await getCategoryChainFromLevel4(masalaNoodles._id);
    if (chain && chain.level1 && chain.level2 && chain.level3) {
      // As per rule: when L4 exists, L3 should have 20 products
      const l3Products = [];
      for (let i = 1; i <= 20; i += 1) {
        const title = `Instant Noodles Pack ${i}`;
        l3Products.push(
          createProductDoc({
            title,
            description: `Quick-cook tasty noodles - ${title}. Ideal for a fast and flavorful meal.`,
            mainCategory: chain.level1._id,
            subCategory: chain.level2._id,
            subSubCategory: chain.level3._id,
            subSubSubCategory: undefined,
            basePrice: 20 + i,
          })
        );
      }
      if (l3Products.length) {
        await Product.insertMany(l3Products);
        console.log(`Seeded ${l3Products.length} products for L3 category: ${chain.level3.name}`);
      }

      // And one L4 should have 4 products distributed (we seed for Masala Noodles)
      const l4Products = [];
      for (let i = 1; i <= 4; i += 1) {
        const title = `Masala Noodles Variant ${i}`;
        l4Products.push(
          createProductDoc({
            title,
            description: `Spicy and flavorful masala noodles - ${title}.`,
            mainCategory: chain.level1._id,
            subCategory: chain.level2._id,
            subSubCategory: chain.level3._id,
            subSubSubCategory: chain.level4._id,
            basePrice: 25 + i,
          })
        );
      }
      if (l4Products.length) {
        await Product.insertMany(l4Products);
        console.log(`Seeded ${l4Products.length} products for L4 category: ${chain.level4.name}`);
      }
    }
  } else {
    console.warn("L4 category 'Masala Noodles' not found. Skipping L4 sample product seeding.");
  }

  // New: Seed products for Exotic fruits sub-sub-subcategories
  const exoticFruits = await Category.findOne({ name: "Exotic fruits", level: 3 });
  if (exoticFruits) {
    const chain = await getCategoryChain(exoticFruits._id);
    if (chain && chain.level1 && chain.level2) {
      // Get all L4 categories under Exotic fruits
      const exoticL4Categories = await Category.find({ 
        parentCategory: exoticFruits._id, 
        level: 4 
      });

      if (exoticL4Categories.length > 0) {
        // Now seed products for each L4 category (7-10 products each)
        for (const l4Category of exoticL4Categories) {
          const l4Products = [];
          const productCount = Math.floor(Math.random() * 4) + 7; // Random between 7-10
          
          for (let i = 1; i <= productCount; i += 1) {
            const title = `${l4Category.name} Selection ${i}`;
            l4Products.push(
              createProductDoc({
                title,
                description: `Premium ${l4Category.name.toLowerCase()} - ${title}. Fresh and exotic selection.`,
                mainCategory: chain.level1._id,
                subCategory: chain.level2._id,
                subSubCategory: chain.level3._id,
                subSubSubCategory: l4Category._id,
                basePrice: 70 + i * 4,
              })
            );
          }
          
          if (l4Products.length) {
            await Product.insertMany(l4Products);
            console.log(`Seeded ${l4Products.length} products for L4 category: ${l4Category.name}`);
          }
        }
      }
    }
  } else {
    console.warn("L3 category 'Exotic fruits' not found. Skipping exotic fruits product seeding.");
  }
}

async function seed() {
  await connectDB();
  try {
    await clearCategories();
    const mainCategories = await seedMainCategories();
    const subCategories = await seedSubCategories(mainCategories);
    const subSubCategories = await seedSubSubCategories(subCategories);
    await seedSubSubSubCategories(subSubCategories);
    await clearProducts();
    await seedSampleProducts();
    console.log("Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
