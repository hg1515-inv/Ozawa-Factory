// LocalStorage-based data store for OzawaFactory Customer Management

const STORAGE_KEY = 'ozawa_factory_customers';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);

// Sample data for demonstration
const SAMPLE_DATA = [
  {
    id: generateId(),
    name: '田中 美咲',
    address: '東京都世田谷区成城3-12-5',
    nearestStation: '成城学園前駅',
    kitchenType: 'gas',
    hasOven: true,
    kitchenMemo: 'ガスコンロ3口。オーブンは電気式。作業スペース広め。',
    lastVisitDate: '2026-04-10',
    createdAt: '2026-01-15',
    family: [
      { id: generateId(), name: '田中 美咲', relation: '本人', age: 35, birthday: '1991-03-15', allergies: [], tastePref: '薄味が好き。和食好み。', memo: '' },
      { id: generateId(), name: '田中 健一', relation: '夫', age: 38, birthday: '1988-07-22', allergies: ['甲殻類'], tastePref: '辛口OK。肉料理好き。', memo: '' },
      { id: generateId(), name: '田中 はな', relation: '長女', age: 5, birthday: '2021-05-10', allergies: ['卵', '乳製品'], tastePref: '甘い味付けが好き。野菜はなるべく細かく。', memo: '5月10日が誕生日' },
    ],
    events: [
      { id: generateId(), name: '結婚記念日', date: '07-22' },
      { id: generateId(), name: 'はなちゃん誕生日', date: '05-10' },
    ],
    menuHistory: [
      {
        id: generateId(),
        date: '2026-04-10',
        items: ['鯛のカルパッチョ', '鶏もも肉のローズマリーグリル', '春野菜のミネストローネ', 'いちごのパンナコッタ（卵・乳不使用）'],
        genre: 'イタリアン',
        reaction: 'パンナコッタが大好評。はなちゃんがおかわりした。鶏肉も柔らかくて好評。',
        rating: 5,
        photos: [],
        memo: '次回は和食をリクエストされた。'
      },
      {
        id: generateId(),
        date: '2026-03-05',
        items: ['筑前煮', '鮭の西京焼き', 'ほうれん草のお浸し', '豆腐ハンバーグ（はなちゃん用）'],
        genre: '和食',
        reaction: '筑前煮が少し味が濃かったかも。豆腐ハンバーグは完食。',
        rating: 4,
        photos: [],
        memo: '次回はもう少し薄味に調整。'
      }
    ]
  },
  {
    id: generateId(),
    name: '佐藤 大輔',
    address: '東京都港区白金台4-8-12',
    nearestStation: '白金台駅',
    kitchenType: 'ih',
    hasOven: false,
    kitchenMemo: 'IH 2口。オーブンなし。電子レンジはあり。作業スペースやや狭い。',
    lastVisitDate: '2026-03-20',
    createdAt: '2025-11-01',
    family: [
      { id: generateId(), name: '佐藤 大輔', relation: '本人', age: 42, birthday: '1984-11-03', allergies: ['そば'], tastePref: 'しっかりした味付けが好み。ワインに合うメニュー希望。', memo: '' },
      { id: generateId(), name: '佐藤 理恵', relation: '妻', age: 40, birthday: '1986-06-18', allergies: [], tastePref: 'フレンチが好き。パクチーNG。', memo: '' },
    ],
    events: [
      { id: generateId(), name: '結婚記念日', date: '10-15' },
    ],
    menuHistory: [
      {
        id: generateId(),
        date: '2026-03-20',
        items: ['フォアグラのテリーヌ', '牛フィレのロッシーニ風', 'トリュフリゾット', 'クレームブリュレ'],
        genre: 'フレンチ',
        reaction: 'すべて大好評。特にロッシーニ風は絶賛。',
        rating: 5,
        photos: [],
        memo: '記念日だったので特別メニュー。ワインペアリングも喜ばれた。'
      }
    ]
  },
  {
    id: generateId(),
    name: '山本 ゆかり',
    address: '神奈川県横浜市青葉区あざみ野2-1-8',
    nearestStation: 'あざみ野駅',
    kitchenType: 'gas',
    hasOven: true,
    kitchenMemo: 'ガスコンロ4口。ガスオーブンあり。業務用に近い設備。',
    lastVisitDate: '2026-05-01',
    createdAt: '2026-02-10',
    family: [
      { id: generateId(), name: '山本 ゆかり', relation: '本人', age: 55, birthday: '1971-09-28', allergies: [], tastePref: 'ヘルシー志向。糖質控えめ希望。', memo: '' },
      { id: generateId(), name: '山本 哲也', relation: '夫', age: 58, birthday: '1968-01-14', allergies: ['小麦'], tastePref: '和食中心。焼き魚好き。', memo: '血圧が高めなので塩分控えめ' },
      { id: generateId(), name: '山本 翔太', relation: '長男', age: 28, birthday: '1998-04-05', allergies: [], tastePref: 'ガッツリ系OK。何でも食べる。', memo: '月1回帰省時のみ参加' },
      { id: generateId(), name: '山本 美智子', relation: '母（義母）', age: 82, birthday: '1944-12-20', allergies: ['えび', 'かに'], tastePref: '柔らかいものが良い。刺身好き。', memo: '入れ歯あり。硬いものは避ける' },
    ],
    events: [
      { id: generateId(), name: '義母誕生日', date: '12-20' },
    ],
    menuHistory: [
      {
        id: generateId(),
        date: '2026-05-01',
        items: ['季節の刺身盛り合わせ', '鰆の幽庵焼き', '里芋の煮物', '茶碗蒸し', '赤飯（グルテンフリー）'],
        genre: '和食',
        reaction: '茶碗蒸しが義母に好評。赤飯も哲也さんが喜んだ。',
        rating: 5,
        photos: [],
        memo: '義母の体調に合わせて柔らかめの調理を心がけた。'
      }
    ]
  }
];

export function loadCustomers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    // Initialize with sample data
    saveCustomers(SAMPLE_DATA);
    return SAMPLE_DATA;
  } catch (e) {
    console.error('Error loading customers:', e);
    return [];
  }
}

export function saveCustomers(customers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('Error saving customers:', e);
  }
}

export function addCustomer(customer) {
  const customers = loadCustomers();
  const newCustomer = {
    ...customer,
    id: generateId(),
    createdAt: new Date().toISOString().split('T')[0],
    family: customer.family || [],
    events: customer.events || [],
    menuHistory: customer.menuHistory || [],
  };
  customers.unshift(newCustomer);
  saveCustomers(customers);
  return newCustomer;
}

export function updateCustomer(id, updates) {
  const customers = loadCustomers();
  const idx = customers.findIndex(c => c.id === id);
  if (idx !== -1) {
    customers[idx] = { ...customers[idx], ...updates };
    saveCustomers(customers);
    return customers[idx];
  }
  return null;
}

export function deleteCustomer(id) {
  const customers = loadCustomers();
  saveCustomers(customers.filter(c => c.id !== id));
}

export function getCustomerById(id) {
  return loadCustomers().find(c => c.id === id) || null;
}

export function searchByAllergy(allergen) {
  const customers = loadCustomers();
  return customers.filter(c =>
    c.family.some(f => f.allergies.some(a => a.includes(allergen)))
  );
}

export function getReminders() {
  const customers = loadCustomers();
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return customers.filter(c => {
    if (!c.lastVisitDate) return true;
    return new Date(c.lastVisitDate) <= oneMonthAgo;
  });
}

export function getUpcomingEvents() {
  const customers = loadCustomers();
  const now = new Date();
  const results = [];
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sixtyDaysLater = new Date(today);
  sixtyDaysLater.setDate(today.getDate() + 60);

  customers.forEach(c => {
    (c.events || []).forEach(ev => {
      const [m, d] = ev.date.split('-').map(Number);
      let evDate = new Date(today.getFullYear(), m - 1, d);
      if (evDate < today) evDate.setFullYear(evDate.getFullYear() + 1);
      
      if (evDate <= sixtyDaysLater) {
        results.push({ ...ev, customerName: c.name, customerId: c.id });
      }
    });
    (c.family || []).forEach(f => {
      if (f.birthday) {
        const [, m, d] = f.birthday.split('-').map(Number);
        let bd = new Date(today.getFullYear(), m - 1, d);
        if (bd < today) bd.setFullYear(bd.getFullYear() + 1);

        if (bd <= sixtyDaysLater) {
          results.push({ name: `${f.name}の誕生日`, date: f.birthday.slice(5), customerName: c.name, customerId: c.id });
        }
      }
    });
  });
  return results;
}

export { generateId };
