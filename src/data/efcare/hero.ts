// ADMIN: Edit this file to update hero slides. Requires site rebuild to apply.

export const heroSlides = [
  {
    image: { src: '/images/hero.webp', alt: 'EFCARE chăm sóc gia đình tại nhà', width: 1402, height: 1122 },
    eyebrow: 'Premium Healthcare Ecosystem',
    heading: 'Quản lý sức khỏe gia đình',
    headingAccent: 'từ nhà đến bệnh viện',
    description: 'EFCARE là nền tảng chăm sóc sức khỏe đa thế hệ kết nối công nghệ, bác sĩ, cộng đồng và gia đình trong một hệ sinh thái minh bạch, chuyên nghiệp và bền vững.',
    features: ['Hub Chăm sóc', 'App EFCARE', 'Kinh tế Đầu Bạc', 'Healthcare ESG'],
    ctaPrimary: { text: 'Đăng ký hội viên ngay', href: '/lien-he' },
    ctaSecondary: { text: 'Tìm hiểu thêm', href: '#about' },
  },
  {
    image: { src: '/images/hero-2.webp', alt: 'EFCARE AI theo dõi sức khỏe 24/7', width: 1402, height: 1122 },
    eyebrow: 'AI Healthcare Technology',
    heading: 'Theo dõi sức khỏe mọi lúc',
    headingAccent: 'AI cảnh báo 24/7',
    description: 'Thiết bị EFCARE kết hợp AI thông minh theo dõi liên tục các chỉ số sức khỏe, phát hiện bất thường và cảnh báo kịp thời — bảo vệ gia đình bạn mọi lúc, mọi nơi.',
    features: ['Theo dõi liên tục 24/7', 'AI phân tích thông minh', 'Cảnh báo kịp thời', 'Can thiệp bảo vệ an toàn'],
    ctaPrimary: { text: 'Khám phá thiết bị', href: '/cong-nghe' },
    ctaSecondary: { text: 'Xem tính năng', href: '#technology' },
  },
  {
    image: { src: '/images/hero-3.webp', alt: 'EFCARE chăm sóc chuyên sâu bệnh đặc biệt', width: 1402, height: 1122 },
    eyebrow: 'Chuyên sâu & Bền vững',
    heading: 'Chăm sóc chuyên sâu',
    headingAccent: 'dành cho bệnh đặc biệt',
    description: 'EFCARE đồng hành cùng người mắc bệnh mạn tính với giải pháp theo dõi chuyên sâu, ngăn ngừa sớm biến chứng và phục hồi bền vững — đội ngũ cộng tác viên luôn bên cạnh.',
    features: ['Theo dõi chuyên sâu', 'Ngăn ngừa sớm biến chứng', 'Phục hồi bền vững', 'Đội ngũ cộng tác viên'],
    ctaPrimary: { text: 'Tìm hiểu giải pháp', href: '/lien-he' },
    ctaSecondary: { text: 'Về chúng tôi', href: '#about' },
  },
];

// Legacy export for non-slider usage
export const hero = heroSlides[0];
