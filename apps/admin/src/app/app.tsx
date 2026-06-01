import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { ProductsPage } from '@org/admin/feature-products';

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Nx Showcase · Admin</span>
        <nav>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      <main className="shell">
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
