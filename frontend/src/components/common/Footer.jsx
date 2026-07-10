import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 text-gray-600 border-t">
      © {new Date().getFullYear()} SignLang - Hệ thống phiên dịch ngôn ngữ ký hiệu
    </footer>
  );
};

export default Footer;