# My Dua Collection App

A comprehensive Islamic dua management application designed to help Muslims organize, memorize, and practice their daily supplications with AI-powered assistance and smart features for special occasions like Ramadan and the 10 days of Dhul Hijjah.

## Table of contents

- [Overview](#overview)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [App Structure](#app-structure)
  - [Screens](#screens)
  - [Navigation](#navigation)
- [Detailed Screen Breakdown](#detailed-screen-breakdown)
  - [Home Screen](#home-screen)
  - [Collection Screen](#collection-screen)
  - [Explore Screen](#explore-screen)
  - [Tasbih Screen](#tasbih-screen)
  - [Bookmark Screen](#bookmark-screen)
  - [Profile Screen](#profile-screen)
- [Dua Features](#dua-features)
  - [Adding Duas](#adding-duas)
  - [Dua Properties](#dua-properties)
  - [Dua Data Model](#dua-data-model)
  - [Collection Properties](#collection-properties)
- [Design System and Conventions](#design-system-and-conventions)
  - [Theming](#theming)
  - [Icon Library](#icon-library)
  - [Search](#search)
  - [Project Structure and Naming](#project-structure-and-naming)
- [Key Features](#key-features)
  - [Collections System](#collections-system)
  - [AI Assistant](#ai-assistant)
  - [Smart Reminders](#smart-reminders)
  - [Month Mode](#month-mode)
  - [Share Features](#share-features)
- [Technical Stack](#technical-stack)
  - [Built with](#built-with)
  - [Planned integrations](#planned-integrations)
- [Design Inspiration](#design-inspiration)
- [To do](#to-do)
- [Author](#author)

## Overview

### Features

Users should be able to:

- **Dua Management:**
  - Add duas through image upload (OCR), manual entry, or AI assistance
  - Organize duas into multiple collections (like Instagram saves - a dua can belong to several collections)
  <!-- - Access Arabic text, transliteration, and translations with word-by-word analysis down to root words -->
  <!-- - Listen to audio recitations of duas -->
  - Track recitation with customizable tasbih counters (preset and custom)
  - Edit and delete user-created duas

- **Smart Organization:**
  - Create and manage custom collections
  - Reorganize collections with drag and drop (priority collections stay at top-left)
  - Filter collections: My Collections, Pre-made Collections, All Collections
  <!-- - Switch between grid and list views -->
  - Sort duas by date added, alphabetical, or custom order
  - Bookmark favorite duas for quick access

- **AI Features:**
  - Get dua recommendations based on situations
  - Ask questions about Islamic concepts
  - Generate custom duas for specific needs
  - Receive contextual explanations and commentary
  - Chat interface with conversation history
  - Suggested prompts for common queries

- **Special Occasions:**
  - Automatic Ramadan mode with special reminders and priority collection
  - Dhul Hijjah mode for the blessed 10 days
  - AI-powered priority collections during special Islamic months
  - Ramadan countdown timer
  - Context-aware dua suggestions

- **Learning Tools:**
  <!-- - Word-by-word translation with root word analysis (tap any word) -->
  - Historical context and scholarly commentary
  - Hadith and Quranic references
  - Benefits and virtues of each dua
  - "When to recite" guidance for occasions/timing

- **Additional Tools:**
  - Plain tasbih counter
  - 99 Names of Allah
  <!-- - Personal dua list/notepad (bullet points for personal duas) -->
  - Habits and life tracker
  - Islamic calendar date display
  - Search functionality

- **Sharing & Export:**
  - Generate beautiful dua cards with Arabic text, translation, transliteration, and app watermark
  - Share to social media and messaging
  - Save as image or copy text
  - Print entire collections
  - Download collections in PDF format with source and background for each dua (with customizable options)

- **Notifications:**
  - Daily dua reminders (customizable)
  - Ramadan-specific reminders (pre-Iftar, Suhoor, Taraweeh, last 10 nights, Zakat al-Fitr)
  - Custom notification schedules

- **Responsive Design:**
  - View optimal layout depending on device's screen size
  - Grid/list view toggle for collections
  - Adjustable font sizes for Arabic text
  - Dark/light mode appearance

### Screenshots

_[Screenshots will be added during development]_

### Links

- Repository URL: [https://github.com/Hikmahx/my-dua-collection](https://github.com/Hikmahx/my-dua-collection)
- Live App URL: [App Store/Play Store URL]
- Documentation: [Documentation URL]

## App Structure

### Screens

The app consists of **5 main screens** accessible via bottom navigation:

1. **Home** - Collections hub with grid/list view
2. **Explore** - Discovery, search, AI chat, and Islamic tools
3. **Tasbih** - Simple counter for dhikr
4. **Bookmark** - All saved/favorited duas (the Favorites tab)
5. **Settings** - Settings, notifications, and personal content

Opened from these screens (no bottom bar): the **Collection** screen, from a collection card on Home, and the add-dua modal, from the "+" button on Home.

### Navigation

**Bottom Navigation Bar:**
- Home
- Explore
- Tasbih
- Bookmark
- Settings

## Detailed Screen Breakdown

### Home Screen

**Primary Purpose:** Collections management hub

**Layout Components:**
- **Top Bar:**
  - Filter icon (top right) for browsing collections
  - Grid/List view toggle

- **Tabs/Filters:**
  - My Collections
  - Pre-made Collections
  - All Collections

- **Priority Collection Card (Top-Left):**
  - AI-powered collection for special occasions (Ramadan, Dhul Hijjah, etc.)
  - Always remains at top-left position
  - Shows AI icon to indicate priority status
  - User can reorganize other collections but this stays fixed

- **Collections Grid/List:**
  - User-created collections
  - Pre-made collections (Quranic Duas, Morning Adhkar, Evening Adhkar, Ramadan Duas, Travel, Sleep, Food & Drink, etc.)
  - Reorganizable via drag and drop
  - Each collection shows:
    - Collection name and cover
    - Tiny number badge showing dua count
    - Preview of included duas
  - Tapping a collection opens the [Collection Screen](#collection-screen)

- **Fixed "+" Button:**
  - Always visible on home screen
  - Opens modal with three options:
    1. Image Upload
    2. Manual Entry
    3. AI Assistant

### Collection Screen

**Primary Purpose:** The duas of one collection

Opened by tapping a collection card on Home (route `app/collection/[id].tsx`, where `id` is the collection id, e.g. `Quranic`). It opens over the tabs, so there is no bottom bar.

**Layout Components:**
- **Header:**
  - Back arrow
  - Collection name
  - Count of duas under the name ("11 duas")
  - Search icon: opens a search field under the header, and closes and clears it when tapped again (see [Search](#search))
- **List of duas:** one numbered row per dua, with
  - The number in a circle
  - The dua title
  - The source under the title, e.g. `Al-Baqarah · 2:201` for the Quran (surah name from `constants/surah-names.ts`, verse ranges with an en dash) or `Hadith · Qudsi 234`. Left out when the dua has no source
- **Empty states:** "No duas in this collection yet", or "No duas found" while searching
- **Planned:**
  - Collection description
  <!-- - Grid/list view toggle -->
  <!-- - Sort options: Date added, Alphabetical, Custom order -->
  - Share entire collection button
  - Print entire collection button
  - Tapping a row opens the dua (see [Dua Features](#dua-features))

The list is built from shared parts (`DuaListScreen`, `DuaListRow` in `components/dua-list/`, and `ScreenHeader`), which the [Bookmark Screen](#bookmark-screen) uses too.

### Explore Screen

**Primary Purpose:** Discovery, search, and Islamic tools

**Top Section:**
- **AI Chat:** "Ask anything here" - prominent call-to-action at top
- **Search Bar:** Universal search for duas

**Special Occasion Cards:**
- Ramadan card (when in Ramadan mode)
- Other Islamic month cards as applicable

**Features Grid/List:**
- **My Dua List/Notes:** Personal bullet-point notepad for duas
- **99 Names of Allah:** Reference guide
- **Tasbih (Plain):** Simple counter link
- **Favorites:** Bookmarked duas with collection indicators
- **Habits and Life:** Habit tracking feature
- **Search:** Deep search functionality

**Search Features:**
- Search by Arabic text
- Search by meaning/occasion
- Search by tags
- Browse by categories

**Current implementation (built):**
- Header with the "Explore" title and a filter icon that opens the same Appearance menu as Home (Dark / Light)
- Search bar with a clear button. It filters the topics by name and shows "No topics found" when nothing matches (it sits on a full-width band in light mode)
- 3x3 topics grid (defined in `constants/explore-topics.ts`, in reading order): Ask DuaAI, Names of Allah, Sunnah, Tahajjud, Hajj & Umrah, Ramadan & other fasting, Hijamah, Tawakkul & Yaqeen, Habits and Life. Ask DuaAI is a tile for now instead of the top call-to-action
- The grid takes all the remaining height between the search bar and the bottom tab bar. Each row is at least 130 tall (the screen scrolls on short devices), and the grid always shows at least 3 rows, even while searching, so the grid lines and background still fill the screen
- Cells alternate between two shades (checkerboard): `#043340` at 50% and `#063743` at 70% in dark mode. In light mode the cells frost the pattern behind them with white at 50%
- Pattern background behind the cells: `assets/images/cards-bg-dark.svg` and `assets/images/cards-bg-light.svg`, switched with the theme
- Each cell shows its icon in a 56x56 rounded box (translucent teal in dark mode, solid emerald `#066653` with the gold icon in light mode) and the topic name in the Berkshire font
- Every Explore color for both modes lives in `constants/explore-theme.ts`
- Tapping a topic does not navigate yet (the topic screens are still to build)

### Tasbih Screen

**Primary Purpose:** Simple dhikr counter

**Features:**
- Large number display (shakes when the counter reaches its goal)
- Tap to increment
- Reset button
- Clean, distraction-free interface
- Optional vibration/sound feedback

### Bookmark Screen

**Primary Purpose:** Quick access to saved duas

**Features:**
- All bookmarked/favorited duas, in the same list design as the [Collection Screen](#collection-screen) (numbered rows with the title and source, and the "N duas" count under the title)
- Shows which collections each dua belongs to, as small pills under the source: up to 2, then "+N" for the rest
- Search icon in the header (same search as the Collection screen). There is no back arrow, because it is a tab
- Empty state: "No favorite duas yet"
- Grid/list view toggle
- Quick access to dua details
- Remove bookmark option

### Profile Screen

**Primary Purpose:** Settings and personal content

**Sections:**

1. **Personal Content:**
   - Profile details

2. **Islamic Calendar:**
   - Today's date in Islamic calendar
   - Gregorian date

3. **Notifications:**
   - Notification settings and preferences
   - Daily reminder and other months configuration and toggle

4. **Appearance:**
   - Dark/Light mode toggle
   - Font size adjustment
   - Arabic text styling preferences

5. **Language & Translation:**
   - Translation language preferences
   - Multiple language support options

<!-- 6. **Content:**
   - Notes/Dua journal
   - Personal dua list management -->

6. **About & Support:**
   - App information
   - Help documentation
   - Contact support
   - Privacy policy

## Dua Features

### Adding Duas

The "+" button on the home screen opens a modal with **three methods**:

#### 1. Image Upload (OCR)
**Flow:**
- Choose between camera viewfinder or gallery upload
- OCR processing indicator appears
- Review scanned text screen:
  - Editable Arabic text field
  - Auto-detect translation (if possible)
  - Add to collections (multi-select)
  - Add notes/context field
  - Save button

#### 2. Manual Entry
**Form Fields:**
- **Dua title/occasion** (text input)
- **Arabic text input** (textarea with Arabic keyboard support)
- **Transliteration** (text input)
- **Translation** (multiple language options via dropdown)
- **Source** (select Quran or Hadith) and **Reference** (text input; the placeholder changes with the selected source, e.g. `11:38` for Quran, `Qudsi 234` for Hadith)
- **Audio upload** (optional file upload)
- **Tags** (comma-separated or tag selector)
- **Add to collections** (multi-select checkbox)
- Save button

#### 3. AI Assistant (Advanced Feature)
**Flow:**
- Text input field: "I need a dua for..."
- Submit to AI
- AI processes and suggests relevant duas
- Result screen shows:
  - Suggested dua(s)
  - Arabic text
  - Translation
  - Sources/references
  - "Refine suggestion" button
  - "Save to collection" button (multi-select)

### Dua Properties

**Every dua includes:**

1. **Text Content:**
   - Arabic text (adjustable font size)
   - Transliteration (toggle on/off)
   - Translation in selected language(s) (toggle on/off)
   <!-- - Word-by-word tapping feature:
     - Tap any word to see popup with:
       - Individual word meaning
       - Root word in Arabic
       - Grammatical notes
       - Related vocabulary -->

2. **Metadata:**
   - Collection(s) it belongs to (can be multiple)
   - Tags for categorization
   - Source and reference (see [Dua Data Model](#dua-data-model))

3. **Interactive Elements:**
   - **Tasbih Counter:**
     - Customizable by user
     - Some duas (morning/evening adhkar) have preset, fixed counters (+/- doesn't show)
     - Others have preset counters that can be adjusted by user (saved & updatable)
   - **Audio Player:** Play dua recitation
   - **Share Icon:** Generate and share dua card
   - **Bookmark Icon:** Save to favorites
   - **Collections Button:** Shows which collections the dua belongs to
   - **Context & Commentary Icon (ℹ️):** Opens overlay with:
     - "When to recite" (occasions/timing)
     - Historical context
     - References (Hadith, Quran, scholarly sources)
     - Scholarly commentary
     - Benefits/virtues of this dua

4. **User Actions (for created duas only):**
   - Edit button
   - Delete button
   - These only appear for duas the user created

### Dua Data Model

```typescript
export type DuaSource = 'quran' | 'hadith'
export type DuaOrigin = 'builtin' | 'manual' | 'ai' | 'image' | 'shared'

export interface Dua {
  id: string
  title: string
  arabicText: string
  transliteration?: string
  translations: Record<string, string> // keyed by language code
  categories: string[]
  source?: DuaSource
  reference?: string // '21:87' or '11:39-42'
  info?: string // HTML from the rich editor
  origin: DuaOrigin
  isFavorite: boolean
  iconPath?: string
}
```

- **Source and reference:** `source` is a fixed option (Quran, Hadith) and `reference` is the detail within it. Both are optional, so duas without a known source (manual or AI-generated) don't need them. Quran references can be a single verse (`21:87`) or a range (`11:39-42`), validated with `/^\d{1,3}:\d{1,3}(-\d{1,3})?$/` plus a check that the surah number is 114 or less. The reference input placeholder changes with the selected source (`11:38` for Quran, `Qudsi 234` for Hadith). Lists show them as a source line, e.g. `Al-Baqarah · 2:201` (`formatSourceLine` in `lib/dua-utils.ts`).
- **Translations:** stored per language code. The user picks a language in Settings and the app shows `translations[language]`, falling back to `translations.en` if that language is missing.
- **Transliteration:** optional per dua, and shown or hidden with a `showTransliteration` toggle in Settings.
- **Categories:** an array, since a dua can belong to several categories. A category id is also a collection id (see `constants/collections.ts`).
- **Info:** rich text (bold, bullet points, titles) about the dua, stored as HTML. It must be sanitized before rendering.
- **Origin:** where the dua came from: `builtin` (ships with the app), `manual` (typed by the user), `ai`, `image` (scanned), or `shared` (from another user). This replaces `isUserCreated`; edit and delete actions apply to anything other than `builtin`.
- **Favorites:** tracked only through `isFavorite` on each dua. There is no separate favorites array.
- **Settings:** `settingsSlice` holds `language` (default `'en'`) and `showTransliteration`.
- **Data source:** duas load from `data/data.json` (33 duas: 15 general duas and 18 dhikr in the Dhikr collection). The built-in duas are always read from `data.json`, so adding or editing them needs no cache reset. The copy saved on the device only keeps what the user changed: favorites and the duas they added.

### Collection Properties

**Every collection includes:**

1. **Visual Elements:**
   - Collection name
   - Cover image/icon
   - Tiny number badge (shows dua count)

2. **Content:**
   - List/grid of duas within collection
   - Preview cards for each dua

3. **Organization Options:**
   - **Sort options:**
     - Date added
     - Alphabetical
     - Custom order (drag and drop)
   - Grid/List view toggle

4. **Actions:**
   - Share entire collection (generates shareable format)
   - Print entire collection
   - Edit collection name/cover (for user-created collections)
   - Delete collection (for user-created collections)

## Design System and Conventions

### Theming

- Dark mode is the default. The user's choice is saved on the device and restored on launch
- The theme is switched from the Appearance menu (filter icon) on the Home, Explore and Tasbih screens
- Shared palette: `tailwind.config.js` (for class names), mirrored in `constants/theme-colors.ts` (for SVG props, icons and `rgba()` values; `withAlpha(hex, opacity)` adds transparency to a palette color). Keep the two in sync
- Screen-specific colors for both modes, next to the palette: `constants/explore-theme.ts`, `constants/tasbih-theme.ts` and `constants/dua-list-theme.ts`. They reuse the shared palette and only spell out values sampled from that screen's design
- Components read the current mode with `useColorScheme()` (or a small hook such as `useTasbihColors()` and `useDuaListColors()`), so each screen only needs its light and dark values defined once
- Screens with a header band (Explore, Tasbih, Collection, Bookmark) use `ScreenHeader`: a title, an optional subtitle, an optional left slot (e.g. a back arrow) and a right slot (the Appearance menu by default)

### Icon Library

All collection icons live in one library, because the same icons are reused in several places: collection covers, the Explore topics, and the icon picker users will get when creating a new collection.

- **Source SVGs:** `assets/icons/collection/`. File names describe what the icon shows (lowercase, hyphens, no "icon" suffix): `book`, `sun`, `moon`, `lamp`, `journal`, `hands`, `chat-sparkle`, `star-pillars`, `open-book`, `moon-sparkle`, `kaaba`, `crescent-cup`, `cupping-cup`, `heart-check`, `checklist`
- **Rendering:** `components/icons/collection-icons/` (TSX). The SVGs are drawn as `react-native-svg` components so the color and size follow the theme, which a plain `.svg` file cannot do
- **Rule:** the SVG is the source of truth and the TSX is generated from it. To add an icon, drop the `.svg` into `assets/icons/collection/`, add its name to `scripts/generate-line-icons.js`, then run `node scripts/generate-line-icons.js` (this rebuilds `line-icons.tsx`). The first six icons (`book`, `sun`, `moon`, `lamp`, `journal`, `hands`) are drawn directly in `collection-icons/index.tsx`
- **Picker:** `COLLECTION_ICON_KEYS` lists every selectable icon, in order, for the "choose an icon" grid
- Tab bar and other app icons stay in `components/icons/`

### Search

Every search box in the app uses the same code, so they all behave the same way.

- **Matching** (`lib/search.ts`): `normalizeForSearch` lowercases the text and, for Arabic, removes the diacritics, Quranic signs and tatweel and treats every alef the same, so "سبحان" finds "سُبْحَانَ". `matchesSearch(query, fields)` is true when any field contains the query, and an empty query matches everything
- **Hook** (`hooks/use-search.ts`): `useSearch(items, getFields)` keeps the query and returns `{ query, setQuery, results, isSearching }`. `getFields` says which text of an item is searchable. Define it outside the component so the results aren't recomputed on every render
- **Dua fields:** `duaSearchFields` in `lib/dua-utils.ts` gives the title, transliteration, Arabic and every translation of a dua
- **Input:** `SearchField` (`components/ui/search-field.tsx`) is the rounded search bar with the clear button
- **Used by:** the Tasbih "Choose a dua" picker (it shows the 10 preset duas while the box is empty), the Collection screen, the Bookmark screen, and the Explore topics (`[topic.label]`)
- **To add search to a new list:** call `useSearch(items, getFields)`, render a `SearchField` bound to `query` and `setQuery`, and show `results`

### Project Structure and Naming

- File names are lowercase with hyphens (`explore-card.tsx`, `theme-colors.ts`). Redux reducer files stay camelCase (`duasSlice.ts`). Route files in `app/` follow Expo Router
- `components/ui/` holds reusable UI, `components/icons/` holds icons, `constants/` holds static data and theme values, `lib/` holds helpers and storage, `hooks/` holds hooks, `data/` holds the dua data (`data.json`)
- Components used by one feature live in a folder named after it: `components/tasbih/`, and `components/dua-list/` (shared by the Collection and Bookmark screens)
- Screens stay thin: shared pieces (cards, filter menu, tab selector, backgrounds, lists) are separate components

## Key Features

### Collections System

**Multi-Collection Assignment:**
- Like Instagram saves - a dua can belong to multiple collections
- Select multiple collections when adding a dua
- View all collections a dua belongs to from dua detail screen (the Bookmark list already shows them as pills)

**Collection Types:**
1. **Pre-made Collections:**
   - Quranic Duas (nested by Surah):
      - Organized by chapter with Surah name, number, and dua count
      - Toggle between: all chapters at once (expanded) or filtered by specific Surah
      - Structure: Quranic Duas → Surah Al-Baqarah (5 duas) → Individual duas
   - Morning Adhkar
   - Evening Adhkar
   - Ramadan Duas
   - Travel Duas
   - Sleep & Waking
   - Food & Drink
   - Protection & Healing
   - And more...

2. **AI Priority Collection:**
   - Appears at top-left during special occasions
   - Marked with AI icon
   - Dynamically curated for Ramadan, Dhul Hijjah, etc.
   - Cannot be moved from top-left position

3. **User-Created Collections:**
   - Custom names and covers
   - Fully editable and deletable
   - Reorganizable (except priority collection)

**Collection Management:**
- **Email requirement:** Users must provide email once to create collections (enables backend saving). Perhaps prompt the user only once when they want to create their first collection
- **Local caching:** All duas cached locally for offline access
- **Cloud sync:** User-created collections synced to backend

### AI Assistant

**Location:** Explore screen (top section)

**Chat Interface:**
- Conversation history saved
- "Ask anything here" prominent CTA

**Suggested Prompts:**
- "Find a dua for traveling"
- "Teach me about morning adhkar"
- "What dua should I recite when anxious?"
- "Explain the benefits of Ayatul Kursi"

**AI Capabilities:**
- Dua recommendations based on situation
- Explanation of Islamic concepts
- How-to guides (proper wudu, prayer positions, etc.)
- Custom dua generation for specific needs
- Quiz mode for memorization
- Habit suggestions

**AI-Generated Dua Result Screen:**
- Shows AI-suggested dua
- Option to save to collection (multi-select)
- Sources/references provided
- "Refine suggestion" button

### Smart Reminders

**Daily Reminders:**
- Customizable time and frequency
- Choose specific collection or random dua
- Notification preview

**Ramadan-Specific Reminders:**
- Pre-Iftar dua (15 minutes before)
- Suhoor time reminder
- Taraweeh prayer reminder
- Last 10 nights special notifications
- Zakat al-Fitr reminder

**Configuration:**
- Managed in Profile > Notifications
- Toggle on/off for each type
- Time selection for daily reminders

### Month Mode

**Automatic Detection:**
- Ramadan mode
- Dhul Hijjah mode (10 days)
- Other Islamic months

**Ramadan Mode Features:**
- **Explore Screen:** Ramadan card appears at top
- **Home Screen:** AI priority collection emphasizes Ramadan duas
- **Extra Reminders:**
  - More frequent notifications
  - Ramadan-specific alerts (Iftar, Suhoor, etc.)
  - Last 10 nights special reminders
- **Ramadan Collection:** Auto-created or promoted
- **Ramadan Countdown:** Display countdown to/within Ramadan

**Dhul Hijjah Mode:**
- Similar priority collection for the 10 blessed days
- Specific duas for these days highlighted

### Share Features

**Beautiful Card Generator:**
- Arabic text (formatted beautifully)
- Translation
- Transliteration
- App watermark/branding

**Share Options:**
- Share to social media (Instagram, Twitter, Facebook, WhatsApp)
- Share to messaging apps
- Save as image to device
- Copy text to clipboard

**Collection Export:**
- **PDF Download:**
  - Entire collection exportable
  - User choice of content:
    - Option 1: All context and commentary for each dua
    - Option 2: Just source and background
  - Formatted for printing
  - Includes collection name and metadata

## Technical Stack

### Built with

- **Frontend:**
  - React Native
  - Redux Toolkit
  - Tailwind CSS
  - Expo file-based routing

- **Backend:**
  - Node.js - Runtime environment
  - Express.js - Backend framework
  - MongoDB - NoSQL database
  - JWT

- **AI & Services:**
  - Groq API - AI assistant for dua recommendations and Islamic Q&A
  - Google Vision API / Tesseract OCR - Image text extraction for dua scanning
  - [TBD] - Translation API (Google Translate API / DeepL)
  - [TBD] - Audio hosting/streaming service
  - [TBD] - Push notification service (Firebase Cloud Messaging / OneSignal)

- **Storage:**
  - Local caching for offline access (AsyncStorage)
  - Cloud sync for user-created collections (MongoDB Atlas)
  - [TBD] - Cloud storage for images/audio (AWS S3 / Firebase Storage / Cloudinary)

- **Additional Libraries:**
  - PDF generation library (react-native-pdf / pdf-lib)
  - Share functionality (react-native-share)
  - Image picker (react-native-image-picker / image_picker)
  - Audio player (react-native-sound / audioplayers)

### Planned integrations

- Islamic calendar API for date conversion (Hijri <-> Gregorian)
- Prayer times API (optional integration for reminder timing)
- Translation APIs for multiple languages
- Text-to-speech for audio generation
- Social media SDKs for sharing
- Analytics for app usage insights (optional)

## Design Inspiration

**App References:**
- **Dhikr and Dua** - UI/UX patterns for Islamic content and commentary display
- **Al Quran (by Greentech Apps Foundation)** - filter/menu icon, Word-by-word translation feature with root word analysis, translation & transliteration toggle
- **Instagram** - Multi-collection save feature (a post can be saved to multiple collections)

**Visual Style:**
- Clean, modern Islamic aesthetic
- Subtle geometric patterns (Islamic art motifs)
- Calligraphy accents for Arabic text
- Color palette: Deep greens/blues with gold accents
- Highly readable Arabic typography (multiple font options)
- Card-based UI design for duas and collections
- Smooth animations and transitions
- Respectful, spiritual atmosphere

**Design Principles:**
- Distraction-free reading experience
- Accessibility (adjustable font sizes, high contrast)
- Offline-first approach
- Fast, responsive interactions
- Beautiful share cards for social media

## To do

### Core Features (MVP)
- [ ] Authentication and user management (email required for cloud sync)
<!-- - [x] Bottom navigation setup (5 screens)
- [x] Dark/light mode with a saved preference
- [x] Dua data model (source, reference, translations, categories, info, origin) loaded from `data/data.json`
- [x] Reusable collection icon library (see [Icon Library](#icon-library))
- [x] Splash screen
- [x] Dhikr collection (18 dhikr duas in `data/data.json`)
- [x] One shared search for every list and search box (see [Search](#search))
- [x] **Explore Screen UI:**
  - [x] Search bar that filters the topics
  - [x] 3x3 topics grid that fills the remaining height
  - [x] Light and dark themed cells and background pattern
- [ ] **Home Screen:**
  - [x] Collections grid view (2, 3 or 4 columns by screen width)
  - [ ] Collections list view
  - [x] Filter tabs (My Collections, Pre-made, All)
  - [x] Open a collection by tapping its card
  - [ ] Reorganizable collections
  - [x] Fixed "+" button for adding duas -->
- [ ] **Manual Dua Entry:**
  <!-- - [x] Form with title, Arabic, translation, categories, source and reference
  - [ ] Transliteration and info (rich text) fields
  - [x] Multi-collection assignment
  - [x] Save to local cache -->
  - [ ] Save to backend
- [ ] **Collection Management:**
  <!-- - [x] Collection screen: name, dua count, numbered list with source line, search -->
  - [ ] Create custom collections
  - [ ] Collection description
  - [ ] Sort duas within collections
  - [ ] Edit/delete collections
- [ ] **Dua Detail View:**
  - [ ] Arabic text display
  - [ ] Translation (toggle on/off)
  - [ ] Transliteration (toggle on/off)
  - [ ] Collections indicator
  - [ ] Bookmark icon
  - [ ] Share button
  - [ ] Open it from the Collection and Bookmark lists
- [ ] **Tasbih Counter:**
  <!-- - [x] Simple counter screen -->
  - [ ] Customizable counters per dua
  - [ ] Preset counters for morning/evening adhkar
- [ ] **Bookmark System:**
  <!-- - [x] Bookmark screen with all saved duas, the collections each one is in, and search -->
  - [ ] Save/unsave duas
  - [ ] Remove a bookmark from the list
- [ ] **Profile Screen:**
  - [ ] Basic settings (appearance, language)
  - [ ] Today's Islamic date
<!-- - [x] Local caching for offline access -->
- [ ] Cloud sync for collections

### AI & Advanced Input
- [ ] **Image OCR:**
  - [ ] Camera integration
  - [ ] Gallery image upload
  - [ ] Text extraction from images
  - [ ] Review and edit scanned text
  - [ ] Auto-detect translation
- [ ] **AI Chat Assistant:**
  - [ ] Chat interface on Explore screen
  - [ ] Conversation history
  - [ ] Suggested prompts
  - [ ] Dua recommendations
  - [ ] Islamic Q&A
  - [ ] Save AI suggestions to collections
- [ ] **AI Priority Collection:**
  - [ ] Auto-create for Ramadan/Dhul Hijjah
  - [ ] Fixed position at top-left
  - [ ] AI icon indicator
- [ ] **Search Functionality:**
  <!-- - [x] Search all duas by title, transliteration, Arabic and translation (Tasbih dua picker, Collection screen, Bookmark screen) -->
  - [ ] Universal search on Explore screen
  - [ ] Search by Arabic text, meaning, tags
  - [ ] Filter and browse options

### Enhanced Features
- [ ] **Audio Integration:**
  - [ ] Audio player for duas
  - [ ] Upload custom audio
  - [ ] Audio file hosting
<!-- - [ ] **Word-by-Word Translation:**
  - [ ] Tap-to-reveal word meanings
  - [ ] Root word analysis
  - [ ] Grammatical notes
  - [ ] Related vocabulary -->
- [ ] **Context & Commentary:**
  - [ ] "When to recite" information
  - [ ] Historical context
  - [ ] Hadith/Quran references
  - [ ] Scholarly commentary
  - [ ] Benefits and virtues
- [ ] **Share Card Generator:**
  - [ ] Beautiful card design
  - [ ] Include Arabic, translation, transliteration
  - [ ] App watermark
  - [ ] Save as image
  - [ ] Share to social media
- [ ] **PDF Export:**
  - [ ] Export entire collections
  - [ ] Customizable content (full commentary vs. basic)
  - [ ] Print-ready formatting

### Special Features & Optimization
- [ ] **Month Mode System:**
  - [ ] Ramadan mode detection
  - [ ] Dhul Hijjah mode
  - [ ] Ramadan countdown
  - [ ] Special occasion cards on Explore screen
- [ ] **Smart Reminders:**
  - [ ] Daily dua reminders
  - [ ] Ramadan-specific reminders
  - [ ] Custom notification schedules
  - [ ] Push notification integration
- [ ] **Additional Tools:**
  - [ ] 99 Names of Allah reference
  - [ ] Plain tasbih counter on Explore
  - [ ] My Dua List/Notes (personal notepad)
  - [ ] Habits and Life tracker
- [ ] **Multi-Language Support:**
  - [ ] Translation API integration
  - [ ] Multiple language preferences
  - [ ] Auto-detect translation from OCR
- [ ] **Performance Optimization:**
  - [ ] Lazy loading for large collections
  - [ ] Image compression
  - [ ] Efficient caching strategies
  - [ ] Background sync

### Future Considerations
- [ ] Memorization quiz mode
- [ ] Community features (share collections publicly)
- [ ] Offline audio downloads
- [ ] Widget support (daily dua on home screen)
- [ ] Apple Watch / Wear OS companion app
- [ ] Family sharing features
- [ ] Share duas with friends (the first time a dua is shared with someone, the app asks if they should be added as a friend)
- [ ] Prayer time integration (optional)
- [ ] Qibla direction finder
- [ ] Integration with Quran apps

## Author

- Github - [Hikmah Yousuph](https://github.com/Hikmahx)
- Email - [hikmayousuph@gmail.com](mailto:hikmayousuph@gmail.com)
- LinkedIn - [Hikmah Yousuph](https://linkedin.com/in/hikmah-yousuph)
- Website - [hikmayousuph.com](https://hikmayousuph.com)

---

**Note:** This is a personal Islamic app project aimed at helping Muslims organize and practice their daily supplications with the assistance of modern technology. The app prioritizes authentic sources and provides proper references for all duas.

**Core Values:**
- Authenticity: All duas sourced from authentic Islamic texts
- Respect: Reverent presentation of sacred content
- Accessibility: Easy to use for all age groups
- Privacy: User data protected and secured
- Offline-First: Core features work without internet

May Allah ﷻ accept this effort and make it beneficial for the Muslim community. Ameen.

---

## License

<!-- [Choose appropriate license - MIT, GPL, etc.] -->

## Acknowledgments

- Islamic scholars and references used for duas
- Dhikr and Dua app for UI inspiration
- Al Quran app for word-by-word feature inspiration
- The Muslim community for support and feedback