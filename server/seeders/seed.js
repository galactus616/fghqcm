require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

// Import Models
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const dummyData = async () => {
  await connectDB();

  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log("Old data cleared!");

    // qCommerce-style categories
    const categories = await Category.insertMany([
      {
        name: "Fruits",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239607/imgi_13_close-up-delicious-apple_23-2151868338_bi6uih.jpg",
      },
      {
        name: "Vegetables",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_167_fresh-cilantro-bunch-vibrant-green-herb_632498-25488_kyoigs.jpg",
      },
      {
        name: "Snacks",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752240550/imgi_60_cheese-chips-bag-design-realistic-vector-illustration_1240525-127876_q2ooce.jpg",
      },
      {
        name: "Beverages",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752240555/imgi_14_refreshing-orange-soda-can-design-cold-drink-summer-beverage_84443-38586-removebg-preview_nsoae7.png",
      },
      {
        name: "Instant Food",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/download-removebg-preview_pobolq.png",
      },
      {
        name: "Chocolate",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_14_realistic-flavored-chocolate-bar-pack-template-with-orange-nuts-picture-vector-illustration_1284-68296-removebg-preview_lboeyh.png",
      },
      {
        name: "Fresh Meat",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_53_pile-raw-chicken-sits-checkered-cloth_410516-135776-removebg-preview_iarf6p.png",
      },
      {
        name: "Fashion",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_31_isometric-cloth-3d-isolated-render_28315-9363_darftc.jpg",
      },
      {
        name: "Electronics",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239608/imgi_35_samsung-phone-with-time-it_1025256-15624-removebg-preview_zcpanx.png",
      },
      {
        name: "Stationry",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_37_colorful-pencils-orange-holder-bright-cheerful-image-perfect-back-school-art-projects_632498-32320_ddgwyl.jpg",
      },
      {
        name: "Tea Coffe",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_46_package-tea-bag-is-countertop_665346-103951-removebg-preview_ts6u2j.png",
      },
      {
        name: "Biscuite",
        imageUrl:
          "https://res.cloudinary.com/deepmitra/image/upload/v1752239609/imgi_42_sandwich-cookie-package-design-isolated-orange-background-3d-illustration_317442-125-removebg-preview_kpzwvu.png",
      },
    ]);
    console.log("Categories seeded!");

    // Create a mapping from category name to its ObjectId
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Helper to generate images array
    const makeImages = (mainUrl) => [
      mainUrl,
      mainUrl,
      mainUrl,
      mainUrl,
      mainUrl
    ];

    // Helper to generate variants
    const makeVariants = (basePrice, labels = ["Default"], discount = 0.1) =>
      labels.map((label, idx) => {
        const price = Math.round(basePrice * (1 + 0.2 * idx));
        return {
          quantityLabel: label,
          price,
          discountedPrice: Math.round(price * (1 - discount)),
        };
      });

      

    // Category product templates
    const categoryTemplates =  {
      Fruits: [{
          name: "Apple",
          basePrice: 120,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300604/imgi_13_close-up-delicious-apple_23-2151868338-removebg-preview_tpqdtk.png"
      }, {
          name: "Banana",
          basePrice: 60,
          variants: ["6 pcs", "12 pcs"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300603/download_18_edvapu.jpg"
      }, {
          name: "Pinapple",
          basePrice: 150,
          variants: ["1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300605/Pineapple_Fruit_White_Transparent_Pineapple_Fruit_Pineapple_Pineapple_Clipart_Pineapple_Fruit_PNG_Image_For_Free_Download_a503gs.jpg"
      }, {
          name: "Orange",
          basePrice: 90,
          variants: ["1kg", "2kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752298671/Top_Foods_to_Help_Lower_Cholesterol-removebg-preview_zj1cdr.png"
      }, {
          name: "Grapes",
          basePrice: 110,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300606/grapes_demo.png"
      }, {
          name: "Mango",
          basePrice: 130,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300607/mango_demo.png"
      }],
      Vegetables: [{
          name: "Brinjal",
          basePrice: 40,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300373/download_17_nqmncg.jpg"
      }, {
          name: "Carrot",
          basePrice: 50,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300372/download_16_qx3ck4.jpg"
      }, {
          name: "Spinach",
          basePrice: 30,
          variants: ["250g", "500g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300371/download_15_bimwog.jpg"
      }, {
          name: "Brocoli",
          basePrice: 35,
          variants: ["1kg", "2kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300371/20_Free_download_Broccoli_vegetables_isolated_on_transparent_background__Free_for_use_download__nuabem.jpg"
      }, {
          name: "Tomato",
          basePrice: 45,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300374/tomato_demo.png"
      }, {
          name: "Potato",
          basePrice: 35,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300375/potato_demo.png"
      }],
      Snacks: [{
          name: "Potato Chips",
          basePrice: 40,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752240550/imgi_60_cheese-chips-bag-design-realistic-vector-illustration_1240525-127876_q2ooce.jpg"
      }, {
          name: "Kurkure",
          basePrice: 60,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300801/KURKURE_bgevbb.jpg"
      }, {
          name: "Vujia",
          basePrice: 30,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300798/ALOO_BHUJIA_-_HALDIRAMS_SNACKS_ITEMS_ml4fpi.jpg"
      }, {
          name: "Chanachur",
          basePrice: 50,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300800/Jhal_Chanachur_ntge1s.jpg"
      }, {
          name: "Nachos",
          basePrice: 55,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300802/nachos_demo.png"
      }, {
          name: "Popcorn",
          basePrice: 40,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300803/popcorn_demo.png"
      }],
      Beverages: [{
          name: "Sprite",
          basePrice: 80,
          variants: ["500ml", "1L"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299820/Sprite_Bottle_Png_Logo_-_Sprite_Png_Transparent_PNG_-_368x1242_-_Free_Download_on_NicePNG_jua5ev.jpg"
      }, {
          name: "Cola",
          basePrice: 40,
          variants: ["500ml", "1L"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299820/Drinking_Coke_and_Pepsi_leads_to_larger_testicles_more_testosterone__study_fv2v5a.jpg"
      }, {
          name: "Frooti",
          basePrice: 35,
          variants: ["500ml", "1L"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299820/download_13_exgmow.jpg"
      }, {
          name: "Fanta",
          basePrice: 50,
          variants: ["500ml", "1L"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299819/download_12_baqtho.jpg"
      }, {
          name: "Pepsi",
          basePrice: 45,
          variants: ["500ml", "1L"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299821/pepsi_demo.png"
      }, {
          name: "Lemonade",
          basePrice: 35,
          variants: ["500ml", "1L"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299822/lemonade_demo.png"
      }],
      "Instant Food": [{
          name: "Instant Noodles",
          basePrice: 30,
          variants: ["1 pack", "2 pack"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300184/Maggi_Masala_2-Minute_Noodles_India_Snack_-_24_Pack_kr76ce.jpg"
      }, {
          name: "Cup Soup",
          basePrice: 40,
          variants: ["1 cup", "2 cup"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300184/cup_a_soup_kip_rmjl1w.jpg"
      }, {
          name: "Ramen",
          basePrice: 60,
          variants: ["1 pack"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752305489/Samyang_Buldak_Cream_Carbonara_Hot_Chicken_Ramen_Noodles_5_Pack_-_World_Market_unkv0i.jpg"
      }, {
          name: "Mac & Cheese",
          basePrice: 70,
          variants: ["1 pack"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300183/download_14_pkcjy5.jpg"
      }, {
          name: "Pasta",
          basePrice: 60,
          variants: ["1 pack", "2 pack"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300185/pasta_demo.png"
      }, {
          name: "Upma Mix",
          basePrice: 50,
          variants: ["1 pack", "2 pack"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300186/upma_demo.png"
      }],
      Chocolate: [{
          name: "Milk Chocolate",
          basePrice: 50,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299636/download_11_osvoor.jpg"
      }, {
          name: "Kitkat",
          basePrice: 60,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299636/Everyone_Has_A_Chocolate_Bar_That_Matches_Their_Personality_Here_s_Yours_arwwmo.jpg"
      }, {
          name: "Chocolate Bar",
          basePrice: 40,
          variants: ["50g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299637/Gravadores_fofos_xsgc1o.jpg"
      }, {
          name: "Chocolate Truffles",
          basePrice: 80,
          variants: ["4 pcs", "8 pcs"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299638/M_M_s_m8cqi1.jpg"
      }, {
          name: "Dark Chocolate",
          basePrice: 70,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299639/darkchocolate_demo.png"
      }, {
          name: "White Chocolate",
          basePrice: 65,
          variants: ["50g", "100g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299640/whitechocolate_demo.png"
      }],
      "Fresh Meat": [{
          name: "Chicken Leg",
          basePrice: 180,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752301438/Delhaize___Pilons___Poulet___1_kg___Delhaize_dp2ykr.jpg"
      }, {
          name: "Mutton liver",
          basePrice: 350,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752301439/Transparent_HD_Raw_Beef_Liver_lhma9i.jpg"
      }, {
          name: "Beaf",
          basePrice: 220,
          variants: ["500g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752301439/download_22_ywjqdh.jpg"
      }, {
          name: "whole chicken",
          basePrice: 200,
          variants: ["500g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752301438/CHICKEN_vitamin_B6_Precursor_of_serotonin_and_noradrenaline_so_it_increases_the_disposition_and_avoids_fatigue__medpvx.jpg"
      }, {
          name: "Fish Fillet",
          basePrice: 250,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752301440/fishfillet_demo.png"
      }, {
          name: "Prawns",
          basePrice: 300,
          variants: ["500g", "1kg"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752301441/prawns_demo.png"
      }],
      Fashion: [{
          name: "T-Shirt",
          basePrice: 300,
          variants: ["M", "L", "XL"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752298360/What_colour_pants_and_sneakers_would_you_pair_with_this__exelfe.jpg"
      }, {
          name: "kids dress",
          basePrice: 900,
          variants: ["30", "32", "34"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752298360/THERESA_TANA_LAWN_COTTON_a_couple_of_lovely_dresses_in_Theresa_Liberty_Florals_Summer_Button_Front_Dress_or_Dress_with_Cutout_Back_-_which_one_would_you_choose__eh9i0p.jpg"
      }, {
          name: "Sneakers",
          basePrice: 1200,
          variants: ["7", "8", "9"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1740688354/cld-sample-5.jpg"
      }, {
          name: "dress",
          basePrice: 1500,
          variants: ["M", "L", "XL"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752298360/Verdusa_Women_s_Long_Sleeve_Sweetheart_Neck_Lantern_Sleeve_Ruched_Bust_Ruffle_Trim_Mini_Dress_woanwp.jpg"
      }, {
          name: "Jeans",
          basePrice: 800,
          variants: ["M", "L", "XL"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752298361/jeans_demo.png"
      }, {
          name: "Cap",
          basePrice: 200,
          variants: ["Free Size"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752298362/cap_demo.png"
      }],
      Electronics: [{
          name: "Smartphone",
          basePrice: 15000,
          variants: ["64GB", "128GB"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299461/OPPO_A78_4G_-_Mist_Black_fafajy.jpg"
      }, {
          name: "Headphones",
          basePrice: 2000,
          variants: ["Wired", "Wireless"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299461/OneOdio_A70_Bluetooth_Headphones_Over_Ear_72_Hrs_Playtime_Monitor_Level_Stereo_Sound_Quality_v7kfcl.jpg"
      }, {
          name: "Mixer",
          basePrice: 5000,
          variants: ["Black", "Silver"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299460/Juicer_Mixer_Grinder__Upto_70_Off_on_Mixer_Grinders_Juicers_ttoygi.jpg"
      }, {
          name: "Bluetooth Speaker",
          basePrice: 2500,
          variants: ["Red", "Blue"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299460/download_10_d7eu30.jpg"
      }, {
          name: "Smartwatch",
          basePrice: 3500,
          variants: ["Black", "Silver"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299462/smartwatch_demo.png"
      }, {
          name: "Tablet",
          basePrice: 12000,
          variants: ["32GB", "64GB"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299463/tablet_demo.png"
      }],
      Stationry: [{
          name: "Notebook",
          basePrice: 40,
          variants: ["A4", "A5"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299264/Yansanido_Spiral_Notebook_4_Pcs_8_3_Inch_x_5_iexujj.jpg"
      }, {
          name: "Pencil Set",
          basePrice: 30,
          variants: ["2 pcs", "5 pcs"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299264/Musgrave_Pencil_Company_Tennessee_Red_Pencil_Wood-Cased_Graphite_2_HB_Soft_Un-Sharpened_Eastern_Red_Cedar_Pencil_12-Pack_in_Box_czewc9.jpg"
      }, {
          name: "Highlighter",
          basePrice: 25,
          variants: ["Yellow", "Pink"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299264/Posca_Marker_Medium_PC-5M_-_Metallic_Blue_k7xoyx.jpg"
      }, {
          name: "School Bag",
          basePrice: 20,
          variants: ["50 sheets", "100 sheets"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299264/Free_Photo___Pink_school_bag_obswfk.jpg"
      }, {
          name: "Eraser",
          basePrice: 10,
          variants: ["Small", "Large"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299265/eraser_demo.png"
      }, {
          name: "Sharpener",
          basePrice: 15,
          variants: ["Single", "Double"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299266/sharpener_demo.png"
      }],
      "Tea Coffe": [{
          name: "Green Tea",
          basePrice: 120,
          variants: ["25 bags", "50 bags"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299020/download_9_cpclo0.jpg"
      }, {
          name: "MilkTea",
          basePrice: 100,
          variants: ["25 bags", "50 bags"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299020/Premium_Tea_Pouch_Packaging___Packaging_Design_Agency_in_Delhi_graphicdesigners_biyhhz.jpg"
      }, {
          name: "Coffee Beans",
          basePrice: 300,
          variants: ["250g", "500g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299019/Design_a_eye-catching_pkg_for_specialty__coffee___espresso___Product_packaging_contest_vgfmgn.jpg"
      }, {
          name: "Instant Coffee",
          basePrice: 150,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299020/Nescaf%C3%A9_Frapp%C3%A9latte_fxgpxs.jpg"
      }, {
          name: "Black Tea",
          basePrice: 110,
          variants: ["25 bags", "50 bags"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299021/blacktea_demo.png"
      }, {
          name: "Espresso",
          basePrice: 200,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752299022/espresso_demo.png"
      }],
      Biscuite: [{
          name: "Marie Biscuits",
          basePrice: 30,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300984/download_21_w2za2x.jpg"
      }, {
          name: "Chocolate Cookies",
          basePrice: 50,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300980/Arnotts_Tim_Tam_Dark_Chocolate_nbxt7d.jpg"
      }, {
          name: "Chocopie Biscuits",
          basePrice: 40,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300982/download_20_uwwtgv.jpg"
      }, {
          name: "Oreo Cookies",
          basePrice: 60,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300981/Cadbury_Original_Oreo_Chocolatey_Sandwich_Biscuit_Family_Pack_300g_z85sxi.jpg"
      }, {
          name: "Digestive Biscuits",
          basePrice: 35,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300985/digestive_demo.png"
      }, {
          name: "Butter Cookies",
          basePrice: 55,
          variants: ["100g", "200g"],
          img: "https://res.cloudinary.com/deepmitra/image/upload/v1752300986/buttercookies_demo.png"
      }]
  }

    // Build productDefs from templates
    const productDefs = [];
    Object.entries(categoryTemplates).forEach(([cat, products]) => {
      // Always pick 6 products for each category
      const chosen = products.slice(0, 6);
      chosen.forEach(prod => {
        const variants = makeVariants(prod.basePrice, prod.variants);
        productDefs.push({
          name: prod.name,
          category: cat,
          price: variants[0].price,
          discountedPrice: variants[0].discountedPrice,
          imageUrl: prod.img,
          images: makeImages(prod.img),
          description: `Fresh ${prod.name} from our ${cat} section.`,
          isBestSeller: Math.random() < 0.3,
          isFeatured: Math.random() < 0.3,
          variants,
        });
      });
    });

    // Validate and map product categories
    const validProducts = [];
    productDefs.forEach(p => {
      if (!categoryMap[p.category]) {
        // skip, but with new categories this should not happen
      } else {
        validProducts.push({
          ...p,
          category: categoryMap[p.category],
          images: p.images || makeImages(p.imageUrl),
          discountedPrice: p.discountedPrice || Math.round(p.price * 0.9),
          variants: p.variants || [{ quantityLabel: "Default", price: p.price, discountedPrice: Math.round(p.price * 0.9) }],
        });
      }
    });

    const products = await Product.insertMany(validProducts);
    console.log("Products seeded!");

    const user = await User.create({
      name: "Test User",
      address: "123 Main St, Anytown, CA 90210",
      phone: "9876543211",
    });
    console.log("Dummy user seeded!");

    // Use only valid product indices for dummy cart and orders
    const safeProduct = (arr, idx) => arr[idx] || arr[0];

    // const dummyCart = await Cart.create({
    //   userId: user._id,
    //   items: [
    //     { productId: safeProduct(products, 0)._id, variantIndex: 0, quantity: 2 },
    //     { productId: safeProduct(products, 1)._id, variantIndex: 0, quantity: 1 },
    //   ],
    // });
    // console.log("Dummy cart seeded!");

    // await Order.insertMany([
    //   {
    //     userId: user._id,
    //     orderId: `ORD-${Date.now()}-001`,
    //     date: new Date("2025-06-25"),
    //     total: 250,
    //     status: "Delivered",
    //     items: [
    //       {
    //         product: {
    //           id: safeProduct(products, 0)._id,
    //           name: safeProduct(products, 0).name,
    //           price: safeProduct(products, 0).price,
    //           imageUrl: safeProduct(products, 0).imageUrl,
    //         },
    //         quantity: 2,
    //       },
    //       {
    //         product: {
    //           id: safeProduct(products, 1)._id,
    //           name: safeProduct(products, 1).name,
    //           price: safeProduct(products, 1).price,
    //           imageUrl: safeProduct(products, 1).imageUrl,
    //         },
    //         quantity: 1,
    //       },
    //     ],
    //     deliveryAddress: "123 Main St, Anytown, CA 90210",
    //     phone: "9876543210",
    //     paymentMethod: "cod",
    //   },
    //   {
    //     userId: user._id,
    //     orderId: `ORD-${Date.now()}-002`,
    //     date: new Date("2025-06-20"),
    //     total: 120,
    //     status: "Delivered",
    //     items: [
    //       {
    //         product: {
    //           id: safeProduct(products, 2)._id,
    //           name: safeProduct(products, 2).name,
    //           price: safeProduct(products, 2).price,
    //           imageUrl: safeProduct(products, 2).imageUrl,
    //         },
    //         quantity: 1,
    //       },
    //       {
    //         product: {
    //           id: safeProduct(products, 3)._id,
    //           name: safeProduct(products, 3).name,
    //           price: safeProduct(products, 3).price,
    //           imageUrl: safeProduct(products, 3).imageUrl,
    //         },
    //         quantity: 2,
    //       },
    //     ],
    //     deliveryAddress: "123 Main St, Anytown, CA 90210",
    //     phone: "9876543210",
    //     paymentMethod: "cod",
    //   },
    //   {
    //     userId: user._id,
    //     orderId: `ORD-${Date.now()}-003`,
    //     date: new Date("2025-06-18"),
    //     total: 180,
    //     status: "Cancelled",
    //     items: [
    //       {
    //         product: {
    //           id: safeProduct(products, 4)._id,
    //           name: safeProduct(products, 4).name,
    //           price: safeProduct(products, 4).price,
    //           imageUrl: safeProduct(products, 4).imageUrl,
    //         },
    //         quantity: 3,
    //       },
    //     ],
    //     deliveryAddress: "123 Main St, Anytown, CA 90210",
    //     phone: "9876543210",
    //     paymentMethod: "cod",
    //   },
    // ]);
    // console.log("Dummy orders seeded!");

    console.log("Data seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

dummyData();
