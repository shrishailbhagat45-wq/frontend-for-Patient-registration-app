import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { getPatientBills } from '../API/billing';
import { useQuery } from '@tanstack/react-query';
import { FiDownload } from 'react-icons/fi';

export default function GetBillingInfo() {
  const today = new Date();
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const defaultDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const defaultMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

  const [view, setView] = useState('day'); // 'day' | 'month'
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [showCalendar, setShowCalendar] = useState(false);

  const doctorId = localStorage.getItem('doctorId');

  const queryKey = ['patientBills', doctorId, view, selectedDate, selectedMonth];
  const { data: bills = [], isLoading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (view === 'day') {
        const res = await getPatientBills({ doctorId, date: selectedDate });
        return res || [];
      } else {
        const res = await getPatientBills({ doctorId, month: selectedMonth });
        return res || [];
      }
    },
    enabled: !!doctorId,
  });

  const totalCount = bills.length;
  const totalAmount = useMemo(() => bills.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0), [bills]);

  const downloadMonthlyPDF = () => {
    // build printable HTML and open new window for print (user can Save as PDF)
    const head = `
      <head>
        <meta charset="utf-8" />
        <title>Monthly Billing - ${selectedMonth}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #111827 }
          table { width: 100%; border-collapse: collapse; margin-top: 12px }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left }
          th { background: #f3f4f6 }
          h1 { font-size: 18px; margin: 0 }
          .meta { margin-top: 8px }
        </style>
      </head>
    `;

    const rows = bills.map((b, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${b.patientName || ''}</td>
        <td>${new Date(b.createdAt).toLocaleString()}</td>
        <td>${b.items?.map(it=> `${it.name} (₹${it.amount || it.price || 0})`).join(', ')}</td>
        <td>₹${Number(b.totalAmount || 0).toFixed(2)}</td>
      </tr>
    `).join('\n');

    const body = `
      <body>
        <h1>Monthly Billing - ${selectedMonth}</h1>
        <div class="meta">Total bills: ${totalCount} • Total amount: ₹${Number(totalAmount).toFixed(2)}</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    `;

    const win = window.open('', '_blank');
    if (!win) return alert('Unable to open print window. Please allow popups.');
    win.document.write('<html>' + head + body + '</html>');
    win.document.close();
    win.focus();
    // give the new window a moment to render
    setTimeout(() => {
      win.print();
      // optionally close after printing
      // win.close();
    }, 500);
  };

  // Simple Calendar component (no external deps)
  function Calendar({ selected, onSelect }) {
    const [viewDate, setViewDate] = useState(() => {
      const parts = (selected || defaultDate).split('-').map(Number);
      return new Date(parts[0], parts[1] - 1, 1);
    });

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const startDay = new Date(year, month, 1).getDay(); // 0 Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const buildISO = (y, m, d) => {
      const mm = (m + 1).toString().padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      return `${y}-${mm}-${dd}`;
    };

    const weeks = [];
    let dayCounter = 1 - startDay;
    while (dayCounter <= daysInMonth) {
      const week = [];
      for (let i = 0; i < 7; i++, dayCounter++) {
        if (dayCounter > 0 && dayCounter <= daysInMonth) week.push(dayCounter);
        else week.push(null);
      }
      weeks.push(week);
    }

    return (
      <div className="w-72">
        <div className="flex items-center justify-between mb-2">
          <button onClick={prevMonth} className="px-2 py-1">◀</button>
          <div className="font-medium">{viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
          <button onClick={nextMonth} className="px-2 py-1">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-600 mb-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=> <div key={d}>{d}</div>)}
        </div>
        <div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((d, di) => {
                const isSelected = d && buildISO(year, month, d) === selected;
                return (
                  <button
                    key={di}
                    onClick={() => d && onSelect(buildISO(year, month, d))}
                    className={`h-8 rounded ${isSelected ? 'bg-blue-600 text-white' : 'bg-white hover:bg-slate-100'}`}
                    disabled={!d}
                  >
                    {d || ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-20 px-4 md:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Billing Overview</h1>
              <p className="text-sm text-slate-500">View bills by day or month and download monthly report</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-2 rounded-md text-sm ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                Day
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-2 rounded-md text-sm ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                Month
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            {view === 'day' ? (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Select date</label>
                <div className="relative">
                  <button onClick={()=> setShowCalendar(s => !s)} className="border px-3 py-2 rounded-md bg-white">
                    {selectedDate}
                  </button>
                  {showCalendar && (
                    <div className="absolute z-40 mt-2 bg-white border rounded-md shadow-lg p-3">
                      <Calendar selected={selectedDate} onSelect={(d)=>{ setSelectedDate(d); setShowCalendar(false); }} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Select month</label>
                <input type="month" value={selectedMonth} onChange={(e)=> setSelectedMonth(e.target.value)} className="border px-3 py-2 rounded-md" />
              </div>
            )}

            <div className="ml-auto text-right">
              <div className="text-sm text-slate-500">Bills</div>
              <div className="text-2xl font-semibold">{totalCount}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Total Amount</div>
              <div className="text-2xl font-semibold">₹{Number(totalAmount).toFixed(2)}</div>
            </div>

            {view === 'month' && (
              <button onClick={downloadMonthlyPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md">
                <FiDownload />
                Download Monthly PDF
              </button>
            )}

          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            {isLoading ? (
              <div className="text-center py-12">Loading bills...</div>
            ) : bills.length === 0 ? (
              <div className="text-center py-12">No bills found for selected {view === 'day' ? 'date' : 'month'}.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="text-sm text-slate-600">
                      <th className="py-2 px-3 text-left">#</th>
                      <th className="py-2 px-3 text-left">Patient</th>
                      <th className="py-2 px-3 text-left">Date</th>
                      <th className="py-2 px-3 text-left">Items</th>
                      <th className="py-2 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((b, i) => (
                      <tr key={b._id || i} className="border-t border-slate-100 text-sm">
                        <td className="py-2 px-3">{i+1}</td>
                        <td className="py-2 px-3">{b.patientName || b.patient?.name || '—'}</td>
                        <td className="py-2 px-3">{new Date(b.createdAt).toLocaleString()}</td>
                        <td className="py-2 px-3">{b.items?.map(it => it.itemName).join(', ')}</td>
                        <td className="py-2 px-3 text-right">₹{Number(b.totalAmount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
