import React, { useState } from 'react';
import { Camera, MapPin, List } from 'lucide-react'; 

const CATEGORIES = [
  "Яма", "Мусор", "Освещение", "Опасность", "Пешеходы", 
  "Дороги", "Ветки/Деревья", "Парковка"
];

export default function AddProblemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState('55.7558, 37.6176 (Москва, Кремль)'); 
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !imageFile) {
        alert("Пожалуйста, заполните заголовок, описание и прикрепите фото.");
        return;
    }

    console.log("Новая проблема отправлена:", {
      title,
      description,
      category,
      location,
      imageName: imageFile?.name,
    });
    alert("Заявка успешно отправлена на модерацию!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        
        {}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Сообщить о проблеме</h1>
        <p className="text-gray-600 mb-8">
            Сделайте фото, укажите категорию и опишите суть проблемы, чтобы мы могли быстро ее решить.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {}
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
                  <p className="text-sm font-medium text-green-600">Фото прикреплено: {imageFile.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition">
                    Сделать/Выбрать Фото (Обязательно)
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

          {}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                <List className="w-4 h-4 mr-2 text-blue-600" /> Категория проблемы
            </label>
            <select
              
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {}
           <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Заголовок</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200"
              placeholder="Краткое описание (например, 'Яма на Московской')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Подробное описание</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200 h-32 resize-none"
              placeholder="Опишите проблему более детально: где именно находится, насколько критична и т.д."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Местоположение (Геолокация)
            </label>
            {}
            <div className="w-full px-4 py-3 border border-gray-300 bg-gray-200 rounded-lg text-lg text-gray-900">
                {location} 
                <span className="text-blue-600 ml-3 cursor-pointer text-sm font-semibold hover:underline">
                    (Изменить на карте)
                </span>
            </div>
          </div>

          {}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform active:scale-98 mt-8"
          >
            Отправить заявку на модерацию
          </button>
        </form>
      </div>
    </div>
  );
}