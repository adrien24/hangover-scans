# Documentation API - Endpoints User Data

Tous les endpoints sont prefixes par `/api/userdata`.
Tous necessitent le header `Authorization: Bearer <token>`.

---

## Bookmarks (progression de lecture)

### `GET /api/userdata/bookmarks`

Retourne tous les bookmarks de l'utilisateur.

**Response 200 :**
```json
[
  {
    "title": "One Piece",
    "chapters": [
      {
        "id": 1,
        "currentPage": 15,
        "isFinished": false,
        "lastUpdated": 1711000000000
      }
    ]
  }
]
```

---

### `GET /api/userdata/bookmarks/:mangaTitle`

Retourne le bookmark d'un manga specifique.

**Response 200 :** un objet `MangaBookmark` (voir ci-dessus)
**Response 404 :** si pas de bookmark pour ce manga

---

### `GET /api/userdata/bookmarks/:mangaTitle/chapters/:chapterId`

Retourne les donnees d'un chapitre specifique.

**Response 200 :**
```json
{
  "id": 1,
  "currentPage": 15,
  "isFinished": false,
  "lastUpdated": 1711000000000
}
```
**Response 404 :** si pas de donnees pour ce chapitre

---

### `PUT /api/userdata/bookmarks/:mangaTitle/chapters/:chapterId`

Cree ou met a jour la progression d'un chapitre.

**Request body :**
```json
{
  "currentPage": 15,
  "isFinished": false
}
```

**Response 200 :** `{ "ok": true }`

---

### `PUT /api/userdata/bookmarks/:mangaTitle/chapters/:chapterId/finish`

Marque un chapitre comme termine.

**Request body :** aucun

**Response 200 :** `{ "ok": true }`

---

## Watchlist

### `GET /api/userdata/watchlist`

Retourne toute la watchlist de l'utilisateur.

**Response 200 :**
```json
[
  {
    "title": "Jujutsu Kaisen",
    "status": "En cours",
    "addedAt": 1710900000000,
    "lastRead": 1711000000000,
    "lastChapterRead": "42"
  }
]
```

Les statuts possibles sont : `"À lire"`, `"En cours"`, `"Terminé"`, `"En pause"`

---

### `GET /api/userdata/watchlist/:mangaTitle`

**Response 200 :** un objet `WatchlistItem`
**Response 404 :** si pas dans la watchlist

---

### `PUT /api/userdata/watchlist`

Ajoute ou met a jour un manga dans la watchlist.

**Request body :**
```json
{
  "title": "Jujutsu Kaisen",
  "status": "En cours",
  "lastChapterRead": "42"
}
```

**Response 200 :** `{ "ok": true }`

---

### `PATCH /api/userdata/watchlist/:mangaTitle`

Met a jour partiellement un item de watchlist.

**Request body :** un ou plusieurs champs parmi :
```json
{
  "status": "Terminé",
  "lastRead": 1711000000000,
  "lastChapterRead": "200"
}
```

**Response 200 :** `{ "ok": true }`

---

### `DELETE /api/userdata/watchlist/:mangaTitle`

Retire un manga de la watchlist.

**Response 200 :** `{ "ok": true }`

---

## Reader Modes (preferences de lecteur)

### `GET /api/userdata/reader-modes/:mangaTitle`

**Response 200 :**
```json
{
  "title": "Bleach",
  "mode": "carousel"
}
```

Mode possible : `"carousel"` ou `"vertical"`

**Response 404 :** si pas de preference (le front utilisera `"carousel"` par defaut)

---

### `PUT /api/userdata/reader-modes/:mangaTitle`

**Request body :**
```json
{
  "mode": "vertical"
}
```

**Response 200 :** `{ "ok": true }`

---

## Sync localStorage (migration)

### `POST /api/userdata/sync`

Import en masse des donnees localStorage vers la DB. Utilise pour la migration des utilisateurs qui avaient des donnees avant de creer un compte.

**Request body :**
```json
{
  "bookmarks": [
    {
      "title": "One Piece",
      "chapters": [
        { "id": 1, "currentPage": 15, "isFinished": false, "lastUpdated": 1711000000000 }
      ]
    }
  ],
  "watchlist": [
    {
      "title": "Jujutsu Kaisen",
      "status": "En cours",
      "addedAt": 1710900000000,
      "lastRead": 1711000000000,
      "lastChapterRead": "42"
    }
  ],
  "readerModes": [
    { "title": "Bleach", "mode": "carousel" }
  ]
}
```

**Comportement attendu :** Merge les donnees (ne pas ecraser les donnees existantes en DB si elles sont plus recentes). Utiliser `lastUpdated` pour les bookmarks et `lastRead`/`addedAt` pour la watchlist.

**Response 200 :**
```json
{
  "imported": {
    "bookmarks": 5,
    "watchlist": 3,
    "readerModes": 2
  }
}
```

---

## Types TypeScript de reference

```typescript
interface BookmarkChapter {
  id: number;
  currentPage: number;
  isFinished: boolean;
  lastUpdated: number;
}

interface MangaBookmark {
  title: string;
  chapters: BookmarkChapter[];
}

type WatchlistStatus = "À lire" | "En cours" | "Terminé" | "En pause";

interface WatchlistItem {
  title: string;
  status: WatchlistStatus;
  addedAt: number;
  lastRead?: number;
  lastChapterRead?: string;
}

interface MangaReaderMode {
  title: string;
  mode: "carousel" | "vertical";
}
```

---

## Notes pour le backend

- Les `:mangaTitle` dans les URLs sont encodes via `encodeURIComponent` cote front
- Le endpoint sync doit merge intelligemment (donnee la plus recente gagne)
- Toutes les reponses d'erreur doivent avoir un champ `message` (string)
