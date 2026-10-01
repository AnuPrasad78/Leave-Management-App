import React, { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, ClipboardCheck, Bell, HelpCircle } from 'lucide-react';
import { employeeDetails, employeeProfile } from '../data/employee';

function parseBalance(value) {
  return Number.parseInt(value, 10) || 0;
}

function BalanceDonut({ used, total }) {
  const gradientId = useId().replace(/:/g, '');
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.min(used / total, 1) : 0;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div className="relative flex-shrink-0">
      <svg viewBox="0 0 128 128" className="w-32 h-32 md:w-36 md:h-36" aria-hidden>
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#E8E8E8" strokeWidth="14" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 64 64)"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9DC6CC" />
            <stop offset="50%" stopColor="#72B3BE" />
            <stop offset="100%" stopColor="#47A2B0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#0E0E0E]">
          {used}
          <span className="text-[#999] font-normal"> / </span>
          {total}
        </span>
        <span className="brand-plate text-[9px] text-[#777] tracking-widest mt-0.5">UTILIZED</span>
      </div>
    </div>
  );
}

function BalanceBarRow({ code, label, value, max, showNa }) {
  const numeric = parseBalance(value);
  const cap = max > 0 ? max : 0;
  const width = cap > 0 ? Math.min(100, (numeric / cap) * 100) : 0;

  return (
    <div className="grid grid-cols-[2.5rem_1fr_3.5rem] items-center gap-3">
      <span className="brand-plate text-[10px] text-[#47A2B0] font-bold tracking-wider" title={label}>
        {code}
      </span>
      <div className="h-2 rounded-full bg-[#E8E8E8] overflow-hidden">
        {!showNa && (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${width}%`,
              background: 'linear-gradient(to right, #9DC6CC, #47A2B0)',
            }}
          />
        )}
      </div>
      <span className="text-right text-xs font-bold text-[#0E0E0E] tabular-nums">
        {showNa ? 'N/A' : `${value}/${String(max).padStart(2, '0')}`}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { code: 'OP', label: 'OPENING', value: '00' },
    { code: 'CR', label: 'CREDITED', value: '25' },
    { code: 'UT', label: 'UTILIZED', value: '00' },
    { code: 'AV', label: 'AVAILABLE', value: '25' },
    { code: 'CU', label: 'CONT. UTILIZED', value: '00' },
    { code: 'CA', label: 'CONT. AVAILABLE', value: '00' },
  ];

  const credited = parseBalance(stats.find((s) => s.label === 'CREDITED')?.value ?? '0');
  const utilized = parseBalance(stats.find((s) => s.label === 'UTILIZED')?.value ?? '0');
  const contUtilized = parseBalance(stats.find((s) => s.label === 'CONT. UTILIZED')?.value ?? '0');
  const contAvailable = parseBalance(stats.find((s) => s.label === 'CONT. AVAILABLE')?.value ?? '0');
  const contHasPool = contUtilized > 0 || contAvailable > 0;

  const actions = [
    { title: 'Apply Leave', path: '/apply-leave', desc: 'Request time off', icon: PlusCircle },
    { title: 'My Requests', path: '/leave-details', desc: 'View your history', icon: FileText },
    { title: 'Leave Requests', path: '/leave-requests', desc: 'Approve team requests', icon: ClipboardCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-8 h-[3px]" style={{ background: 'linear-gradient(to right, #9DC6CC, #57A6B3)' }} />
          <h2 className="brand-plate text-xs text-[#47A2B0] tracking-widest">EMPLOYEE OVERVIEW</h2>
        </div>

        <div className="bg-white border border-[#E0E0E0] brand-corner overflow-hidden teal-hover-sm">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[17rem] flex-shrink-0 px-6 py-6 bg-[#F0F7F8] border-b lg:border-b-0 lg:border-r border-[#E0E0E0] flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#47A2B0] flex items-center justify-center text-white text-xl font-bold mb-3 border-2 border-[#ABC7CA]">
                {employeeProfile.initials}
              </div>
              <p className="font-bold text-[#0E0E0E] leading-snug">{employeeProfile.name}</p>
              <p className="text-[#47A2B0] text-xs mt-1 brand-plate tracking-wider">{employeeProfile.role}</p>
              <p className="text-[#777] text-xs mt-1">{employeeProfile.email}</p>
            </div>

            <div className="flex-1 p-6 md:p-8">
              <p className="brand-plate text-[10px] text-[#47A2B0] tracking-widest mb-4">EMPLOYEE DETAILS</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {employeeDetails.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="text-[#999] text-xs mb-1">{item.label}</dt>
                    <dd className="font-medium text-sm text-[#0E0E0E] break-words" title={item.value}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-8 h-[3px]" style={{ background: 'linear-gradient(to right, #9DC6CC, #57A6B3)' }} />
          <h2 className="brand-plate text-xs text-[#47A2B0] tracking-widest">QUICK ACTIONS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((act, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => navigate(act.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(act.path);
              }}
              className="bg-white p-6 border border-[#E0E0E0] cursor-pointer teal-hover brand-corner flex flex-col justify-between h-36 group"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-xl text-[#0E0E0E]">{act.title}.</h3>
                <div className="w-10 h-10 flex items-center justify-center text-[#47A2B0] bg-[#F0F7F8] brand-corner group-hover:bg-[#47A2B0] group-hover:text-white transition-colors">
                  <act.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-[#777] brand-plate text-[10px]">{act.desc}</p>
                <span className="text-[#47A2B0] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-8 h-[3px]" style={{ background: 'linear-gradient(to right, #9DC6CC, #57A6B3)' }} />
          <h2 className="brand-plate text-xs text-[#47A2B0] tracking-widest">LEAVE BALANCES · 2026</h2>
        </div>

        <div className="bg-white border border-[#E0E0E0] brand-corner p-6 md:p-8 teal-hover-sm">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#0E0E0E]">Balance breakdown.</h3>
                  <p className="text-sm text-[#777] mt-1">Opening, credited, and utilization for the current year.</p>
                </div>
                <div className="flex justify-center sm:justify-end lg:hidden">
                  <BalanceDonut used={utilized} total={credited} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mb-8 pb-6 border-b border-[#E0E0E0]">
                {stats.map((stat) => (
                  <div key={stat.code} className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#47A2B0] flex-shrink-0" />
                    <span className="brand-plate text-[10px] text-[#47A2B0] tracking-wider font-bold">{stat.code}</span>
                    <span className="text-[10px] text-[#777] truncate">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <BalanceBarRow code="OP" label="OPENING" value={stats[0].value} max={credited} />
                <BalanceBarRow code="CR" label="CREDITED" value={stats[1].value} max={credited} />
                <BalanceBarRow code="UT" label="UTILIZED" value={stats[2].value} max={credited} />
                <BalanceBarRow code="AV" label="AVAILABLE" value={stats[3].value} max={credited} />
                <BalanceBarRow
                  code="CU"
                  label="CONT. UTILIZED"
                  value={stats[4].value}
                  max={credited}
                  showNa={!contHasPool}
                />
                <BalanceBarRow
                  code="CA"
                  label="CONT. AVAILABLE"
                  value={stats[5].value}
                  max={credited}
                  showNa={!contHasPool}
                />
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center pt-2">
              <BalanceDonut used={utilized} total={credited} />
              <p className="brand-plate text-[10px] text-[#47A2B0] tracking-widest mt-4 text-center max-w-[9rem]">
                ANNUAL LEAVE CONSUMED VS CREDITED
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#F0F7F8] border border-[#ABC7CA] p-5 brand-corner flex gap-4 items-start">
          <div className="w-8 h-8 bg-[#47A2B0] flex items-center justify-center text-white brand-corner flex-shrink-0 mt-0.5">
            <Bell className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-[#333] leading-relaxed">
            PTO accrues each pay period. For your current balance, contact HR. See the{' '}
            <strong className="text-[#0E0E0E]">Paid Leave Policy</strong> on Policy Hub.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 border border-[#E0E0E0] brand-corner teal-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-[#47A2B0] flex items-center justify-center text-white brand-corner flex-shrink-0">
            <HelpCircle className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-bold text-xl mb-2 text-[#0E0E0E]">Support Centre.</h2>
            <p className="text-[#777] text-sm brand-plate tracking-wider">
              FOR ANY KIND OF HELP, SUBMIT A TICKET VIA THE HELPDESK
            </p>
          </div>
        </div>
        <button
          type="button"
          className="px-8 py-4 bg-[#47A2B0] text-white font-bold uppercase brand-plate text-xs hover:bg-[#2A7682] transition-colors w-full md:w-auto tracking-wider"
        >
          Help desk →
        </button>
      </div>
    </div>
  );
}
