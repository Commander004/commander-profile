# 🎛️ Commander Profile

یک صفحه پروفایل شخصی مدرن، کاملاً قابل تنظیم از طریق پنل Admin، سازگار با **GitHub Pages** و بدون نیاز به Backend.

طراحی Dark / Glassmorphism / Mobile-First با الهام از سایت‌های پروفایل شخصی (بدون کپی مستقیم).

---

## ✨ ویژگی‌ها

- **صفحه عمومی** (`index.html`) — پروفایل، بایو، سوشال، موزیک پلیر، متن‌های سفارشی، پس‌زمینه
- **پنل ادمین** (`admin.html`) — لاگین + داشبورد کامل
- **Live Preview** — هر تغییری همان لحظه در پیش‌نمایش دیده می‌شود
- **Publish برای عموم** با فایل `config.json` (دانلود از ادمین → آپلود در ریپو)
- **Live Preview** با localStorage (فقط برای ویرایش)
- **Export / Import JSON** برای بکاپ شخصی
- **Theme Editor** کامل (رنگ‌ها، blur، radius، presetها)
- **Background** : Solid / Gradient / Image / GIF / Video
- **Music Player** زیبا با چند ترک، استایل‌های مختلف
- **Text Blocks** قابل تنظیم با انیمیشن
- **Social Links** با آیکون و رنگ سفارشی
- **Custom CSS**
- **SEO** settings
- **Responsive** و Mobile-First
- بدون Backend — فقط HTML + CSS + Vanilla JS

---

## 📁 ساختار

```
/
├── index.html          # صفحه عمومی پروفایل
├── admin.html          # پنل ادمین + لاگین
├── config.js           # تنظیمات پیش‌فرض + Username/Password
├── config.json         # تنظیمات منتشرشده برای عموم (Publish)
├── css/
│   ├── main.css
│   └── admin.css
├── js/
│   ├── storage.js
│   ├── profile.js
│   └── admin.js
├── assets/
│   ├── image/
│   ├── music/
│   └── video/
└── README.md
```

---

## 🔐 لاگین (Password)

فایل **`config.js`** را باز کن:

```js
const ADMIN_CONFIG = {
  username: "commander",
  password: "commander123"   // ← این را عوض کن
};
```

- Username و Password پیش‌فرض: `commander` / `commander123`
- این رمز فقط Client-Side است و برای استفاده شخصی کافی است.
- بعد از Login موفق وارد داشبورد می‌شوید.
- گزینه Remember me وجود دارد.

---

## 🚀 اجرای Local

1. کل پروژه را دانلود یا Clone کن.
2. یک سرور استاتیک ساده اجرا کن (به خاطر CORS و iframe):

```bash
# با Python
python -m http.server 8080

# یا با Node (npx)
npx serve .
```

3. مرورگر را باز کن:
   - صفحه عمومی: `http://localhost:8080`
   - ادمین: `http://localhost:8080/admin.html`

> باز کردن مستقیم فایل (`file://`) ممکن است به خاطر محدودیت‌های مرورگر برای iframe و localStorage مشکل ایجاد کند. حتماً از یک HTTP server محلی استفاده کن.

---

## 📦 Deploy روی GitHub Pages

1. این ریپو را روی GitHub داشته باش (همین `commander-profile` یا ریپوی جدید).
2. به **Settings → Pages** برو.
3. Source را روی **Deploy from a branch** بگذار.
4. Branch: `main` و Folder: `/ (root)`.
5. Save کن.
6. بعد از ۱–۲ دقیقه سایت در آدرس زیر در دسترس است:

```
https://COMMANDER004.github.io/commander-profile/
```

(نام کاربری و نام ریپو را با خودت جایگزین کن)

### نکته مهم برای Subpath
اگر سایت روی مسیر فرعی است (مثل `/commander-profile/`) لینک‌های نسبی (`css/...`, `js/...`) درست کار می‌کنند چون همه نسبی هستند.

---

## 🛠️ چطور تنظیمات را تغییر بدهم؟

### ۱. ورود به ادمین
- برو به `admin.html`
- با یوزر/پسورد وارد شو

### ۲. Profile
- بخش **Profile**: آواتار (URL)، نام، بایو، لوکیشن، استاتوس، بج، شکل و اندازه آواتار، انیمیشن

### ۳. Background
- نوع را انتخاب کن (Solid / Gradient / Image / GIF / Video)
- برای Image/GIF/Video فقط **URL** وارد کن
- فایل‌ها را داخل پوشه `assets/` قرار بده یا از یک CDN/Discord/Imgur استفاده کن
- Blur، Brightness، Overlay قابل تنظیم است

### ۴. Music
- Music Player را روشن کن
- ترک جدید اضافه کن → Title، Artist، **Audio URL**، Cover
- فایل‌های mp3 را داخل `assets/music/` بگذار و مسیر نسبی یا URL کامل بده
- Style پلیر را انتخاب کن (Glass / Minimal / Floating ...)

### ۵. Text Blocks
- متن جدید اضافه کن
- فونت‌سایز، رنگ، انیمیشن (Fade / Slide / Glow / Pulse / Float)

### ۶. Social Links
- لینک‌ها را روشن/خاموش کن
- URL و رنگ و آیکون را تنظیم کن
- لینک Custom هم می‌توانی اضافه کنی

### ۷. Theme
- Preset انتخاب کن یا رنگ‌ها را دستی عوض کن
- Border Radius و Blur را اسلایدر کن

### ۸. Custom CSS
- هر CSS دلخواهی بنویس → روی صفحه عمومی اعمال می‌شود

### ۹. Save vs Publish
- **Save** → فقط روی مرورگر خودت (`localStorage`) — برای ویرایش و Preview
- **Publish** → فایل `config.json` دانلود می‌شود → آن را در ریشه ریپو بگذار و Commit کن → **همه بازدیدکننده‌ها** تنظیمات جدید را می‌بینند

---

## 🚀 Publish برای عموم (مهم)

هر بار که ظاهر سایت را برای همه تغییر دادی:

1. وارد **Admin** شو و تنظیمات را انجام بده
2. دکمه **📤 Publish** را بزن (بالای صفحه یا بخش Export)
3. فایل **`config.json`** دانلود می‌شود
4. در GitHub → ریپو → **Add file → Upload files**
5. `config.json` را در **ریشه** (کنار `index.html`) بگذار / جایگزین کن
6. **Commit changes** بزن

بعد از ۱–۲ دقیقه صفحه عمومی (`index.html`) تنظیمات جدید را از `config.json` می‌خواند.

> Live Preview داخل ادمین از localStorage استفاده می‌کند و نیازی به Publish ندارد.

---

## 📤 Export / Import (بکاپ شخصی)

- **Export**: بکاپ با نام تاریخ‌دار (آرشیو شخصی)
- **Import**: بازگرداندن تنظیمات روی همین مرورگر
- برای **عموم** همیشه از **Publish → config.json** استفاده کن

---

## ⚠️ نکات مهم

1. **رمز عبور Client-Side است** — هرکسی که سورس را ببیند می‌تواند آن را پیدا کند. برای استفاده شخصی مشکلی نیست.
2. **آپلود فایل مستقیم در GitHub Pages وجود ندارد** — فایل‌های تصویر/موزیک/ویدیو را داخل ریپو بگذار یا از URL خارجی استفاده کن.
3. **Save فقط برای خودت است** — برای عموم حتماً `config.json` را Publish و Commit کن.
4. برای Performance بهتر روی موبایل، Performance Mode را در Effects روشن کن و از ویدیوهای سنگین پرهیز کن.

---

## 👤 Author

**Commander004**  
[GitHub](https://github.com/Commander004)

---

ساخته‌شده با ❤️ برای پروفایل شخصی قابل تنظیم واقعی.
