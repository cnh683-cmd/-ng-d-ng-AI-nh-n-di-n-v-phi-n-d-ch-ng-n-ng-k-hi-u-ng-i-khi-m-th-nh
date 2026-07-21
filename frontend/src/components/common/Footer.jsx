import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 text-gray-600 border-t">
      © {new Date().getFullYear()} SignBridge - Phát triển bởi Nguyễn Bảo Long và Nguyễn Hoàng Anh.
    </footer>
  );
};

export default Footer;