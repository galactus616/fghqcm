# Subcategory Feature Implementation

## Overview
The subcategory feature allows users to filter products within a main category by selecting specific subcategories. This provides a better user experience by organizing products into more specific groups.

## How It Works

### 1. Category Page Layout
When a user visits a category page (e.g., `/category/Fruits & Vegetables`), they will see:

- **Desktop**: A sidebar on the left showing subcategories
- **Mobile**: A horizontal filter bar at the top showing subcategories

### 2. Subcategory Sidebar Component
The `SubcategorySidebar` component (`client/src/components/user/SubcategorySidebar.jsx`) provides:

- **All Products** option to show all products in the category
- Individual subcategory options with icons
- Visual feedback for selected subcategory
- Loading states while fetching subcategories

### 3. Product Filtering
- Products are filtered client-side based on the selected subcategory
- When "All Products" is selected, all products in the category are shown
- When a specific subcategory is selected, only products from that subcategory are displayed

### 4. API Integration
The feature uses existing API endpoints:
- `GET /api/products/categories/:mainCategoryId/subcategories` - Fetches subcategories
- `GET /api/products/categories/:categoryId/products` - Fetches products for a category

## Database Structure

### Categories Table
- `level`: 1 for main categories, 2 for subcategories
- `parentCategory`: References the main category ID for subcategories
- `isActive`: Boolean to enable/disable categories

### Products Table
- `mainCategory`: References the main category
- `subCategory`: References the specific subcategory

## Features

### 1. Responsive Design
- **Desktop**: Sidebar layout with vertical subcategory list
- **Mobile**: Horizontal filter bar with scrollable subcategory buttons

### 2. Visual Indicators
- Selected subcategory is highlighted with green background
- Icons for each subcategory based on name matching
- Loading skeleton while fetching subcategories

### 3. Internationalization
- Supports both English and Bengali translations
- Translation keys: `subcategories`, `all_products`, `no_products_found_in_this_subcategory`

### 4. Error Handling
- Graceful fallback when subcategories fail to load
- Empty state messages for no products found
- Loading states for better UX

## Usage

### For Users
1. Navigate to any category page (e.g., Fruits & Vegetables)
2. Use the sidebar (desktop) or filter bar (mobile) to select a subcategory
3. Products will be filtered to show only items from that subcategory
4. Click "All Products" to see all products in the category

### For Developers
The feature is automatically available for all categories that have subcategories in the database. No additional configuration is required.

## Technical Implementation

### Components
- `CategoryPage.jsx`: Main page with subcategory integration
- `SubcategorySidebar.jsx`: Sidebar component for subcategory selection

### State Management
- Uses Zustand store for category and subcategory data
- Local state for selected subcategory and filtered products
- Automatic re-fetching when category changes

### Styling
- Follows existing design patterns with green color scheme
- Responsive design with Tailwind CSS
- Consistent with existing component styling

## Future Enhancements
- Add subcategory images from database
- Implement subcategory-specific promotions
- Add subcategory analytics
- Support for nested subcategories (level 3+) 