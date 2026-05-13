const CACHE = 'work-manager-v1';

// 安裝時快取主頁面
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./index_blank.html']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// 離線快取
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// 接收推播通知
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '工作管理中心', {
      body: data.body || '您有任務需要處理',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: data.tag || 'task-reminder',
      data: { url: './index_blank.html' }
    })
  );
});

// 點擊通知開啟網頁
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) {
        if (c.url.includes('index_blank') && 'focus' in c) return c.focus();
      }
      return clients.openWindow('./index_blank.html');
    })
  );
});

// 定時檢查任務（每天早上8點）
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_CHECK') {
    scheduleCheck();
  }
});

function scheduleCheck() {
  // 由頁面端每天呼叫，這裡處理本地通知邏輯
}
