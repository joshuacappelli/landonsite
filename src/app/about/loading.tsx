import Loader from '../components/loader';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Loader />
      </div>
    </div>
  );
} 