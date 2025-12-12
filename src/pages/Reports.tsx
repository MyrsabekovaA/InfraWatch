import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { BarChart3, PieChart, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

type Problem = {
    id: string;
    category: string;
    status: string;
    created_at: string;
};

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [problems, setProblems] = useState<Problem[]>([]);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const { data, error } = await supabase
                .from("problems")
                .select("id, category, status, created_at");

            if (error) {
                console.error("Error fetching problems:", error);
            } else {
                setProblems(data || []);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-3">⏳</div>
                    <p className="text-gray-600 font-medium">Загрузка данных...</p>
                </div>
            </div>
        );
    }


    const total = problems.length;
    const byStatus = {
        new: problems.filter((p) => p.status === "новая").length,
        accepted: problems.filter((p) => p.status === "принято").length,
        work: problems.filter((p) => p.status === "в_работе").length,
        solved: problems.filter((p) => p.status === "решено").length,
    };

    const categories = Array.from(new Set(problems.map((p) => p.category)));
    const byCategory = categories.map((cat) => ({
        name: cat,
        count: problems.filter((p) => p.category === cat).length,
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white shadow-sm border-b py-8 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        Отчеты и статистика
                    </h1>
                    <p className="text-gray-500 mt-2">Обзор текущей ситуации по городским проблемам</p>
                </div>
            </div>

            <div className="container mx-auto px-4 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Всего заявок</h3>
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{total}</p>
                        <p className="text-sm text-green-600 mt-2 font-medium">За все время</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Решено</h3>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{byStatus.solved}</p>
                        <p className="text-sm text-gray-400 mt-2">
                            {total > 0 ? Math.round((byStatus.solved / total) * 100) : 0}% от общего числа
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">В работе</h3>
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{byStatus.work}</p>
                        <p className="text-sm text-gray-400 mt-2">Активные задачи</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Новые</h3>
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{byStatus.new}</p>
                        <p className="text-sm text-gray-400 mt-2">Требуют внимания</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-gray-500" />
                            Статус заявок
                        </h2>
                        <div className="space-y-4">
                            <StatusBar label="Новая" count={byStatus.new} total={total} color="bg-red-500" />
                            <StatusBar label="Принято" count={byStatus.accepted} total={total} color="bg-blue-500" />
                            <StatusBar label="В работе" count={byStatus.work} total={total} color="bg-orange-500" />
                            <StatusBar label="Решено" count={byStatus.solved} total={total} color="bg-green-500" />
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-500" />
                            По категориям
                        </h2>
                        <div className="space-y-4">
                            {byCategory.map((cat) => (
                                <div key={cat.name} className="relative">
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <span className="font-medium text-gray-700 capitalize">{cat.name}</span>
                                        <span className="text-gray-500">{cat.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-2.5 rounded-full"
                                            style={{ width: `${total > 0 ? (cat.count / total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {byCategory.length === 0 && (
                                <p className="text-gray-500 text-center py-4">Нет данных по категориям</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
