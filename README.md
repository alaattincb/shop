# E-Ticaret Uygulaması

Modern ve kullanıcı dostu bir e-ticaret uygulaması. Angular ve Node.js teknolojileri kullanılarak geliştirilmiştir.

## Özellikler

- 🛍️ Ürün listeleme ve detay görüntüleme
- 🔍 Gelişmiş ürün arama ve filtreleme
- 🛒 Sepet yönetimi
- ❤️ Favori ürünler
- 👤 Kullanıcı hesap yönetimi
- 🔐 JWT tabanlı kimlik doğrulama
- 💳 Güvenli ödeme işlemleri
- 📱 Responsive tasarım

## Teknolojiler

### Frontend
- Angular 17
- TypeScript
- Bootstrap 5
- RxJS
- NgRx (State Management)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/shop.git
cd shop
```

2. Gerekli paketleri yükleyin:

Frontend için:
```bash
cd client
npm install
```

Backend için:
```bash
cd server
npm install
```

3. Ortam değişkenlerini ayarlayın:
- `.env.example` dosyasını `.env` olarak kopyalayın
- Gerekli değişkenleri kendi bilgilerinizle güncelleyin

4. Veritabanını başlatın:
- MongoDB'nin yüklü olduğundan emin olun
- MongoDB servisini başlatın

5. Uygulamayı çalıştırın:

Backend için:
```bash
cd server
npm run dev
```

Frontend için:
```bash
cd client
ng serve
```

## API Endpoints

### Ürünler
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Ürün detayını getir
- `POST /api/products` - Yeni ürün ekle (Admin)
- `PUT /api/products/:id` - Ürün güncelle (Admin)
- `DELETE /api/products/:id` - Ürün sil (Admin)

### Kullanıcılar
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profili

### Sepet
- `GET /api/cart` - Sepeti görüntüle
- `POST /api/cart` - Sepete ürün ekle
- `DELETE /api/cart/:id` - Sepetten ürün kaldır

### Favoriler
- `GET /api/favorites` - Favorileri listele
- `POST /api/favorites` - Favorilere ekle
- `DELETE /api/favorites/:id` - Favorilerden kaldır

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: Açıklama'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 