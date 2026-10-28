import React from 'react';
import { lazy,Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
// import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Signup from './components/Signup';
import Login from './components/Login';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import Contact from './components/Contact';
import About from './components/About';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Loader from './components/Loader';
const ProductList = lazy(()=>import("./components/ProductList"))

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader/>} >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path='/loader' element={<Loader/>}>  </Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
