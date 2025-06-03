import Link from 'next/link';

export default function AdminDashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Posts" count="?" href="/admin/posts" />
          <DashboardCard title="Camera Roll Images" count="?" href="/admin/camera-roll" />
          <DashboardCard title="Newsletter Subscribers" count="?" href="/admin/newsletter" />
        </div>
      </div>
    );
  }
  
  function DashboardCard({ title, count, href }: { title: string, count: string, href: string }) {
    return (
      <Link href={href}>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
      </Link>
    );
  }