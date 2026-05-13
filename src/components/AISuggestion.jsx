import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Check, Settings } from 'lucide-react';

export default function AISuggestion({ customer, onBack }) {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('ozawa_gemini_key') || '');
  const [showSettings, setShowSettings] = useState(false);

  const c = customer;
  const allAllergies = [...new Set(c.family.flatMap(f => f.allergies))];
  const familyDesc = c.family.map(f => {
    let desc = `${f.relation}（${f.name}、${f.age}歳）`;
    if (f.allergies.length > 0) desc += `【アレルギー: ${f.allergies.join('・')}】`;
    if (f.tastePref) desc += `[好み: ${f.tastePref}]`;
    if (f.memo) desc += `{メモ: ${f.memo}}`;
    return desc;
  }).join('\n');

  const pastMenus = (c.menuHistory || []).slice(0, 5).map(m =>
    `${m.date} ${m.genre}：${m.items.join('、')}（評価:${m.rating}/5）${m.reaction ? `→${m.reaction}` : ''}`
  ).join('\n');

  const kitchenDesc = `${c.kitchenType === 'gas' ? 'ガスコンロ' : c.kitchenType === 'ih' ? 'IH' : '両方'}, オーブン${c.hasOven ? 'あり' : 'なし'}${c.kitchenMemo ? ', ' + c.kitchenMemo : ''}`;

  const prompt = `あなたはプロの出張料理家のアシスタントです。以下の顧客情報をもとに、次回の訪問時の献立案を5品程度提案してください。

【顧客名】${c.name}
【家族構成・嗜好】
${familyDesc}
${allAllergies.length > 0 ? `\n【⚠重要：アレルギー食材（絶対に使用禁止）】${allAllergies.join('、')}` : ''}
【キッチン設備】${kitchenDesc}
【過去のメニュー履歴】
${pastMenus || 'なし'}

以下の点を考慮してください：
1. アレルギー食材は絶対に使用しない
2. 過去のメニューと被らないようにする
3. 家族全員の好みを考慮する
4. キッチン設備で調理可能なメニューにする
5. 季節感を取り入れる（現在は${new Date().toLocaleDateString('ja-JP', { month: 'long' })}）
6. 各品目に簡単な調理ポイントも添える

献立案を提案してください。`;

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    setIsLoading(true);
    setResult('');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
          })
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'AIからの応答を取得できませんでした。';
      setResult(text);
    } catch (err) {
      setResult(`エラーが発生しました: ${err.message}\n\nAPIキーが正しいか確認してください。`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveApiKey = () => {
    localStorage.setItem('ozawa_gemini_key', apiKey);
    setShowSettings(false);
  };

  return (
    <div>
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> {c.name}様の詳細に戻る</button>

      <div className="ai-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Sparkles size={24} color="var(--accent)" /> AI献立提案
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={14} /> API設定
          </button>
        </div>

        {showSettings && (
          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #E7E5E4' }}>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Gemini API Key</label>
              <input className="form-control" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIzaSy..." />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Google AI Studio（https://aistudio.google.com/apikey）で無料のAPIキーを取得できます。
            </p>
            <button className="btn btn-primary btn-sm" onClick={saveApiKey}>保存</button>
          </div>
        )}

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {c.name}様の家族構成・アレルギー・過去のメニューをもとに、AIが次回の献立を提案します。
        </p>

        {/* Summary */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span className="kitchen-badge">👨‍👩‍👧 {c.family.length}名</span>
          {allAllergies.map((a, i) => <span key={i} className="allergy-badge">⚠ {a}</span>)}
          <span className="taste-badge">🍽 前回: {c.menuHistory?.[0]?.genre || '記録なし'}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button className="btn btn-accent" onClick={handleGenerate} disabled={isLoading}>
            <Sparkles size={16} /> {isLoading ? '生成中...' : 'AIに献立を提案してもらう'}
          </button>
          <button className="btn btn-secondary" onClick={handleCopyPrompt}>
            {copied ? <><Check size={14} /> コピー済み</> : <><Copy size={14} /> プロンプトをコピー</>}
          </button>
        </div>

        {isLoading && (
          <div className="ai-loading">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            <span>AIが献立を考えています...</span>
          </div>
        )}

        {result && (
          <div className="ai-result">{result}</div>
        )}

        {/* Prompt Preview */}
        <details style={{ marginTop: '16px' }}>
          <summary style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>生成プロンプトを確認</summary>
          <pre style={{ background: '#F5F5F4', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', marginTop: '8px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {prompt}
          </pre>
        </details>
      </div>
    </div>
  );
}
