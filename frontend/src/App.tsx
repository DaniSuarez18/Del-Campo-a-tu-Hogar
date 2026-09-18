import { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cliente',
    phone: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage('¡Usuario registrado con éxito!');
      } else {
        setMessage('Error al registrar usuario');
      }
    } catch (error) {
      setMessage('Error de conexión con el backend');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '400px' }}>
      <h2>Del Campo a tu Hogar — Registro</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="cliente">Cliente</option>
          <option value="campesino">Campesino</option>
        </select>
        <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>
          Registrar
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}