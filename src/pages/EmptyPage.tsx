import { useLocation } from 'react-router-dom';

export default function EmptyPage() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
          {pageName}
        </h1>
        <p className="text-gray-600">Эта страница находится в разработке</p>
      </div>
    </div>
  );
}
