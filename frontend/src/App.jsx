import { useState } from 'react';

function App() {

  const [notas, setNotas] = useState([
    { id: 1, titulo: 'Clase 1: Introducción a POO', tag: 'POO' },
    { id: 2, titulo: 'Estructura de datos en MongoDB', tag: 'Backend' }
  ]);
  
  const [nuevaNota, setNuevaNota] = useState('');

  const controlarAgregarNota = (e) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;

    const notaCreada = {
      id: Date.now(),
      titulo: nuevaNota,
      tag: 'Estudio'
    };

    setNotas([...notas, notaCreada]);
    setNuevaNota(''); 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Encabezado con el nombre oficial del proyecto */}
      <h2>🧠 Panel de MenteColmena</h2>
      <p style={{ color: '#666' }}>Llevas <strong>{notas.length}</strong> apuntes registrados</p>
      
      {/* Formulario interactivo */}
      <form onSubmit={controlarAgregarNota} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Escribe un nuevo apunte o título..." 
          value={nuevaNota}
          onChange={(e) => setNuevaNota(e.target.value)}
          style={{ padding: '8px', width: '70%', marginRight: '10px', borderRadius: '4px',
             border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007BFF', color: 'white',
           border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Añadir
        </button>
      </form>

      {/* Lista renderizada dinámicamente */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {notas.map((nota) => (
          <li key={nota.id} style={{ padding: '10px', marginBottom: '8px', backgroundColor: '#f4f4f9',
           borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{nota.titulo}</span>
            <span style={{ backgroundColor: '#e2e2e2', padding: '2px 6px', borderRadius: '4px',
               fontSize: '12px' }}>{nota.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;