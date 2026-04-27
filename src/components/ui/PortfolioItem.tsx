import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

interface PortfolioItemProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  category: string;
}

export const PortfolioItem = ({ 
  beforeImage, 
  afterImage, 
  title, 
  category 
}: PortfolioItemProps) => {
  const controls = useAnimation();
  
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        opacity: 0.7,
        transition: { duration: 0.5 }
      }).then(() => {
        controls.start({
          opacity: 1,
          transition: { duration: 0.5 }
        });
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [controls]);

  return (
    <motion.div 
      className="portfolio-item"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-80 rounded-2xl overflow-hidden">
        {/* Before image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={beforeImage} 
            alt="До" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-card/80 to-transparent flex items-end p-6">
            <span className="text-sm font-medium text-background-card">ДО</span>
          </div>
        </div>
        
        {/* After image with hover effect */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={afterImage} 
            alt="После" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-card/90 to-transparent flex items-end p-6">
            <span className="text-sm font-medium text-background-card">ПОСЛЕ</span>
          </div>
        </motion.div>
        
        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 shine pointer-events-none"
          animate={{
            backgroundPosition: ['-100% 0', '200% 0'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-light text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted">{category}</p>
      </div>
      
      {/* Gold line divider */}
      <div className="gold-divider mt-4" />
    </motion.div>
  );
};