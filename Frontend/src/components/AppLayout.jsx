import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarOff,
  ClipboardCheck,
  ClipboardList,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserMinus,
  X,
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My Requests', icon: ClipboardList, path: '/leave-details' },
  { label: 'Leave Requests', icon: ClipboardCheck, path: '/leave-requests' },
  { label: 'Holidays', icon: Flag, path: '/holidays' },
  { label: 'Separation Request', icon: UserMinus, path: '/separation-request' },
];

const pathToNavLabel = {
  '/dashboard': 'Dashboard',
  '/leave-details': 'My Requests',
  '/leave-requests': 'Leave Requests',
  '/holidays': 'Holidays',
  '/separation-request': 'Separation Request',
};

function navLabelForPath(pathname) {
  return pathToNavLabel[pathname] ?? 'Dashboard';
}

export default function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { profile, user, signOut, isManager } = useAuth();
  const [annualBalance, setAnnualBalance] = useState({ used: 0, total: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(() => navLabelForPath(pathname));
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const year = new Date().getFullYear();
    supabase
      .from('leave_balances')
      .select('credited')
      .eq('employee_id', user.id)
      .eq('year', year)
      .maybeSingle()
      .then(({ data }) => setAnnualBalance({ used: 0, total: data?.credited ?? 0 }));
  }, [user?.id]);

  useEffect(() => {
    setActiveNav(navLabelForPath(pathname));
  }, [pathname]);

  useEffect(() => {
    if (!user?.id) return undefined;

    let cancelled = false;
    supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!cancelled) setNotifications(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, isNotifOpen]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const channel = supabase
      .channel('app-layout-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.new?.recipient_id === user.id) {
            setNotifications((prev) =>
              prev.some((n) => n.id === payload.new.id)
                ? prev
                : [payload.new, ...prev].slice(0, 20),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!isNotifOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsNotifOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNotifOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markNotificationRead = async (notification) => {
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
      );
      await supabase.from('notifications').update({ is_read: true }).eq('id', notification.id);
    }
    setIsNotifOpen(false);
    navigate('/leave-requests');
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false);
  };

  const formatNotifDate = (value) =>
    new Date(value).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isSidebarOpen]);

  const visibleNavItems = isManager
    ? navItems
    : navItems.filter((item) => item.path !== '/leave-requests');

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F0] text-[#0E0E0E] font-sans">
      <div
        className="h-1.5 w-full"
        style={{
          background: 'linear-gradient(to right, #9DC6CC 0%, #72B3BE 50%, #57A6B3 100%)',
        }}
      />

      <header className="h-16 bg-white border-b border-[#E0E0E0] flex items-center px-6 relative z-30">
        <div className="flex items-center gap-4 w-1/3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 transition-colors ${isSidebarOpen ? 'bg-[#47A2B0] text-white' : 'text-[#555] hover:text-[#47A2B0] hover:bg-[#F0F7F8]'}`}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/dashboard');
              setIsSidebarOpen(false);
            }}
            className="rounded p-0.5 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A2B0]"
            aria-label="Go to dashboard"
          >
            <img src="/emids-logo.png" alt="EMIDS" className="h-5 w-auto block" />
          </button>
        </div>

        <div className="flex items-center justify-center w-1/3">
          <h1 className="text-2xl font-bold tracking-tight text-[#0E0E0E]">Absence Management</h1>
        </div>

        <div className="flex items-center justify-end gap-5 w-1/3">
          <button type="button" className="text-[#999] hover:text-[#47A2B0] transition-colors">
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
              className={`relative text-[#999] transition-colors ${
                isNotifOpen ? 'text-[#47A2B0]' : 'hover:text-[#47A2B0]'
              }`}
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center rounded-full bg-[#E04F4F] text-white text-[10px] font-bold leading-none border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-10 w-80 bg-white border border-[#E0E0E0] shadow-[0_10px_30px_rgba(71,162,176,0.18)] brand-corner z-40">
                <div
                  className="h-1 w-full"
                  style={{ background: 'linear-gradient(to right, #9DC6CC, #72B3BE, #57A6B3)' }}
                />
                <div className="bg-[#F0F7F8] border-b border-[#ABC7CA] px-4 py-3 flex items-center justify-between brand-plate text-[10px] tracking-widest">
                  <span className="text-[#47A2B0] font-bold">NOTIFICATIONS ({unreadCount})</span>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[#777] hover:text-[#47A2B0] transition-colors"
                  >
                    MARK ALL READ
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E0E0E0]">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markNotificationRead(n)}
                      className="w-full text-left px-4 py-3 flex gap-3 hover:bg-[#F0F7F8] transition-colors"
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                          n.is_read ? 'bg-[#E0E0E0]' : 'bg-[#47A2B0]'
                        }`}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-[#0E0E0E] truncate">
                          {n.title}
                        </span>
                        {n.message && (
                          <span className="block text-xs text-[#777] mt-0.5 line-clamp-2">{n.message}</span>
                        )}
                        <span className="block text-[10px] text-[#999] mt-1 brand-plate tracking-wider">
                          {formatNotifDate(n.created_at)}
                        </span>
                      </span>
                    </button>
                  ))}
                  {notifications.length === 0 && (
                    <p className="py-10 text-center text-sm text-[#999]">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {isNotifOpen && (
        <button
          type="button"
          aria-label="Close notifications"
          className="fixed inset-0 z-20 bg-transparent cursor-default"
          onClick={() => setIsNotifOpen(false)}
        />
      )}

      <div className="flex-1 flex relative">
        <div
          className={`fixed left-0 bottom-0 w-80 bg-white text-[#0E0E0E] z-50 flex flex-col overflow-hidden border-r border-[#E0E0E0] shadow-[4px_0_24px_rgba(71,162,176,0.12)] transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
          }`}
          style={{ top: 'calc(0.375rem + 4rem)' }}
          aria-hidden={!isSidebarOpen}
        >
          <div
            className="h-1 w-full flex-shrink-0"
            style={{
              background: 'linear-gradient(to right, #9DC6CC 0%, #72B3BE 50%, #57A6B3 100%)',
            }}
          />

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="px-6 py-6 flex flex-col items-center text-center border-b border-[#E0E0E0] bg-[#F0F7F8]">
              <div className="w-20 h-20 rounded-full bg-[#47A2B0] flex items-center justify-center text-white text-2xl font-bold mb-3 border-2 border-[#ABC7CA] shadow-sm">
                {profile?.initials ?? '—'}
              </div>
              <p className="font-bold text-sm text-[#0E0E0E]">{profile?.name ?? 'Employee'}</p>
              <p className="text-[#47A2B0] text-xs mt-1 brand-plate tracking-wider">{profile?.role ?? ''}</p>
              <p className="text-[#777] text-xs mt-1">{profile?.email ?? user?.email ?? ''}</p>

              <div className="flex justify-center mt-5 text-xs bg-white border border-[#ABC7CA] px-4 py-2 brand-corner">
                <div className="flex items-center gap-1.5">
                  <CalendarOff className="w-3.5 h-3.5 text-[#47A2B0]" />
                  <strong className="text-[#0E0E0E]">
                    {annualBalance.used}/{annualBalance.total}
                  </strong>
                  <span className="text-[#777]">Annual</span>
                </div>
              </div>
            </div>

            <nav className="px-3 py-4 space-y-1 bg-[#F2F2F0]">
              {visibleNavItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setActiveNav(item.label);
                    if (item.path) {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors brand-corner ${
                    activeNav === item.label
                      ? 'bg-[#47A2B0] text-white shadow-sm'
                      : 'text-[#555] hover:text-[#47A2B0] hover:bg-white border border-transparent hover:border-[#E0E0E0]'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 px-6 py-4 border-t border-[#E0E0E0] text-center bg-white">
            <p className="text-[#47A2B0] brand-plate text-[10px] tracking-widest mb-1">TODAY</p>
            <p className="text-sm text-[#333]">
              {dayName}, {dateStr}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#F0F7F8] text-[#47A2B0] brand-plate text-[10px] tracking-wider border border-[#ABC7CA]">
              WORKING DAY
            </span>
          </div>

          <div className="flex-shrink-0 px-3 pb-4 bg-white border-t border-[#E0E0E0]">
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#777] hover:text-[#E04F4F] hover:bg-[#F0F7F8] transition-colors brand-corner"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              Log out
            </button>
          </div>
        </div>

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed left-80 right-0 bottom-0 bg-[#0E0E0E]/10 z-40 border-0 p-0 cursor-default"
            style={{ top: 'calc(0.375rem + 4rem)' }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
