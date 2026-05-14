import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, AlertTriangle, Flame, MapPin, Star, Plus, Mic, MicOff, Camera, Sparkles, X, Calendar } from 'lucide-react';
import { generateId } from '../lib/store';
import MenuForm from './MenuForm';

export default function CustomerDetail({ customer, onBack, onEdit, onDelete, onUpdate, onOpenAI }) {
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const c = customer;
  const allAllergies = c.family.flatMap(f => f.allergies.map(a => ({ allergy: a, person: f.name }))).filter(x => x.allergy);
  const lastMenu = c.menuHistory?.[0];

  const handleSaveMenu = (menuData) => {
    let updated;
    if (editingMenu) {
      updated = c.menuHistory.map(m => m.id === editingMenu.id ? { ...m, ...menuData } : m);
    } else {
      updated = [{ ...menuData, id: generateId() }, ...(c.menuHistory || [])];
    }
    // Update lastVisitDate
    const dates = updated.map(m => m.date).sort().reverse();
    onUpdate({ menuHistory: updated, lastVisitDate: dates[0] || c.lastVisitDate });
    setShowMenuForm(false);
    setEditingMenu(null);
  };

  const handleDeleteMenu = (menuId) => {
    if (!window.confirm('この訪問記録を削除しますか？')) return;
    const updated = c.menuHistory.filter(m => m.id !== menuId);
    const dates = updated.map(m => m.date).sort().reverse();
    onUpdate({ menuHistory: updated, lastVisitDate: dates[0] || '' });
  };

  return (
    <div>
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> 顧客一覧に戻る</button>

      {/* Allergy Alert Banner */}
      {allAllergies.length > 0 && (
        <div className="allergy-alert" style={{ marginBottom: '18px' }}>
          <AlertTriangle size={22} />
          <div>
            <strong>⚠ アレルギー注意：</strong>
            {allAllergies.map((a, i) => (
              <span key={i}> {a.person}→{a.allergy}{i < allAllergies.length - 1 ? '、' : ''}</span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Avatar Area */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FAFAF9', border: '2px solid white', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', flexShrink: 0 }}>
            {c.avatar ? (
              <img src={c.avatar} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D6D3D1' }}>
                <Camera size={32} />
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{c.name}</h2>
              {c.nickname && <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>{c.nickname}</span>}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {c.address}</span>
              {c.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📞 {c.phone}</span>}
              {c.line && <a href={c.line} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06C755', textDecoration: 'none', fontWeight: 600 }}>💬 LINE</a>}
              {c.instagram && <a href={c.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E1306C', textDecoration: 'none', fontWeight: 600 }}>📸 Instagram</a>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-accent btn-sm" onClick={onOpenAI}><Sparkles size={14} /> AI献立提案</button>
          <button className="btn btn-secondary btn-sm" onClick={onEdit}><Edit2 size={14} /> 編集</button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}><Trash2 size={14} /></button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        <a href={c.phone ? `tel:${c.phone}` : '#'} className="action-button" style={{ background: '#7FB1E3' }}>
          <span className="main">TEL</span><span className="sub">する</span>
        </a>
        <a href={c.line || '#'} target="_blank" rel="noopener noreferrer" className="action-button" style={{ background: '#38C138' }}>
          <span className="main">LINE</span><span className="sub">する</span>
        </a>
        <a href={c.instagram || '#'} target="_blank" rel="noopener noreferrer" className="action-button" style={{ background: '#A85CBF' }}>
          <span className="main">Instagram</span>
        </a>
      </div>

      {/* Memo History (formerly Menu History) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 className="section-title" style={{ margin: 0 }}>📋 メモ履歴</h4>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditingMenu(null); setShowMenuForm(true); }}>
            <Plus size={14} /> 記録追加
          </button>
        </div>

        {(!c.menuHistory || c.menuHistory.length === 0) ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            まだメモ履歴の記録がありません
          </div>
        ) : (
          c.menuHistory.map((m, i) => (
            <div key={m.id || i} className="menu-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="date">{m.date}</span>
                  <span className="genre">{m.genre}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div className="rating">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} fill={s <= m.rating ? '#F59E0B' : 'none'} color={s <= m.rating ? '#F59E0B' : '#D6D3D1'} />
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 6px', marginLeft: '6px' }} onClick={() => { setEditingMenu(m); setShowMenuForm(true); }}>
                    <Edit2 size={11} />
                  </button>
                  <button className="btn btn-danger btn-sm" style={{ padding: '3px 6px' }} onClick={() => handleDeleteMenu(m.id)}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <div className="dishes">
                {m.items.map((item, j) => (
                  <span key={j} style={{ display: 'inline-block', marginRight: '6px', marginBottom: '2px' }}>• {item}</span>
                ))}
              </div>
              {m.reaction && <div className="reaction">💬 {m.reaction}</div>}
              {m.memo && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>📝 {m.memo}</p>}
            </div>
          ))
        )}
      </div>

      {/* Events */}
      {c.events && c.events.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 className="section-title" style={{ fontSize: '1rem' }}><Calendar size={18} color="var(--accent)" /> 記念日・イベント</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {c.events.map((ev, i) => (
              <span key={i} className="taste-badge">🎉 {ev.name}（{ev.date}）</span>
            ))}
          </div>
        </div>
      )}

      {/* Family Members (Bottom) */}
      <div>
        <h4 className="section-title" style={{ fontSize: '1rem' }}>👨‍👩‍👧 家族構成・嗜好</h4>
        <div className="family-grid">
          {c.family.map((f, i) => (
            <div key={f.id || i} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '0.95rem' }}>{f.name}</strong>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.relation} / {f.age}歳</div>
                  {f.birthday && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🎂 {f.birthday}</div>}
                </div>
              </div>
              {f.allergies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                  {f.allergies.map((a, j) => <span key={j} className="allergy-badge">⚠ {a}</span>)}
                </div>
              )}
              {f.tastePref && <div className="taste-badge" style={{ marginBottom: '4px' }}>🍽 {f.tastePref}</div>}
              {f.memo && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>📝 {f.memo}</p>}
            </div>
          ))}
        </div>
      </div>

      {showMenuForm && (
        <MenuForm
          menu={editingMenu}
          onSave={handleSaveMenu}
          onClose={() => { setShowMenuForm(false); setEditingMenu(null); }}
        />
      )}
    </div>
  );
}
