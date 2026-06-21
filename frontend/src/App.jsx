import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NotesHistory from './components/NotesHistory';
import Workspace from './components/Workspace';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial de la app: Pantalla de Login */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta para crear un nuevo usuario */}
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard general: estadísticas, rachas */}
        <Route path="/home" element={<Home />} />
        
        {/* explorador, historial y buscador de apuntes */}
        <Route path="/notebooks" element={<NotesHistory />} />
        
        {/* Editor de notas interactivo conectado con la IA  */}
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
    </Router>
  );
}

export default App;