import AccessibilityWidgetFrame from './AccessibilityWidgetFrame';

const quickLinks = ['افتح حساباً', 'حوّل الأموال', 'ابحث عن فرع', 'تواصل معنا'];

const services = [
  { title: 'الحسابات الجارية', text: 'خدمات مصرفية يومية بدون رسوم شهرية مع إشعارات فورية.' },
  { title: 'الادخار', text: 'نمِّ أموالك بعوائد تنافسية وشروط مرنة.' },
  { title: 'البطاقات', text: 'بطاقات خصم وبطاقات ائتمانية بمزايا السفر ومدفوعات آمنة عبر الإنترنت.' },
  { title: 'التمويل العقاري', text: 'موّل منزلك الجديد بدفعات شهرية واضحة وشفافة.' },
];

const footerColumns = [
  { title: 'الأفراد', links: ['الحسابات', 'البطاقات', 'الادخار', 'التمويل'] },
  { title: 'الأعمال', links: ['حسابات الأعمال', 'الرواتب', 'الخدمات التجارية'] },
  { title: 'الدعم', links: ['مركز المساعدة', 'الأمان', 'الفروع وأجهزة الصراف', 'إمكانية الوصول'] },
];

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        انتقل إلى المحتوى الرئيسي
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#" aria-label="بنك الروضة - الصفحة الرئيسية">
            <span className="logo-mark" aria-hidden="true">ر</span>
            بنك الروضة
          </a>
          <nav aria-label="القائمة الرئيسية" className="main-nav">
            <ul className="nav-list">
              <li><a href="#">الأفراد</a></li>
              <li><a href="#">الأعمال</a></li>
              <li><a href="#">البطاقات</a></li>
              <li><a href="#">التمويل</a></li>
              <li><a href="#">المساعدة</a></li>
            </ul>
          </nav>
          <a className="button button-outline header-login" href="#">تسجيل الدخول</a>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-text">
              <p className="eyebrow">الخدمات المصرفية للأفراد</p>
              <h1>خدمات مصرفية تناسب الجميع</h1>
              <p>
                أدر أموالك وادفع فواتيرك وادّخر لمستقبلك عبر الإنترنت أو في الفرع.
                هذا موقع بنك تجريبي لإثبات مفهوم خدمة المساعدة لذوي الإعاقة.
              </p>
              <div className="hero-actions">
                <a className="button button-light" href="#">افتح حساباً</a>
                <a className="button button-ghost" href="#">استكشف المنتجات</a>
              </div>
            </div>
            <div className="hero-card" aria-hidden="true">
              <span className="hero-card-chip" />
              <span className="hero-card-number" dir="ltr">•••• •••• •••• 4821</span>
              <span className="hero-card-name">بنك الروضة</span>
            </div>
          </div>
        </section>

        <section className="container quick-links" aria-label="روابط سريعة">
          <ul>
            {quickLinks.map((link) => (
              <li key={link}><a href="#">{link}</a></li>
            ))}
          </ul>
        </section>

        <section className="container section" aria-labelledby="services-heading">
          <h2 id="services-heading">خدماتنا</h2>
          <ul className="card-grid">
            {services.map((service) => (
              <li key={service.title} className="card">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#" className="card-link">اعرف المزيد<span className="visually-hidden"> عن {service.title}</span></a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section section-muted" aria-labelledby="inclusive-heading">
          <div className="container split">
            <div>
              <h2 id="inclusive-heading">المساعدة عندما تحتاجها</h2>
              <p>
                يمكن للعملاء من ذوي الإعاقة طلب المساعدة من موظف الدعم مع مترجم في مكالمة فيديو
                واحدة. استخدم زر المساعدة في أسفل الشاشة. لا يلزم تسجيل الدخول.
              </p>
            </div>
            <div>
              <h2>الأمان أولاً</h2>
              <p>
                لن نطلب منك أبداً كلمة المرور أو رمز التحقق عبر الهاتف أو البريد الإلكتروني أو
                المحادثة. تعرّف على طرق حماية نفسك من الاحتيال في مركز الأمان.
              </p>
            </div>
          </div>
        </section>

        <section className="container section" aria-labelledby="news-heading">
          <h2 id="news-heading">الأخبار والمستجدات</h2>
          <div className="news-list">
            <article className="news-item">
              <h3>تجربة جديدة لتطبيق الجوال</h3>
              <p>تحويلات أسرع وتحكم بالبطاقات وشاشة رئيسية أبسط.</p>
            </article>
            <article className="news-item">
              <h3>ساعات عمل ممتدة للفروع</h3>
              <p>فروع مختارة تفتح الآن حتى الساعة 8 مساءً في أيام الأسبوع.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="footer-title">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container footer-bottom">
          © {new Date().getFullYear()} بنك الروضة. بنك وهمي لأغراض العرض فقط.
        </div>
      </footer>

      <AccessibilityWidgetFrame />
    </>
  );
}
