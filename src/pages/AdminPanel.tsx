import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronDown } from 'lucide-react';

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  image_url?: string;
  created_at: string;
};

const CATEGORIES = [
  'Все',
  'Яма',
  'Мусор',
  'Освещение',
  'Опасность',
  'Пешеходы',
  'Дороги',
  'Ветки/Деревья',
  'Парковка',
];

export default function AdminPanel() {
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedStatus, setSelectedStatus] = useState('Все');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchAllProblems();
  }, []);

  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('problems')
        .select('*')
        .order('votes', { ascending: false });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError('Ошибка загрузки проблем');
        setAllProblems([]);
        return;
      }

      setAllProblems(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Неожиданная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = allProblems.filter((p) => {
    const categoryMatch = selectedCategory === 'Все' || p.category === selectedCategory;
    const statusMatch = selectedStatus === 'Все' || p.status === selectedStatus;
    return categoryMatch && statusMatch;
  });


  const stats = {
    total: allProblems.length,
    новая: allProblems.filter((p) => p.status === 'новая').length,
    принято: allProblems.filter((p) => p.status === 'принято').length,
    в_работе: allProblems.filter((p) => p.status === 'в_работе').length,
    решено: allProblems.filter((p) => p.status === 'решено').length,
  };

  const handleStatusChange = async (id: string, newStat: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('problems')
        .update({ status: newStat })
        .eq('id', id)
        .select();

      if (updateError) {
        alert('Ошибка: ' + updateError.message);
        return;
      }

      if (!data || data.length === 0) {
        alert('Не удалось обновить статус. Проверьте права доступа.');
        return;
      }

      setAllProblems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStat } : p))
      );

      setSelectedProblem(null);
      setNewStatus('');
    } catch (err) {
      alert('Ошибка: ' + String(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto">
        { }
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
            Админ-панель
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Управление проблемами города
          </p>
        </div>

        { }
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg border border-blue-200">
            <p className="text-xs md:text-sm font-semibold text-blue-700">Всего</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 md:p-4 rounded-lg border border-red-200">
            <p className="text-xs md:text-sm font-semibold text-red-700">Новые</p>
            <p className="text-2xl md:text-3xl font-bold text-red-900 mt-1">
              {stats.новая}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 md:p-4 rounded-lg border border-orange-200">
            <p className="text-xs md:text-sm font-semibold text-orange-700">Принято</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-900 mt-1">
              {stats.принято}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg border border-blue-200">
            <p className="text-xs md:text-sm font-semibold text-blue-700">В работе</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-1">
              {stats.в_работе}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-lg border border-green-200">
            <p className="text-xs md:text-sm font-semibold text-green-700">Решено</p>
            <p className="text-2xl md:text-3xl font-bold text-green-900 mt-1">
              {stats.решено}
            </p>
          </div>
        </div>

        { }
        <div className="bg-white p-4 md:p-6 rounded-lg border-2 border-gray-300 mb-6 md:mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            { }
            <div>
              <label className="block text-sm md:text-base font-bold text-gray-900 mb-3">
                📊 Статус
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 border-2 border-gray-400 rounded-lg bg-white font-semibold text-base md:text-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer transition hover:border-gray-500"
                >
                  <option value="Все" className="text-gray-900">Все статусы</option>
                  <option value="новая" className="text-gray-900">Новая</option>
                  <option value="принято" className="text-gray-900">Принято</option>
                  <option value="в_работе" className="text-gray-900">В работе</option>
                  <option value="решено" className="text-gray-900">Решено</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
              </div>
            </div>

            { }
            <div>
              <label className="block text-sm md:text-base font-bold text-gray-900 mb-3">
                🏷️ Категория
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 border-2 border-gray-400 rounded-lg bg-white font-semibold text-base md:text-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer transition hover:border-gray-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-gray-900">
                      {cat === 'Все' ? '✓ Все категории' : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        { }
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6 text-red-700">
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchAllProblems}
              className="text-sm mt-2 text-red-600 hover:text-red-800 font-semibold"
            >
              Попробовать снова
            </button>
          </div>
        )}

        { }
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-3">⏳</div>
            <p className="text-gray-600 font-medium">Загрузка проблем...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            { }
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-md">
                {filteredProblems.length === 0 ? (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <p className="text-base md:text-lg">Проблем не найдено</p>
                  </div>
                ) : (
                  <>
                    { }
                    <div className="md:hidden space-y-3 p-3">
                      {filteredProblems.map((problem) => (
                        <div
                          key={problem.id}
                          onClick={() => setSelectedProblem(problem)}
                          className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-blue-500 p-4 rounded cursor-pointer hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                              {problem.title}
                            </h3>
                            <span
                              className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap ${problem.status === 'новая'
                                  ? 'bg-red-500'
                                  : problem.status === 'принято'
                                    ? 'bg-orange-400'
                                    : problem.status === 'в_работе'
                                      ? 'bg-blue-500'
                                      : 'bg-green-500'
                                }`}
                            >
                              {problem.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>{problem.category}</span>
                            <span className="font-bold text-blue-600">🔥 {problem.votes}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    { }
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 border-b-2 border-gray-300">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Заголовок
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Категория
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                              Статус
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                              🔥
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredProblems.map((problem) => (
                            <tr
                              key={problem.id}
                              onClick={() => setSelectedProblem(problem)}
                              className="hover:bg-blue-50 cursor-pointer transition active:bg-blue-100"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {problem.title.substring(0, 40)}
                                {problem.title.length > 40 ? '...' : ''}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {problem.category}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${problem.status === 'новая'
                                      ? 'bg-red-500'
                                      : problem.status === 'принято'
                                        ? 'bg-orange-400'
                                        : problem.status === 'в_работе'
                                          ? 'bg-blue-500'
                                          : 'bg-green-500'
                                    }`}
                                >
                                  {problem.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-center">
                                {problem.votes}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>

            { }
            {selectedProblem && (
              <div className="bg-white rounded-lg border-2 border-blue-400 p-4 md:p-6 h-fit sticky top-4 shadow-lg">
                <div className="mb-4">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                    {selectedProblem.title}
                  </h2>

                  {selectedProblem.image_url && (
                    <img
                      src={selectedProblem.image_url}
                      alt={selectedProblem.title}
                      className="w-full h-32 md:h-40 object-cover rounded-lg mb-3 border border-gray-300"
                    />
                  )}

                  <p className="text-gray-700 text-xs md:text-sm mb-3">
                    {selectedProblem.description}
                  </p>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg mb-4 space-y-2 border-2 border-gray-300">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="font-bold text-gray-900">Категория:</span>
                    <span className="text-gray-800 font-semibold">{selectedProblem.category}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="font-bold text-gray-900">Голосов:</span>
                    <span className="text-gray-800 font-bold">{selectedProblem.votes}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="font-bold text-gray-900">Статус:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold text-white ${selectedProblem.status === 'новая'
                          ? 'bg-red-500'
                          : selectedProblem.status === 'принято'
                            ? 'bg-orange-400'
                            : selectedProblem.status === 'в_работе'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                        }`}
                    >
                      {selectedProblem.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-900 mb-2">
                      Новый статус
                    </label>
                    <div className="relative">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 md:py-3 border-2 border-gray-400 rounded-lg text-xs md:text-base font-semibold bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition appearance-none cursor-pointer hover:border-gray-500"
                      >
                        <option value="" className="text-gray-900">Выберите статус...</option>
                        {selectedProblem.status !== 'принято' && (
                          <option value="принято" className="text-gray-900">→ Принято</option>
                        )}
                        {selectedProblem.status !== 'в_работе' && (
                          <option value="в_работе" className="text-gray-900">→ В работе</option>
                        )}
                        {selectedProblem.status !== 'решено' && (
                          <option value="решено" className="text-gray-900">→ Решено ✓</option>
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>

                  {newStatus && (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedProblem.id, newStatus)
                      }
                      className="w-full px-3 py-2 md:py-3 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-blue-700 transition active:scale-95"
                    >
                      ✓ Обновить статус
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedProblem(null);
                    setNewStatus('');
                  }}
                  className="w-full mt-3 px-3 py-2 md:py-3 bg-gray-300 text-gray-900 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-400 transition"
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
