import { getPostCount, getCameraRollImageCount, getNewsletterSubscriberCount } from '@/app/db/queries';

export default async function AdminPage() {
  const [postCount, imageCount, subscriberCount] = await Promise.all([
    getPostCount(),
    getCameraRollImageCount(),
    getNewsletterSubscriberCount()
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Posts</h2>
          <p className="text-3xl font-bold text-blue-600">{postCount}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Camera Roll Images</h2>
          <p className="text-3xl font-bold text-green-600">{imageCount}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Newsletter Subscribers</h2>
          <p className="text-3xl font-bold text-purple-600">{subscriberCount}</p>
        </div>
      </div>
    </div>
  );
}

