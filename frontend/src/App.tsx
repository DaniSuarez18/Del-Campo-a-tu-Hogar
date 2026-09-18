import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error cargando productos:', err));
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32' }}>Del Campo a tu Hogar 🧀🥛</h1>
      <p>Catálogo en vivo conectado a NestJS + Supabase</p>
      <hr />
      <h2>Productos Disponibles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '16px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1b5e20' }}>{p.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{p.description || 'Producto artesanal de Ubaté'}</p>
            <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '8px 0' }}>Precio: ${p.price}</p>
            <p style={{ color: '#2e7d32', fontSize: '14px', margin: 0 }}>Stock: {p.stock} unidades</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;