import React from 'react';
import { Search, AlertTriangle, MapPin, Flame, Users } from 'lucide-react';

export default function CustomerList({ customers, searchQuery, setSearchQuery, onSelect }) {
  const filtered = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    // Search by name, address, nickname
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.address.toLowerCase().includes(q)) return true;
    if ((c.nickname || '').toLowerCase().includes(q)) return true;
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
          <p>該当する友達が見つかりません</p>
        </div>
      ) : (
        <div className="customer-grid">
          {filtered.map(c => {
            const allAllergies = c.family.flatMap(f => f.allergies).filter(Boolean);
            const uniqueAllergies = [...new Set(allAllergies)];
            const lastMenu = c.menuHistory?.[0];

            return (
              <div key={c.id} className="card card-clickable" onClick={() => onSelect(c.id)}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  {/* Avatar Thumbnail */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FAFAF9', border: '1px solid #E7E5E4', overflow: 'hidden', flexShrink: 0 }}>
                    {c.avatar ? (
                      <img src={c.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6D3D1' }}>
                        <Users size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '1rem', margin: 0 }}>{c.name}</h3>
                      {c.nickname && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>({c.nickname})</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={10} /> {c.address}
                    </div>
                  </div>
                </div>

                {/* Allergy Alert */}
                {uniqueAllergies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                    {uniqueAllergies.slice(0, 3).map((a, i) => (
                      <span key={i} className="allergy-badge">⚠ {a}</span>
                    ))}
                    {uniqueAllergies.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>他...</span>}
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
