import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X, Zap } from "lucide-react";
import ProblemCard from "../components/problems/ProblemCard";
import ProblemsMap from "../components/map/ProblemsMap";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import type { ProblemStatus } from "../components/problems/ProblemCard";

const CATEGORIES = [
  "Все",
  "Яма",
  "Мусор",
  "Освещение",
  "Опасность",
  "Пешеходы",
  "Дороги",
  "Ветки/Деревья",
  "Парковка",
];

const STATUSES: ProblemStatus[] = ["новая", "принято", "в_работе", "решено"];

type Problem = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  status: ProblemStatus;
  votes: number;
  lat: number;
  lng: number;
  category: string;
};

export default function Home({ isMobileMenuOpen }: { isMobileMenuOpen?: boolean }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedStatuses, setSelectedStatuses] = useState<ProblemStatus[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("problems")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Ошибка загрузки проблем");
        setProblems([]);
        return;
      }

      setProblems(data || []);
      setError(null);
    } catch (err) {
      setError("Неожиданная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    let filtered = problems;

    if (selectedCategory !== "Все") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((p) => selectedStatuses.includes(p.status));
    }

    setFilteredProblems(filtered);
  }, [problems, selectedCategory, selectedStatuses]);

  const toggleStatus = (status: ProblemStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleVote = async (id: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const problem = problems.find((p) => p.id === id);
      if (!problem) return;

      const { error: updateError } = await supabase
        .from("problems")
        .update({ votes: problem.votes + 1 })
        .eq("id", id);

      if (updateError) {
        alert("Ошибка голосования");
        return;
      }

      setProblems((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, votes: p.votes + 1 } : p
        )
      );
    } catch (err) {
      alert("Ошибка голосования");
    }
  };

  const stats = {
    total: problems.length,
    новая: problems.filter((p) => p.status === "новая").length,
    принято: problems.filter((p) => p.status === "принято").length,
    в_работе: problems.filter((p) => p.status === "в_работе").length,
    решено: problems.filter((p) => p.status === "решено").length,
  };

  return (
    <main className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Проблемы города
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Голосуйте за важные проблемы, чтобы помочь их решению.
            </p>
          </div>
          {user && (
            <button
              onClick={() => navigate("/add")}
              className="hidden md:flex items-center gap-2 px-5 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5" />
              Сообщить о проблеме
            </button>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Всего
            </p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Новые
            </p>
            <p className="text-2xl md:text-3xl font-bold text-red-700 mt-1">
              {stats.новая}
            </p>
          </div>
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Принято
            </p>
            <p className="text-2xl md:text-3xl font-bold text-orange-700 mt-1">
              {stats.принято}
            </p>
          </div>
          <div className="bg-primary-50/50 p-4 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              В работе
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary-700 mt-1">
              {stats.в_работе}
            </p>
          </div>
          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
              Решено
            </p>
            <p className="text-2xl md:text-3xl font-bold text-green-700 mt-1">
              {stats.решено}
            </p>
          </div>
        </div>

        <div className={`w-full h-80 md:h-[450px] bg-white border border-gray-200 shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${isMobileMenuOpen ? 'hidden' : ''}`}>
          <ProblemsMap problems={problems} />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <Filter className="w-5 h-5 text-gray-400" />
            {showFilters ? "Скрыть фильтры" : "Фильтры и поиск"}
          </button>

          {showFilters && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100 space-y-6 animate-in slide-in-from-top-2 duration-300">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Категория
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/50"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Статус
                </h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedStatuses.includes(status)
                        ? "ring-2 ring-offset-1 ring-primary-500 shadow-md transform scale-105"
                        : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-gray-100"
                        } ${status === "новая"
                          ? "bg-red-500 text-white"
                          : status === "принято"
                            ? "bg-orange-400 text-white"
                            : status === "в_работе"
                              ? "bg-primary-500 text-white"
                              : "bg-green-500 text-white"
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedCategory !== "Все" || selectedStatuses.length > 0) && (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedCategory("Все");
                      setSelectedStatuses([]);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium transition hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                    Сбросить все
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-800 flex items-center justify-between">
            <span className="font-medium">{error}</span>
            <button
              onClick={fetchProblems}
              className="px-3 py-1 bg-white border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
            >
              Повторить
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4 font-medium">
              Загружаем проблемы...
            </p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ничего не найдено</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              {problems.length === 0
                ? "В данный момент сообщений о проблемах нет. Будьте первым!"
                : "По вашим фильтрам ничего не найдено. Попробуйте изменить параметры поиска."}
            </p>
            {user && problems.length === 0 && (
              <button
                onClick={() => navigate("/add")}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
              >
                Сообщить проблему
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Список проблем</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">{filteredProblems.length}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  title={problem.title}
                  description={problem.description}
                  image={problem.image_url}
                  status={problem.status}
                  votes={problem.votes}
                  onVote={() => handleVote(problem.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}