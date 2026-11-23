# 🌴 Antalya Yazılımcıları - Üye Projeleri Vitrin Web Sitesi

Antalya Yazılımcıları topluluğu için özel olarak hazırlanmış, üyelerin geliştirdiği projeleri tüm dünyaya tanıtan, modern, hızlı ve saf (vanilla) web teknolojileriyle geliştirilmiş vitrin web sitesi.

- **Canlı Domain:** [www.antalyayazılımcıları.com.tr](https://www.antalyayazilimcilari.com.tr)
- **Teknoloji Yığını:** Saf HTML5, CSS3 (Modern Değişkenler & Flex/Grid), Vanilla JavaScript (ES6+)
- **Sıfır Bağımlılık:** Framework yok, build/derleme adımı yok, npm paket kurulumu zorunluluğu yok.

---

## 🚀 1. Siteyi Yerelde (Local) Nasıl Çalıştırırım?

Sitede JSON dosyalarından dinamik veri okumak için modern tarayıcıların güvenlik politikaları (CORS / Same-Origin) gereği yerel bir HTTP sunucu ile çalıştırmak önerilir. Dosyaya çift tıklayarak (`file://`) açmak yerine aşağıdaki basit yöntemlerden birini kullanabilirsiniz:

### Yöntem A: Python ile (En Pratik)
Bilgisayarınızda Python yüklüyse, proje klasöründe terminal açın ve şu komutu çalıştırın:

```bash
# Python 3
python -m http.server 8000
```
Ardından tarayıcınızda açın:  
👉 **`http://localhost:8000`**

---

### Yöntem B: VS Code "Live Server" Eklentisi ile
1. Proje klasörünü Visual Studio Code ile açın.
2. Eklentiler (Extensions) bölümünden **Live Server** (Ritwick Dey) eklentisini kurun.
3. Sağ alttaki **"Go Live"** butonuna tıklayın veya `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğini seçin.

---

### Yöntem C: Node.js (npx serve) ile
Node.js yüklüyse, hiçbir şey kurmadan doğrudan çalıştırabilirsiniz:

```bash
npx serve .
```

---

## 📁 2. Dosya ve Dizin Yapısı

```text
antalya yazılımcıları sitesi/
│
├── index.html              # Ana sayfa (Hero, öne çıkan projeler, toplantı özeti)
├── projeler.html           # Tüm projeler listesi (Arama ve kategori/teknoloji filtreleri)
├── proje.html              # Proje detay sayfası (?id=... ile dinamik çalışır)
├── uyeler.html             # Topluluk üyeleri & geliştirici profilleri
├── hakkimizda.html         # Topluluk hikayesi, vizyonu, SSS ve nasıl katılınır
├── etkinlikler.html        # Haftalık toplantı bilgileri ve geçmiş workshoplar arşivi
├── iletisim.html           # İletişim formu, sosyal bağlantılar ve e-posta
│
├── css/
│   └── style.css           # Tasarım sistemi, CSS değişkenleri, koyu/açık tema, responsive
│
├── js/
│   ├── theme.js            # Koyu/Açık tema geçişi ve localStorage yönetimi
│   ├── common.js           # Mobil menü, navigasyon vurgulama, ortak kart şablonu
│   ├── home.js             # Ana sayfa öne çıkan projeler yükleyicisi
│   ├── projeler.js         # Filtreleme, anlık arama, kategori & teknoloji filtreleri
│   ├── proje-detay.js      # URL parametresine göre detay ve geliştirici eşleştirme
│   └── uyeler.js           # Üyeleri listeleme ve üye bazlı proje sayaçları
│
├── data/
│   ├── projeler.json       # Tüm projelerin tutulduğu dinamik veri tabanı
│   └── uyeler.json         # Topluluk üye profilleri
│
├── photos/                 # Orijinal logo ("Antalya Coding Community Logo.png") ve profil fotoğrafı
└── assets/
    ├── favicon.svg         # Tarayıcı sekme ikonu (ve antalya-coding-community-logo.png)
    └── images/             # Antalya Coding Community Logosu, profil fotoğrafı, proje kapakları ve görseller
```

---

## 📝 3. Yeni Proje ve Üye Nasıl Eklenir?

Sitenin mimarisi **tamamen veri odaklıdır**. Yeni bir proje veya üye eklemek için HTML dosyalarını düzenlemenize gerek **yoktur**; sadece ilgili JSON dosyasına yeni bir nesne eklemeniz yeterlidir.

### A. Yeni Proje Eklemek (`data/projeler.json`)
`data/projeler.json` dosyasını bir metin düzenleyiciyle açın ve dizinin içerisine yeni projenizi ekleyin:

```json
{
  "id": "benim-harika-projem",
  "ad": "Benim Harika Projem",
  "kisaAciklama": "Projenin kartlarda görünecek 1-2 cümlelik kısa ve etkileyici özeti.",
  "uzunAciklama": "Projenin detay sayfasında yer alacak kapsamlı tanıtımı, hikayesi, çözdüğü problem ve teknik detayları.",
  "teknolojiler": ["React", "Node.js", "PostgreSQL", "Docker"],
  "kategori": "Web Geliştirme",
  "uye": "Ahmet Yılmaz",
  "uyeId": "ahmet-yilmaz",
  "gorsel": "assets/images/projenizin-gorseli.png",
  "demoLink": "https://projeniz.com",
  "oneCikan": true,
  "olusturmaTarihi": "2026-11-18"
}
```

> **İpuçları:**
> - `id`: Benzersiz ve Türkçe karaktersiz olmalıdır (URL'de `proje.html?id=benim-harika-projem` şeklinde görünür).
> - `gorsel`: Eğer görseliniz yoksa `""` (boş) bırakabilirsiniz; sistem otomatik olarak şık bir modern kod illüstrasyonu yerleştirecektir.
> - `oneCikan`: `true` yapılırsa ana sayfadaki vitrinde gösterilir.
> - `kategori`: Eklediğiniz kategori, filtreleme menüsünde **otomatik** olarak belirecektir.
> - `teknolojiler`: Yazdığınız teknolojiler, teknoloji filtre açılır kutusuna **otomatik** eklenecektir.

---

### B. Yeni Üye Eklemek (`data/uyeler.json`)
`data/uyeler.json` dosyasını açıp yeni üye kaydı oluşturun:

```json
{
  "id": "ayse-demir",
  "ad": "Ayşe Demir",
  "unvan": "Full-Stack Developer",
  "bio": "Antalya'da yaşayan, açık kaynak projelere katkı veren yazılımcı.",
  "foto": "assets/images/uye-ayse.png",
  "linkedin": "https://www.linkedin.com/in/ceyhun-rahimov-3519a5248",
  "uzmanliklar": ["TypeScript", "Next.js", "Python"]
}
```

> `data/projeler.json` dosyasındaki `uyeId` alanı ile `data/uyeler.json` dosyasındaki `id` alanı eşleştiğinde, proje detay sayfasında üyenin profili ve "Üyenin Diğer Projeleri" bağlantısı otomatik olarak birbirine bağlanır.

---

## 🌐 4. Projeyi Yayına Alma (Deploy)

Statik dosyalardan oluştuğu için hiçbir sunucu maliyeti ödemeden ücretsiz ve hızlıca yayına alabilirsiniz:

### Seçenek 1: GitHub Pages ile Yayınlama (Önerilen)
1. GitHub üzerinde yeni bir repo oluşturun (örn: `antalya-yazilimcilari`).
2. Bilgisayarınızdaki proje klasöründe terminal açın:
   ```bash
   git init
   git add .
   git commit -m "İlk sürüm: Antalya Yazılımcıları vitrin sitesi"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/antalya-yazilimcilari.git
   git push -u origin main
   ```
3. GitHub reponuzda **Settings > Pages** sekmesine gidin.
4. **Branch** kısmından `main` ve `/ (root)` seçeneğini belirleyip **Save** butonuna tıklayın.
5. Birkaç dakika içinde siteniz `https://KULLANICI_ADINIZ.github.io/antalya-yazilimcilari/` adresinde yayında olacaktır!
6. Kendi özel alan adınız (`www.antalyayazılımcıları.com.tr`) için **Custom domain** kutusuna domain adınızı yazıp DNS CNAME kaydı yapabilirsiniz.

---

### Seçenek 2: Vercel ile Yayınlama
1. [vercel.com](https://vercel.com) adresine gidin ve GitHub hesabınızla giriş yapın.
2. **"Add New Project"** butonuna tıklayın.
3. GitHub'daki `antalya-yazilimcilari` deposunu seçin ve **"Import"** deyin.
4. Framework Preset alanını **"Other"** bırakın (derleme komutu gerekmez).
5. **"Deploy"** butonuna basın. Yaklaşık 10 saniyede global CDN üzerinde yayına girer.
6. **Project Settings > Domains** sekmesinden `www.antalyayazılımcıları.com.tr` alan adınızı ekleyebilirsiniz.

---

## 🎨 5. Tasarım Özellikleri & Özelleştirme

- **Vurgu Rengi:** `css/style.css` dosyasının en başındaki `:root` bölümünden `--color-accent` değişkenini değiştirerek sitenin tüm buton, rozet ve vurgu renklerini tek tıkla değiştirebilirsiniz.
- **Koyu / Açık Tema:** Kullanıcının tercihi `localStorage` içine kaydedilir. Sayfa yenilendiğinde veya başka bir sayfaya geçildiğinde tercih korunur.
- **Mobil Uyum (Responsive):** Mobil öncelikli (mobile-first) tasarım felsefesiyle hazırlanmıştır. Masaüstü, tablet ve mobil cihazlarda kusursuz çalışır.
- **Erişilebilirlik:** `skip-link`, anlamsal HTML5 etiketleri, ARIA etiketleri ve yüksek kontrastlı renk oranları gözetilmiştir.

---

## 💡 6. Gelecek Yol Haritası (Roadmap)
- [ ] Üye kayıt ve giriş paneli
- [ ] Etkinlik kayıt ve RSVP biletleme
- [ ] Topluluk teknik blogu
- [ ] Haftalık bülten aboneliği

---

© 2026 Antalya Yazılımcıları Topluluğu. Açık kaynak ruhuyla Akdeniz'de üretildi.
