import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const HistoryCard = ({ item }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {item.input_type === 'text' ? '📝 Văn bản' : '🤟 Ký hiệu'}
          </span>
          <p className="mt-2 text-gray-800 font-medium">
            <span className="font-bold">Input:</span> {item.input_content}
          </p>
          <p className="text-gray-600">
            <span className="font-bold">Output:</span> {item.output_content}
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {format(new Date(item.timestamp), 'dd/MM/yyyy HH:mm', { locale: vi })}
        </span>
      </div>
    </div>
  );
};

export default HistoryCard; 