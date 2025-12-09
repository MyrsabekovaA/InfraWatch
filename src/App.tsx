
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login'; 
import Register from './pages/Register';
import AddProblemScreen from './pages/AddProblemScreen';


function App() {
  return (
    <BrowserRouter>
      
      {}
      <header className="bg-gray-900 p-4 text-white shadow-2xl sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
            <Link to="/add" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition">
                InfraWatch
            </Link>
            <nav className="flex space-x-6">
                <Link 
                    to="/add" 
                    className="hover:text-blue-400 transition font-semibold"
                >
                    Сообщить о проблеме
                </Link>
                <Link 
                    to="/login" 
                    className="hover:text-green-400 transition"
                >
                    Вход
                </Link>
                <Link 
                    to="/register" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
                >
                    Регистрация
                </Link>
            </nav>
        </div>
      </header>

        {}
      <Routes>
        {}
        <Route path="/" element={<AddProblemScreen />} /> 
        
        {}
        <Route path="/add" element={<AddProblemScreen />} />
        
        {}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
      </Routes>
    </BrowserRouter>
  );
}

export default App;