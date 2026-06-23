import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Registro() {
  return <div>Registro</div>;
}

function Login() {
  return <div>Login</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registro />} />
        <Route path="/login" element={<Login />} />             
        {/* Aquí irás agregando el Dashboard, Settings, etc. abajo sin romper nada */}
        {}
      </Routes>
    </Router>
  );
}

export default App;