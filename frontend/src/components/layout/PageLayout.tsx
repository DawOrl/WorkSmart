import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function PageLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f6ff 0%, #faf8ff 100%)' }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="relative flex-1 overflow-y-auto p-6">
          {/* Subtle dot grid */}
          <div
            className="pointer-events-none fixed inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Ambient glow – top right */}
          <div
            className="pointer-events-none fixed right-0 top-0 h-[400px] w-[400px] opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)',
              filter: 'blur(60px)',
            }}
          />
          {/* Ambient glow – bottom left */}
          <div
            className="pointer-events-none fixed bottom-0 left-56 h-[300px] w-[300px] opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)',
              filter: 'blur(60px)',
            }}
          />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
