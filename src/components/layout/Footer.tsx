export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-12 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Логотип вместо текста Beauty Studio */}
          <div>
            <img 
              src="/images/es_logo.svg" 
              alt="Логотип студии красоты Екатерины Сташок"
              className="h-10 w-auto md:h-12 mb-3"
            />
            <p className="text-gray-400 text-sm">Профессиональный уход и эстетика</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Контакты</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>+7 (999) 123-45-67</p>
              <p>info@beautystudio.ru</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">График</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Пн-Пт: 10:00 - 20:00</p>
              <p>Сб: 10:00 - 18:00</p>
              <p>Вс: Выходной</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          © 2026 Студия Красоты Екатерины Сташок
        </div>
      </div>
    </footer>
  );
};