# Menu Tree System - Backend

Aplikasi backend untuk sistem menu hierarki (tree) menggunakan NestJS dan Prisma.

## 🚀 Fitur

- **RESTful API** untuk manajemen menu tree
- **Struktur Hierarki** dengan relasi parent-child
- **Validasi Input** dengan class-validator
- **Error Handling** yang komprehensif
- **Database** PostgreSQL dengan Prisma ORM
- **TypeScript** untuk type safety

## 📋 API Endpoints

### Menu Management
- `GET /menus` - Mendapatkan semua menu (struktur tree)
- `GET /menus/:id` - Mendapatkan menu berdasarkan ID
- `POST /menus` - Membuat menu baru
- `PATCH /menus/:id` - Mengupdate menu
- `DELETE /menus/:id` - Menghapus menu (beserta child-nya)

### Bonus Features
- `PATCH /menus/:id/move` - Memindahkan menu ke parent berbeda
- `PATCH /menus/:id/reorder` - Mengubah urutan menu

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: class-validator
- **Architecture**: Modular dengan Service-Repository Pattern

## 📦 Instalasi

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm atau yarn

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd menu-tree-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional packages**
   ```bash
   npm install class-validator class-transformer @nestjs/mapped-types
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/menu_tree_db"
   PORT=3000
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Run database migration**
   ```bash
   npx prisma migrate dev --name init
   ```

7. **Start development server**
   ```bash
   npm run start:dev
   ```

Server akan berjalan di `http://localhost:3000`

## 🏗️ Struktur Proyek

```
src/
├── main.ts                    # Entry point aplikasi
├── app.module.ts              # Root module
├── common/                    # Komponen reusable
│   ├── filters/              # Exception filters
│   ├── interceptors/         # Interceptors
│   ├── decorators/           # Custom decorators
│   └── exceptions/           # Custom exceptions
├── config/                   # Konfigurasi aplikasi
│   └── database.config.ts   # Database configuration
├── prisma/                   # Prisma setup
│   ├── prisma.service.ts     # Prisma client service
│   └── prisma.module.ts      # Prisma module
└── modules/                  # Feature modules
    └── menus/               # Menu module
        ├── controllers/     # HTTP controllers
        ├── services/        # Business logic
        ├── repositories/    # Database access
        ├── dto/            # Data transfer objects
        ├── entities/        # Entity definitions
        └── menus.module.ts  # Module configuration
```

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 📝 Contoh Penggunaan API

### Create Menu
```bash
curl -X POST http://localhost:3000/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dashboard",
    "url": "/dashboard",
    "icon": "home",
    "order": 0
  }'
```

### Create Child Menu
```bash
curl -X POST http://localhost:3000/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Management",
    "url": "/dashboard/users",
    "icon": "users",
    "parentId": 1,
    "order": 0
  }'
```

### Get All Menus (Tree Structure)
```bash
curl http://localhost:3000/menus
```

### Move Menu
```bash
curl -X PATCH http://localhost:3000/menus/2/move \
  -H "Content-Type: application/json" \
  -d '{
    "newParentId": null,
    "newOrder": 1
  }'
```

## 🔧 Development Commands

```bash
# Development
npm run start:dev          # Start dengan hot-reload
npm run start:debug        # Start dengan debug mode

# Build
npm run build              # Build untuk production
npm run start:prod         # Start production build

# Linting & Formatting
npm run lint               # ESLint
npm run format             # Prettier

# Database
npx prisma studio          # Buka Prisma Studio
npx prisma migrate dev      # Create migration
npx prisma generate         # Generate client
```

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Project ini dibuat untuk keperluan technical test.

## 🔍 Arsitektur & Keputusan

### Mengapa NestJS?
- **Modular**: Memudahkan scaling dan maintenance
- **TypeScript**: Type safety dan developer experience
- **Dependency Injection**: Clean architecture
- **Ecosystem**: Rich ecosystem dengan banyak packages

### Mengapa Prisma?
- **Type Safety**: Auto-generated types
- **Modern**: Clean API dan performa tinggi
- **Migration**: Built-in migration system
- **Studio**: Visual database browser

### Service-Repository Pattern
- **Separation of Concerns**: Logic terpisah dari data access
- **Testability**: Mudah untuk unit testing
- **Maintainability**: Kode lebih organized dan readable
