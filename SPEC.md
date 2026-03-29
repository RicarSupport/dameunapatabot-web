# SPEC.md — Dame una Pata Web

## 1. Concept & Vision

Portal web para Dame una Pata Paraguay que permite recibir solicitudes de adopción, donaciones, voluntariado y hogares temporales a través de formularios online. El bot de WhatsApp envía links a estos formularios en lugar de documentos .docx que se pierden en el chat. La ONG gestiona las respuestas desde un dashboard privado con aprobación/rechazo.

**Meta:** Que ninguna solicitud se pierda, que sea fácil de completar (mobile-first), y que la ONG tenga control total sobre el proceso.

## 2. Design Language

### Aesthetic Direction
- Warm, friendly, animal-friendly — inspirado en páginas de ONGs de animales como ASPCA o Petfinder
- Fotos de mascotas reales como heroes
- Paleta cálida con acentos de esperanza (verde/corazón)

### Color Palette
```
--primary: #2D7D46      /* Verde — esperanza, vida */
--primary-light: #4A9D63
--secondary: #F4A261    /* Naranja cálido — energía */
--accent: #E76F51       /* Coral — urgencia, amor */
--background: #FDF8F4   /* Crema suave */
--surface: #FFFFFF
--text: #1A1A1A
--text-muted: #6B7280
--success: #10B981
--warning: #F59E0B
--error: #EF4444
```

### Typography
- **Headings:** Poppins (600, 700)
- **Body:** Inter (400, 500)

### Spatial System
- Base unit: 4px
- Sections: 80px padding vertical
- Cards: 24px padding, 12px border-radius
- Mobile-first breakpoints: sm(640), md(768), lg(1024)

## 3. Layout & Structure

### Public Pages
```
/                          → Homepage con CTA
/adoptar                   → Formulario de adopción
/dar-adopcion              → Formulario para dar en adopción
/hogar-temporal            → Formulario hogar temporal
/donaciones                → Info y form de donaciones
/voluntario                → Formulario de voluntariado
/gracias                   → Página post-submit
/estado/[token]            → Tracking de estado de solicitud
```

### Admin Dashboard
```
/admin                     → Login
/admin/dashboard           → Lista de solicitudes
/admin/solicitud/[id]      → Detalle de solicitud
```

### Responsive Strategy
- Mobile-first (el 80% del tráfico viene de WhatsApp)
- Stack vertical en mobile, grid en desktop
- Touch-friendly inputs (min 44px tap targets)

## 4. Features & Interactions

### Formularios

#### Adopción
Campos:
- Nombre completo *
- Teléfono/WhatsApp *
- Email
- Tipo de vivienda (casa/depto/otro) *
- ¿Tenés patio? (Sí/No) *
- ¿Mascotas actuales? (Sí/No + cuáles)
- ¿Niños en casa? (Sí/No + edades)
- ¿Horario de trabajo? (horas fuera de casa)
- Mascota de interés *
- ¿Por qué querés adoptar? *
- Fotos de la vivienda (upload, multiple)

#### Dar en Adopción
Campos:
- Nombre *
- Teléfono *
- Tipo de animal *
- Raza (si se conoce)
- Edad aproximada
- Sexo *
- Descripción
- Fotos (upload)
- Estado de salud/vacunas

#### Hogar Temporal
Campos:
- Nombre *
- Teléfono *
- Tipo de vivienda *
- ¿Mascotas propias? (Sí/No)
- ¿Niños? (Sí/No)
- Disponibilidad (qué fechas)
- Experiencia previa con mascotas

#### Voluntariado
Campos:
- Nombre *
- Teléfono *
- Email *
- Áreas de interés (transporte, foster, eventos, redes)
- Disponibilidad horaria
- Experiencia

### Estados de Solicitud
```
pending    → Nueva, sin revisar
approved   → Aprobada, contactar usuario
rejected   → Rechazada con motivo
```

### Interacciones
- **Submit:** Validación client + server, guarda en DB, genera token único, muestra página de gracias
- **Admin approve/reject:** Solo admin logueado, requiere motivo si es reject, envía notificación por email (futuro)
- **Tracking:** Usuario puede ver estado con su token

### Edge Cases
- Form vacío → mostrar error
- Upload muy grande → reject con mensaje
- Token no existe → 404
- Double submit → idempotency via token

## 5. Component Inventory

### Public Components
- `Navbar` — Logo + links + botón WhatsApp
- `HeroSection` — Imagen de mascotas + headline + CTA
- `FormCard` — Card con título, descripción, botón
- `AdoptionForm` — Multi-step form (datos → vivienda → mascota → submit)
- `FileUpload` — Drag/drop con preview
- `StatusTracker` — Muestra estado actual de solicitud
- `Footer` — Links, redes sociales

### Admin Components
- `AdminLogin` — Email + password
- `RequestTable` — Lista con filtros (tipo, estado, fecha)
- `RequestCard` — Preview de solicitud
- `RequestDetail` — Formulario completo con acciones
- `StatusBadge` — Colored badge (pending/approved/rejected)
- `ConfirmModal` — Para aprobar/rechazar

### States
- Default, loading (spinner), error (red border + message), success (green checkmark)

## 6. Technical Approach

### Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Coolify)
- **ORM:** Prisma
- **Auth:** NextAuth.js (credentials para admin)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **File Upload:** Local filesystem (production: S3/R2)
- **Deployment:** Coolify

### API Design

```
POST /api/forms/adoption     → Crear solicitud adopción
POST /api/forms/give-up       → Crear solicitud dar en adopción
POST /api/forms/foster        → Crear solicitud hogar temporal
POST /api/forms/volunteer     → Crear solicitud voluntariado
GET  /api/forms/[token]      → Obtener estado de formulario
GET  /api/admin/requests      → Listar solicitudes (auth required)
PATCH /api/admin/requests/[id] → Aprobar/rechazar (auth required)
```

### Data Model

```prisma
model AdoptionForm {
  id          String   @id @default(cuid())
  token       String   @unique  // Para tracking público
  status      Status   @default(PENDING)
  type        FormType
  data        Json     // Datos del formulario
  files       String[] // Paths de archivos
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  reviewedAt  DateTime?
  reviewedBy  String?
  rejectionReason String?
}

enum Status {
  PENDING
  APPROVED
  REJECTED
}

enum FormType {
  ADOPTION
  GIVE_UP
  FOSTER
  VOLUNTEER
}

model Admin {
  id       String @id @default(cuid())
  email    String @unique
  password String // bcrypt hash
}
```

### Bot Integration

El bot envía el link en lugar del documento:

```typescript
// Antes
await flowDynamic([{
  body: '📄 Formulario de adopción — Perros',
  media: path.join(process.cwd(), 'assets', 'formulario-perros.docx'),
}])

// Después
await flowDynamic(
  '¡Buenísimo! 🐶 Completá el formulario online 👇\n\n' +
  'https://dameunapatapy.com/adoptar?ref=perro'
)
```

### Environment Variables
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@dameunapatapy.com
ADMIN_PASSWORD=...
```

## 7. Milestones

### M1: Scaffold + Forms básicos
- [ ] Next.js project con Tailwind
- [ ] Schema de Prisma
- [ ] Form de adopción funcional
- [ ] Página de gracias
- [ ] Tracking por token

### M2: Admin Dashboard
- [ ] NextAuth setup
- [ ] Login page
- [ ] Dashboard con lista de requests
- [ ] Detalle + approve/reject
- [ ] Filtros

### M3: Integración Bot
- [ ] Modificar flows del bot para enviar links
- [ ] Probar end-to-end

### M4: Polish
- [ ] Estilos finales
- [ ] Mobile testing
- [ ] Deploy en Coolify
- [ ] Custom domain

## 8. Out of Scope (v1)
- Email notifications
- WhatsApp notifications back to user
- Payment integration
- Multi-language
- File uploads to cloud storage
