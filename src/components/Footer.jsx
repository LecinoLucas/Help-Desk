// src/components/Footer.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Se estiver próximo do final da página (ex: 50px antes)
      if (scrollTop + windowHeight >= docHeight - 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Remove listener quando desmontar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`footer ${visible ? 'visible' : 'hidden'}`}>
      <p>© 2025 Lecino Lucas Corporation. Todos os direitos reservados.</p>
    </footer>
  );
}
