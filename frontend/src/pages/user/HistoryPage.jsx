import React from 'react';
import { useHistory } from '../../hooks/user/useHistory';
import HistoryCard from '../../components/user/HistoryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HistoryPage = () => {
  const { history, loading } = useHistory();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử phiên dịch</h1>
      {history.length === 0 ? (
        <p className="text-gray-500">Chưa có lịch sử phiên dịch nào.</p>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;