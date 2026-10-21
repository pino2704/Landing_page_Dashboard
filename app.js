'use strict';

const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

function closeMenu(returnFocus) {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Mở menu');
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  mobileMenu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileMenu.hidden) closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!mobileMenu.hidden && !event.target.closest('.site-header')) closeMenu(false);
});
window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu(false);
});

function animateState(element) {
  element.classList.remove('state-enter');
  requestAnimationFrame(() => element.classList.add('state-enter'));
}

const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  animateState(document.getElementById(tab.getAttribute('aria-controls')));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    if (link.dataset.feature) selectTab(document.getElementById(link.dataset.feature));
    if (!mobileMenu.hidden) closeMenu(false);
    const destination = document.querySelector(link.getAttribute('href'));
    if (destination) destination.focus({ preventScroll: true });
  });
});

document.querySelectorAll('[data-gallery-image]').forEach((control) => {
  control.addEventListener('click', () => {
    const gallery = control.closest('.feature-gallery');
    const screenshot = gallery.querySelector('[data-lightbox]');
    const img = screenshot.querySelector('img');
    img.src = control.dataset.galleryImage;
    img.alt = control.dataset.alt;
    img.width = Number(control.dataset.width);
    img.height = Number(control.dataset.height);
    screenshot.dataset.caption = control.dataset.caption;
    screenshot.setAttribute('aria-label', 'Phóng to: ' + control.textContent.trim());
    gallery.querySelector('.window-label').textContent = control.dataset.title;
    gallery.querySelector('.gallery-caption-text').textContent = control.dataset.caption;
    gallery.querySelectorAll('[data-gallery-image]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === control));
    });
    animateState(screenshot);
  });
});

const walkSteps = [
  {
    image: 'Real_System/DB_WEB_01_accreditation_overview.png', width: 1918, height: 1070,
    title: 'Chọn phạm vi dữ liệu',
    description: 'Lọc theo giai đoạn hoặc năm.',
    context: 'Ảnh tổng quan: giai đoạn từ năm 2026 trở về trước, ngưỡng sắp hết hiệu lực 12 tháng.',
    alt: 'Tổng quan kiểm định với bộ chọn giai đoạn và các góc nhìn thời gian.'
  },
  {
    image: 'Real_System/DB_WEB_06_alerts.png', width: 1876, height: 916,
    title: 'Nhận diện mốc hết hiệu lực',
    description: 'Ảnh dùng ngưỡng 24 tháng; bước 1 dùng 12 tháng.',
    context: 'Ảnh minh họa riêng dùng ngưỡng 24 tháng và hiển thị 15 GCN. Khác với ngưỡng 12 tháng ở ảnh bước 1; đây không phải kết quả cùng một bộ lọc.',
    alt: 'Danh sách giấy chứng nhận sắp hết hiệu lực, ngưỡng cảnh báo 24 tháng.'
  },
  {
    image: 'Real_System/DB_WEB_03_program_detail.png', width: 1868, height: 917,
    title: 'Đối chiếu hồ sơ chứng nhận',
    description: 'Minh họa riêng: danh sách AUN-QA.',
    context: 'Ảnh là danh sách minh chứng chứng nhận AUN-QA, không phải hồ sơ chi tiết của một chương trình trong danh sách cảnh báo ở bước 2.',
    alt: 'Danh sách minh chứng chứng nhận AUN-QA với tên chương trình và thời hạn.'
  },
  {
    image: 'Real_System/DB_WEB_06_alerts.png', width: 1876, height: 916,
    title: 'Chủ động lập kế hoạch',
    description: 'Đơn vị chuyên môn lập kế hoạch từ dữ liệu tra cứu.',
    context: 'Dashboard cung cấp thông tin hỗ trợ. Việc lập và triển khai kế hoạch do đơn vị chuyên môn thực hiện, không được tự động hóa trong walkthrough này.',
    alt: 'Các mốc hết hiệu lực trong danh sách chứng nhận để đơn vị đối chiếu và lập kế hoạch.'
  }
];
const walkControls = Array.from(document.querySelectorAll('[data-walk-step]'));
const walkPanel = document.querySelector('#walk-panel');
function selectWalkStep(index) {
  const step = walkSteps[index];
  walkControls.forEach((control, controlIndex) => control.setAttribute('aria-pressed', String(index === controlIndex)));
  const img = walkPanel.querySelector('img');
  img.src = step.image;
  img.alt = step.alt;
  img.width = step.width;
  img.height = step.height;
  walkPanel.querySelector('[data-lightbox]').dataset.caption = step.context;
  walkPanel.querySelector('[data-lightbox]').setAttribute('aria-label', 'Phóng to: ' + step.title);
  document.querySelector('#walk-title').textContent = step.title;
  document.querySelector('#walk-description').textContent = step.description;
  document.querySelector('#walk-context').textContent = step.context;
  document.querySelector('#walk-number').textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#walk-window-label').textContent = 'Bước ' + (index + 1) + ' / 4 · Giao diện thực tế';
  animateState(walkPanel);
}
walkControls.forEach((control, index) => control.addEventListener('click', () => selectWalkStep(index)));

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxBody = document.querySelector('#lightbox-body');
const zoomButton = document.querySelector('#lightbox-zoom');
let lightboxTrigger;
document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    lightboxTrigger = trigger;
    const source = trigger.querySelector('img');
    lightboxImage.src = source.getAttribute('src');
    lightboxImage.alt = source.alt;
    lightboxImage.width = source.naturalWidth;
    lightboxImage.height = source.naturalHeight;
    document.querySelector('#lightbox-title').textContent = trigger.querySelector('.window-label').textContent;
    document.querySelector('#lightbox-caption').textContent = trigger.dataset.caption;
    lightboxBody.classList.remove('actual-size');
    zoomButton.setAttribute('aria-pressed', 'false');
    zoomButton.textContent = 'Xem 100%';
    lightbox.showModal();
    document.body.classList.add('dialog-open');
    lightboxBody.scrollTo(0, 0);
    document.querySelector('#lightbox-close').focus();
  });
});
document.querySelector('#lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  const bounds = lightbox.getBoundingClientRect();
  if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lightboxTrigger?.focus({ preventScroll: true });
});
zoomButton.addEventListener('click', () => {
  const expanded = lightboxBody.classList.toggle('actual-size');
  zoomButton.setAttribute('aria-pressed', String(expanded));
  zoomButton.textContent = expanded ? 'Vừa khung' : 'Xem 100%';
});
