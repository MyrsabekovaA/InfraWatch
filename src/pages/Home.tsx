import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X } from "lucide-react";
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

export default function Home() {
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
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Проблемы города
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Голосуйте за важные проблемы, чтобы помочь их решению.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          <div className="bg-blue-50 p-2 md:p-3 rounded-lg border border-blue-200">
            <p className="text-xs md:text-sm font-semibold text-blue-700">
              Всего
            </p>
            <p className="text-xl md:text-2xl font-bold text-blue-900">
              {stats.total}
            </p>
          </div>
          <div className="bg-red-50 p-2 md:p-3 rounded-lg border border-red-200">
            <p className="text-xs md:text-sm font-semibold text-red-700">
              Новые
            </p>
            <p className="text-xl md:text-2xl font-bold text-red-900">
              {stats.новая}
            </p>
          </div>
          <div className="bg-orange-50 p-2 md:p-3 rounded-lg border border-orange-200">
            <p className="text-xs md:text-sm font-semibold text-orange-700">
              Принято
            </p>
            <p className="text-xl md:text-2xl font-bold text-orange-900">
              {stats.принято}
            </p>
          </div>
          <div className="bg-blue-50 p-2 md:p-3 rounded-lg border border-blue-200">
            <p className="text-xs md:text-sm font-semibold text-blue-700">
              В работе
            </p>
            <p className="text-xl md:text-2xl font-bold text-blue-900">
              {stats.в_работе}
            </p>
          </div>
          <div className="bg-green-50 p-2 md:p-3 rounded-lg border border-green-200">
            <p className="text-xs md:text-sm font-semibold text-green-700">
              Решено
            </p>
            <p className="text-xl md:text-2xl font-bold text-green-900">
              {stats.решено}
            </p>
          </div>
        </div>

        <div className="w-full h-64 md:h-96 border-2 border-gray-300 shadow-md rounded-lg overflow-hidden">
          <ProblemsMap problems={problems} />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
          </button>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                  Категория
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs md:text-sm transition ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                  Статус
                </h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-3 py-1 rounded-full text-xs md:text-sm transition font-medium ${
                        selectedStatuses.includes(status)
                          ? "ring-2 ring-offset-1"
                          : "opacity-70"
                      } ${
                        status === "новая"
                          ? "bg-red-500 text-white"
                          : status === "принято"
                          ? "bg-orange-400 text-white"
                          : status === "в_работе"
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedCategory !== "Все" || selectedStatuses.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategory("Все");
                    setSelectedStatuses([]);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs md:text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  <X className="w-4 h-4" />
                  Очистить фильтры
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm md:text-base">
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchProblems}
              className="text-xs md:text-sm mt-2 text-red-600 hover:text-red-800 font-semibold"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="text-gray-600 mt-3 text-sm md:text-base">
              Загрузка проблем...
            </p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-xl">
            <p className="text-base md:text-lg text-gray-600">
              {problems.length === 0
                ? "Проблем пока не найдено"
                : "По выбранным фильтрам ничего не найдено"}
            </p>
            {user && problems.length === 0 && (
              <button
                onClick={() => navigate("/add")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
              >
                ➕ Сообщить первую проблему
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-xs md:text-sm">
              Найдено {filteredProblems.length} проблем
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          </>
        )}
      </div>
    </main>
  );
}