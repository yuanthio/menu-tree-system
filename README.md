# Menu Tree System

A modern web application for managing hierarchical menu structures with full CRUD operations, built using Next.js, NestJS, and Prisma.

## 🚀 Features

- **Hierarchical Menu Management**: Create, read, update, and delete menu items with parent-child relationships
- **Tree View Interface**: Interactive tree visualization with expand/collapse functionality
- **Optimistic Updates**: Instant UI feedback for all CRUD operations
- **Cascade Delete**: Delete parent menus with automatic deletion of all children
- **Real-time Validation**: Form validation with error handling
- **Responsive Design**: Modern UI using Tailwind CSS and shadcn/ui components
- **Toast Notifications**: User-friendly feedback for all operations

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **NestJS** framework
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **PostgreSQL** database (development)
- **Class Validator** for input validation
- **Class Transformer** for data transformation

## 📁 Project Structure

```
menu-tree-system/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── modules/
│   │   │   └── menus/       # Menu module (controllers, services, repositories)
│   │   ├── app.module.ts    # Main application module
│   │   └── main.ts          # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json
├── frontend/               # Next.js frontend application
│   ├── app/
│   │   ├── menus/          # Menus page and components
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/
│   │   └── menus/          # Menu-specific components
│   ├── features/
│   │   └── menus/          # Redux slice for menus
│   ├── utils/              # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <https://github.com/yuanthio/menu-tree-system>
cd menu-tree-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npx prisma db seed
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Backend (Development)
```bash
# In backend directory
npm run start:dev
```
The backend will start on `http://localhost:4000`

#### Frontend (Development)
```bash
# In frontend directory
npm run dev
```
The frontend will start on `http://localhost:3000`

### Production Mode

#### Backend (Production)
```bash
# In backend directory
# Build the application
npm run build

# Start production server
npm run start:prod
```

#### Frontend (Production)
```bash
# In frontend directory
# Build the application
npm run build

# Start production server
npm start
```

## 📡 API Documentation

### Base URL
- Development: `http://localhost:4000`
- Production: `http://localhost:4000`

### Endpoints

#### Menus API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/menus` | Get all menus with hierarchical structure |
| `POST` | `/menus` | Create a new menu |
| `GET` | `/menus/:id` | Get a specific menu by ID |
| `PATCH` | `/menus/:id` | Update an existing menu |
| `DELETE` | `/menus/:id` | Delete a menu (cascade delete) |
| `PATCH` | `/menus/:id/move` | Move a menu to a different parent |
| `PATCH` | `/menus/reorder` | Reorder menus at the same level |

### Request/Response Examples

#### Get All Menus
```http
GET /menus
```

**Response:**
```json
{
  "success": true,
  "message": "Menus retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Dashboard",
      "parentId": null,
      "order": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "children": [
        {
          "id": 2,
          "name": "Analytics",
          "parentId": 1,
          "order": 0,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "children": []
        }
      ]
    }
  ]
}
```

#### Get Menu by ID
```http
GET /menus/1
```

**Response:**
```json
{
  "success": true,
  "message": "Menu retrieved successfully",
  "data": {
    "id": 1,
    "name": "Dashboard",
    "parentId": null,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

#### Create Menu
```http
POST /menus
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Menu",
  "parentId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu created successfully",
  "data": {
    "id": 3,
    "name": "New Menu",
    "parentId": 1,
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

#### Create Root Menu
```http
POST /menus
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Settings"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu created successfully",
  "data": {
    "id": 4,
    "name": "Settings",
    "parentId": null,
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

#### Update Menu
```http
PATCH /menus/1
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Dashboard Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Dashboard Name",
    "parentId": null,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

#### Delete Menu
```http
DELETE /menus/1
```

**Response:**
```json
{
  "success": true,
  "message": "Menu deleted successfully"
}
```

#### Move Menu
```http
PATCH /menus/2/move
Content-Type: application/json
```

**Request Body:**
```json
{
  "newParentId": 4,
  "newOrder": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu moved successfully",
  "data": {
    "id": 2,
    "name": "Analytics",
    "parentId": 4,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

#### Move Menu to Root
```http
PATCH /menus/2/move
Content-Type: application/json
```

**Request Body:**
```json
{
  "newOrder": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu moved successfully",
  "data": {
    "id": 2,
    "name": "Analytics",
    "parentId": null,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

#### Reorder Menu
```http
PATCH /menus/2/reorder
Content-Type: application/json
```

**Request Body:**
```json
{
  "order": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu reordered successfully",
  "data": {
    "id": 2,
    "name": "Analytics",
    "parentId": 1,
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "children": []
  }
}
```

### Validation Rules

#### Create/Update Menu
- `name`: Required, string, max 100 characters
- `parentId`: Optional, integer, minimum 0

#### Move Menu
- `newParentId`: Optional, integer, minimum 1
- `newOrder`: Required, integer, minimum 0

#### Reorder Menu
- `order`: Required, integer, minimum 0

## 🎯 How to Use

1. **Access the Application**: Open `http://localhost:3000` in your browser

2. **Add Root Menu**: Click the "Add Root Menu" button to create a top-level menu

3. **Add Child Menu**: Hover over any menu and click the blue (+) button to add a child menu

4. **Edit Menu**: Hover over any menu and click the green (✏️) button to edit the menu name

5. **Delete Menu**: Hover over any menu and click the red (🗑️) button to delete
   - **Note**: Deleting a parent menu will automatically delete all its children (cascade delete)

6. **Navigate Tree**: Click the arrow (▶️) next to menus with children to expand/collapse

## 🔧 Architecture Decisions

### Frontend Architecture
- **Redux Toolkit**: Chosen for predictable state management and excellent DevTools support
- **Optimistic Updates**: Implemented for instant user feedback during CRUD operations
- **Component-based Architecture**: Reusable components with clear separation of concerns
- **TypeScript**: Ensures type safety and better developer experience

### Backend Architecture
- **NestJS**: Provides a robust, scalable architecture with dependency injection
- **Prisma ORM**: Type-safe database access with excellent migration support
- **Service Layer Pattern**: Separates business logic from controllers
- **Repository Pattern**: Abstracts database operations for better testability

### Database Design
- **Self-referencing Relationship**: Menu table references itself for parent-child relationships
- **Order Field**: Maintains menu order at each level
- **Cascade Delete**: Ensures data integrity when deleting parent menus

## 🎨 UI/UX Features

- **Hover Actions**: Action buttons appear on hover for cleaner interface
- **Color-coded Actions**: 
  - Blue (+) for Add
  - Green (✏️) for Edit  
  - Red (🗑️) for Delete
- **Toast Notifications**: Success/error feedback for all operations
- **Loading States**: Visual feedback during async operations
- **Responsive Design**: Works seamlessly on desktop and mobile

### Development Tips

- Use Redux DevTools to debug state changes
- Check browser console for any JavaScript errors
- Use Prisma Studio (`npx prisma studio`) to inspect database data
