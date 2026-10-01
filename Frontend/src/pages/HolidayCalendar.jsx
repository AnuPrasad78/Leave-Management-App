import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[8.5rem]">
      <label className="brand-plate text-[10px] text-[#777] tracking-widest">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#C5C5C5] pl-3 pr-9 py-2 text-sm font-medium text-[#0E0E0E] outline-none focus:border-[#47A2B0]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777]" />
      </div>
    </div>
  );
}

function formatDate(value) {
  const d = new Date(`${value}T00:00:00`);
  return isNaN(d) ? value : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function HolidayTable({ title, rows }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-[#0E0E0E] mb-4">{title}</h3>
      <div className="border border-[#E0E0E0] bg-white brand-corner overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr
              className="text-white brand-plate text-[10px] tracking-widest"
              style={{ background: 'linear-gradient(to right, #9DC6CC, #72B3BE, #57A6B3)' }}
            >
              <th className="py-3 px-4 font-normal w-[5.5rem]">DATE</th>
              <th className="py-3 px-4 font-normal w-[6.5rem]">DAY</th>
              <th className="py-3 px-4 font-normal">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-t border-[#E0E0E0] ${i % 2 === 1 ? 'bg-[#F0F7F8]/60' : 'bg-white'}`}
              >
                <td className="py-2.5 px-4 font-medium text-[#0E0E0E] whitespace-nowrap">{formatDate(row.date)}</td>
                <td className="py-2.5 px-4 text-[#555] whitespace-nowrap">{row.day}</td>
                <td className="py-2.5 px-4 text-[#333]">{row.description}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-[#999]">No holidays for this selection.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HolidayCalendar() {
  const [rows, setRows] = useState([]);
  const [country, setCountry] = useState('INDIA');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    supabase
      .from('holidays')
      .select('*')
      .order('date')
      .then(({ data }) => {
        const items = data ?? [];
        setRows(items);
        if (items.length > 0) {
          setCountry(items[0].country);
          setLocation(items[0].location);
          setYear(String(items[0].year));
        }
      });
  }, []);

  const countries = useMemo(() => [...new Set(rows.map((r) => r.country))], [rows]);
  const locations = useMemo(() => [...new Set(rows.map((r) => r.location))], [rows]);
  const years = useMemo(() => [...new Set(rows.map((r) => String(r.year)))], [rows]);

  const filtered = useMemo(
    () => rows.filter((r) => r.country === country && r.location === location && String(r.year) === String(year)),
    [rows, country, location, year],
  );
  const fixed = useMemo(() => filtered.filter((r) => !r.is_optional), [filtered]);
  const optional = useMemo(() => filtered.filter((r) => r.is_optional), [filtered]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div
          className="inline-flex items-center px-5 py-3 brand-plate text-xs text-white tracking-[0.2em] font-bold brand-corner w-fit"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)' }}
        >
          HOLIDAY CALENDAR
        </div>

        <div className="flex flex-wrap gap-4 lg:gap-5">
          <FilterSelect label="COUNTRY" value={country} onChange={setCountry} options={countries} />
          <FilterSelect label="LOCATION" value={location} onChange={setLocation} options={locations} />
          <FilterSelect label="YEAR" value={year} onChange={setYear} options={years} />
        </div>
      </div>

      <p className="text-sm text-[#777]">
        Showing holidays for <strong className="text-[#0E0E0E]">{location}</strong>, {country} · {year}
      </p>

      <div className="flex flex-col xl:flex-row gap-8 xl:gap-10">
        <HolidayTable title={`Fixed Holiday - ${fixed.length} Days`} rows={fixed} />
        <HolidayTable
          title={`Optional Holiday List - Choose 3 Out of ${optional.length} Days`}
          rows={optional}
        />
      </div>
    </div>
  );
}
