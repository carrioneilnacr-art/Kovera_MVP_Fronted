# Kovera Frontend — Documento de Handoff Técnico

> **Versión:** MVP v1.0  
> **Fecha de generación:** 11 de agosto de 2026  
> **Propósito:** Handoff completo para otra IA o desarrollador. Describe arquitectura, estado actual, pendientes y decisiones de diseño tomadas.

---

## 1. ¿Qué es el Frontend de Kovera?

El frontend de Kovera es una **Single Page Application (SPA)** que sirve dos audiencias:

1. **Tienda Pública** (`/`, `/product/:sku`, `/cart`, `/checkout`, `/login`): e-commerce orientado al cliente final con catálogo filtrable, carrito persistente, checkout y visualización de precios vs competencia.
2. **Panel Administrativo** (`/admin/*`): Dashboard con métricas, gestión de productos, órdenes, facturas de compra, proveedores y reportes con gráficos.

El sistema incluye además un **módulo de accesibilidad** (alto contraste, ajuste de tamaño de fuente) y notificaciones en tiempo real via WebSocket.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión / Notas |
|------|-----------|-----------------|
| **Framework** | React | v18.x — Hooks, Suspense, lazy loading |
| **Lenguaje** | TypeScript | v5.x — Tipado estricto en toda la app |
| **Build tool** | Vite | v5.x — HMR, proxy hacia backend, ESM nativo |
| **Routing** | React Router DOM | v6.x — Rutas declarativas, `useSearchParams` |
| **Estado global** | Zustand | v4.x — Stores ligeros para auth, cart y accesibilidad |
| **Persistencia** | Zustand + localStorage | `persist` middleware guarda auth y carrito |
| **HTTP Client** | Axios | v1.x — Instancia configurada con interceptors JWT |
| **WebSockets** | Socket.IO Client | v4.x — Conectado al gateway del backend |
| **Gráficos** | Recharts | v2.x — AreaChart, BarChart, LineChart, PieChart |
| **Iconos** | Lucide React | v0.400+ — Tree-shakeable, SVG icons |
| **Fuentes** | Google Fonts | Outfit (titulares), Inter (cuerpo) |
| **CSS** | Vanilla CSS | Design tokens vía variables CSS (`--color-*`, `--radius-*`) |
| **Proxy** | Vite dev proxy | `/api/*` → `http://localhost:3000` sin CORS en desarrollo |

---

## 3. Estructura de Directorios

```
Fronted/                          # (Nombre del directorio del proyecto)
├── src/
│   ├── main.tsx                  # Entry point: ReactDOM.createRoot
│   ├── App.tsx                   # Router raíz: rutas públicas + admin protegidas
│   ├── index.css                 # Design system completo (variables, utilidades, componentes)
│   ├── App.css                   # Estilos mínimos de la app shell
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx        # Navbar + Outlet para la tienda pública
│   │   └── AdminLayout.tsx       # Sidebar colapsable + Outlet para el panel admin
│   │
│   ├── pages/
│   │   ├── shop/
│   │   │   ├── Home.tsx          # Catálogo completo: hero, filtros, búsqueda, grid de productos
│   │   │   ├── ProductDetail.tsx # Detalle de producto: variaciones, gráfico de precios
│   │   │   ├── Cart.tsx          # Vista del carrito con resumen de compra
│   │   │   └── Checkout.tsx      # Formulario de checkout (invitado o registrado)
│   │   ├── auth/
│   │   │   └── Login.tsx         # Formulario de login, redirección por rol
│   │   └── admin/
│   │       ├── Dashboard.tsx     # KPIs, gráfico de ventas, stock crítico, órdenes recientes
│   │       ├── ProductsManager.tsx # CRUD de productos con búsqueda y soft-delete
│   │       ├── OrdersManager.tsx   # Gestión de órdenes: filtros, cambio de estado, cancelación
│   │       ├── InvoicesManager.tsx # Facturas de compra ERP (lectura)
│   │       ├── SuppliersManager.tsx # Proveedores con modal de creación
│   │       └── Reports.tsx         # Reportes: ingresos por mes, órdenes por estado, productos por categoría
│   │
│   ├── store/
│   │   ├── useAuthStore.ts       # Estado de autenticación (user, token, isAuthenticated)
│   │   ├── useCartStore.ts       # Carrito (items, addItem, removeItem, updateQty, clear)
│   │   └── useAccessibilityStore.ts # Accesibilidad (highContrast, fontSize)
│   │
│   ├── services/
│   │   └── api.ts                # Instancia Axios con baseURL '/api' e interceptor JWT
│   │
│   ├── hooks/
│   │   └── useKoveraSockets.ts   # Hook para conectar/desconectar Socket.IO
│   │
│   ├── types/
│   │   └── index.ts              # Interfaces TypeScript: Product, Category, Order, User, etc.
│   │
│   └── assets/                   # Imágenes y recursos estáticos locales
│
├── public/                        # Favicon y assets públicos
├── vite.config.ts                 # Config Vite: proxy /api, plugins React
├── tsconfig.json
└── package.json
```

---

## 4. Configuración de Vite y Proxy

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
```

**¿Por qué es crítico el proxy?**  
El frontend llama a `/api/...` (ruta relativa). Vite redirige esas peticiones al backend en el puerto 3000 sin que el navegador vea un cross-origin. Esto elimina los errores CORS en desarrollo. En producción, este rol lo cumple Nginx u otro reverse proxy.

---

## 5. Sistema de Diseño (index.css)

### Variables CSS (Design Tokens)

```css
:root {
  /* Colores */
  --color-bg: #f8fafc;                /* Fondo principal */
  --color-bg-card: #ffffff;           /* Fondos de tarjetas */
  --color-bg-subtle: #f1f5f9;         /* Fondos sutiles */
  --color-border: #e2e8f0;            /* Bordes */
  --color-text-primary: #0f172a;      /* Texto principal */
  --color-text-secondary: #475569;    /* Texto secundario */
  --color-text-muted: #94a3b8;        /* Texto suave */
  --color-primary: #2563eb;           /* Azul Kovera */
  --color-accent: #3b82f6;            /* Azul acento */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  /* Tipografía */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;
  --font-size-base: 16px;

  /* Radio */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
}
```

### Modo Alto Contraste (Accesibilidad)

Cuando `highContrast: true` en `useAccessibilityStore`, se aplica clase `.high-contrast` al `<html>`. Esto activa:
```css
.high-contrast {
  --color-bg: #000000;
  --color-bg-card: #1a1a1a;
  --color-text-primary: #ffffff;
  --color-primary: #ffff00;
  /* etc. */
}
```

### Ajuste de Tamaño de Fuente

El store `useAccessibilityStore` maneja `fontSize` (rango 14px–22px). Se aplica como `document.documentElement.style.setProperty('--font-size-base', fontSize + 'px')`.

### Clases Utilitarias Clave

| Clase | Uso |
|-------|-----|
| `.btn` | Base de botones |
| `.btn-primary` | Botón azul Kovera |
| `.btn-outline` | Botón con borde |
| `.btn-sm`, `.btn-lg` | Tamaños de botón |
| `.input` | Input de formulario |
| `.card` | Tarjeta con sombra |
| `.badge` + `.badge-success` / `.badge-warning` / etc. | Etiquetas de estado |
| `.skeleton` | Placeholder de carga animado |
| `.container` | Contenedor con max-width centrado |
| `.products-grid` | Grid responsive para tarjetas de producto |
| `.product-card` | Tarjeta de producto con hover effects |
| `.sidebar` | Sidebar del panel admin |
| `.sidebar-link` | Links del sidebar con estado activo |
| `.kpi-card` | Tarjetas de métricas del dashboard |
| `.table-wrapper` | Tabla con scroll horizontal |
| `.page-header` | Header de sección con flex |
| `.animate-fade-in` | Animación de entrada |
| `.animate-float` | Flotación suave para imágenes de producto |

---

## 6. Gestión de Estado (Zustand Stores)

### useAuthStore

```typescript
interface AuthState {
  user: User | null;     // { id, name, email, role }
  token: string | null;  // JWT Bearer token
  isAuthenticated: boolean;
  login: (user, token) => void;
  logout: () => void;
}
// Persistido en localStorage como 'kovera-auth'
```

### useCartStore

```typescript
interface CartItem {
  productId: string;
  variationId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku: string;
}
interface CartState {
  items: CartItem[];
  addItem: (item) => void;     // Suma quantity si ya existe
  removeItem: (productId) => void;
  updateQuantity: (productId, qty) => void;
  clear: () => void;
  getTotals: () => { count: number; subtotal: number };
}
// Persistido en localStorage como 'kovera-cart'
```

### useAccessibilityStore

```typescript
interface AccessibilityState {
  highContrast: boolean;
  fontSize: number;             // 14-22px
  toggleHighContrast: () => void;
  increaseFontSize: () => void;  // +2px, max 22
  decreaseFontSize: () => void;  // -2px, min 14
  resetAccessibility: () => void;
}
// Persistido en localStorage como 'kovera-a11y'
```

---

## 7. Cliente HTTP (api.ts)

```typescript
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Nota:** `withCredentials: true` permite enviar cookies. El interceptor adjunta automáticamente el JWT en cada request. No hay interceptor de respuesta para refresh tokens aún.

---

## 8. Routing (App.tsx)

```
/                    → MainLayout → Home (catálogo)
/product/:sku        → MainLayout → ProductDetail
/cart                → MainLayout → Cart
/checkout            → MainLayout → Checkout
/login               → MainLayout → Login

/admin               → ProtectedRoute(role=admin) → AdminLayout → Dashboard
/admin/products      → ProtectedRoute → AdminLayout → ProductsManager
/admin/orders        → ProtectedRoute → AdminLayout → OrdersManager
/admin/invoices      → ProtectedRoute → AdminLayout → InvoicesManager
/admin/suppliers     → ProtectedRoute → AdminLayout → SuppliersManager
/admin/reports       → ProtectedRoute → AdminLayout → Reports

*                    → Navigate to /
```

### ProtectedRoute

```typescript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};
```

Todas las páginas admin usan `React.lazy()` + `Suspense` para code splitting automático.

---

## 9. Páginas de la Tienda Pública

### Home.tsx

**Responsabilidades:**
- Hero section con estadísticas del catálogo
- Features strip (envío gratis, garantía, etc.)
- Filtro de categorías horizontalmente scrolleable (solo categorías padre: `!c.parent_id`)
- Grid de productos con paginación
- Búsqueda via `useSearchParams` (captura `?search=` de la URL)
- Loading skeleton mientras carga

**Flujo de datos:**
```
useEffect([activeCategory, searchQ]) → 
  api.get('/catalog/products', { params: { categoryId, search, page, limit } }) →
  setProducts(res.data.data) + setTotalPages(res.data.meta.totalPages)
```

**Estado local:**
```typescript
const [searchParams] = useSearchParams();
const searchQ = searchParams.get('search') || '';   // Desde URL
const [activeCategory, setActiveCategory] = useState<number | null>(null);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
```

### ProductDetail.tsx

**Responsabilidades:**
- Obtiene producto por SKU desde URL params
- Muestra variaciones clickeables (cambia precio e imagen)
- Gráfico Recharts `LineChart` de historial de precios vs competencia (últimos 30 días)
- Botón "Agregar al carrito" con feedback visual (cambia a verde 2 segundos)
- Breadcrumb de navegación
- Trust badges (garantía, original, mejor precio)

**Datos cargados en paralelo:**
```typescript
const [prodRes, histRes] = await Promise.all([
  api.get(`/catalog/products/sku/${sku}`),
  api.get(`/catalog/products/sku/${sku}/price-history`).catch(() => ({ data: [] })),
]);
```

### Cart.tsx

**Responsabilidades:**
- Lista items del carrito desde Zustand (persistido)
- Botones de +/- cantidad, eliminar item
- Cálculo de subtotal y resumen
- Botón para ir a Checkout
- Estado vacío con CTA de regreso al catálogo

### Checkout.tsx

**Responsabilidades:**
- Formulario: nombre, email, dirección de envío, notas
- Si el usuario está autenticado, pre-rellena los campos
- Validación local antes de submit
- Llama a `POST /api/orders/checkout` con los ítems del carrito
- Si éxito: limpia el carrito, muestra confirmación con número de orden
- Si falla: muestra mensaje de error (ej. stock insuficiente)

**Estructura del DTO enviado:**
```typescript
{
  items: [{ productId: string, quantity: number, variationDetails?: any }],
  guestEmail?: string,
  guestName?: string,
  shippingAddress?: string,
  notes?: string
}
```

### Login.tsx

**Flujo:**
1. POST `/api/auth/login` con `{ email, password }`
2. Respuesta: `{ accessToken, user }`
3. Llama a `useAuthStore.login(user, accessToken)`
4. Redirección: `user.role === 'admin'` → `/admin`, else → `/`

---

## 10. Panel de Administración

### Dashboard.tsx

**Datos cargados:**
```typescript
const [ordersRes, productsRes] = await Promise.all([
  api.get('/orders'),
  api.get('/catalog/products', { params: { limit: 100 } }),
]);
```

**KPIs calculados en el cliente:**
- Ingresos totales (órdenes `paid` + `shipped`)
- Total órdenes
- Productos activos
- Stock crítico (≤ 10 unidades)

**Gráficos:**
- `AreaChart` de ventas de los últimos 7 días (agrupado por fecha de la orden)
- Lista de productos en stock crítico
- Tabla de últimas 5 órdenes

### ProductsManager.tsx

- Búsqueda con formulario (submit → `api.get('/catalog/products', { params: { search } })`)
- Tabla con: imagen, SKU, nombre, categoría, precio base, stock (badge de color), estado
- Paginación
- Soft-delete via `PUT /catalog/products/:id/soft-delete`
- Link "Ver en tienda" abre el ProductDetail en nueva pestaña
- Botón "Crear producto (Swagger)" abre Swagger en nueva pestaña (temporal hasta que se implemente el form)

### OrdersManager.tsx

- Carga todas las órdenes: `GET /orders`
- Filtros por estado en pestañas (Todos / Pendiente / Pagado / Enviado / Cancelado) con conteos
- Selector de estado inline para cambiar directamente
- Botón de cancelación con confirmación
- Total de ingresos confirmados en el header
- Tabla con: ID, cliente (usuario o guest email), estado, total, fecha

### InvoicesManager.tsx

- Carga facturas: `GET /erp/invoices`
- Tabla con: número de factura, proveedor, fecha, ítems, total con IGV
- Vista expandida al hacer clic en una fila (detalle de ítems)
- **Nota:** No tiene formulario de creación en el frontend. Para crear facturas, actualmente se usa Swagger (`/api/docs`). Pendiente implementar el form.

### SuppliersManager.tsx

- Carga proveedores: `GET /erp/suppliers`
- Modal de creación con formulario (nombre empresa, email, teléfono)
- Submit llama a `POST /erp/suppliers`
- Lista en tabla simple

### Reports.tsx

**Gráficos (Recharts):**
1. `BarChart` de ingresos por mes (horizontal, órdenes `paid` + `shipped`)
2. `PieChart` donut de órdenes por estado
3. `BarChart` horizontal de productos por categoría (top 8)

Todos los datos se calculan en el cliente a partir de las mismas respuestas de `/orders` y `/catalog/products`.

---

## 11. MainLayout.tsx (Navbar)

**Funcionalidades:**
- Logo KOVERA con link al inicio
- **Búsqueda global**: `<form>` que navega a `/?search=<término>`
- Menú de usuario: si autenticado muestra avatar inicial del nombre + "Salir", si no muestra "Mi cuenta"
- Contador del carrito (número en badge)
- **Panel de accesibilidad** (botón ♿): dropdown con alto contraste, zoom +/-, reset
- Menú hamburguesa para móvil
- Sticky header (z-index: 200)

**Hook de WebSockets:**
```typescript
useKoveraSockets(); // Conecta Socket.IO en /notifications
```

---

## 12. AdminLayout.tsx (Sidebar)

**Funcionalidades:**
- Sidebar colapsable (ícono ↔ texto)
- Avatar con inicial del nombre de admin
- `NavLink` con clase `active` automática (React Router)
- Botón "Ver tienda" en el topbar (abre `/` en nueva pestaña)
- Botón de logout
- Links del menú: Dashboard, Productos, Órdenes, Facturas, Proveedores, Reportes

---

## 13. WebSockets (useKoveraSockets.ts)

```typescript
// Hook montado en MainLayout → activo en toda la tienda pública
const socket = io('http://localhost:3000', {
  path: '/socket.io',
  transports: ['websocket'],
});

socket.emit('subscribe_admin'); // Solo si es admin

socket.on('new_order', (data) => { /* Toast o notificación */ });
socket.on('low_stock', (data) => { /* Alerta de stock */ });
```

**Estado actual:** El hook conecta pero los eventos `new_order` y `low_stock` no tienen triggers activos en el backend. La conexión funciona; las notificaciones están pendientes de conectar.

---

## 14. Imágenes de Productos

Las imágenes se sirven desde el backend en `/static/uploads/webp/`:

| Archivo | Categorías que lo usan |
|---------|------------------------|
| `iphone.webp` | Celulares (general) |
| `samsung.webp` | Samsung Galaxy |
| `macbook.webp` | Laptops Apple, Impresoras |
| `laptop-gaming.webp` | Laptops Gaming, Gaming |
| `tablet.webp` | Tablets, Televisores |
| `headphones.webp` | Audio |
| `smartwatch.webp` | Smartwatches |
| `camera.webp` | Cámaras |
| `airpods.webp` | Auriculares iPhone, Accesorios |

Las imágenes son reales (generadas con IA), en formato WebP optimizado, servidas como archivos estáticos por Express via `/static/*`.

---

## 15. Tipos TypeScript (types/index.ts)

```typescript
interface Category { id: number; name: string; slug: string; parent_id?: number | null; is_active?: boolean; }
interface ProductVariation { id: number; product_id: number; attributes: Record<string, string>; price: number; stock: number; image_url?: string; }
interface Product { id: number; sku: string; name: string; description: string; is_active: boolean; created_at: string; category_id?: number; category_name?: string; category_slug?: string; base_price?: number; stock?: number; image_url?: string; variations?: ProductVariation[]; }
interface PriceHistory { recorded_date: string; recorded_price: number; competitor_name: string; }
interface Supplier { id: number; company_name: string; contact_email?: string; phone?: string; }
interface Order { id: number; user_id?: number; guest_email?: string; status: 'pending'|'paid'|'cancelled'|'shipped'; total_amount: number; created_at: string; }
interface User { id: number; name: string; email: string; role: 'admin' | 'customer'; }
```

---

## 16. Lista de Tareas

### ✅ COMPLETADO

- [x] SPA completa con React Router v6 y code splitting
- [x] Design system con variables CSS, modo claro, fuentes Google Fonts
- [x] Modo alto contraste y ajuste de tamaño de fuente (accesibilidad)
- [x] Tienda pública: catálogo, detalle de producto, carrito, checkout
- [x] Filtro de categorías funcional (llama al backend con `categoryId`)
- [x] Búsqueda funcional via `useSearchParams` (URL → API)
- [x] Paginación en el catálogo
- [x] Gráfico de historial de precios vs competencia en ProductDetail
- [x] Carrito persistente en localStorage con Zustand
- [x] Checkout funcional (invitado o autenticado, manejo de errores de stock)
- [x] Login con redirección por rol (admin → /admin, customer → /)
- [x] Panel admin protegido con `ProtectedRoute`
- [x] Dashboard con KPIs reales + gráfico de ventas (Recharts)
- [x] ProductsManager con búsqueda, paginación y soft-delete
- [x] OrdersManager con filtros por estado, cambio de estado inline, cancelación
- [x] InvoicesManager con vista de facturas del backend
- [x] SuppliersManager con modal de creación funcional
- [x] Reports con 3 gráficos (ingresos, órdenes por estado, productos por categoría)
- [x] Sidebar colapsable en AdminLayout
- [x] Header sticky con búsqueda global
- [x] Panel de accesibilidad (♿) funcional
- [x] Hook WebSocket conectado al backend
- [x] Imágenes reales en WebP desde el backend
- [x] Responsive design básico (grid auto-fit, scroll horizontal en categorías)
- [x] Loading skeletons en todas las páginas
- [x] Estados vacíos con iconos (ej. carrito vacío, sin órdenes)
- [x] Animaciones de entrada (`animate-fade-in`) y flotación de imágenes (`animate-float`)

### 🔧 PENDIENTE

- [ ] **Form de creación de productos**: `ProductsManager` actualmente redirige a Swagger. Implementar modal/form nativo en el frontend para crear y editar productos con subida de imagen.
- [ ] **Form de creación de facturas**: `InvoicesManager` solo lee. Implementar form para crear facturas de compra con ítems y selección de proveedor.
- [ ] **Edición de productos**: Agregar botón de edición en `ProductsManager` que abra un modal pre-relleno.
- [ ] **Detalle de orden para cliente**: Página en la tienda pública para que el cliente vea sus órdenes (`/my-orders`).
- [ ] **Notificaciones WebSocket en UI**: Mostrar toasts cuando llegan eventos `new_order` o `low_stock`.
- [ ] **Validación del formulario de checkout**: Actualmente solo valida que haya ítems. Agregar validación de email, dirección requerida.
- [ ] **Responsive completo mobile**: El admin panel no es totalmente responsive en pantallas pequeñas. El sidebar colapsable no tiene versión drawer/overlay para móvil.
- [ ] **Página de error 404**: La ruta `*` redirige a `/` sin mostrar nada. Crear página de error descriptiva.
- [ ] **SEO y meta tags**: Cada página debería tener `<title>` y `<meta description>` dinámicos con el producto/categoría.
- [ ] **Internacionalización**: Todos los textos están hardcodeados en español. No hay sistema i18n.
- [ ] **Dark mode**: El modo alto contraste existe pero no hay un dark mode elegante. El diseño está pensado en claro.
- [ ] **Skeleton en Admin Dashboard**: El loading del dashboard podría ser más granular (skeleton por KPI card).
- [ ] **Gestión de usuarios en Admin**: Existe el endpoint en backend pero no hay página en el frontend para listar/desactivar usuarios.
- [ ] **Refresh token / sesión expirada**: Si el JWT expira, el usuario recibe un 401 pero la UI no lo maneja elegantemente (no redirige al login automáticamente).
- [ ] **Imágenes de productos custom**: Actualmente todos los productos de una categoría comparten la misma imagen. Permitir que cada producto tenga su propia imagen al crearse.

### ❌ BUGS CONOCIDOS

- [ ] **Categorías en el catálogo**: El filtro de categorías muestra solo categorías de nivel raíz (`!c.parent_id`). Hacer clic en "Celulares" muestra solo productos con `category_id=1`, pero no incluye productos de subcategorías (Samsung Galaxy, Auriculares iPhone). Estos tienen `category_id=12` o `category_id=11`. Solución: la query del backend debe incluir también subcategorías al filtrar por padre.
- [ ] **Imagen de Televisores**: Los televisores muestran imagen de tablet (el seed asignó `tablet.webp` a `category_id=9` por error en el `imgMap`). Corregir en `seed-massive.js`.
- [ ] **Rating hardcodeado**: En `ProductDetail.tsx` las estrellas y el texto "4.8 (132 reseñas)" están hardcodeados. No hay sistema de reviews en el backend.
- [ ] **`withCredentials: true` en Axios**: No es estrictamente necesario si no se usan cookies HTTP-only. Puede causar preflight CORS en algunos servidores. Revisar si es necesario.
- [ ] **`useEffect` con dependencias faltantes**: Varios `useEffect` en páginas admin usan funciones locales como dependencias sin `useCallback`. Puede causar re-renders innecesarios en React 18 Strict Mode.

---

## 17. Cómo Ejecutar el Frontend

```bash
# Instalar dependencias
cd "d:\Kovera Proyecto mvp\Fronted"
npm install

# Modo desarrollo (requiere el backend corriendo en :3000)
npm run dev
# Disponible en: http://localhost:5173

# Build de producción
npm run build
# Genera dist/ para desplegar en servidor estático
```

**Prerrequisito:** El backend debe estar corriendo en `http://localhost:3000` para que el proxy de Vite funcione.

---

## 18. Arquitectura de Comunicación Frontend

```
Browser
  │
  ├── HTTP (Axios) → /api/* → Vite Proxy → Backend :3000/api/*
  │     └── Interceptor: adjunta JWT automáticamente
  │
  ├── Estáticos → /static/* → Vite Proxy → Backend :3000/static/*
  │     └── Imágenes WebP de productos
  │
  └── WebSocket (Socket.IO) → ws://localhost:3000
        └── Namespace: /notifications
        └── Events: subscribe_admin, new_order, low_stock

Estado
  ├── Zustand (useAuthStore) → localStorage 'kovera-auth'
  ├── Zustand (useCartStore) → localStorage 'kovera-cart'
  └── Zustand (useAccessibilityStore) → localStorage 'kovera-a11y'

Routing
  ├── React Router v6 (BrowserRouter)
  ├── Code splitting con React.lazy() por página
  └── ProtectedRoute guarda el /admin/* por rol
```

---

*Documento generado el 11/08/2026 a partir del análisis exhaustivo del código fuente en `d:\Kovera Proyecto mvp\Fronted\`*
