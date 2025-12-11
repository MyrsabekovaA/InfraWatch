import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProblemScreen from './pages/AddProblemScreen';
import Home from './pages/Home';
// import ReportPage from './pages/ReportPage'; // 👈 сделаем-заглушку для отчётов

function App() {
    return (
        <BrowserRouter>
            {/* Шапка */}
            <header className="bg-gray-900 p-4 text-white shadow-2xl sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-xl font-bold text-blue-400 hover:text-blue-300 transition"
                    >
                        InfraWatch
                    </Link>
                    <nav className="flex space-x-6 text-sm md:text-base">
                        <Link
                            to="/add"
                            className="hover:text-blue-400 transition font-semibold"
                        >
                            Сообщить о проблеме
                        </Link>
                        <Link
                            to="/report"
                            className="hover:text-yellow-400 transition"
                        >
                            Отчёт
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

            {/* Маршруты */}
            <section className="bg-gray-100">
            <Routes>
                {/* главная: карта города */}
                <Route path="/" element={<Home />} />

                {/* страница добавления проблемы */}
                <Route path="/add" element={<AddProblemScreen />} />

                {/* отчёт / аналитика */}
                {/*<Route path="/report" element={<ReportPage />} />*/}

                {/* auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            </section>
        </BrowserRouter>
    );
}

export default App;