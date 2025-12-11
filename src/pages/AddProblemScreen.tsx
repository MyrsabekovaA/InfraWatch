import React, { useState } from 'react';
import { Camera, MapPin, List, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProblemsMap from '../components/map/ProblemsMap';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const CATEGORIES = [
  'Яма',
  'Мусор',
  'Освещение',
  'Опасность',
  'Пешеходы',
  'Дороги',
  'Ветки/Деревья',
  'Парковка',
];

type LatLng = {
  lat: number;
  lng: number;
};

export default function AddProblemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState<LatLng | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Браузер не поддерживает геолокацию.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setShowMap(false);
      },
      () => {
        setError('Не удалось получить геопозицию. Разрешите доступ в настройках браузера.');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim() || !description.trim() || !imageFile) {
      setError('Пожалуйста, заполните заголовок, описание и прикрепите фото.');
      return;
    }

    if (!location) {
      setError('Пожалуйста, выберите точку на карте.');
      return;
    }

    if (!user) {
      setError('Вы не авторизованы.');
      return;
    }

    setLoading(true);

    try {
      const timestamp = Date.now();
      const fileName = `${user.id}/${timestamp}_${imageFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('problems')
        .upload(fileName, imageFile);

      if (uploadError) {
        setError('Ошибка загрузки фото: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from('problems')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('problems').insert({
        title: title.trim(),
        description: description.trim(),
        category,
        lat: location.lat,
        lng: location.lng,
        image_url: publicUrl.publicUrl,
        user_id: user.id,
        status: 'новая',
        votes: 0,
      });

      if (dbError) {
        setError('Ошибка сохранения проблемы: ' + dbError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setImageFile(null);
      setLocation(null);
      setCategory(CATEGORIES[0]);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Неожиданная ошибка: ' + String(err));
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Сообщить о проблеме</h1>
        <p className="text-gray-600">
          Сделайте фото, отметьте точку на карте, выберите категорию и опишите проблему.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Местоположение проблемы
              </span>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
              >
                📍 Моя геопозиция
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="w-full px-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition"
            >
              {location ? (
                <>
                  ✓ Выбрано: {location.lat.toFixed(5)}, {location.lng.toFixed(5)} (изменить)
                </>
              ) : (
                <>
                  📍 Нажмите, чтобы выбрать точку на карте
                </>
              )}
            </button>

            {showMap && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full h-[80vh] max-h-[600px] sm:max-h-[700px] overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b bg-gray-50 flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">Выберите местоположение</h2>
                    <button
                      type="button"
                      onClick={() => setShowMap(false)}
                      className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-hidden bg-gray-200">
                    <ProblemsMap
                      selectedLocation={location}
                      onLocationSelect={(coords) => {
                        setLocation(coords);
                        setShowMap(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              required
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {imageFile ? (
                <div className="flex flex-col items-center">
                  <Camera className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-green-600">
                    ✓ Фото прикреплено: {imageFile.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition">
                    📸 Сделать / выбрать фото (обязательно)
                  </p>
                </div>
              )}
            </label>
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Предпросмотр"
                className="w-full h-48 object-cover rounded-lg mt-4 border border-gray-200"
              />
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <List className="w-4 h-4 mr-2 text-blue-600" /> Категория проблемы
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Заголовок</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
              placeholder="Например: Яма на ул. Московской возле остановки"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Подробное описание</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition h-32 resize-none"
              placeholder="Опишите, где именно проблема, насколько она опасна..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
              <p className="font-medium text-red-800">Ошибка</p>
              <p className="text-red-700 text-xs mt-1">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm">
              <p className="font-medium text-green-800">✓ Заявка отправлена успешно!</p>
              <p className="text-green-700 text-xs mt-1">Перенаправляем на главную...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Загружаем...
              </span>
            ) : success ? (
              '✓ Готово!'
            ) : (
              'Отправить заявку'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}