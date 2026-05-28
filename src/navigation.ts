import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Trang chủ', href: getPermalink('/') },
    { text: 'Công nghệ', href: getPermalink('/cong-nghe') },
    { text: 'Bài viết', href: getPermalink('/bai-viet') },
    { text: 'Liên hệ', href: getPermalink('/lien-he') },
  ],
  actions: [{ text: 'Hotline 0815 515 456', href: 'tel:0815515456' }],
};

export const footerData = {
  links: [
    {
      title: 'Về EFCARE',
      links: [
        { text: 'Giới thiệu', href: getPermalink('/#about') },
        { text: 'Sứ mệnh & Tầm nhìn', href: getPermalink('/#about') },
        { text: 'Ngũ Tâm', href: getPermalink('/#values') },
        { text: 'Đối tác', href: getPermalink('/#partners') },
      ],
    },
    {
      title: 'Giải pháp',
      links: [
        { text: 'Hub Chăm sóc', href: getPermalink('/#services') },
        { text: 'App EFCARE', href: getPermalink('/#app') },
        { text: 'Kinh tế Đầu Bạc', href: getPermalink('/#services') },
        { text: 'Healthcare ESG', href: getPermalink('/#services') },
        { text: 'Công nghệ', href: getPermalink('/cong-nghe') },
      ],
    },
    {
      title: 'Hỗ trợ',
      links: [
        { text: 'Câu hỏi thường gặp', href: '#' },
        { text: 'Chính sách bảo mật', href: '#' },
        { text: 'Điều khoản sử dụng', href: '#' },
        { text: 'Bài viết & Tin tức', href: getPermalink('/bai-viet') },
      ],
    },
    {
      title: 'Liên hệ',
      links: [
        { text: 'Hotline: 0815 515 456', href: 'tel:0815515456' },
        { text: 'hello@efcare.vn', href: 'mailto:hello@efcare.vn' },
        { text: 'business@efcare.vn', href: 'mailto:business@efcare.vn' },
        { text: 'Liên hệ ngay', href: getPermalink('/lien-he') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Chính sách bảo mật', href: '#' },
    { text: 'Điều khoản sử dụng', href: '#' },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://facebook.com/efcare.vn' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    &copy; 2025 <a class="text-gold underline" href="https://efcare.vn">EFCARE</a> — Công ty Cổ phần Tập đoàn Khoa học Sức khỏe. Bảo lưu mọi quyền.
  `,
};
