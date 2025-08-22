# WhatsAppIn - Aplikasi Manajemen WhatsApp Business

Aplikasi web untuk mengelola percakapan WhatsApp Business dengan fitur multi-workspace, assignment conversation, dan notifikasi real-time.

## 🚀 Fitur Utama

- **Multi-Workspace**: Kelola beberapa workspace dalam satu aplikasi
- **WhatsApp Business Integration**: Koneksi dengan WhatsApp Business API
- **Assignment System**: Assign percakapan ke karyawan tertentu
- **Real-time Notifications**: Notifikasi real-time untuk percakapan baru
- **Role Management**: Sistem role admin dan karyawan
- **Team Invitations**: Undang anggota tim ke workspace

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI + Tailwind CSS
- **Email**: Resend

## 📋 Prerequisites

Pastikan Anda telah menginstall:
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- MySQL Server

## 🚀 Setup dan Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd etalas-bsp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

#### Buat Database MySQL

Buat database baru dengan nama `whatsappin`:

```sql
CREATE DATABASE whatsappin;
```

#### Setup Environment Variables

Buat file `.env` di root directory:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:

```env
DATABASE_URL="mysql://root:@localhost:3306/whatsappinaja"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="J9fK3mN8qR2sT6vY9zA1bC4dE7gH0jK3mN6pQ9sT2vY5zA8bC1dE4gH7jK0mN3pQ"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="EAAbyFR8BZAVsBPKZAPRNoMkrtAYM9dOKtMvPy3LU94jQDwfQKljpn5yLGsb6LypLq0Wj0QYRpZACscCRPVIkhYURXJ7tqq3mMqh0GElZAltsiGIhouuAGz4nrH4WkS8xzMG19gWa8V2ZAEH8UNhBeO0YVzTuHoJOfp4ZAf6T7skWF30BZAZAX1zEXh006x71goBwZCeBmhZCrSNZCJhJiAfwPy5WHmXSJXhem1RQZAhpYFLJbQZDZD"
```

### 4. Database Migration

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Jalankan Migration

```bash
npx prisma db push
```

Atau jika Anda ingin menggunakan migration files:

```bash
npx prisma migrate dev --name init
```

#### Seed Database dengan Data Default

Jalankan seeder untuk membuat data percakapan default:

```bash
npm run db:seed
```

Atau jika ingin reset database dan seed ulang:

```bash
npm run db:reset
```

Atau setup database dari awal dengan seed:

```bash
npm run db:setup
```

**Data yang akan dibuat:**
- 1 Admin user (admin@whatsappin.com / admin123)
- 1 Workspace default
- 5 Percakapan dengan pesan-pesan realistis
- Notifikasi default

### 5. Jalankan Aplikasi

#### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

#### Production Mode

```bash
npm run build
npm start
```

## 🗃️ Database Schema

Aplikasi menggunakan beberapa tabel utama:

- **User**: Data pengguna dengan role admin/karyawan
- **Workspace**: Workspace untuk organisasi
- **WhatsAppConnection**: Koneksi ke WhatsApp Business
- **Conversation**: Percakapan dengan customer
- **Message**: Pesan dalam percakapan
- **Notification**: Notifikasi untuk pengguna
- **Invitation**: Undangan anggota tim

## 📝 Available Scripts

```bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm start

# Linting
npm run lint

# Generate Prisma client (otomatis dijalankan setelah npm install)
npm run postinstall

# Database seeding
npm run db:seed          # Jalankan seeder
npm run db:reset         # Reset database dan seed ulang
npm run db:setup         # Setup database dari awal dengan seed
```

## 🔧 Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database tanpa migration files
npx prisma db push

# Buat dan jalankan migration
npx prisma migrate dev --name migration-name

# Reset database (HATI-HATI: akan menghapus semua data)
npx prisma migrate reset

# Lihat database di browser
npx prisma studio

# Deploy migration ke production
npx prisma migrate deploy

# Check status migration
npx prisma migrate status
```

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | URL koneksi MySQL | ✅ |
| `NEXTAUTH_URL` | URL aplikasi | ✅ |
| `NEXTAUTH_SECRET` | Secret key untuk NextAuth | ✅ |
| `RESEND_API_KEY` | API key untuk email service | ✅ |
| `FROM_EMAIL` | Email pengirim | ✅ |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Business access token | ❌ |
| `WHATSAPP_VERIFY_TOKEN` | WhatsApp webhook verify token | ❌ |

## 🔐 Authentication

Aplikasi menggunakan NextAuth.js dengan custom credentials provider. Pengguna dapat:
- Register akun baru
- Login dengan email/password
- Role-based access (admin/karyawan)

## 📱 WhatsApp Integration

Untuk mengintegrasikan dengan WhatsApp Business API:

1. Daftar di Meta for Developers
2. Buat WhatsApp Business app
3. Dapatkan access token dan phone number ID
4. Setup webhook endpoint: `/api/whatsapp/webhook`
5. Tambahkan koneksi melalui dashboard admin

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

1. Build aplikasi: `npm run build`
2. Setup MySQL database di server
3. Set environment variables
4. Jalankan migration: `npx prisma migrate deploy`
5. Start aplikasi: `npm start`

## 🤝 Contributing

1. Fork repository
2. Buat branch feature: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push ke branch: `git push origin feature/amazing-feature`
5. Buat Pull Request

## 📄 License

[MIT License](LICENSE)

## 🆘 Troubleshooting

### Database Connection Error

```bash
# Check MySQL service
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Prisma Client Error

```bash
# Regenerate Prisma client
npx prisma generate

# Reset dan migrate ulang
npx prisma migrate reset
npx prisma migrate dev
```

### Build Error

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 📞 Support

Jika mengalami masalah, silakan:
1. Check dokumentasi di atas
2. Buat issue di GitHub
3. Contact tim development

---

**Happy Coding! 🎉**
