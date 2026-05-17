# RUSH Architecture

## System Overview

```
┌─────────────┐     HTTPS      ┌─────────────┐     ┌──────────────┐
│   Vercel    │ ──────────────▶│   Render    │────▶│ MongoDB      │
│  Next.js 15 │   REST + JWT   │  Express API│     │ Atlas        │
└─────────────┘   Cookies      └─────────────┘     └──────────────┘
       │                                │
       │                                ├── Stripe / Razorpay
       │                                └── Cloudinary
       └── Zustand (client state)
```

## Authentication Flow

1. User logs in → API validates credentials
2. API issues `accessToken` (15m) + `refreshToken` (7d)
3. Tokens stored in HTTP-only cookies + returned in body for mobile
4. Protected routes verify `accessToken` via middleware
5. On expiry → `POST /auth/refresh` rotates tokens
6. Logout clears cookies and invalidates refresh token in DB

## Database Schemas

| Collection | Key indexes | Relationships |
|------------|-------------|---------------|
| users | email, role | addresses[], savedPaymentMethods[] |
| products | slug, category, text search | variants[], images[] |
| categories | slug, parent | self-ref parent |
| orders | userId+createdAt, orderNumber, status | userId → User |
| carts | userId (unique) | items → Product |
| wishlists | userId (unique) | products[] → Product |
| coupons | code, expiresAt | — |
| reviews | productId, userId+productId | User, Product |

## API Structure (`/api/v1`)

| Route | Auth | Description |
|-------|------|-------------|
| `POST /auth/register` | — | Create account |
| `POST /auth/login` | — | Login |
| `POST /auth/refresh` | Cookie | Refresh tokens |
| `GET /auth/me` | User | Current user |
| `GET /products` | — | List + filters |
| `GET /products/:slug` | — | Product detail |
| `GET /cart` | User | Get cart |
| `POST /cart/items` | User | Add to cart |
| `POST /orders` | User | Place order |
| `GET /orders/:id` | User | Order detail |
| `GET /admin/dashboard` | Admin | Analytics |

## Frontend Architecture

```
src/
├── app/              # App Router pages (feature-based route groups)
├── components/
│   ├── ui/           # Design system primitives
│   ├── layout/       # Header, footer, drawers
│   ├── product/      # Product-specific components
│   └── providers/    # Theme, auth, toast
├── hooks/            # useProducts, useDebounce
├── lib/              # api client, utils, mock fallback
└── stores/           # Zustand: auth, cart, wishlist, ui
```

## State Management

| Store | Persistence | Purpose |
|-------|-------------|---------|
| auth-store | localStorage | User session |
| cart-store | localStorage | Cart items + drawer |
| wishlist-store | localStorage | Product IDs |
| ui-store | memory | Search, mobile menu |

Server state fetched via `lib/api.ts` + React hooks; synced to stores on mutation.

## Security

- Helmet, CORS, rate limiting (general + auth)
- `express-mongo-sanitize` for NoSQL injection
- Zod validation on all inputs
- bcrypt password hashing (12 rounds)
- HTTP-only secure cookies in production
- Role-based `authorize('admin')` middleware

## SEO Strategy

- Dynamic `metadata` per page
- Semantic HTML, accessible components
- Next.js Image optimization
- Server Components for product listing where applicable
- `sitemap.xml` / `robots.txt` (add at deploy)

## Caching Strategy

- API: pagination-ready responses, lean queries
- Frontend: Next.js static generation for marketing pages
- Future: Redis for session/product cache, CDN for images

## Deployment

### Vercel (Frontend)

```bash
# Root directory: apps/web
# Build: npm run build --workspace=@rush/web
# Env: NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

### Render (API)

```bash
# Root: apps/api
# Build: npm run build --workspace=@rush/api
# Start: npm run start --workspace=@rush/api
# Env: MONGODB_URI, JWT_*, CLIENT_URL, etc.
```

### MongoDB Atlas

- Create cluster → get connection string → set `MONGODB_URI`
- Enable IP whitelist for Render/Vercel

## Future Scalability

| Capability | Approach |
|------------|----------|
| Mobile app | Same REST API + JWT |
| Multi-vendor | `vendorId` on products, vendor dashboard |
| AI recommendations | Event stream → recommendation service |
| Real-time inventory | WebSockets / Redis pub-sub |
| Notifications | Queue (BullMQ) + FCM/email |
| Subscriptions | Stripe Billing + subscription schema |
| i18n | next-intl + locale in user prefs |
| Multi-warehouse | `inventory` collection per warehouse |
| Microservices | Split auth, catalog, orders, payments |

## Payment Integration

Stripe and Razorpay endpoints exist at `/payments/stripe/create-intent` and `/payments/razorpay/create-order`. Configure keys in `.env` for production; mock responses returned in development.
