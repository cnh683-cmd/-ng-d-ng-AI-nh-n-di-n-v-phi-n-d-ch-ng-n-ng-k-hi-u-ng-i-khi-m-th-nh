import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const ModelUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // Giả lập upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    if (onUpload) onUpload(file);
    setFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Upload mô hình AI mới</h3>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".pth,.pt"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <FaUpload />
          <span>{uploading ? 'Đang tải...' : 'Tải lên'}</span>
        </button>
      </div>
      {file && <p className="mt-2 text-sm text-gray-500">File: {file.name}</p>}
    </div>
  );
};

export default ModelUploader;