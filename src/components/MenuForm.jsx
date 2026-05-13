import React, { useState, useRef } from 'react';
import { X, Star, Mic, MicOff, Camera, Plus, Trash2 } from 'lucide-react';

export default function MenuForm({ menu, onSave, onClose }) {
  const isEdit = !!menu;
  const [form, setForm] = useState({
    date: menu?.date || new Date().toISOString().split('T')[0],
    items: menu?.items || [''],
    genre: menu?.genre || '',
    reaction: menu?.reaction || '',
    rating: menu?.rating || 0,
    photos: menu?.photos || [],
    memo: menu?.memo || '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const updateItem = (idx, val) => {
    const items = [...form.items];
    items[idx] = val;
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, ''] });

  const removeItem = (idx) => {
    if (form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  // Voice input
  const toggleVoice = (field) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('お使いのブラウザは音声入力に対応していません。Chrome推奨です。');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('');
      setForm(prev => ({ ...prev, [field]: prev[field] + text }));
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  // Photo upload
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, photos: [...prev.photos, ev.target.result] }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (idx) => {
    setForm({ ...form, photos: form.photos.filter((_, i) => i !== idx) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanItems = form.items.filter(i => i.trim());
    if (cleanItems.length === 0) { alert('提供品目を1つ以上入力してください'); return; }
    onSave({ ...form, items: cleanItems });
  };

  const GENRES = ['和食', 'イタリアン', 'フレンチ', '中華', '韓国料理', 'エスニック', '創作料理', 'その他'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '訪問記録を編集' : '訪問記録を追加'}</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>日付 *</label>
              <input className="form-control" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>ジャンル</label>
              <select className="form-control" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
                <option value="">選択</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Menu Items */}
          <div className="form-group">
            <label>提供品目 *</label>
            {form.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <input className="form-control" value={item} onChange={e => updateItem(idx, e.target.value)} placeholder={`品目 ${idx + 1}`} />
                {form.items.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => removeItem(idx)}><Trash2 size={14} /></button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={12} /> 品目追加</button>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>評価</label>
            <div className="rating" style={{ gap: '4px' }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={28} className="star" fill={s <= form.rating ? '#F59E0B' : 'none'} color={s <= form.rating ? '#F59E0B' : '#D6D3D1'}
                  onClick={() => setForm({ ...form, rating: s === form.rating ? 0 : s })}
                />
              ))}
            </div>
          </div>

          {/* Reaction with voice */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>リアクション・感想</label>
              <button type="button" className={`voice-btn ${isRecording ? 'recording' : ''}`} onClick={() => toggleVoice('reaction')}>
                {isRecording ? <><MicOff size={14} /> 停止</> : <><Mic size={14} /> 音声入力</>}
              </button>
            </div>
            <textarea className="form-control" rows="3" value={form.reaction} onChange={e => setForm({ ...form, reaction: e.target.value })} placeholder="お客様のリアクションを記録..." style={{ resize: 'vertical' }} />
          </div>

          {/* Photos */}
          <div className="form-group">
            <label>料理写真</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {form.photos.map((p, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={p} alt="" className="photo-thumb" style={{ width: '80px', height: '80px' }} />
                  <button type="button" onClick={() => removePhoto(i)} style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" style={{ width: '80px', height: '80px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.7rem' }}
                onClick={() => fileInputRef.current?.click()}>
                <Camera size={20} />写真追加
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            </div>
          </div>

          {/* Memo with voice */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>メモ</label>
              <button type="button" className={`voice-btn ${isRecording ? 'recording' : ''}`} onClick={() => toggleVoice('memo')}>
                {isRecording ? <><MicOff size={14} /> 停止</> : <><Mic size={14} /> 音声入力</>}
              </button>
            </div>
            <textarea className="form-control" rows="2" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} placeholder="次回への申し送り..." style={{ resize: 'vertical' }} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn btn-primary">{isEdit ? '更新する' : '記録する'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
