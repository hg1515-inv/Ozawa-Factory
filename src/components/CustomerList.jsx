import React from 'react';
import { Search, AlertTriangle, MapPin, Flame } from 'lucide-react';

export default function CustomerList({ customers, searchQuery, setSearchQuery, onSelect }) {
  const filtered = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    // Search by name, address, station
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.address.toLowerCase().includes(q)) return true;
    if (c.nearestStation.toLowerCase().includes(q)) return true;
    // Search by allergy
    if (c.family.some(f => f.allergies.some(a => a.toLowerCase().includes(q)))) return true;
    // Search by taste pref
    if (c.family.some(f => (f.tastePref || '').toLowerCase().includes(q))) return true;
    return false;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input
            placeholder="名前・住所・アレルギー食材で検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={48} />
          <p>該当する顧客が見つかりません</p>
        </div>
      ) : (
        <div className="customer-grid">
          {filtered.map(c => {
            const allAllergies = c.family.flatMap(f => f.allergies).filter(Boolean);
            const uniqueAllergies = [...new Set(allAllergies)];
            const lastMenu = c.menuHistory?.[0];

            return (
              <div key={c.id} className="card card-clickable" onClick={() => onSelect(c.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{c.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {c.nearestStation}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="kitchen-badge">
                      <Flame size={12} /> {c.kitchenType === 'gas' ? 'ガス' : c.kitchenType === 'ih' ? 'IH' : '両方'}
                    </span>
                  </div>
                </div>

                {/* Allergy Alert */}
                {uniqueAllergies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                    <AlertTriangle size={14} color="var(--danger)" style={{ marginTop: '2px' }} />
                    {uniqueAllergies.map((a, i) => (
                      <span key={i} className="allergy-badge">⚠ {a}</span>
                    ))}
                  </div>
                )}

                {/* Family count */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  👨‍👩‍👧 家族{c.family.length}名
                </div>

                {/* Last visit */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid #f0f0f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>最終訪問: {c.lastVisitDate || '未訪問'}</span>
                  {lastMenu && <span style={{ color: 'var(--primary)' }}>{lastMenu.genre}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
