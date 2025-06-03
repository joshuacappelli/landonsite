import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Hero Settings', href: '/admin/hero' },
    { label: 'Hero Favorites', href: '/admin/hero-favorites' },
    { label: 'Hero Tags', href: '/admin/hero-tags' },
    { label: 'About Me', href: '/admin/about' },
    { label: 'Posts', href: '/admin/posts' },
    { label: 'Camera Roll', href: '/admin/camera-roll' },
    { label: 'Newsletter Subscribers', href: '/admin/newsletter' },
    { label: 'FAQs', href: '/admin/faq' },
    { label: 'Locations', href: '/admin/locations' },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <nav className="p-2">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="mb-1">
              <Link href={item.href} className="block p-2 hover:bg-gray-100 rounded">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}