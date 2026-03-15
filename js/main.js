// starflower - main.js

// --- ハンバーガーメニュー ---
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // ナビリンクをクリックしたら閉じる
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

// --- スクロールでヘッダーに影 ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// --- フェードインアニメーション ---
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // 複数要素がある場合、順番にフェードイン
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// --- スムーズスクロール（ハッシュリンク対応）---
document.querySelectorAll('a[href*="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    // 同ページ内のハッシュのみ対応
    if (href.startsWith('#') || (href.includes(location.pathname) && href.includes('#'))) {
      const id = href.split('#')[1];
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80; // ヘッダー分
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});
