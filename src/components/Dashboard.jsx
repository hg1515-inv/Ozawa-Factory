import React from 'react';
import { Clock, AlertTriangle, Calendar, Users, ChefHat } from 'lucide-react';
import { getReminders } from '../lib/store';

export default function Dashboard({ customers, onSelect }) {
  const reminders = getReminders();
  const totalAllergies = customers.reduce((sum, c) => sum + c.family.filter(f => f.allergies.length > 0).length, 0);
  const totalFamily = customers.reduce((sum, c) => sum + c.family.length, 0);

  // Upcoming birthdays/events within 30 days
  const now = new Date();
  const upcoming = [];
  customers.forEach(c => {
    (c.events || []).forEach(ev => {
      const [m, d] = ev.date.split('-').map(Number);
      const evDate = new Date(now.getFullYear(), m - 1, d);
      if (evDate < now) evDate.setFullYear(evDate.getFullYear() + 1);
      const diff = (evDate - now) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff <= 30) upcoming.push({ ...ev, customerName: c.name, customerId: c.id, daysLeft: Math.ceil(diff) });
    });
    (c.family || []).forEach(f => {
      if (f.birthday) {
        const [, m, d] = f.birthday.split('-').map(Number);
        const bd = new Date(now.getFullYear(), m - 1, d);
        if (bd < now) bd.setFullYear(bd.getFullYear() + 1);
        const diff = (bd - now) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 30) upcoming.push({ name: `${f.name}の誕生日`, customerName: c.name, customerId: c.id, daysLeft: Math.ceil(diff) });
      }
    });
  });
  upcoming.sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{customers.length}</div>
          <div className="stat-label">顧客数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalFamily}</div>
          <div className="stat-label">家族総数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: totalAllergies > 0 ? 'var(--danger)' : 'var(--primary)' }}>{totalAllergies}</div>
          <div className="stat-label">アレルギー該当者</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: reminders.length > 0 ? 'var(--primary)' : 'var(--accent)' }}>{reminders.length}</div>
          <div className="stat-label">ご機嫌伺い</div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Reminders */}
        <div>
          <h3 className="section-title"><Clock size={20} color="var(--primary)" /> ご機嫌伺いリスト</h3>
          {reminders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
              ✅ 全顧客が1ヶ月以内に訪問済みです
            </div>
          ) : (
            reminders.map(c => {
              const daysSince = c.lastVisitDate ? Math.floor((now - new Date(c.lastVisitDate)) / (1000*60*60*24)) : '未訪問';
              return (
                <div key={c.id} className="reminder-card" onClick={() => onSelect(c.id)} style={{ marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      最終訪問: {c.lastVisitDate || '未訪問'} ({typeof daysSince === 'number' ? `${daysSince}日前` : daysSince})
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>詳細 →</span>
                </div>
              );
            })
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="section-title"><Calendar size={20} color="var(--accent)" /> 今後のイベント（30日以内）</h3>
          {upcoming.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
              直近30日以内のイベントはありません
            </div>
          ) : (
            upcoming.map((ev, i) => (
              <div key={i} className="card" style={{ marginBottom: '10px', padding: '14px 18px', cursor: 'pointer' }} onClick={() => onSelect(ev.customerId)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>🎉 {ev.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{ev.customerName}様</div>
                  </div>
                  <span className="taste-badge">{ev.daysLeft === 0 ? '今日！' : `あと${ev.daysLeft}日`}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
