import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <Lock className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Доступ запрещен</h1>
        <p className="text-gray-600 mb-6">
          У вас недостаточно прав для доступа к этой странице.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 font-medium">
            💡 Совет: Эта страница доступна только для ЖКХ/организаций
          </p>
          <p className="text-xs text-blue-600 mt-2">
            При регистрации выберите "🏢 ЖКХ / организация"
          </p>
        </div>

        <Link
          to="/"
          className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
