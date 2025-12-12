import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  votes: number;
  status: string;
  user_id: string;
  created_at: string;
};

export default function ModerationPanel() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchNewProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('problems')
        .select('*')
        .eq('status', 'новая')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError('Ошибка загрузки заявок: ' + fetchError.message);
        setProblems([]);
        return;
      }

      setProblems(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Неожиданная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProblems();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const { data, error: updateError } = await supabase
        .from('problems')
        .update({ status: 'принято' })
        .eq('id', id)
        .select();

      if (updateError) {
        alert('Ошибка при одобрении: ' + updateError.message);
        setProcessing(null);
        return;
      }

      if (!data || data.length === 0) {
        alert('Не удалось изменить статус. Возможно, нет прав.');
        setProcessing(null);
        return;
      }

      setProblems((prev) => prev.filter((p) => p.id !== id));
      setProcessing(null);
    } catch (err) {
      alert('Ошибка при одобрении: ' + String(err));
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      const { data, error: deleteError } = await supabase
        .from('problems')
        .delete()
        .eq('id', id)
        .select();

      if (deleteError) {
        alert('Ошибка при отклонении: ' + deleteError.message);
        setProcessing(null);
        return;
      }

      if (!data || data.length === 0) {
        alert('Не удалось удалить заявку. Возможно, нет прав.');
        setProcessing(null);
        return;
      }

      setProblems((prev) => prev.filter((p) => p.id !== id));
      setProcessing(null);
    } catch (err) {
      alert('Ошибка при отклонении: ' + String(err));
      setProcessing(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Модерация заявок</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchNewProblems}
            className="text-sm mt-2 text-red-600 hover:text-red-800 font-semibold"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-gray-600 mt-3">Загрузка заявок...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-12 bg-green-50 rounded-xl">
          <p className="text-lg text-gray-600">✓ Все заявки проверены!</p>
          <p className="text-sm text-gray-500 mt-2">Нет новых заявок на модерацию</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="grid md:grid-cols-3 gap-4">

                {problem.image_url && (
                  <div className="md:col-span-1">
                    <img
                      src={problem.image_url}
                      alt={problem.title}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className={problem.image_url ? 'md:col-span-2' : 'md:col-span-3'}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {problem.title}
                  </h2>
                  <p className="text-gray-600 mb-3">{problem.description}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span>📁 {problem.category}</span>
                    <span>🔥 {problem.votes} голосов</span>
                    <span>📅 {new Date(problem.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>

                  { }
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(problem.id)}
                      disabled={processing === problem.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
                    >
                      <Check className="w-5 h-5" />
                      Принять
                    </button>
                    <button
                      onClick={() => handleReject(problem.id)}
                      disabled={processing === problem.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
                    >
                      <X className="w-5 h-5" />
                      Отклонить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
