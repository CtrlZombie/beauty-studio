import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO = ({
  title = "Студия красоты Екатерины Сташок. Магнитогорск",
  description = "Профессиональный уход за собой. Запись на брови, ресницы, шугаринг, прокол ушей. Уютная атмосфера, премиальные материалы. Запишитесь онлайн!",
  keywords = "салон красоты, брови, ресницы, шугаринг, прокол ушей, Магнитогорск, beauty studio, запись онлайн",
  image = "/og-image.jpg",
  url = "https://beauty-studio.ru",
  type = "website"
}: SEOProps) => {
  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <link rel="icon" href="/images/es_logo.svg" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      
      {/* Автор и robots */}
      <meta name="author" content="Beauty Studio" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Russian" />
      
      {/* Open Graph (для соцсетей) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Beauty Studio" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Дополнительные мета-теги */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#f5f5f5" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Альтернативные языки (если нужны) */}
      <link rel="alternate" href={url} hrefLang="ru" />
      
      {/* Schema.org разметка */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          "name": "Beauty Studio",
          "image": "https://beauty-studio.ru/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "ул. Доменщиков 13",
            "addressLocality": "Магнитогорск",
            "addressRegion": "Челябинская область",
            "addressCountry": "RU"
          },
          "telephone": "+7 (999) 123-45-67",
          "priceRange": "₽₽",
          "openingHours": ["Mo-Fr 10:00-20:00", "Sa 10:00-18:00"],
          "url": "https://beauty-studio.ru"
        })}
      </script>
    </Helmet>
  );
};