import React, { useState } from 'react';
import { Camera, MapPin, List } from 'lucide-react';
import ProblemsMap from '../components/map/ProblemsMap';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !imageFile) {
      alert('Пожалуйста, заполните заголовок, описание и прикрепите фото.');
      return;
    }

    if (!location) {
      alert('Пожалуйста, выберите точку на карте.');
      return;
    }

    console.log('Новая проблема отправлена:', {
      title,
      description,
      category,
      location,
      imageName: imageFile.name,
    });

    alert('Заявка успешно отправлена на модерацию!');
    // тут потом добавишь отправку в Supabase / API
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Браузер не поддерживает геолокацию.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
        },
        (err) => {
          console.error(err);
          alert('Не удалось получить геопозицию. Разрешите доступ в настройках браузера.');
        }
    );
  };

  return (
      <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Сообщить о проблеме</h1>
          <p className="text-gray-600">
            Сделайте фото, отметьте точку на карте, выберите категорию и опишите проблему — это поможет
            быстрее её решить.
          </p>

          {/* 🗺 Карта Бишкека + выбор точки */}
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
                Использовать мою геопозицию
              </button>
            </div>

            <ProblemsMap selectedLocation={location} onLocationSelect={setLocation} />

            <div className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-sm text-gray-800">
              {location ? (
                  <>
                    Выбрано: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </>
              ) : (
                  <span className="text-gray-500">
                Кликните по карте, чтобы выбрать точку, или используйте свою геопозицию.
              </span>
              )}
            </div>
          </div>

          {/* 📸 Фото */}
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
                        Фото прикреплено: {imageFile.name}
                      </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                      <Camera className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition">
                        Сделать / выбрать фото (обязательно)
                      </p>
                    </div>
                )}
              </label>
              {imageFile && (
                  <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Предпросмотр проблемы"
                      className="w-full h-48 object-cover rounded-lg mt-4 border border-gray-200"
                  />
              )}
            </div>

            {/* 🏷 Категория */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                <List className="w-4 h-4 mr-2 text-blue-600" /> Категория проблемы
              </label>
              <select
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                ))}
              </select>
            </div>

            {/* 📝 Заголовок */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Заголовок</label>
              <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200"
                  placeholder="Кратко: например, “Яма на Московской возле остановки”"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* 🧾 Описание */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Подробное описание</label>
              <textarea
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200 h-32 resize-none"
                  placeholder="Опишите, где именно проблема, насколько она опасна и кому мешает."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
              />
            </div>

            {/* ✅ Отправка */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 active:scale-95"
            >
              Отправить заявку на модерацию
            </button>
          </form>
        </div>
      </div>
  );
}