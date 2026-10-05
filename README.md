# mapApp: промо-лендінг

Next.js 16 (App Router) + Tailwind CSS v4 + next-intl. Мови: українська (`/`) і англійська (`/en`).

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run i18n:check   # перевірка, що в усіх мовах однакові ключі перекладу
npm run typecheck
```

Node.js 20.9 або новіший.

## Що заповнити перед рев'ю в App Store і Google Play

`src/config/site.ts`:

| Поле | Що це |
|---|---|
| `url` | Домен сайту (або змінна `NEXT_PUBLIC_SITE_URL`) |
| `company`, `companyId`, `address` | ФОП / ТОВ, ЄДРПОУ або РНОКПП, юридична адреса |
| `email` | Email підтримки |
| `iosUrl`, `androidUrl` | Посилання на сторінки в сторах. Поки пусті, кнопки показують «Незабаром» |
| `effectiveDate` | Дата набрання чинності політик |
| `minAge` | Мінімальний вік користувача |

Поки значення починається з `[`, воно підсвічується на сайті як незаповнене.
Список сервісів, що обробляють дані, задається ключем `legal.processors` у `messages/*.json`.

## Посилання для консолей сторів

| Поле | URL |
|---|---|
| Privacy Policy (Apple, Google) | `https://ваш-домен/privacy` |
| Support URL (Apple) | `https://ваш-домен/support` |
| Marketing URL (Apple) | `https://ваш-домен/` |
| Delete account URL (Google Play → Data safety) | `https://ваш-домен/delete-account` |
| Terms / EULA | `https://ваш-домен/terms` |
| Правила контенту (UGC, Apple 1.2) | `https://ваш-домен/content-rules` |

Англійські версії доступні з префіксом `/en/...`.

## Переклади

- `messages/uk.json` є базовою мовою, а ключі в ній типізовані: TypeScript підкаже, якщо ключа немає.
- `messages/en.json` повторює ту саму структуру. `npm run i18n:check` покаже відсутні або зайві ключі.
- Щоб додати мову: створіть `messages/<код>.json`, додайте код у `src/i18n/routing.ts` (`locales`) і підпис у `LanguageSwitcher.tsx`.
- Масиви (списки, FAQ, піни на карті) читаються через `t.raw()`.
- Розмітка в текстах політик, FAQ і «Про нас»: `**жирний**`, `[текст](/privacy)` (посилання з урахуванням мови), `{app}`, `{company}`, `{email}`, `{complex}`, `{minAge}`, `{address}`, `{companyId}`, `{processors}`.
- Документи (`legal.docs.*.blocks`) описані блоками: `p`, `h2`, `h3`, `note`, `ul`, `steps`, `table`, `copy`.

## Структура

```
messages/              переклади uk / en
src/app/[locale]/      головна, [doc]: privacy | terms | content-rules | delete-account | support
src/app/sitemap.ts     sitemap.xml для обох мов
src/components/
  layout/              Header (мобільне меню), Footer, LanguageSwitcher
  sections/            Hero, IsoMap (3D-карта), Marquee, Problem, Features, HowItWorks, BusinessCta, Faq, About
  phones/              макети екранів застосунку
  legal/               рендер документів, кнопка копіювання
src/config/            site.ts (дані компанії), legal.ts (список документів)
src/i18n/              routing, navigation, request
src/proxy.ts           визначення мови (Next 16: proxy замість middleware)
```

## Деплой

Vercel: імпортуйте репозиторій, змінну `NEXT_PUBLIC_SITE_URL` встановіть на свій домен. Шрифти (Unbounded, Onest, JetBrains Mono) лежать у самому проєкті через `@fontsource`, тож Google Fonts не потрібні.
