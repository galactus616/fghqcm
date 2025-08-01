// Utility function to get subcategory icons based on name
export const getSubcategoryIcon = (subcategoryName) => {
  const name = subcategoryName.toLowerCase();
  
  if (name.includes('apple') || name.includes('fruit')) {
    return '🍎';
  } else if (name.includes('banana')) {
    return '🍌';
  } else if (name.includes('grape')) {
    return '🍇';
  } else if (name.includes('potato')) {
    return '🥔';
  } else if (name.includes('tomato')) {
    return '🍅';
  } else if (name.includes('onion')) {
    return '🧅';
  } else if (name.includes('carrot')) {
    return '🥕';
  } else if (name.includes('cucumber')) {
    return '🥒';
  } else if (name.includes('pepper') || name.includes('capsicum')) {
    return '🫑';
  } else if (name.includes('lettuce') || name.includes('leafy')) {
    return '🥬';
  } else if (name.includes('broccoli')) {
    return '🥦';
  } else if (name.includes('cauliflower')) {
    return '🥬';
  } else if (name.includes('mushroom')) {
    return '🍄';
  } else if (name.includes('garlic')) {
    return '🧄';
  } else if (name.includes('ginger')) {
    return '🫚';
  } else if (name.includes('lemon') || name.includes('lime')) {
    return '🍋';
  } else if (name.includes('orange')) {
    return '🍊';
  } else if (name.includes('mango')) {
    return '🥭';
  } else if (name.includes('strawberry')) {
    return '🍓';
  } else if (name.includes('blueberry')) {
    return '🫐';
  } else if (name.includes('pineapple')) {
    return '🍍';
  } else if (name.includes('watermelon')) {
    return '🍉';
  } else if (name.includes('melon')) {
    return '🍈';
  } else if (name.includes('peach')) {
    return '🍑';
  } else if (name.includes('pear')) {
    return '🍐';
  } else if (name.includes('cherry')) {
    return '🍒';
  } else if (name.includes('kiwi')) {
    return '🥝';
  } else if (name.includes('avocado')) {
    return '🥑';
  } else if (name.includes('coconut')) {
    return '🥥';
  } else {
    return '🥬';
  }
}; 