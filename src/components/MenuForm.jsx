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
    memo: menu?.memo || '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.memo.trim()) { alert('メモを入力してください'); return; }
    onSave({ ...form, items: [] });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '訪問記録を編集' : '訪問記録を追加'}</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Memo with voice (Top) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>メモ *</label>
              <button type="button" className={`voice-btn ${isRecording ? 'recording' : ''}`} onClick={() => toggleVoice('memo')}>
                {isRecording ? <><MicOff size={14} /> 停止</> : <><Mic size={14} /> 音声入力</>}
              </button>
            </div>
            <textarea className="form-control" rows="5" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} placeholder="内容を入力..." style={{ resize: 'vertical' }} required />
          </div>

          {/* Date (Bottom) */}
          <div className="form-group">
            <label>日付 *</label>
            <input className="form-control" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
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
