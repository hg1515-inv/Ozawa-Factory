import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { generateId } from '../lib/store';

const COMMON_ALLERGIES = ['卵', '乳製品', '小麦', 'そば', '落花生', 'えび', 'かに', '甲殻類', 'ナッツ類', '大豆', 'ごま', 'さば', 'いか', 'あわび', 'りんご', 'バナナ', 'キウイ', '桃', 'くるみ'];

export default function CustomerForm({ customer, onSave, onClose }) {
  const isEdit = !!customer;
  const [form, setForm] = useState({
    name: customer?.name || '',
    address: customer?.address || '',
    nearestStation: customer?.nearestStation || '',
    kitchenType: customer?.kitchenType || 'gas',
    hasOven: customer?.hasOven ?? false,
    kitchenMemo: customer?.kitchenMemo || '',
    family: customer?.family || [{ id: generateId(), name: '', relation: '本人', age: '', birthday: '', allergies: [], tastePref: '', memo: '' }],
    events: customer?.events || [],
  });

  const [allergyInput, setAllergyInput] = useState({});

  const updateFamily = (idx, field, value) => {
    const f = [...form.family];
    f[idx] = { ...f[idx], [field]: value };
    setForm({ ...form, family: f });
  };

  const addFamily = () => {
    setForm({ ...form, family: [...form.family, { id: generateId(), name: '', relation: '', age: '', birthday: '', allergies: [], tastePref: '', memo: '' }] });
  };

  const removeFamily = (idx) => {
    if (form.family.length <= 1) return;
    setForm({ ...form, family: form.family.filter((_, i) => i !== idx) });
  };

  const addAllergy = (idx, allergy) => {
    if (!allergy.trim()) return;
    const f = [...form.family];
    if (!f[idx].allergies.includes(allergy.trim())) {
      f[idx] = { ...f[idx], allergies: [...f[idx].allergies, allergy.trim()] };
      setForm({ ...form, family: f });
    }
    setAllergyInput({ ...allergyInput, [idx]: '' });
  };

  const removeAllergy = (fIdx, aIdx) => {
    const f = [...form.family];
    f[fIdx] = { ...f[fIdx], allergies: f[fIdx].allergies.filter((_, i) => i !== aIdx) };
    setForm({ ...form, family: f });
  };

  const addEvent = () => {
    setForm({ ...form, events: [...form.events, { id: generateId(), name: '', date: '' }] });
  };

  const updateEvent = (idx, field, value) => {
    const e = [...form.events];
    e[idx] = { ...e[idx], [field]: value };
    setForm({ ...form, events: e });
  };

  const removeEvent = (idx) => {
    setForm({ ...form, events: form.events.filter((_, i) => i !== idx) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { alert('氏名を入力してください'); return; }
    onSave({
      ...form,
      family: form.family.map(f => ({ ...f, age: f.age ? parseInt(f.age) : 0 })),
      menuHistory: customer?.menuHistory || [],
      lastVisitDate: customer?.lastVisitDate || '',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '顧客情報を編集' : '新規顧客登録'}</h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>氏名 *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例：田中 美咲" required />
            </div>
            <div className="form-group">
              <label>最寄り駅</label>
              <input className="form-control" value={form.nearestStation} onChange={e => setForm({ ...form, nearestStation: e.target.value })} placeholder="例：成城学園前駅" />
            </div>
          </div>

          <div className="form-group">
            <label>住所</label>
            <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="例：東京都世田谷区成城3-12-5" />
          </div>

          {/* Kitchen */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>コンロタイプ</label>
              <select className="form-control" value={form.kitchenType} onChange={e => setForm({ ...form, kitchenType: e.target.value })}>
                <option value="gas">ガス</option>
                <option value="ih">IH</option>
                <option value="both">両方</option>
              </select>
            </div>
            <div className="form-group">
              <label>オーブン</label>
              <select className="form-control" value={form.hasOven ? 'yes' : 'no'} onChange={e => setForm({ ...form, hasOven: e.target.value === 'yes' })}>
                <option value="yes">あり</option>
                <option value="no">なし</option>
              </select>
            </div>
            <div className="form-group">
              <label>キッチンメモ</label>
              <input className="form-control" value={form.kitchenMemo} onChange={e => setForm({ ...form, kitchenMemo: e.target.value })} placeholder="コンロ口数など" />
            </div>
          </div>

          {/* Family Members */}
          <div style={{ borderTop: '2px solid var(--primary-light)', marginTop: '10px', paddingTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem' }}>👨‍👩‍👧 家族構成・嗜好</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addFamily}><Plus size={14} /> 家族追加</button>
            </div>

            {form.family.map((f, idx) => (
              <div key={f.id || idx} style={{ background: '#FAFAF9', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #E7E5E4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '0.88rem' }}>家族 {idx + 1}</strong>
                  {form.family.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm" style={{ padding: '2px 8px' }} onClick={() => removeFamily(idx)}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.78rem' }}>名前</label>
                    <input className="form-control" value={f.name} onChange={e => updateFamily(idx, 'name', e.target.value)} placeholder="名前" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.78rem' }}>続柄</label>
                    <select className="form-control" value={f.relation} onChange={e => updateFamily(idx, 'relation', e.target.value)}>
                      <option value="">選択</option>
                      <option value="本人">本人</option>
                      <option value="配偶者">配偶者</option>
                      <option value="夫">夫</option>
                      <option value="妻">妻</option>
                      <option value="長男">長男</option>
                      <option value="長女">長女</option>
                      <option value="次男">次男</option>
                      <option value="次女">次女</option>
                      <option value="父">父</option>
                      <option value="母">母</option>
                      <option value="祖父">祖父</option>
                      <option value="祖母">祖母</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.78rem' }}>年齢</label>
                    <input className="form-control" type="number" value={f.age} onChange={e => updateFamily(idx, 'age', e.target.value)} placeholder="歳" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.78rem' }}>生年月日</label>
                    <input className="form-control" type="date" value={f.birthday} onChange={e => updateFamily(idx, 'birthday', e.target.value)} />
                  </div>
                </div>

                {/* Allergies */}
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>⚠ アレルギー（最重要）</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {COMMON_ALLERGIES.slice(0, 10).map(a => (
                      <button key={a} type="button"
                        style={{
                          padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer',
                          border: f.allergies.includes(a) ? '2px solid var(--danger)' : '1px solid #E7E5E4',
                          background: f.allergies.includes(a) ? 'var(--danger-light)' : 'white',
                          color: f.allergies.includes(a) ? 'var(--danger)' : 'var(--text-secondary)',
                          fontWeight: f.allergies.includes(a) ? 700 : 400, fontFamily: 'inherit',
                        }}
                        onClick={() => f.allergies.includes(a) ? removeAllergy(idx, f.allergies.indexOf(a)) : addAllergy(idx, a)}
                      >{a}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input className="form-control" style={{ flex: 1 }} value={allergyInput[idx] || ''} onChange={e => setAllergyInput({ ...allergyInput, [idx]: e.target.value })} placeholder="その他のアレルギーを入力" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAllergy(idx, allergyInput[idx] || ''); }}} />
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => addAllergy(idx, allergyInput[idx] || '')}>追加</button>
                  </div>
                  {f.allergies.length > 0 && (
                    <div className="tag-list">
                      {f.allergies.map((a, j) => (
                        <span key={j} className="tag" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                          ⚠ {a} <span className="tag-remove" onClick={() => removeAllergy(idx, j)}>×</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Taste */}
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem' }}>味の好み</label>
                  <input className="form-control" value={f.tastePref} onChange={e => updateFamily(idx, 'tastePref', e.target.value)} placeholder="例：薄味派、辛口NG、パクチー嫌い" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>メモ</label>
                  <input className="form-control" value={f.memo} onChange={e => updateFamily(idx, 'memo', e.target.value)} placeholder="特記事項" />
                </div>
              </div>
            ))}
          </div>

          {/* Events */}
          <div style={{ borderTop: '2px solid var(--primary-light)', marginTop: '10px', paddingTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem' }}>🎉 記念日・イベント</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addEvent}><Plus size={14} /> 追加</button>
            </div>
            {form.events.map((ev, idx) => (
              <div key={ev.id || idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                <input className="form-control" style={{ flex: 1 }} value={ev.name} onChange={e => updateEvent(idx, 'name', e.target.value)} placeholder="記念日名" />
                <input className="form-control" style={{ width: '120px' }} value={ev.date} onChange={e => updateEvent(idx, 'date', e.target.value)} placeholder="MM-DD" />
                <button type="button" className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => removeEvent(idx)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn btn-primary">{isEdit ? '更新する' : '登録する'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
