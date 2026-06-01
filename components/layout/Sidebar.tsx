// 'use client';

// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// export default function Sidebar() {
//   const { data: session } = useSession();
//   const pathname = usePathname();

//   const navItems = session?.user?.role === 'cto' 
//     ? [
//         { name: 'Dashboard', href: '/dashboard/cto', icon: '📊' },
//         { name: 'All Reports', href: '/dashboard/cto?view=all', icon: '📋' },
//         { name: 'Analytics', href: '/dashboard/cto?view=analytics', icon: '📈' },
//       ]
//     : [
//         { name: 'New Report', href: '/dashboard/employee', icon: '✏️' },
//         { name: 'My Reports', href: '/dashboard/employee?view=history', icon: '📚' },
//         { name: 'Statistics', href: '/dashboard/employee?view=stats', icon: '📊' },
//       ];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
//       <div className="p-4">
//         <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0088D0' }}>
//               <span className="text-white text-xs font-bold">
//                 {session?.user?.name?.charAt(0) || 'U'}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
//               <p className="text-xs text-gray-500 capitalize">{session?.user?.role}</p>
//             </div>
//           </div>
//         </div>

//         <nav className="space-y-1">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href.split('?')[0];
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'text-white'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//                 style={isActive ? { backgroundColor: '#0088D0' } : {}}
//               >
//                 <span>{item.icon}</span>
//                 <span>{item.name}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//     </aside>
//   );
// }