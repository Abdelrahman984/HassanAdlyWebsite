# Hassan Adly Quran Platform - Frontend Reverse Engineering and Full-Stack Architecture

## 1. Scope and Current State

This document refines the existing architecture rather than redesigning it from scratch. The goal is to keep the strong decisions, correct weak points, reduce early complexity, and make the backend realistic for production delivery by a solo or small full-stack team.

Current frontend observations:

- The app is a React + Vite single-page application.
- Routing already models the main product surface: home, surah detail, search, favorites, selected playlist, downloads, player, and about page.
- Surahs and Qira'at are currently hardcoded in frontend data files.
- Audio playback is already centralized in a global player context.
- Favorites are currently client-only in memory.
- Theme preference is persisted in `localStorage`.
- The frontend already expects a future API service layer.

Relevant frontend evidence:

- Routing and app shell: `src/app/App.tsx`
- Static entities: `src/app/data/surahs.ts`, `src/app/data/qiraat.ts`
- Audio service stub: `src/app/services/api.ts`
- Global player state: `src/app/context/PlayerContext.tsx`
- Core user flows: `src/app/pages/HomePage.tsx`, `src/app/pages/SurahDetailPage.tsx`, `src/app/pages/SurahPlayerPage.tsx`, `src/app/pages/SearchPage.tsx`
- Placeholder future features: `src/app/pages/FavoritesPage.tsx`, `src/app/pages/SelectedPage.tsx`, `src/app/pages/DownloadsPage.tsx`

The current frontend is static only, but it already implies a clear domain model and a backend contract.

## 1.1 Architecture Review Summary

Strong parts worth preserving:

- `AudioTrack` is the right center of the domain.
- Object storage + CDN is the correct media-delivery direction.
- A dedicated admin dashboard is required.
- Clean Architecture is still a good fit.
- Global player state in the frontend is the correct conceptual starting point.

Weak points corrected in this revision:

- Favorites were modeled by `SurahId` and are now corrected to `AudioTrackId`.
- `PlaylistItem` mixed `AudioTrackId`, `SurahId`, and `QiraaId`; it is simplified to `AudioTrackId` only.
- Public auth, cross-device sync, and advanced analytics were pulled too far into V1 and are now postponed.
- Search was too abstract too early; V1 now uses normalized SQL-based search.
- The system is refined toward a modular monolith first, not multiple early services.
- Quran metadata support is extended with `Ayah` and `AyahTiming` for future verse-aware capabilities.
- The solution structure is clarified into `Domain`, `Application`, `Infrastructure`, `Persistence`, `Api`, and `Shared`.

## 2. Frontend Modules Identified

The current frontend already separates into functional modules that should map to backend capabilities.

### 2.1 Public browsing module

Purpose:

- Show hero content
- Show Sheikh information
- Browse all surahs
- Open a surah detail page
- Select a Qira'a

Frontend evidence:

- `HomePage.tsx`
- `Hero.tsx`
- `AboutPage.tsx`
- `SurahCard.tsx`
- `SurahDetailPage.tsx`
- `QiraaListItem.tsx`

### 2.2 Audio playback module

Purpose:

- Hold global current track
- Control play/pause
- Seek in track
- Change playback speed
- Loop current track
- Navigate next/previous surah while preserving selected Qira'a

Frontend evidence:

- `PlayerContext.tsx`
- `MiniPlayer.tsx`
- `SidebarPlayer.tsx`
- `FullPlayer.tsx`
- `SurahPlayerPage.tsx`

### 2.3 Search module

Purpose:

- Search surahs
- Search Qira'at

Current limitation:

- Search is purely client-side and only runs against static arrays

Frontend evidence:

- `SearchPage.tsx`

### 2.4 Personalization module

Purpose:

- Favorites
- Continue listening
- Selected list / playlist
- Downloads

Current state:

- Favorites exist only in memory
- Continue listening is inferred from `currentTrack`
- Selected and downloads pages are UI placeholders

Frontend evidence:

- `FavoritesPage.tsx`
- `SelectedPage.tsx`
- `DownloadsPage.tsx`
- `HomePage.tsx`
- `PlayerContext.tsx`

### 2.5 Presentation and shell module

Purpose:

- Sidebar navigation
- Bottom navigation
- Theme switching
- Responsive mobile-first rendering

Frontend evidence:

- `Sidebar.tsx`
- `BottomNav.tsx`
- `ThemeContext.tsx`

## 3. Refined Full System Architecture

## 3.1 High-level production architecture

Recommended system:

1. React frontend
2. ASP.NET Core Web API backend
3. Admin dashboard frontend
4. SQL database
5. Object storage for audio and images
6. CDN for audio delivery
7. Lightweight background processing for uploads and metadata extraction

Suggested deployment topology:

- Public React app: static hosting or CDN edge hosting
- Admin dashboard: separate frontend deployment, same API backend
- .NET API: one deployable backend application
- SQL Server or PostgreSQL: primary relational database
- Blob storage: Azure Blob Storage or S3-compatible object storage
- CDN: Azure CDN, CloudFront, or Cloudflare

## 3.2 Required backend modules

The original architecture separated too many responsibilities too early. For this platform, the right first step is a modular monolith with clean internal modules.

### Catalog module

Responsibilities:

- Return Sheikh profile
- Return surahs
- Return Qira'at
- Return available tracks per surah and Qira'a
- Return homepage featured content

### Audio module

Responsibilities:

- Resolve `surah + qiraa` into a playable `AudioTrack`
- Return stream URL and audio metadata
- Support next and previous playback lookups
- Support future `AyahTiming` queries

### Search module

Responsibilities:

- Search surahs by Arabic name and transliteration
- Search Qira'at by Arabic name, imam, and rawi fields
- Use normalized database columns for simple search

V1 simplification:

- Do not introduce a dedicated search engine yet
- Do not introduce `SearchAlias` management in V1
- Start with SQL queries plus normalized searchable columns

### Admin module

Responsibilities:

- Admin authentication
- Upload and replace audio files
- Manage Sheikh profile
- Manage surah and Qira'a metadata
- Manage publishing state
- Provide recording matrix visibility

### Media processing module

Responsibilities:

- Extract audio metadata after upload
- Validate file format and checksum
- Move audio into canonical storage paths
- Mark track processing success or failure

Implementation note:

- In V1 this can run as in-process background work or a single lightweight worker
- It does not need a distributed media-processing platform on day one

### Postponed modules

These should not be part of V1:

- Public user accounts
- Cross-device favorites sync
- Server-side playlists
- Advanced playback analytics
- Distributed event pipelines

## 3.3 Suggested scalable structure

Recommended V1 structure:

- One ASP.NET Core backend deployed as a modular monolith
- One SQL database
- One object storage container or bucket for media
- One CDN in front of media
- One admin frontend
- Optional in-process jobs or a single worker process for upload processing

Why this is better:

- Lower operational complexity
- Faster delivery for a solo or small team
- Easier debugging and deployment
- Still scalable enough for a specialized Quran audio platform

Recommended scale-up path:

- Split background processing into a dedicated worker only when uploads or derived-asset jobs justify it
- Add distributed cache only when catalog traffic proves it is needed
- Add external search only when SQL search becomes a bottleneck
- Add analytics pipeline only after launch and real usage patterns

## 4. Database Design

The database should reflect both the current product and future Quran-aware features, while keeping V1 realistic.

## 4.1 Core V1 entities

### `Sheikh`

Purpose:

- Stores the reciter profile shown in the hero and about page
- Even though the platform is exclusive to one Sheikh, keep this entity for clean modeling and admin management

Fields:

- `Id` (PK, bigint)
- `Slug` (unique, varchar)
- `DisplayNameArabic` (nvarchar)
- `DisplayNameEnglish` (varchar, nullable)
- `FullNameArabic` (nvarchar)
- `BirthDate` (date, nullable)
- `BirthPlaceArabic` (nvarchar, nullable)
- `BiographyArabic` (nvarchar(max))
- `ShortDescriptionArabic` (nvarchar(500))
- `ProfileImageUrl` (varchar)
- `IsActive` (bit)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Relationships:

- One `Sheikh` to many `AudioTrack`
- One `Sheikh` to many `SheikhEducation`
- One `Sheikh` to many `SheikhExperience`
- One `Sheikh` to many `SheikhTeacher`

### `Surah`

Purpose:

- Represents each Quran surah

Fields:

- `Id` (PK, smallint) - 1..114
- `NameArabic` (nvarchar)
- `NameTransliteration` (varchar)
- `NameEnglish` (varchar, nullable)
- `RevelationType` (tinyint or enum: Makki or Madani)
- `VerseCount` (smallint)
- `DisplayOrder` (smallint)
- `SearchNormalizedArabic` (nvarchar)
- `IsPublished` (bit)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Relationships:

- One `Surah` to many `AudioTrack`
- One `Surah` to many `Ayah`

### `Ayah`

Purpose:

- Adds a future-ready Quran metadata layer without changing the current public UI
- Enables verse-aware features later without redesigning the data model

Fields:

- `Id` (PK, bigint)
- `SurahId` (FK -> `Surah.Id`)
- `AyahNumber` (smallint)
- `GlobalAyahNumber` (int, nullable)
- `TextUthmani` (nvarchar(max))
- `Juz` (tinyint)
- `Hizb` (tinyint)
- `PageNumber` (smallint)
- `RubElHizb` (tinyint, nullable)
- `SajdahType` (varchar, nullable)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Recommended uniqueness:

- Unique key on `SurahId + AyahNumber`

Why it matters:

- Supports future tafsir integration
- Supports verse bookmarks
- Supports verse highlighting
- Supports synchronized playback
- Supports later expansion into ayah-level annotations and navigation

### `Qiraa`

Purpose:

- Represents the available Ten Qira'at displayed on the surah detail page

Fields:

- `Id` (PK, smallint)
- `Slug` (unique, varchar)
- `NameArabic` (nvarchar)
- `NameEnglish` (varchar, nullable)
- `RawiArabic` (nvarchar)
- `ImamArabic` (nvarchar, nullable)
- `DescriptionArabic` (nvarchar(1000), nullable)
- `DisplayOrder` (smallint)
- `IsPublished` (bit)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Relationships:

- One `Qiraa` to many `AudioTrack`

### `AudioTrack`

Purpose:

- Central entity of the platform
- Represents a specific recording for one surah in one Qira'a by Sheikh Hassan Adly

Recommended uniqueness:

- Unique key on `SheikhId + SurahId + QiraaId`

Fields:

- `Id` (PK, bigint)
- `SheikhId` (FK -> `Sheikh.Id`)
- `SurahId` (FK -> `Surah.Id`)
- `QiraaId` (FK -> `Qiraa.Id`)
- `TitleArabic` (nvarchar)
- `AudioObjectKey` (varchar)
- `StreamUrl` (varchar, nullable if generated dynamically)
- `DownloadUrl` (varchar, nullable if generated dynamically)
- `DurationSeconds` (int)
- `FileSizeBytes` (bigint)
- `BitrateKbps` (int, nullable)
- `AudioFormat` (varchar)
- `SampleRateHz` (int, nullable)
- `ChannelMode` (varchar, nullable)
- `WaveformJson` (nvarchar(max), nullable)
- `ChecksumSha256` (varchar(64), nullable)
- `Version` (int)
- `Status` (tinyint: Draft, Processing, Ready, Failed, Published, Archived)
- `PublishedAtUtc` (datetime, nullable)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Relationships:

- Many `AudioTrack` to one `Surah`
- Many `AudioTrack` to one `Qiraa`
- Many `AudioTrack` to one `Sheikh`
- One `AudioTrack` to many `AyahTiming`

Design note:

- `AudioTrack` already contains all playback context required by the frontend: Surah, Qira'a, Sheikh, file metadata, and playable URL.
- This is why future favorites and playlist items should point to `AudioTrackId` only.

### `AyahTiming`

Purpose:

- Stores verse-level timing markers for an `AudioTrack`
- Enables synchronized Quran text with recitation

Fields:

- `Id` (PK, bigint)
- `AudioTrackId` (FK -> `AudioTrack.Id`)
- `AyahId` (FK -> `Ayah.Id`)
- `StartMs` (int)
- `EndMs` (int)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Recommended uniqueness:

- Unique key on `AudioTrackId + AyahId`

Why it matters:

- Enables interactive player features
- Enables future highlighted verse playback
- Supports synchronized text display
- Opens the door to precise bookmarks and learning tools

### `MediaAsset`

Purpose:

- General file abstraction for audio, images, and derived assets

Fields:

- `Id` (PK, bigint)
- `AssetType` (varchar: Audio, Image, Waveform)
- `StorageProvider` (varchar)
- `BucketOrContainer` (varchar)
- `ObjectKey` (varchar)
- `PublicUrl` (varchar, nullable)
- `MimeType` (varchar)
- `FileSizeBytes` (bigint)
- `ChecksumSha256` (varchar(64))
- `Status` (tinyint)
- `CreatedAtUtc`

### `FeaturedContent`

Purpose:

- Controls homepage hero and promoted content

Fields:

- `Id` (PK, bigint)
- `Type` (tinyint: HeroTrack, HeroMessage, FeaturedSurah)
- `TitleArabic` (nvarchar)
- `SubtitleArabic` (nvarchar, nullable)
- `AudioTrackId` (FK -> `AudioTrack.Id`, nullable)
- `SurahId` (FK -> `Surah.Id`, nullable)
- `ImageUrl` (varchar, nullable)
- `DisplayOrder` (int)
- `IsActive` (bit)
- `StartsAtUtc` (datetime, nullable)
- `EndsAtUtc` (datetime, nullable)

### `AdminUser`

Purpose:

- Represents authenticated admin users for the dashboard
- Keeps V1 auth focused only on operational staff

Fields:

- `Id` (PK, bigint)
- `Email` (unique, varchar)
- `PasswordHash` (varchar)
- `DisplayName` (nvarchar)
- `Role` (tinyint: SuperAdmin, ContentAdmin, MediaAdmin)
- `IsActive` (bit)
- `LastLoginAtUtc` (datetime, nullable)
- `CreatedAtUtc`
- `UpdatedAtUtc`

### `AdminRefreshToken`

Purpose:

- Supports JWT refresh flow for admin sessions only

Fields:

- `Id` (PK, bigint)
- `AdminUserId` (FK -> `AdminUser.Id`)
- `TokenHash` (varchar)
- `ExpiresAtUtc` (datetime)
- `RevokedAtUtc` (datetime, nullable)
- `CreatedAtUtc`
- `CreatedByIp` (varchar, nullable)

## 4.2 Future phase entities

These entities are valid, but they should be postponed until after public launch.

### `PublicUser`

Purpose:

- Represents a public listener account if cross-device persistence is introduced later

Fields:

- `Id` (PK, bigint)
- `Email` (unique, varchar, nullable)
- `DisplayName` (nvarchar, nullable)
- `PasswordHash` (varchar, nullable)
- `IsActive` (bit)
- `CreatedAtUtc`
- `UpdatedAtUtc`

### `Favorite`

Purpose:

- Stores a user's saved favorite recitations

Critical correction:

- Favorites must target `AudioTrackId`, not `SurahId`

Why this is correct:

- The same Surah can exist in multiple Qira'at
- A user may favorite `Surah 1 + Hafs` without favoriting `Surah 1 + Warsh`
- `AudioTrack` already contains the `Surah + Qiraa + Sheikh` context

Fields:

- `Id` (PK, bigint)
- `PublicUserId` (FK -> `PublicUser.Id`)
- `AudioTrackId` (FK -> `AudioTrack.Id`)
- `CreatedAtUtc`

Recommended uniqueness:

- Unique key on `PublicUserId + AudioTrackId`

Admin implications:

- Replacing an audio file should not create a new logical favorite target
- Keep the same `AudioTrack` row when replacing media so favorites remain valid
- Admin list views should be able to show favorite counts by track later if the feature is introduced

Future API implications:

- Favorite endpoints must accept `audioTrackId`
- Favorite list responses should return resolved track DTOs, not bare surah IDs

### `ListeningHistory`

Purpose:

- Persists listening progress when public accounts are introduced

Fields:

- `Id` (PK, bigint)
- `PublicUserId` (FK -> `PublicUser.Id`)
- `AudioTrackId` (FK -> `AudioTrack.Id`)
- `LastPositionSeconds` (int)
- `CompletionPercent` (decimal(5,2))
- `LastPlayedAtUtc` (datetime)
- `CreatedAtUtc`
- `UpdatedAtUtc`

Recommended uniqueness:

- Unique key on `PublicUserId + AudioTrackId`

### `Playlist`

Purpose:

- Supports post-V1 user-created or system-created audio lists

Fields:

- `Id` (PK, bigint)
- `PublicUserId` (FK -> `PublicUser.Id`)
- `Name` (nvarchar)
- `Type` (tinyint: Custom, Selected)
- `CreatedAtUtc`
- `UpdatedAtUtc`

### `PlaylistItem`

Purpose:

- Ordered items inside a playlist

Critical simplification:

- Use `AudioTrackId` only

Fields:

- `Id` (PK, bigint)
- `PlaylistId` (FK -> `Playlist.Id`)
- `AudioTrackId` (FK -> `AudioTrack.Id`)
- `SortOrder` (int)
- `AddedAtUtc`

Why this is cleaner:

- `AudioTrack` already contains the Surah and Qira'a context
- The backend does not need to resolve partial playlist rows
- The frontend does not need to guess which Qira'a to use
- Ordering, validation, and playback become much simpler

Recommended uniqueness:

- Unique key on `PlaylistId + AudioTrackId`

## 4.3 Relationship summary

Core V1 relationships:

- `Sheikh 1 -> N AudioTrack`
- `Surah 1 -> N AudioTrack`
- `Surah 1 -> N Ayah`
- `Qiraa 1 -> N AudioTrack`
- `AudioTrack 1 -> N AyahTiming`
- `AdminUser 1 -> N AdminRefreshToken`

Future relationships:

- `PublicUser 1 -> N Favorite`
- `PublicUser 1 -> N ListeningHistory`
- `PublicUser 1 -> N Playlist`
- `Playlist 1 -> N PlaylistItem`
- `AudioTrack 1 -> N Favorite`
- `AudioTrack 1 -> N ListeningHistory`

Business uniqueness:

- One track per `sheikh + surah + qiraa`
- One ayah per `surah + ayahNumber`
- One ayah timing per `audioTrack + ayah`
- One favorite per `publicUser + audioTrack` in future
- One resume-state record per `publicUser + audioTrack` in future

## 5. Admin Panel Requirements

The current static frontend implies a strong need for a content-management back office.

## 5.1 Admin dashboard modules

### Dashboard

Show:

- Total published tracks
- Total completed uploaded tracks
- Missing recordings by surah and Qira'a
- Recently uploaded tracks
- Storage usage
- Failed media-processing jobs

V1 simplification:

- Postpone listener analytics and active-user metrics until real traffic exists
- Focus the dashboard on catalog coverage and upload operations

### Sheikh management

Manage:

- Sheikh profile
- Hero image and profile image
- About page content
- Education timeline
- Experience list
- Teacher list
- Highlighted biography cards

### Surah management

Manage:

- Surah names and display order
- Revelation type
- Verse count
- Published state
- SEO metadata

Notes:

- Core Quran metadata changes should be tightly permissioned because they are canonical
- `Ayah` import and maintenance tooling should be planned, but should not block V1 launch

### Qira'a management

Manage:

- Qira'a names
- Rawi names
- Imam metadata
- Descriptions
- Display order
- Availability

### Audio track management

Manage:

- Upload audio file
- Attach uploaded file to `surah + qiraa + sheikh`
- Replace existing file
- Set publish status
- Update duration if needed
- Add bitrate and file metadata
- Mark processing failures
- Soft archive old versions

Recommended admin UI features:

- Bulk upload
- Filter by missing recordings
- Grid view by surah vs Qira'a to quickly detect gaps
- Preview player before publish
- Replace file with version history
- Validation to prevent duplicate `surah + qiraa + sheikh`

### Recording Matrix View

Purpose:

- Give admins one screen to detect missing or unpublished recordings
- Support bulk operational management across the full Quran and Ten Qira'at

Example concept:

```text
| Surah   | Hafs | Warsh | Qalun |
|---------|------|-------|-------|
| Fatiha  |  ✅  |  ❌   |  ✅   |
| Baqarah |  ✅  |  ✅   |  ❌   |
```

Recommended behavior:

- Each row represents a `Surah`
- Each column represents a `Qiraa`
- Each cell shows `Missing`, `Draft`, `Processing`, `Ready`, or `Published`
- Cell click opens the corresponding track detail or upload flow

Backend requirement:

- Provide a matrix endpoint that returns all Surahs with track status per Qira'a

Efficient querying strategy:

- Query all active Surahs
- Query all active Qira'at
- Query all `AudioTrack` rows once for the selected Sheikh
- Materialize the matrix in application code using `SurahId + QiraaId` lookup

Admin usability benefits:

- Fast visibility of content gaps
- Reduced admin navigation time
- Safer publishing workflow
- Better fit for a recording library than a plain list view

### Featured content management

Manage:

- Hero CTA target track
- Featured surah
- Homepage text blocks
- Seasonal content windows

### Search management

Manage:

- Arabic normalization rules
- Searchable display metadata

V1 simplification:

- Do not build manual ranking, alias-management, or external indexing tools yet
- Normalize searchable text at save time and query with SQL

### Storage and media operations

Manage:

- View media storage path
- Replace files safely
- Re-run metadata extraction
- Re-generate waveform preview if needed
- Invalidate CDN cache for replaced assets when necessary
- Download audit logs

## 5.2 Admin roles

Recommended roles:

- `SuperAdmin`: all permissions
- `ContentAdmin`: manage Sheikh, Surahs, Qira'at, featured content
- `MediaAdmin`: upload, replace, publish, and archive tracks

## 6. Refined REST API Design

All endpoints below assume `/api/v1`.

## 6.1 Public catalog endpoints

### `GET /sheikh`

Returns the active Sheikh profile for the platform.

Example response:

```json
{
  "id": 1,
  "slug": "hassan-adly",
  "displayNameArabic": "حسن عدلي",
  "fullNameArabic": "حسن بن عدلي بن محمد كامل بن مشيط",
  "shortDescriptionArabic": "قارئ متقن للقراءات العشر",
  "profileImageUrl": "https://cdn.example.com/images/sheikh/hassan-adly/profile.jpg",
  "about": {
    "birthDate": "1981-03-12",
    "birthPlaceArabic": "الجيزة - مصر",
    "biographyArabic": "..."
  }
}
```

### `GET /surahs`

Query parameters:

- `search`
- `page`
- `pageSize`
- `publishedOnly`

Example response:

```json
{
  "items": [
    {
      "id": 1,
      "nameArabic": "الفاتحة",
      "nameTransliteration": "Al-Fatihah",
      "revelationType": "Makki",
      "verseCount": 7,
      "availableQiraatCount": 10
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 114
}
```

### `GET /surahs/{surahId}`

Returns surah details plus available Qira'at summary.

Example response:

```json
{
  "id": 1,
  "nameArabic": "الفاتحة",
  "nameTransliteration": "Al-Fatihah",
  "revelationType": "Makki",
  "verseCount": 7,
  "availableQiraat": [
    {
      "id": 1,
      "nameArabic": "حفص عن عاصم",
      "rawiArabic": "حفص",
      "trackId": 1001,
      "durationSeconds": 49,
      "isAvailable": true
    }
  ]
}
```

### `GET /qiraat`

Returns all active Qira'at.

### `GET /tracks/resolve?surahId=1&qiraaId=1`

This is the direct replacement for the current frontend `getAudioTrack()` behavior.

Example response:

```json
{
  "id": 1001,
  "surahId": 1,
  "surahNameArabic": "الفاتحة",
  "qiraaId": 1,
  "qiraaNameArabic": "حفص عن عاصم",
  "durationSeconds": 49,
  "streamUrl": "https://cdn.example.com/audio/hassan-adly/hafs-an-asim/001-al-fatihah-v1.mp3",
  "downloadUrl": "https://cdn.example.com/audio/hassan-adly/hafs-an-asim/001-al-fatihah-v1.mp3",
  "bitrateKbps": 128,
  "fileSizeBytes": 905432
}
```

## 6.2 Audio streaming for V1

Recommended V1 approach:

- Return a public CDN URL directly from `GET /tracks/resolve`
- Ensure the CDN and storage origin support HTTP range requests
- Do not proxy audio through the .NET API in V1

Why this is the right choice:

- The frontend only needs a standard audio URL
- HTML audio works well with range-enabled MP3 delivery
- Backend bandwidth and operational cost stay lower

Postpone:

- Signed stream tokens
- Stream proxy endpoints
- Playback telemetry pipelines

## 6.3 Search endpoint

### `GET /search?q=...`

Response should group results by entity type.

Example response:

```json
{
  "query": "الفاتحة",
  "surahs": [
    {
      "id": 1,
      "nameArabic": "الفاتحة",
      "nameTransliteration": "Al-Fatihah"
    }
  ],
  "qiraat": [
    {
      "id": 1,
      "nameArabic": "حفص عن عاصم",
      "rawiArabic": "حفص"
    }
  ],
  "sheikh": []
}
```

Recommended query behavior:

- Normalize Arabic diacritics
- Ignore hamza variants where appropriate
- Support transliteration matching
- Use normalized text columns instead of alias-management tables in V1

## 6.4 Admin authentication endpoints

### Admin auth

- `POST /admin/auth/login`
- `POST /admin/auth/refresh`
- `POST /admin/auth/logout`
- `GET /admin/auth/me`

## 6.5 Essential admin endpoints for V1

Recommended V1 admin surface:

- `GET /admin/dashboard`
- `GET /admin/sheikh`
- `PUT /admin/sheikh/{id}`
- `GET /admin/surahs`
- `PUT /admin/surahs/{id}`
- `GET /admin/qiraat`
- `PUT /admin/qiraat/{id}`
- `GET /admin/tracks`
- `GET /admin/tracks/{id}`
- `POST /admin/tracks`
- `PUT /admin/tracks/{id}`
- `POST /admin/tracks/{id}/init-upload`
- `POST /admin/tracks/{id}/finalize-upload`
- `POST /admin/tracks/{id}/publish`
- `POST /admin/tracks/{id}/archive`
- `GET /admin/recording-matrix`

Why this API surface is better:

- Covers all launch-critical operational workflows
- Matches the actual static frontend needs
- Avoids exposing unimplemented personalization concepts
- Keeps the backend realistic for a solo full-stack implementation

## 6.6 Postponed user-library APIs

These APIs should be documented as future phase, not V1:

- `GET /me/favorites`
- `POST /me/favorites`
- `DELETE /me/favorites/{audioTrackId}`
- `GET /me/playlists`
- `POST /me/playlists`
- `POST /me/playlists/{playlistId}/items`
- `PUT /me/listening-history/{audioTrackId}`

Future favorites request example:

```json
{
  "audioTrackId": 1001
}
```

## 7. Audio System Design

The current frontend uses an HTML audio element and `preload="metadata"`, which is a good baseline and should remain for the first production version.

## 7.1 Streaming strategy

Recommended first approach:

- Store MP3 files in object storage
- Deliver through CDN
- Return direct CDN URL from the API
- Ensure storage and CDN support HTTP range requests

Why this fits the current app:

- The frontend only needs a standard audio URL
- HTML audio works well with byte-range MP3 streaming
- This avoids using the .NET API as a heavy media proxy

## 7.2 Media processing pipeline

When an admin uploads a track:

1. Upload file to temporary storage area
2. Create or update `AudioTrack` in `Processing` state
3. Run metadata extraction job
4. Validate format, duration, file size, checksum
5. Move file to canonical storage path
6. Update track status to `Ready` or `Published`
7. Purge CDN cache only if path reuse is unavoidable

Optional derived assets:

- Waveform JSON for richer player UI
- Lower bitrate version for constrained mobile networks
- Future `AyahTiming` import or generation if available from an external source

Implementation note:

- V1 can use a simple hosted background service or a single worker process
- A distributed job system is unnecessary at launch

## 7.3 CDN and storage recommendations

Preferred setup:

- Blob or object storage as origin
- CDN in front of audio and images
- Long cache headers on versioned files
- Short cache on metadata endpoints

Recommended cache policy:

- Audio files: immutable caching if file path contains version
- Track metadata API: short server-side caching window
- Surah and Qira'a catalog: cacheable for longer periods

## 7.4 Lazy loading and playback optimization

Frontend recommendations:

- Keep current `preload="metadata"` default
- Request actual stream URL only when the user selects a track
- Prefetch next track metadata, not full audio, after playback begins
- Avoid eager loading all tracks on page load

## 7.5 Mobile playback considerations

Important mobile constraints:

- Browsers often require user interaction before playback
- Background playback behavior differs by platform
- Lock-screen media integration may later require PWA and Media Session support

Recommendations:

- Use the Media Session API
- Save playback position locally and debounce updates
- Retry gracefully after network interruption
- Keep player state in a global store that survives route changes

## 8. Authentication and Authorization

## 8.1 V1 authentication decision

Public authentication is not required in V1.

V1 public site should allow anonymous access to:

- Browse surahs
- Browse Qira'at
- View the Sheikh profile
- Search the catalog
- Stream audio

V1 authenticated access should exist only for:

- Admin dashboard users
- Upload and publishing operations
- Content management

Why this is better:

- Removes a large amount of implementation complexity
- Accelerates launch
- Keeps the backend aligned with the real current frontend
- Avoids building sync features before validating the public product

## 8.2 JWT usage

Recommended V1 auth model:

- JWT access token for admin API access
- Refresh token only for admin sessions
- Role claims limited to admin roles

Implementation notes:

- Store refresh tokens securely
- Prefer short-lived access tokens
- Use `httpOnly` cookies for refresh where practical

## 8.3 Authorization model

Recommended policies:

- `Public`: catalog, search, Sheikh profile, track resolve
- `Admin`: authenticated dashboard access
- `ContentAdmin`: manage Sheikh, Surahs, Qira'at, featured content
- `MediaAdmin`: upload, replace, publish, and archive tracks
- `SuperAdmin`: full control

## 8.4 Future public accounts

If public accounts are introduced later, keep them separate from `AdminUser` to avoid coupling listener identities with operational identities.

## 9. Frontend State Management for Production

The current `PlayerContext` is still the correct conceptual starting point. The main refinement is to align state with a V1 anonymous-listening model.

## 9.1 Global audio player state

Keep globally:

- Current track ID
- Surah and Qira'a metadata
- Stream URL
- Is playing
- Current position
- Duration
- Playback rate
- Loop mode
- Playback queue context

Recommended improvement:

- Separate UI state from audio engine state
- Use reducer-based context or a small state library such as Zustand if complexity grows

## 9.2 Persistent playback

Persist locally in V1:

- Current track ID
- Last position
- Last playback rate
- Last selected Qira'a

Recommended behavior:

- Save local resume every 10 to 15 seconds or on pause and navigation
- Restore the last track on app reopen if it still exists
- Defer server-side listening sync until public accounts are introduced

## 9.3 Favorites handling

V1 behavior:

- Store favorites locally in `localStorage`
- Key favorites by `AudioTrackId`, not `SurahId`

Why this matters:

- The selected Qira'a is part of what the user is favoriting
- A favorite must point to a concrete playable track

Future server-side behavior:

- When public accounts are added, sync favorites through `/me/favorites`
- Keep the same `AudioTrackId` contract in both frontend and backend

## 9.4 Recently played and continue listening

V1 behavior:

- Use local storage or IndexedDB with a small history window
- Drive the home page continue-listening experience from local client state

Future behavior:

- Introduce server-side `ListeningHistory` only when public accounts are added

## 10. Clean Architecture Suggestion for .NET Backend

Recommended solution structure:

- `HassanAdly.Domain`
- `HassanAdly.Application`
- `HassanAdly.Infrastructure`
- `HassanAdly.Persistence`
- `HassanAdly.Api`
- `HassanAdly.Shared`

## 10.1 Domain layer

Responsibilities:

- Entities
- Value objects
- Domain rules
- Enumerations
- Domain events where truly necessary

Examples:

- `Surah`
- `Ayah`
- `Qiraa`
- `AudioTrack`
- `AyahTiming`
- `FeaturedContent`
- `TrackStatus`

Should not contain:

- EF Core logic
- HTTP concerns
- Storage SDK concerns

## 10.2 Application layer

Responsibilities:

- Use cases
- Commands and queries
- DTOs
- Validation
- Interfaces for repositories and services
- Authorization rules at use-case level

Examples:

- `GetSurahDetailsQuery`
- `ResolveTrackQuery`
- `UploadTrackCommand`
- `PublishTrackCommand`
- `GetRecordingMatrixQuery`

## 10.3 Infrastructure layer

Responsibilities:

- Blob storage access
- CDN URL generation
- Hashing and token services
- Audio metadata extraction
- External integrations

Examples:

- `AzureBlobMediaStorage`
- `CdnUrlResolver`
- `JwtTokenService`
- `AudioMetadataReader`

## 10.4 Persistence layer

Responsibilities:

- EF Core `DbContext`
- Entity configurations
- Migrations
- Repository implementations
- Read-model queries

Examples:

- `AppDbContext`
- `AudioTrackRepository`
- `SurahReadRepository`
- `RecordingMatrixQueryService`

## 10.5 API layer

Responsibilities:

- Controllers or minimal APIs
- Request and response mapping
- Authentication middleware
- Exception handling
- Rate limiting
- Swagger and OpenAPI exposure

Examples:

- `SurahsController`
- `TracksController`
- `SearchController`
- `AdminTracksController`

## 10.6 Shared layer

Responsibilities:

- Cross-cutting primitives
- Shared result types
- Shared constants and abstractions that do not belong to a specific business module

Important rule:

- `Shared` must stay small and should not become a dump for unrelated code

## 10.7 Dependency direction

Recommended dependency flow:

- `Api` -> `Application`
- `Application` -> `Domain`
- `Infrastructure` -> `Application`
- `Persistence` -> `Application` and `Domain`
- `Domain` -> no project dependencies
- `Shared` -> referenced only where truly needed

Why this is cleaner:

- Better separation of persistence from external integrations
- Easier testability
- Easier long-term maintenance as modules grow
- Cleaner modular-monolith boundaries

## 10.8 Worker support

Worker processing is still valid, but it should remain optional.

Recommended launch approach:

- Start with in-process background jobs or a single worker for media processing
- Extract into a separate worker deployment only when upload volume demands it

## 11. File Storage Strategy

## 11.1 Storage model

Recommended:

- Store large audio outside SQL
- Store only metadata and object keys in SQL

Do not store MP3 binary blobs inside the relational database.

## 11.2 Naming convention

Use deterministic, canonical paths.

Recommended pattern:

```text
/audio/hassan-adly/{qiraa-slug}/{surah-number-padded}-{surah-slug}-v{version}.mp3
```

Example:

```text
/audio/hassan-adly/hafs-an-asim/001-al-fatihah-v1.mp3
```

Benefits:

- Stable and predictable paths
- Easy CDN invalidation
- Easy versioned replacement
- Human-readable storage organization

## 11.3 Folder structure

Recommended structure:

```text
/audio/hassan-adly/
  /hafs-an-asim/
    001-al-fatihah-v1.mp3
    002-al-baqarah-v3.mp3
  /warsh-an-nafi/
    001-al-fatihah-v1.mp3

/images/sheikh/hassan-adly/
  profile.jpg
  hero.jpg

/waveforms/hassan-adly/
  /hafs-an-asim/
    001-al-fatihah.json
```

## 11.4 Metadata handling

Store in SQL:

- Object key
- Duration
- File size
- Bitrate
- Format
- Checksum
- Publish status
- Version number

Derive automatically on upload where possible.

## 11.5 File replacement strategy

Recommended:

- Never overwrite in place without versioning
- Upload new object with incremented version suffix
- Update the existing `AudioTrack` row to point to the new version
- Keep old object version for rollback until retention window expires
- Purge CDN only if path reuse is unavoidable

Why this matters:

- `AudioTrackId` remains stable for future favorites and playlists
- Operational rollback is simpler
- Frontend playback links remain logically consistent

## 12. Production Considerations

## 12.1 Scalability

Recommended priorities:

- Serve audio from CDN, not from the API application
- Cache hot catalog queries
- Keep upload and processing asynchronous
- Use pagination in admin and public listing endpoints
- Add database indexes on `SurahId`, `QiraaId`, `IsPublished`, `DisplayOrder`, and `Status`

V1 scalability principle:

- Prefer a clean modular monolith over premature distributed architecture
- Scale vertically first, then split only proven bottlenecks

## 12.2 Performance

Recommendations:

- Cache public catalog responses
- Pre-compute duration and metadata during ingestion
- Avoid N+1 loading in surah detail and admin grids
- Use projection queries for list endpoints
- Use image optimization for Sheikh media assets
- Keep search queries simple and index-backed

## 12.3 SEO

Public pages needing SEO:

- Home page
- About Sheikh page
- Surah detail pages
- Qira'a detail pages if added later

Recommendations:

- Use server-side rendering or static prerendering for public pages
- Provide canonical URLs
- Add Arabic metadata and Open Graph tags
- Add structured data where useful
- Generate sitemap with surah routes

Note:

- The current app is a Vite SPA. For strong SEO, move public pages to SSR or prerender strategy even if the UI remains visually unchanged.

## 12.4 Security

Recommendations:

- Protect admin routes with strict role checks
- Validate all uploads by MIME type and checksum
- Virus scan uploaded files if required by hosting environment
- Use rate limiting on auth and search endpoints
- Log all admin actions
- Avoid exposing raw storage credentials
- Use public CDN URLs in V1 unless access control is later required

## 12.5 Audio optimization

Recommendations:

- Standardize acceptable audio formats
- Extract metadata automatically
- Keep bitrate policy consistent
- Optionally provide lower bitrate variants later if mobile constraints require them
- Monitor failed range requests and slow start times

## 12.6 Deployment recommendation

Recommended production stack:

- Frontend: React app deployed to Vercel, Netlify, Azure Static Web Apps, or CDN-backed static hosting
- Admin dashboard: separate React deployment
- Backend: ASP.NET Core Web API on Azure App Service, container apps, or equivalent hosting
- Database: SQL Server or PostgreSQL managed service
- Storage: Azure Blob Storage or S3
- CDN: Azure CDN, CloudFront, or Cloudflare
- Observability: Application Insights, OpenTelemetry, Serilog, and centralized logs

## 13. Recommended Implementation Phases

### Phase 1 - V1 launch scope

- Build the core schema: `Sheikh`, `Surah`, `Qiraa`, `AudioTrack`, `MediaAsset`, `FeaturedContent`, `AdminUser`
- Build public APIs for Sheikh, Surahs, Qira'at, Search, and Track Resolve
- Build admin authentication
- Build admin track upload and publishing flow
- Build recording matrix view
- Move audio files to object storage and CDN

### Phase 2 - Quran metadata foundation

- Add `Ayah` data import
- Add `AyahTiming` support
- Prepare synchronized text APIs for later UI enhancements

### Phase 3 - Post-launch user features

- Add `PublicUser`
- Add server-side favorites by `AudioTrackId`
- Add `ListeningHistory`
- Add playlists with `PlaylistItem -> AudioTrackId`

### Phase 4 - Operational maturity

- Improve SEO rendering strategy
- Add richer reporting only where needed
- Introduce external search or separate workers only if usage justifies them

## 14. Direct Mapping from Current Frontend to Backend Needs

Current frontend behavior -> required backend design:

- Static `surahs.ts` -> `Surah` table + `GET /surahs`
- Static `qiraat.ts` -> `Qiraa` table + `GET /qiraat`
- `apiService.getAudioTrack(surahId, qiraaId)` -> `AudioTrack` table + `/tracks/resolve`
- `PlayerContext.currentTrack` -> resolved track DTO + local playback persistence in V1
- In-memory favorites -> local `AudioTrackId` favorites in V1, future `Favorite` table keyed by `AudioTrackId`
- Continue listening block on home -> local playback resume in V1, future `ListeningHistory`
- Selected page placeholder -> future `Playlist` + `PlaylistItem(AudioTrackId)`
- Downloads placeholder -> simple file download behavior, no cross-device download sync in V1
- About page static content -> `Sheikh` profile and related biography tables
- Hero CTA and featured content -> `FeaturedContent`
- Search page array filtering -> `/search` endpoint + normalized SQL search

## 15. Final Recommendation

The strongest production path is:

1. Keep the public frontend experience nearly unchanged.
2. Replace static arrays with catalog APIs.
3. Keep `AudioTrack` as the central playback entity.
4. Use object storage + CDN for MP3 delivery.
5. Launch V1 without public authentication, cross-device sync, playlists, or advanced analytics.
6. Add an authenticated admin dashboard for uploads, publishing, and recording coverage management.
7. Introduce `Ayah` and `AyahTiming` as future-ready metadata layers without forcing them into the public UI immediately.
8. Build the .NET backend as a modular monolith using Clean Architecture with clear layer boundaries.

This refined design preserves the strong parts of the original architecture, removes unnecessary complexity from V1, improves domain correctness, and keeps the system realistic for production delivery.
