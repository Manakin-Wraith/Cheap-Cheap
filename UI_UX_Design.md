**II. Web Application Architecture**

1. **Frontend Framework:**
    *   Choose a frontend framework like React, Vue, or Angular. These frameworks help structure your application, manage data efficiently, and create reusable UI components.
    *   **Recommendation:** React or Vue are excellent choices due to their large communities, extensive documentation, and component-based architecture.

2. **Backend (Optional but Recommended):**
    *   If you anticipate a large dataset or need to handle frequent updates, consider a backend (e.g., Node.js with Express, Python with Flask/Django).
    *   The backend can serve the JSON data via an API, handle more complex filtering/sorting logic, and manage data updates from the source.
    *   **For Simplicity:** If the dataset is relatively small and updates are infrequent, you can directly load the JSON file into your frontend application.

**III. UI/UX Design**

1. **Layout:**
    *   **Product Grid:** Use a grid layout (e.g., CSS Grid or Flexbox) to display products in a visually appealing and organized way.
    *   **Responsive Design:** Ensure the layout adapts to different screen sizes (mobile, tablet, desktop). Use media queries in CSS for responsiveness.

2. **Product Card:**
    *   **Image:** Prominently display the product image.
    *   **Name:** Clear and concise product name.
    *   **Price:** Display the new (promotional) price in a visually distinct way (e.g., larger font size, different color).
    *   **Old Price:** If available, show the old price struck through to emphasize the discount.
    *   **Promo Details:** Display the extracted promo type (e.g., "Buy 2, Save R10") in a clear and noticeable manner. Use badges, labels, or icons to highlight promotions.
    *   **Call to Action (CTA):** Add a button like "View Details" or "Add to Cart" (if applicable).

3. **Filtering and Search:**
    *   **Search Bar:** A prominent search bar at the top for users to search by product name or keywords.
    *   **Filters:**
        *   **Category:** Filter by product category (if you can extract categories from product names or have this data available).
        *   **Price Range:** Use a slider or input fields to filter by price range.
        *   **Promotion Type:** Filter by specific promotion types (e.g., "Buy 2 Get 1 Free", "Smart Price").
        *   **Brand:** If brand information is available, allow filtering by brand.
    *   **Filter Placement:** Place filters on a sidebar (left or right) or above the product grid in a collapsible/expandable section.
    *   **Clear Filters:** Provide a "Clear Filters" button to reset all filters.
    *   **Filter Indication:** Clearly show which filters are currently active.

4. **Sorting:**
    *   **Options:** Allow sorting by:
        *   Price (low to high, high to low)
        *   Name (A-Z, Z-A)
        *   Newest (if applicable)
        *   Best Deals (biggest price difference or promo)
    *   **Dropdown:** Use a dropdown menu for sorting options.

5. **Pagination:**
    *   If you have many products, implement pagination to break the results into multiple pages. This improves loading times and user experience.

6. **User Interaction:**
    *   **Hover Effects:** Use subtle hover effects on product cards (e.g., slight shadow, zoom image) to provide visual feedback.
    *   **Loading States:** Display a loading indicator (spinner or progress bar) while data is being fetched or filtered.
    *   **Error Handling:** Gracefully handle errors (e.g., network issues, no search results) and display informative messages to the user.

**IV. UI/UX Design Principles**

1. **Consistency:**
    *   Use a consistent design language throughout the application (colors, fonts, spacing, button styles).
    *   Maintain consistent layouts and interaction patterns.

2. **Clarity:**
    *   Make it easy for users to understand the information presented.
    *   Use clear and concise labels for filters and sorting options.
    *   Visually differentiate between regular prices and promotional prices.

3. **Simplicity:**
    *   Avoid cluttering the interface with too much information.
    *   Prioritize essential information on product cards.
    *   Use whitespace effectively to create a clean and uncluttered look.

4. **User Control:**
    *   Give users control over filtering and sorting to find the products they need.
    *   Allow users to easily clear filters and reset the view.

5. **Feedback:**
    *   Provide visual feedback for user interactions (e.g., hover effects, loading indicators).
    *   Display messages to inform users about the status of their actions (e.g., "Showing 10 of 50 products", "No products found for this filter").

6. **Accessibility:**
    *   Follow accessibility guidelines (WCAG) to ensure your application is usable by people with disabilities.
    *   Use semantic HTML elements.
    *   Provide sufficient color contrast.
    *   Ensure keyboard navigability.
    *   Use ARIA attributes when necessary.

7. **Mobile-First:**
    *   Design for mobile devices first, then scale up for larger screens.
    *   Ensure touch targets are large enough and easy to use.

**V. Example UI Structure (Conceptual)**

```
+---------------------------------------------------+
|  Header (Logo, Search Bar, Navigation Links)     |
+---------------------------------------------------+
|  Filters (Sidebar or Collapsible Section)        |
|  - Search Bar                                   |
|  - Category Filter (Dropdown or List)           |
|  - Price Range Filter (Slider or Input Fields)   |
|  - Promotion Type Filter (Checkboxes or List)   |
|  - Brand Filter (Dropdown or List)               |
|  - Clear Filters Button                         |
+---------------------------------------------------+
|  Sorting (Dropdown: Price, Name, Newest, etc.)   |
+---------------------------------------------------+
|  Product Grid                                   |
|  - Product Card 1                              |
|    - Image                                      |
|    - Name                                       |
|    - New Price (Prominently displayed)          |
|    - Old Price (Struck through, if available)   |
|    - Promo Details (Badge/Label)                |
|    - View Details Button                        |
|  - Product Card 2                              |
|    - ...                                        |
|  - Product Card 3                              |
|    - ...                                        |
|  - ... (More Product Cards)                    |
+---------------------------------------------------+
|  Pagination (if needed)                         |
+---------------------------------------------------+
|  Footer (Copyright, Links, etc.)                |
+---------------------------------------------------+
```

**VI. Development Steps**

1. **Set up the project:** Initialize your chosen frontend framework (React).
2. **Create components:** Break down the UI into reusable components (e.g., `ProductCard`, `Filter`, `SearchBar`, `SortDropdown`, `Pagination`).
3. **Fetch and prepare data:** Load the JSON data (either directly or through an API call to your backend). Clean and format the data as described in step I.
4. **Implement the layout:** Build the basic layout using HTML and CSS (or a CSS framework like Bootstrap, Tailwind CSS).
5. **Implement product cards:** Create the `ProductCard` component to display individual products.
6. **Implement search and filtering:**
    *   Add state management (e.g., React's `useState`, `useEffect`, or a state management library like Redux/Vuex) to handle filter values and update the displayed products.
    *   Implement the filter logic to filter the `product_urls` array based on the selected filter values.
    *   Implement the search logic (consider using a library like `fuse.js` for fuzzy searching).
7. **Implement sorting:** Add sorting logic based on the selected sorting option.
8. **Implement pagination:** If needed, implement pagination logic and UI.
9. **Test thoroughly:** Test your application on different browsers and devices to ensure it works as expected and is responsive.
10. **Deploy:** Deploy your application to a hosting platform (e.g., Netlify, Vercel, AWS, Heroku).

**Example Code Snippet (React):**

```javascript
import React, { useState, useEffect } from 'react';
// ... other imports

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    promoType: '',
  });

  useEffect(() => {
    // Fetch data (replace with actual API call or local JSON loading)
    fetch('/api/products') // Or fetch('promotions.json')
      .then((res) => res.json())
      .then((data) => {
        // Clean and format data (replace with your data cleaning logic)
        const cleanedData = data.map((product) => ({
          ...product,
          price: parseFloat(product.price.replace(/[^0-9.]/g, '')), // Example price cleaning
          old_price: parseFloat(product.old.replace(/[^0-9.]/g, '')), // Example price cleaning
          // ... other data cleaning and promo details extraction
        }));
        setProducts(cleanedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  // Filtering logic (example)
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category === '' || product.category === filters.category) &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice
      // ... other filter conditions
    );
  });

  return (
    <div>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Filters (example) */}
      <div>
        <h3>Category</h3>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All</option>
          {/* ... other category options */}
        </select>
      </div>

      {/* ... other filters ... */}

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.url} product={product} />
        ))}
      </div>

      {/* ... pagination ... */}
    </div>
  );
}

// Example ProductCard component
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.src} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">R{product.price}</p>
      {product.old_price && (
        <p className="old-price">
          <del>R{product.old_price}</del>
        </p>
      )}
      {product.promo_type && <p className="promo">{product.promo_type}</p>}
      <button>View Details</button>
    </div>
  );
}

export default App;
```
