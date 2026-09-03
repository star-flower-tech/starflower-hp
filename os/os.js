const data = {
  news: [
    ['夏季休業のお知らせ','2026/08/22','お知らせ','公開','トップ掲載'],
    ['AI導入支援サービスを開始しました','2026/08/20','サービス','公開','トップ掲載'],
    ['コーポレートサイトを公開しました','2026/08/15','お知らせ','公開','通常'],
    ['導入事例を追加予定です','2026/08/10','実績','下書き','通常']
  ],
  pages: [
    {name:'トップページ', status:'公開中', updated:'2026/08/22', memo:'ニュース表示、メインコピー、問い合わせ導線を管理。', next:'実績セクションを追加'},
    {name:'サービス', status:'公開中', updated:'2026/08/22', memo:'AI導入支援、HP制作、広告運用の説明を管理。', next:'料金例を追加'},
    {name:'会社概要', status:'公開中', updated:'2026/08/22', memo:'会社情報、代表メッセージ、所在地を管理。', next:'代表メッセージを更新'},
    {name:'お問い合わせ', status:'公開中', updated:'2026/08/22', memo:'問い合わせ先、フォーム導線、返信案内を管理。', next:'自動返信文を整理'}
  ],
  tasks: [
    ['優先','実績セクションを追加','トップページ','今週','未完了'],
    ['優先','夏季休業のお知らせを公開','ニュース','今日','進行中'],
    ['通常','サービスページに料金例を追加','サービス','来週','未完了'],
    ['通常','OGP画像を確認','設定','来週','未完了'],
    ['低','会社概要の代表メッセージ更新','会社概要','今月','未完了']
  ],
  customers: [
    ['株式会社サンライズ','取引中','HP改善・AI導入','¥770,000','2026/08/28'],
    ['株式会社ブルーム','取引中','月次サポート','¥380,000','2026/08/30'],
    ['田中工業株式会社','見込み','AI導入相談','¥280,000','2026/08/24'],
    ['株式会社グリーンフィールド','提案中','LP改善・広告運用','¥580,000','2026/08/26'],
    ['株式会社テックワン','初回接触','HP制作相談','¥520,000','2026/09/02']
  ]
};

const titles = { home:'ホーム', news:'ニュース', pages:'ページ', customers:'顧客', tasks:'更新タスク', settings:'設定' };
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

function statusClass(label) {
  if (label === '公開' || label === '公開中') return 'published';
  if (label === '下書き') return 'draft';
  if (label === '進行中') return 'progress';
  if (label === '完了') return 'done';
  return 'draft';
}

function priorityClass(label) {
  if (label === '優先') return 'red';
  if (label === '通常') return 'blue';
  return 'yellow';
}

function badge(label, color = 'blue') {
  return '<span class="badge ' + color + '">' + label + '</span>';
}

function showToast(message) {
  const toast = qs('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function tableHtml(headers, rows) {
  return '<thead><tr>' + headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + '</tr>').join('') + '</tbody>';
}

function renderNewsItem(news) {
  return '<article class="news-item"><strong>' + news[0] + '</strong><p>' + news[1] + ' / ' + news[2] + ' / ' + news[4] + '</p><span class="status ' + statusClass(news[3]) + '">' + news[3] + '</span></article>';
}

function renderHome() {
  qs('#recentNews').innerHTML = data.news.slice(0, 3).map(renderNewsItem).join('');
  qs('#pageSummary').innerHTML = tableHtml(['ページ','状態','最終更新','次にやること'], data.pages.map(p => [p.name, '<span class="status ' + statusClass(p.status) + '">' + p.status + '</span>', p.updated, p.next]));
  qs('#homeTasks').innerHTML = data.tasks.slice(0, 3).map(t => '<article class="task-item">' + badge(t[0], priorityClass(t[0])) + '<div><strong>' + t[1] + '</strong><p>' + t[2] + ' / ' + t[3] + '</p></div><span class="status ' + statusClass(t[4]) + '">' + t[4] + '</span></article>').join('');
  qs('#customerSummary').innerHTML = tableHtml(['顧客','状態','売上'], data.customers.slice(0, 4).map(c => [c[0], c[1], c[3]]));
}

function renderNews() {
  qs('#newsList').innerHTML = data.news.map(renderNewsItem).join('');
}

function renderPages() {
  qs('#pageCards').innerHTML = data.pages.map(p => '<article class="page-card"><div class="page-card-head"><div><h2>' + p.name + '</h2><p>' + p.memo + '</p></div><span class="status ' + statusClass(p.status) + '">' + p.status + '</span></div><div class="page-meta"><span>最終更新: ' + p.updated + '</span><strong>次にやること: ' + p.next + '</strong><button class="ghost-btn">更新メモを編集</button></div></article>').join('');
}

function renderTasks() {
  qs('#taskTable').innerHTML = tableHtml(['優先度','内容','対象ページ','期限','状態'], data.tasks.map(t => [badge(t[0], priorityClass(t[0])), t[1], t[2], t[3], '<span class="status ' + statusClass(t[4]) + '">' + t[4] + '</span>']));
}

function renderCustomers() {
  qs('#customerTable').innerHTML = tableHtml(['顧客名','状態','内容','売上/見込み','次回フォロー'], data.customers);
  qs('#salesSummary').innerHTML = [
    ['今月見込み', '¥1,240,000'],
    ['取引中', '2社'],
    ['提案中/見込み', '2社'],
    ['次回フォロー', '5件']
  ].map(item => '<article class="sales-item"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></article>').join('');
}

function switchView(id) {
  qsa('.view').forEach(view => view.classList.toggle('active', view.id === id));
  qsa('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === id));
  qs('#viewTitle').textContent = titles[id] || 'Star Flower CMS';
  window.scrollTo({top: 0, behavior: 'smooth'});
}

qsa('.nav-item').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
qsa('[data-jump]').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.jump)));
qs('#sitePreviewBtn').addEventListener('click', () => window.open('https://star-flower.net/', '_blank', 'noopener'));
qsa('.primary-btn, .ghost-btn').forEach(btn => {
  if (!btn.dataset.jump && btn.id !== 'sitePreviewBtn') btn.addEventListener('click', () => showToast('CMS保存機能は次フェーズで実装します'));
});

renderHome();
renderNews();
renderPages();
renderTasks();
renderCustomers();
