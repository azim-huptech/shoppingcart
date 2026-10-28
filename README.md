# 🛍️ Objet — Minimalist Ecommerce & Cart

A modern, responsive mini e-commerce application built with **React 19**, **Vite**, **Redux Toolkit**, and styled with a clean, minimalist **Tailwind CSS** design.

Featuring an end-to-end shopping workflow: product catalog with real-time search, multi-criteria filtering, pagination, complete Redux-powered cart operations (add, update, remove), and a Formik + Yup validated signup flow with local storage persistence.

---
<img width="1366" height="643" alt="image" src="https://github.com/user-attachments/assets/62833798-e817-4c81-b295-f5ec3853ea31" />
<img width="1366" height="644" alt="image" src="https://github.com/user-attachments/assets/1c2f6267-fdd1-45dc-8012-34a42e408f89" />
<img width="1366" height="643" alt="image" src="https://github.com/user-attachments/assets/fd4166a6-cb85-4b1c-8bd3-089c473dc337" />


## ✨ Features

### 🛒 1. Redux Toolkit Cart (`cartSlice`)
* **Add to Cart**: Adds new items or automatically increments quantity for existing ones.
* **Update Quantities**:
  * Step increment (`+`) and decrement (`-`) buttons.
  * Direct numeric input editing with automatic validation.
  * Staged temporary quantity updates with dedicated **Update** action.
* **Remove Items**: Single-click removal of specific items or clearing the entire cart.
* **Financial Calculations**:
  * Real-time subtotal, free shipping logic (orders over $50), and coupon discount support (`SAVE10` for 10% off).
  * Safe floating-point price arithmetic (`Math.round(total * 100) / 100`).
* **Persistence**: Automatically synchronizes cart items to browser `localStorage`.

<img width="1366" height="646" alt="image" src="https://github.com/user-attachments/assets/dfebf21b-8839-45fd-827d-e45f3677a1d2" />

---

### 🔍 2. Product Discovery, Filters & Pagination
* **Live Search**: Instant keyword search matching product titles and descriptions.
* **Category Filters**: Dynamically generated category tabs (*Electronics, Jewelery, Men's Clothing, Women's Clothing*).
* **Price Range Brackets**: Filter by price brackets (*Under $25*, *$25 to $50*, *$50 to $100*, *$100+*).
* **Star Rating Filter**: Filter by product review score (*4★ and above*, *3★ and above*).
* **Sorting**:
  * Price: Low to High / High to Low
  * Rating: Highest to Lowest
  * Alphabetical: A to Z
  * Featured (default order)
* **Smart Pagination**:
  * Configurable items per page (6, 8, 12, 16).
  * Auto-resets to Page 1 when any filter or query changes.
  * Previous / Next and direct page jump buttons.
* **Empty States & Reset**: Friendly feedback when no products match, with a one-click *"Reset All Filters"* button.

<img width="1366" height="689" alt="image" src="https://github.com/user-attachments/assets/f2855449-21dc-4e62-b386-97edf5c5adab" />

---

### 📝 3. Signup Form (Formik + Yup)
* **Schema-Based Validation**:
  * **First Name & Last Name**: Min 2 characters, letters only, required.
  * **Email**: Valid email format, required.
  * **Password**: Minimum 6 characters with alphanumeric requirements.
  * **Confirm Password**: Matches password field using `Yup.ref('password')`.
  * **Terms Agreement**: Required checkbox acceptance.
* **User Experience**:
  * Show/Hide password toggle.
  * Real-time inline error alerts.
  * Button loading and disabled states during submission.
* **Local Storage Persistence**:
  * Saves active session under `current_user` and tracks registered accounts in `all_registered_users`.
  * Displays user profile card upon registration and surfaces active user badge (`Hi, <Name>`) in the navigation bar.
  * Logout / account switching capability.

<img width="1366" height="640" alt="image" src="https://github.com/user-attachments/assets/0cefec9b-f02e-4388-a481-57dc071dafab" />
<img width="1247" height="618" alt="image" src="https://github.com/user-attachments/assets/ae56a168-cf1a-4e94-9c27-f5915373d8a9" />


---

### 🎨 4. Minimalist UI/UX Design
* Styled with **Tailwind CSS v4** and modern design principles.
* Typography powered by **Plus Jakarta Sans**.
* Crisp iconography using **Lucide React**.
* Smooth transitions, subtle border styling, and responsive layout across mobile, tablet, and desktop viewports.


---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vite.dev/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Forms & Validation** | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **API Client** | [Axios](https://axios-http.com/) (FakeStoreAPI) |

---

## 📂 Project Structure

```text
shoppingcart/
├── public/                 # Static assets & favicon
├── src/
│   ├── app/
│   │   └── store.js        # Redux store configuration
│   ├── assets/             # Images and SVG icons
│   ├── components/
│   │   ├── Cart.jsx        # Shopping cart view & order summary
│   │   ├── Navbar.jsx      # Sticky minimalist navigation bar
│   │   ├── ProductList.jsx # Catalog with search, filters & pagination
│   │   └── Signup.jsx      # Formik + Yup signup form & profile card
│   ├── features/
│   │   └── Shopcart/
│   │       ├── cartSlice.js    # Redux slice for cart actions & calculations
│   │       └── productSlice.js # Async thunk to fetch products from FakeStoreAPI
│   ├── App.jsx             # React Router routing configuration
│   ├── index.css           # Tailwind CSS imports & global base styling
│   └── main.jsx            # React root with Redux Provider
├── index.html              # HTML shell with Google Fonts
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite config with Tailwind CSS & React plugins
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.x or later recommended)
* **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/shoppingcart.git
   cd shoppingcart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🧭 Routes & Navigation

| Path | Component | Description |
|---|---|---|
| `/` | `ProductList` | Main storefront with search, category/price/rating filters, and pagination |
| `/cart` | `Cart` | Full cart overview, item quantity adjuster, order summary, and checkout |
| `/signup` | `Signup` | User registration with Formik + Yup validation and profile status |

---

## 🎟️ Promo Codes (for testing)
* `SAVE10` — Applies a **10% discount** on your cart subtotal.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
