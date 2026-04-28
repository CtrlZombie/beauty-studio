import { Button } from '../ui/Button';

interface HeaderProps {
  user: any;
  isAdmin: boolean;
  onAdminClick: () => void;
  onProfileClick: () => void;
  onAuthClick: () => void;
  onBookingClick: () => void;
  onLogoClick: () => void;
}

export const Header = ({
  user,
  isAdmin,
  onAdminClick,
  onProfileClick,
  onAuthClick,
  onBookingClick,
  onLogoClick,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={onLogoClick}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src="/images/es_logo.svg" 
              alt="Логотип студии красоты Екатерины Сташок"
              className="h-10 w-auto md:h-12"
            />
          </button>
          <div className="flex gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={onAdminClick}>
                    Админ-панель
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={onProfileClick}>
                  Личный кабинет
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={onAuthClick}>
                Войти
              </Button>
            )}
            <Button size="sm" onClick={onBookingClick}>
              Записаться
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};