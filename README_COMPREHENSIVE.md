# My Dua Collection App: Comprehensive Documentation

> The detailed reference for this project: features, screen specs, data model, conventions and the full to-do list. For an overview with screenshots, see [README.md](README.md).

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
  - [PDF Export](#pdf-export)
  - [Project Structure and Naming](#project-structure-and-naming)
- [Key Features](#key-features)
  - [Collections System](#collections-system)
  - [AI Assistant](#ai-assistant)
  - [Smart Reminders](#smart-reminders)
  - [Month Mode](#month-mode)
  - [Toasts](#toasts)
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
  - Filter a collection or the favorites by surah or hadith name
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
  - Generate beautiful dua cards with Arabic text, translation, transliteration, and app watermark. Done: see [Share Features](#share-features)
  - Share to social media and messaging apps (WhatsApp, Instagram, Facebook, X, Telegram, Messenger, and any other app through the system share sheet)
  - Save the card as an image or copy the text
  - Share with your **kindred** (people you share duas with, in groups such as Family, Friends, Mosque and Classmates), or with someone by their user code
  - Print entire collections (from the share sheet that opens after a PDF export)
  - Download collections in PDF format with source and background for each dua (with customizable options). Done: see [PDF export](#pdf-export)

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

The screen designs are in [README.md](README.md#screens--functionality) (the images are in `public/readme/`).

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

Opened from these screens (no bottom bar): the **Collection** screen, from a collection card on Home, the **Edit collection** screen, from the Collection screen's menu, and the add-dua modal, from the "+" button on Home or from "Add dua" in the Collection screen's menu.

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
  - Count of duas under the name ("11 duas"). While a filter is on it adds the filter, e.g. "3 duas · Bukhari"
  - Search icon: opens a search field under the header, and closes and clears it when tapped again. It also finds duas by surah and hadith name (see [Search](#search))
  - Filter icon: opens a menu with a **Manage** section (**Add dua** and **Edit collection**), then the source filter section (see below), then Appearance, then an **Export** section (**Export as PDF**, see [PDF export](#pdf-export))
- **Manage section:**
  - **Add dua** opens the add-dua sheet ("Choose how you'd like to add your dua"). The new dua goes into this collection, which is already ticked in the form's collection list (see [Adding Duas](#adding-duas))
  - **Edit collection** opens the [Edit Collection Screen](#edit-collection-screen). It is dimmed (and does nothing) for pre-made collections, because only collections the user made can be edited
- **Filter by source:**
  - The section is named after what the collection has. With both surahs and hadith it is **Filter**, holding a **Surah** group (the surahs found, in Quran order) and a **Hadith** group (the hadith collections, such as Bukhari and Tirmidhi, from A to Z), each with a small label. With only surahs, the section is just **Surah**; with only hadith, just **Hadith**, and the options are listed directly with no extra label. With neither, there is no section
  - The section has a maximum height (about five rows). A long list, such as every surah favorited, scrolls inside the section while Manage and Appearance stay in place
  - One filter at a time: pick a surah or a hadith, and tap it again to clear it. A gold dot on the icon shows a filter is on
  - The hadith name is the text before the number in the reference (`Bukhari 6324` gives `Bukhari`)
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
  - <!-- Print entire collection button: available from the share sheet after Export as PDF -->
  - Tapping a row opens the dua (see [Dua Features](#dua-features))

The list is built from shared parts (`DuaListScreen`, `DuaListRow` in `components/dua-list/`, `ScreenHeader`, and the `useSourceFilter` hook), which the [Bookmark Screen](#bookmark-screen) uses too. Dragging rows into a new order is the shared `ReorderableList` (`components/ui/reorderable-list.tsx`), used by the Edit collection screen and by Favorites; the math is in `lib/reorder.ts`. A collection the user made shows its duas in the order they chose (see below).

### Edit Collection Screen

**Primary Purpose:** Rename a collection the user made, put its duas in a new order, take duas out of it, or delete it

Opened from **Edit collection** in the Collection screen's menu (route `app/edit-collection/[id].tsx`, built in `components/collection-edit/`). The colors are in `constants/collection-edit-theme.ts` (light and dark).

**Layout Components:**
- **Header:** back arrow, "Edit collection", and under it the count and "Your collection" ("11 duas · Your collection"). **Cancel** on the right
- **Collection name:** a text field (up to 40 characters). **Save changes** is dimmed while it is empty
- **Duas · 11:** a list of rows with a red dash on the left (removes the dua from this collection only) and six dots on the right (the drag handle). Press and hold the dots, then drag. The list scrolls by itself when a row is dragged near the top or bottom. For screen readers the handle has "Move up" and "Move down" actions
- **Footer:** "Removing a dua only changes this collection.", **Delete collection** and **Save changes**
- **Delete dialog:** "Delete My Dhikr?" explains that the collection and its order are deleted and the duas stay in the dua library. **Delete collection** deletes it and returns to Home. **Keep collection** (or tapping outside) closes the dialog

Changes are kept on screen until **Save changes**. **Cancel** and the back arrow drop them.

**How collections are stored:** a collection the user made has its own list of dua ids in order (`duaIds`), unlike a pre-made one, whose duas are the ones that name it in `collection`. Because of that, a dua can be in a collection without changing the dua, and built-in duas can be in one. They live in `collectionsSlice` and are saved on the device as `collections:v1` (`lib/collections-storage.ts`, `useCollectionsPersistence`). A dua deleted from the library leaves every collection, and a collection that had only that dua is deleted with it. **A collection cannot exist without a dua**: collections are created only together with their first dua, from the add-dua form (the "+" pill) or from the Dua screen's **Save to collection** sheet (**New collection**). Both go through one all-or-nothing step: the `createDuaInCollections` / `saveDuaCollections` thunks (`redux/thunks.ts`) check the rule and dispatch a single action (`addDuaWithCollections`, or `setDuaCollections` in `collectionsSlice`), so a cancelled or failed add can never leave a collection without a dua or a dua without a collection. Pre-made collections are read only, so a dua can only be added to collections the user made. The rule is also enforced when data is read and edited: saved collections with no duas are dropped on launch (`sanitizeCollections`), and saving the Edit collection screen with no duas left offers to delete the collection instead. Collections are saved to the device immediately (not after a delay), together with the duas.

#### Save to collection sheet

Opened by the **+** in the Dua screen's bottom bar (`components/dua-screen/save-to-collection-sheet.tsx`, on `components/ui/bottom-sheet.tsx`), in the style of TikTok's collections sheet:
- **New collection** is the first row; tapping it turns it into a name field (tick to confirm, cross to cancel). A name that is typed but not confirmed still counts when **Done** is tapped.
- Below it are only the collections the user made (pre-made ones are read only), each with an icon, its dua count and a tick circle. Tick one or more.
- The ticks are a draft. **Done** saves them; closing the sheet any other way drops them, and a new collection made in the sheet is not created.
- A dua the user added must stay in at least one collection (a message explains it). A built-in dua can leave them all, because it is in a pre-made collection.
- Unticking a collection that holds only this dua asks first: it will be deleted, because a collection cannot be empty.

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
- Browse by collection

**Current implementation (built):**
- Header with the "Explore" title and a filter icon that opens the same Appearance menu as Home (Dark / Light)
- Search bar with a clear button. It filters the topics by name and shows "No topics found" when nothing matches (it sits on a full-width band in light mode)
- 3x3 topics grid (defined in `constants/explore-topics.ts`, in reading order): Ask DuaAI, Names of Allah, Sunnah, Tahajjud, Hajj & Umrah, Ramadan & other fasting, Hijamah, Tawakkul & Yaqeen, Habits and Life. Ask DuaAI is a tile for now instead of the top call-to-action
- The grid takes all the remaining height between the search bar and the bottom tab bar. Each row is at least 130 tall (the screen scrolls on short devices), and the grid always shows at least 3 rows, even while searching, so the grid lines and background still fill the screen
- Cells alternate between two shades (checkerboard): `#043340` at 50% and `#063743` at 70% in dark mode. In light mode the cells frost the pattern behind them with white at 50%
- Pattern background behind the cells: `assets/images/cards-bg-dark.svg` and `assets/images/cards-bg-light.svg`, switched with the theme
- Each cell shows its icon in a 56x56 rounded box (translucent teal in dark mode, solid emerald `#066653` with the gold icon in light mode) and the topic name in the Berkshire font
- Every Explore color for both modes lives in `constants/explore-theme.ts`
- Tapping a topic opens its screen. Explore is a stack inside the tab (`app/(tabs)/explore/`), so these screens keep the tab bar:
  - **Topic list** (`explore/[topic]`, `components/explore/article-list-screen.tsx`): back arrow, title, a search box and one row per article (title and a one-line preview). Every topic except Ask DuaAI uses it. The Names of Allah rows show the Arabic name on the right; all other rows show a chevron
  - **Article** (`explore/[topic]/[article]`): the title (plus the Arabic name and meaning for a Name of Allah) and the text, drawn with `RichText`
  - **Ask DuaAI** (`explore/ask-duaai`, `components/chat/`): a chat that is not saved. The messages live in the screen's state, so they are gone when the user leaves. Replies come from `askDuaAI` in `lib/duaai.ts`, which is a placeholder until the AI backend exists. The tab bar hides while the keyboard is open
- The articles are data, not code: `data/explore_articles.json` (the topics) and `data/names_of_allah.json` (the 99 Names), described in `DATA.md`. They are drafts to be reviewed before release

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
- Search and filter icons in the header, the same as the Collection screen: search also finds duas by surah and hadith name, and the filter menu has a **Reorder** option, then the source filter (Filter, Surah or Hadith, as above), then Appearance. There is no back arrow, because it is a tab
- **Reorder:** the user decides the order of their favorites. Tapping **Reorder** (dimmed with fewer than two favorites) shows a grip (six dots) on every row. Press and hold it, then drag the row to a new place; the list scrolls by itself near the top and bottom, and screen readers get "Move up" and "Move down" actions. Each drag is saved right away, and **Done** (where the icons were) goes back to the normal list. While reordering, search and the filters are put aside so the whole list can be arranged, and the collection pills are hidden so every row is the same height
- **The order is used everywhere:** the Favorites list shows the favorites in this order, and the Dua screen goes through the same list, so when one dua is finished the next one is the next favorite in the order the user set. A dua that is newly favorited goes at the end, and an unfavorited one leaves the order
- **How the order is stored:** `favoriteOrder` in `duasSlice` (ids in order). The saved copy keeps it as `favoriteIds` in `duas:v2` (this was already a list, so no new version: favorites saved before this update start in the order they were in). It will be the `position` of each `user_favorites` row (see `data/README.md`)
- Empty state: "No favorite duas yet"
- Grid/list view toggle
- Quick access to dua details
- Remove bookmark option

### Profile Screen

**Primary Purpose:** Settings and personal content

**Sections:**

1. **Personal Content:**
   - Profile details (name and avatar). Without signing in, the app starts as **Guest**: the name shows as "Guest" with the default avatar until the user changes it, and any change is saved on this device only. Signing out goes back to the guest profile

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
   - App language (the app's own text), picked in a bottom sheet. English only for now; the text lives in `locales/en.ts` and is read with `useT()`
   - Translation language (which translation of a dua is shown), picked in a bottom sheet, with how many duas have a translation in each language

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
**Flow** (`components/add-dua/image-dua-step.tsx`):
- Choose between the camera (its own viewfinder) and the photo library (`expo-image-picker`; the camera asks for permission the first time, the library needs none). The picture is shrunk to 1600 px wide and saved as a JPEG before it is sent (`lib/pick-dua-image.ts`)
- A progress overlay on the picture ("Reading the text...") while the text is read, with a **Cancel**. If nothing can be read, the user can **Try again** or pick **Another picture**
- The result is a **draft** that fills in the manual form (see "Image and AI fill in the manual form" below), where the user reviews it: editable Arabic text, the translation if one was found, collections (multi-select), notes, and the Add Dua button
- The scan is `scanDuaImage` in `lib/dua-draft.ts`. Without `EXPO_PUBLIC_API_URL` it is a **placeholder** that returns a sample dua; with it, it posts the picture to the backend (OCR runs there, so the Google Vision key never ships in the app). Backend contract: `POST /api/duas/scan` (multipart: `image`, `language`) answering `{ arabicText, title?, transliteration?, translation?, source?, reference?, notes? }`

#### 2. Manual Entry
**Form Fields:**
- **Dua title/occasion** (text input, required)
- **Arabic text input** (textarea with Arabic keyboard support, required)
- **Transliteration** (optional text input; left out of the dua when empty)
- **Translation** (multiple language options via dropdown)
- **Source** (select Quran or Hadith) and **Reference** (text input; the placeholder changes with the selected source, e.g. `11:38` for Quran, `Qudsi 234` for Hadith)
- **Tags** (comma-separated or tag selector)
- **Collection** (required, multi-select): shows only the collections the user made. The pre-made collections are read only and are not listed, and there is no default "General". A **"+" pill** at the end turns into a name field; confirming it adds and ticks a new collection. That collection is only *pending* until **Add Dua** succeeds: Cancel, closing the sheet, a validation error or a failed save creates nothing. Saving needs at least one ticked collection
- Save button

**Existing or New:** the form starts with a dropdown (`components/ui/dropdown.tsx`, the Tasbih-style sheet) with two options:
- **New** (the default) shows the form above: title, Arabic, transliteration, translation, collection, source and reference
- **Existing** shows only a searchable list of every dua in the app (pre-made and the user's own, `components/add-dua/existing-dua-picker.tsx`), where one or more can be ticked, and the Collection field. Saving puts the ticked duas in the chosen collections (`saveExistingDuasToCollections`). Both forms share the same Collection field and state (`useCollectionChoice`), so switching keeps the collections already picked. A collection typed with "+" is still only created when the duas are saved

**Duplicate check:** before a new dua is saved, its Arabic text is compared with every dua in the app, pre-made and the user's own (`findSimilarDua` in `lib/dua-duplicates.ts`). The title is not looked at. The comparison ignores diacritics, Quranic signs, tatweel, spaces and punctuation, treats the spelling variants of alef, ya, ha, waw and hamza alike, and also catches near-matches: 85% alike or more (one or two letters off), or a piece of a longer dua. If one is found, a modal shows its title, the start of its Arabic and its source, and asks whether the user would rather select it:
- **Select it** switches the form to Existing with that dua ticked, keeping the collections already picked
- **No, add it** closes the modal and adds the new dua anyway
- Tapping outside the modal closes it and adds nothing

The check is `useDuplicateDuaGuard` (`hooks/use-duplicate-dua-guard.tsx`), shared by all three ways of adding: call `checkBeforeSave(arabicText, save)` right before saving. Manual uses it now. Image and AI must call it once their Arabic text has been extracted or generated, before saving

#### 3. AI Assistant (Advanced Feature)
**Flow** (`components/add-dua/ai-dua-step.tsx`):
- A text box ("Describe the dua you are looking for"), with example chips (travelling, anxiety, parents, exams) that fill it in
- A note that the AI can make mistakes, then **Generate dua**; "Writing your dua..." shows while it works, and an error message with the option to try again if it fails
- The result is a **draft** that fills in the manual form (below), where the user reviews and saves it. To ask again, use **Back** (it returns to this screen with the text you asked for still there)
- The AI call is `generateDua` in `lib/dua-draft.ts`: a **placeholder** without `EXPO_PUBLIC_API_URL`, otherwise `POST /api/duas/generate` with `{ prompt, language }`, answering the same shape as the scan

#### Image and AI fill in the manual form
Both methods end in the **same form as Manual**, filled in like an autofill (`applyDraft` in `app/modal.tsx`), so the title, Arabic, transliteration, translation, source, reference, notes, collections, validation, duplicate check and save are all the same code:
- A banner at the top says the form was filled in from a picture, or written by the AI, and to check every field
- Every filled field has an **Auto-filled** tag; the tag leaves a field as soon as the user edits it
- The saved dua gets `origin: 'image'` or `origin: 'ai'`
- **Source lock:** when the draft came with a source, the source chips and the reference are locked. Trying to change either asks **"Are you sure?"** once (the text says whether it was read from the picture or suggested by the AI); after **Yes, change it** the source and reference are the user's own and free to edit. A draft without a source is not locked
- **Back** from the filled-in form returns to the image or AI screen it came from; Back from there empties the form and returns to the list of methods
- Anything the backend sends is checked first (`parseDraft`): no Arabic means an error ("No Arabic text was found"), and a source that is not Quran or Hadith, or a reference in the wrong format, is dropped
- The form has a **Notes (optional)** field for background or context; it is saved as the dua's `info`, one paragraph per line (`plainTextToInfo`)

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
   - **Save to collection (+):** Opens the [Save to collection sheet](#save-to-collection-sheet) (it replaced the audio button; audio comes back with recitations)
   - **Share Icon:** Opens the [share sheet](#share-features): send the dua to your kindred, or share its card to any app, save it as an image or copy the text
   - **Bookmark Icon:** Save to favorites
   - **Collections:** the + is drawn in the accent color when the dua is in one of the user's collections
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
  collection: string[]
  source?: DuaSource
  reference?: string // '21:87' or '11:39-42'
  info?: string // HTML from the rich editor
  origin: DuaOrigin
  sharedBy?: string | null // id of the user who shared it; missing when the user made it
  isFavorite: boolean
  iconPath?: string
  repeat?: number // how many times the dua is recited; the Dua screen counts down from it
  audioUrl?: string // reserved for audio recitations (nothing plays it yet)
}
```

- **Source and reference:** `source` is a fixed option (Quran, Hadith) and `reference` is the detail within it. Both are optional, so duas without a known source (manual or AI-generated) don't need them. Quran references can be a single verse (`21:87`) or a range (`11:39-42`), validated with `/^\d{1,3}:\d{1,3}(-\d{1,3})?$/` plus a check that the surah number is 114 or less. The reference input placeholder changes with the selected source (`11:38` for Quran, `Qudsi 234` for Hadith). Lists show them as a source line, e.g. `Al-Baqarah · 2:201` (`formatSourceLine` in `lib/dua-utils.ts`). The surah name and the hadith name used by the filter and search come from the reference too (`getSurahName`, `getHadithName`). Built-in references were checked against sunnah.com (hadith) and the Quran text; a built-in dua with no `source` is one whose reference has not been verified yet, not one that has none
- **Translations:** stored per language code. The user picks a language in Settings and the app shows `translations[language]`, falling back to `translations.en` if that language is missing.
- **Transliteration:** optional per dua, and shown or hidden with a `showTransliteration` toggle in Settings.
- **Collection:** an array, since a dua can belong to several collections. Each id is a collection id (see `constants/collections.ts`). It names the *pre-made* collections a built-in dua is in. A dua the user adds keeps `collection` empty: the collections it is in are the user's collections that list it in their `duaIds` (`getCollectionIdsOfDua` in `lib/collection-utils.ts` gives both kinds together).
- **Repeat:** `repeat` is how many times the dua is recited (the counter on the Dua screen counts down from it and moves to the next dua at 0), for example 33 for SubhanAllah after prayer. Every dua in `dua.json` has one. A dua without it, such as one the user added, counts once (`DEFAULT_DUA_REPEAT` in `constants/dua-config.ts`).
- **Info:** rich text (bold, bullet points, titles) about the dua, stored as HTML. It must be sanitized before rendering.
- **Origin:** where the dua came from: `builtin` (ships with the app), `manual` (typed by the user), `ai`, `image` (scanned), or `shared` (from another user: the copy also has `sharedBy`, the sender's user id, which is missing on duas the user made). This replaces `isUserCreated`; edit and delete actions apply to anything other than `builtin`.
- **Pre-made duas are read only:** a dua that ships with the app (its id is in `dua.json`, see `isBuiltInDuaId` in `redux/reducers/duasSlice.ts`) can be favorited and put in the user's collections, but never edited or deleted. This is enforced in the data layer: `updateDua` and `removeDua` ignore it (and the collections slice leaves its collections alone), so it holds whichever screen sends the action. No screen offers edit or delete for a single dua today; the Edit collection screen only removes a dua from that collection. A future edit or delete button must also be hidden for these duas (`isBuiltin` in `lib/dua-utils.ts`).
- **Favorites:** `isFavorite` on each dua in memory, so screens just read `dua.isFavorite`. It is not part of `dua.json`: built-in duas load with `isFavorite: false`, and the saved list of favorite ids (`favoriteIds`, see Data source) is applied on top when the app starts.
- **Data folder:** `data/data.json` is the entry point. It lists which file holds each resource and the sample user (`currentUserId`; the app does not sign this user in at launch, it starts as a guest). JSON files cannot import each other, so `data/index.ts` does the loading and exports `data` and `currentUserId`; `data/types.ts` has the types. Each resource is a table on the future backend, and all of it uses generated values (example.com emails, UUID ids), so replacing `data/index.ts` with API calls should not touch the screens. Every field, whether it is required or optional, and the rules for user codes, sharing and duplicate checks are in [`data/README.md`](data/README.md). In short:
  - `dua.json` and `collection.json` are the built-in duas and the home-grid collections (`COLLECTION_DEFS` reads from `collection.json`). A dua or collection that was shared to the user has an optional `sharedBy` (the sender's user id).
  - `user.json` has the people who signed in with Google or Facebook, each with a `userCode` (like `BG-7K3M`) that others type to find them.
  - `user_favorites.json`, `kindred.json` and `shares.json` hold favorites, kindred (with `family`, `friends`, `mosque` and `classmates` groups) and shares. A share stays `pending` until the recipient accepts, and then the item is copied into their library.
  - Duas and collections are read by the app, and so are `kindred.json`, `shares.json` and `user.json` (the share sheet reads them through the `kindred` slice, saved on the device as `kindred:v1`). The rest is ready-made data for the login and favorites work; favorites still live in `duas:v2` on the device until then.
- **Settings:** `settingsSlice` holds `translationLanguage` (default `'en'`, called `language` in older saves, which are converted), `appLanguage` (default `'en'`), `arabicFont` and `showTransliteration`.
- **App language:** all app text goes through `t('key')` (`hooks/use-t.ts`, texts in `locales/en.ts`; `{name}` placeholders, or a function for plurals). A text a language does not have falls back to English. To add a language: create `locales/<code>.ts` with the same keys, register it in `locales/index.ts`, and add its code to `APP_LANGUAGE_CODES` in `constants/languages.ts` (it then appears in the App language sheet). Right-to-left layout is not set up yet. Built-in collection names and Quran/Hadith source names are content, not app text, and are still English.
- **Shared building blocks:** the "new collection name" field of the add-dua form and of the Save to collection sheet is one hook, `useNewCollectionInput` (open/close, typed name, empty and duplicate checks). The pickers for App language, Translation language and Arabic text style all use `components/settings/option-sheet.tsx` (on `components/ui/bottom-sheet.tsx`). The Delete, Save and Keep buttons of the collection screens are `components/ui/pill-button.tsx`. The Tasbih "Choose a dua" picker is built from reusable parts: `components/ui/picker-sheet.tsx` (the bottom sheet with title, close button and optional search), `components/ui/pick-row.tsx` (a choice with a tick) and, on top of those, `components/ui/dropdown.tsx` (a field that opens a short list of options, used for Existing / New in the add-dua form). The add-dua form's own parts are in `components/add-dua/` (`FormField` and `FormInput`, `CollectionField`, the existing-dua list and the duplicate modal), with the state in `useCollectionChoice` and the colors in `useAddDuaColors`.
- **Data source:** duas load from `data/dua.json` (33 duas: 15 general duas and 18 dhikr in the Dhikr collection). The built-in duas are always read from `dua.json`, so adding or editing them needs no cache reset. The copy saved on the device (`duas:v2` in AsyncStorage, `lib/duas-storage.ts`) is `{ favoriteIds, userDuas }`: the ids of every favorite dua, and the duas the user added (without `isFavorite`). A dua is treated as built-in when its id is in `dua.json`, whatever its `origin` says, so it is never saved twice. Saved data for a built-in id is ignored, so the built-in text always wins. `duas:v1` (the whole array) is converted once on the first launch after the update and then removed.

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
- The theme is switched from the Appearance menu (the filter icon in the header) on the Home, Explore, Tasbih, Collection and Bookmark screens
- Shared palette: `tailwind.config.js` (for class names), mirrored in `constants/theme-colors.ts` (for SVG props, icons and `rgba()` values; `withAlpha(hex, opacity)` adds transparency to a palette color). Keep the two in sync
- Screen-specific colors for both modes, next to the palette: `constants/explore-theme.ts`, `constants/tasbih-theme.ts` and `constants/dua-list-theme.ts`. They reuse the shared palette and only spell out values sampled from that screen's design
- Components read the current mode with `useColorScheme()` (or a small hook such as `useTasbihColors()` and `useDuaListColors()`), so each screen only needs its light and dark values defined once
- Screens with a header band (Explore, Tasbih, Collection, Bookmark) use `ScreenHeader`: a title, an optional subtitle, an optional left slot (e.g. a back arrow) and a right slot (the Appearance menu by default). The menu is `AppearanceMenuButton`; it can show extra sections above Appearance (`extraSections`, used for the Surah and Hadith filters) and a gold dot when a filter is on (`active`). A menu section can have labelled `groups` and a `maxHeight`; past it, that section scrolls on its own (`FilterMenuSection` in `lib/types.d.ts`, drawn by `components/ui/filter-menu.tsx`). Menus too tall for the screen scroll as a whole

### Icon Library

All collection icons live in one library, because the same icons are reused in several places: collection covers, the Explore topics, and the icon picker users will get when creating a new collection.

- **Source SVGs:** `assets/icons/collection/`. File names describe what the icon shows (lowercase, hyphens, no "icon" suffix): `book`, `sun`, `moon`, `lamp`, `journal`, `hands`, `chat-sparkle`, `star-pillars`, `open-book`, `moon-sparkle`, `kaaba`, `crescent-cup`, `cupping-cup`, `heart-check`, `checklist`
- **Rendering:** `components/icons/collection-icons/` (TSX). The SVGs are drawn as `react-native-svg` components so the color and size follow the theme, which a plain `.svg` file cannot do
- **Rule:** the SVG is the source of truth and the TSX is generated from it. To add an icon, drop the `.svg` into `assets/icons/collection/`, add its name to `scripts/generate-line-icons.js`, then run `node scripts/generate-line-icons.js` (this rebuilds `line-icons.tsx`). The first six icons (`book`, `sun`, `moon`, `lamp`, `journal`, `hands`) are drawn directly in `collection-icons/index.tsx`
- **Picker:** `COLLECTION_ICON_KEYS` lists every selectable icon, in order, for the "choose an icon" grid
- Tab bar and other app icons stay in `components/icons/`

### Search

Every search box in the app uses the same code, so they all behave the same way.

- **Matching** (`lib/search.ts`): `normalizeForSearch` lowercases the text and, for Arabic, removes the diacritics, Quranic signs and tatweel and treats every alef the same, so "سبحان" finds "سُبْحَانَ". It also ignores apostrophes and treats hyphens as spaces, so "ali imran" finds "Ali 'Imran" and "al baqarah" finds "Al-Baqarah". `matchesSearch(query, fields)` is true when any field contains the query, and an empty query matches everything
- **Hook** (`hooks/use-search.ts`): `useSearch(items, getFields)` keeps the query and returns `{ query, setQuery, results, isSearching }`. `getFields` says which text of an item is searchable. Define it outside the component so the results aren't recomputed on every render
- **Dua fields:** `duaSearchFields` in `lib/dua-utils.ts` gives the title, transliteration, Arabic and every translation of a dua. `duaSourceSearchFields` adds the surah name and the hadith name on top of that
- **Input:** `SearchField` (`components/ui/search-field.tsx`) is the rounded search bar with the clear button
- **Used by:** the Tasbih "Choose a dua" picker (it shows the 10 preset duas while the box is empty, and uses `duaSearchFields`, so it does not search surah or hadith names), the Collection and Bookmark screens (`duaSourceSearchFields`), and the Explore topics (`[topic.label]`)
- **Filter by surah or hadith** (Collection and Bookmark screens): `useSourceFilter(duas)` in `hooks/use-source-filter.ts` returns the filtered duas and one menu section: "Filter" with Surah and Hadith groups when there are both, or just "Surah" or "Hadith" when there is only one (none when there is neither). It is capped by `FILTER_MAX_HEIGHT`, so it scrolls on its own. The helpers behind it are in `lib/dua-utils.ts`: `getSurahName`, `getHadithName`, `listSourceNames` and `matchesSourceFilter`. The filter runs first, then the search runs on what is left
- **To add search to a new list:** call `useSearch(items, getFields)`, render a `SearchField` bound to `query` and `setQuery`, and show `results`

### PDF Export

**What the user sees:** on a collection (pre-made or their own), the header menu has an **Export** section under Appearance with **Export as PDF**. It opens a dialog with these switches (all on by default, except that **Transliteration** starts from the Settings switch):

| Switch | Effect |
| --- | --- |
| Cover page | A first page in the style of the splash screen: the beads logo, **My Dua Collection** (Berkshire Swash), the collection name (Nunito Sans) and the number of duas ("5 Duas") |
| Translation | The translation in the language chosen in Settings (English when a dua has none in that language) |
| Transliteration | The transliteration line |
| Source & reference | e.g. `Al-Anbiya · 21:87` or `Hadith · Qudsi 234` |
| One dua per page | On: every dua starts a page (like the Salah Resources PDF). Off: short duas share a page; a dua is never cut in two if it fits on one page |
| Times to recite | "Recite 3 times", next to the source, for duas recited more than once |
| Notes & background | The dua's note (`info`) in a tinted box |

The dialog scrolls on small screens: a fade with a small arrow at its bottom shows that there are more switches below (this is built into `DialogModal`, so every dialog has it). The Arabic text is always included, in the **Arabic font chosen in Settings**. **Export PDF** makes the file, closes the dialog, and opens the share sheet (save to Files, send, print). The file is named after the collection, in lowercase with hyphens (`quranic-duas.pdf`). 

**On Android** there is also **Save to device** in the dialog: it opens the system folder picker (e.g. Downloads) and saves the PDF there. An emulator often has nothing in its share sheet that can save a file, so use this one there. (iOS: **Save to Files** in the share sheet.)

**On web** the browser's print dialog opens with the PDF pages (a hidden frame, so the app itself is not printed); choose **Save as PDF** there. The page title is the suggested file name. (`expo-print`'s own web support just prints the current page, so the app prints the frame itself.)

**Look of the PDF:** A4, white pages. Each dua has its number (gold) and its title in **Berkshire Swash in deep teal** (`#013241`), with a short gold rule under them, then the Arabic, the transliteration (bold italic), the translation, the source line (grey) and the notes box. Every page has the beads logo and **My Dua Collection** (Berkshire Swash) at the bottom left and the page number at the bottom right. A dua longer than a page continues on the next page under a short "continued" heading.

**How it works (no backend):** the PDF is made on the device.
1. `lib/pdf/pdf-fonts.ts` reads the font files as base64 (the web view that prints knows nothing about the app's fonts, so they are written into the HTML as `@font-face`).
2. `lib/pdf/collection-pdf-html.ts` builds one HTML document. `lib/pdf/pdf-layout.ts` places the duas on pages: it estimates how tall each piece of text is (on the tall side, so a page never overflows into its footer) and splits long text between pages.
3. `expo-print` turns the HTML into a PDF file, `lib/pdf/export-collection-pdf.ts` renames it after the collection, and `expo-sharing` opens the share sheet.

Files: `components/export/export-collection-modal.tsx` (the dialog), `lib/pdf/` (everything above, plus `pdf-config.ts` for the options, colors and page size, and `cover-art.ts`), `constants/prayer-beads-path.ts` (the logo outline, shared with the `PrayerBeadsLogo` component). `cover-art.ts` is generated from `assets/images/splash-background.svg` by `node scripts/generate-pdf-cover-art.js`; run it again if the splash artwork changes.

**Good to know:**
- Arabic needs a real text engine, so the PDF is made from HTML (the phone's own web view shapes the Arabic). A library that draws text itself (`pdf-lib`) would show disconnected letters.
- expo-print lays the page out at 72 px per inch on iOS and 96 on Android, so every length in the PDF is `n` units times `--u`, set per platform in `lib/pdf/pdf-config.ts` (`PDF_UNIT_IOS`, `PDF_UNIT_ANDROID`). If a platform shows the content too small or too large on the page, change that one number.
- It works in Expo Go, in development builds and on web (see above).
- To change what the PDF looks like, edit `buildStyles` in `lib/pdf/collection-pdf-html.ts`. To add a switch: add it to `PdfExportOptions` and `DEFAULT_PDF_OPTIONS` (`pdf-config.ts`), the text keys in `locales/en.ts`, the `OPTION_ROWS` list in the dialog, and use it in `buildDuaUnit`.

### Project Structure and Naming

- File names are lowercase with hyphens (`explore-card.tsx`, `theme-colors.ts`). Redux reducer files stay camelCase (`duasSlice.ts`). Route files in `app/` follow Expo Router
- `components/ui/` holds reusable UI, `components/icons/` holds icons, `constants/` holds static data and theme values, `lib/` holds helpers and storage, `hooks/` holds hooks, `data/` holds the app's data (`data.json` is the entry point; see Data folder)
- Components used by one feature live in a folder named after it: `components/tasbih/`, `components/share/` (the share sheet and the share card) and `components/dua-list/` (shared by the Collection and Bookmark screens)
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

### Toasts

Short messages that go away by themselves: "Dua added successfully!", "PDF saved", "Saved to your photos", "Text copied", "Sent to Maryam A.".

- **Use it from any screen:** `const toast = useToast()` then `toast.success(message)`, `toast.error(message)` or `toast.info(message)` (`hooks/use-toast.ts`). A second argument `true` keeps the toast on screen a little longer, for a message with two parts.
- **Android** shows the phone's own toast (`ToastAndroid`); it cannot be styled. **iOS** has no native toast, so the app draws a banner at the top of the screen (`components/ui/toast-host.tsx`, colors in `constants/toast-theme.ts`). Tap it to close it; VoiceOver reads it out.
- **Toast or Alert?** A toast is for what went well and needs no answer. Keep `Alert` for a confirmation (delete, change a locked source), a missing field, and an error the person has to read.
- **Where the iOS banner is drawn:** `ToastProvider` (in `app/_layout.tsx`) keeps the toast, and a `ToastHost` draws it. A native Modal covers everything under it, so the root layout, `BottomSheet`, `DialogModal` and the Add dua screen (`app/modal.tsx`) each hold a `ToastHost`; the one opened last draws the toast, and when it closes the next one takes over. A new Modal or modal screen needs a `<ToastHost />` inside it.
- **Where toasts are used today:** Add dua (added, and existing duas added), Save to collection (collections updated), Edit collection (saved, deleted), PDF export (saved), and the share sheet (saved to photos, copied, sent, and what went wrong). Errors that need reading stay `Alert`s.

### Share Features

The share icon on the Dua screen opens the **share sheet**, laid out like Instagram's: a fixed search field with a **groups icon** at the top, your kindred scrolling in the middle, and a row of apps and actions fixed at the bottom that scrolls sideways.

**Kindred.** "Kindred" is the app's word for the people you share duas with ("a kindred", "my kindred": the word is the same for one and many). Someone becomes kindred when you save them as such. Kindred can be put in **groups**: Family, Friends, Mosque and Classmates (`KINDRED_GROUPS` in `data/types.ts`; a person can be in several, or none). The groups are one-way like the rest: if Ali saves Sara as kindred, Sara is not Ali's kindred until she saves him.

**The sheet**

| Part | What it does |
|---|---|
| Search field | Filters your kindred by name or email. In "Add by code" it takes the user code instead. |
| Groups icon (right of the search) | Switches the middle between **kindred** and **groups**. Tapping a group picks it (a tick) and so everyone in it; tap again to let them go. A group is picked by itself: picking Friends does not mark Classmates, even when someone is in both. Tapping a person in the kindred view takes them out of a picked group, or adds them on their own. |
| Middle grid | Three columns, scrolls up and down. First cell is **Add by code**; below it your kindred A-Z (people found by code and not saved show with "One-off"). Tap to pick. |
| Bottom row | Scrolls sideways: **WhatsApp, Instagram, Facebook, X, Telegram, Messenger**, **Save image**, **Copy text**, **Card** and **More**. Once someone is picked, the row is replaced by **Send to 1 group**, **Send to 3 people** or **Send to 2 groups and 1 person**. |

**Share Options** (the bottom row)

| Option | What happens |
|---|---|
| WhatsApp, Instagram, Facebook, X, Telegram, Messenger | The **card picture** goes to that app (the app opens with the picture ready; X also gets a short caption). Done with `react-native-share`, which needs a development build. Where it is not available (Expo Go) or the app is not installed, the system share sheet opens instead, so it still works. See `lib/share/social-share.ts`. |
| Save image | The card is saved to the device's photos (`expo-media-library`; it only asks for permission to add pictures, never to read them). |
| Copy text | Copies the dua as text: title, Arabic, transliteration, translation, source, and the app's name (the card's switches apply). |
| Card | Opens the card editor (below). |
| More | The system share sheet with the card picture: any other messaging app, Messages, AirDrop, Nearby Share, Files... |
| Send to kindred | Pick people (or a group, or someone by code) and tap **Send**. One share is created per person (see [Flow: shares](#flow-shares)), and a toast says who got it (and who already had it waiting). |

**Beautiful Card Generator** (`components/share/share-card.tsx`)

- Title, the dua's Arabic (in the Arabic font chosen in Settings), transliteration, translation, and the source (for example `Al-Anbiya · 21:87`).
- The **app watermark** at the bottom: the prayer-beads logo and "My Dua Collection" (`SHARE_APP_NAME` in `constants/share-config.ts`; `SHARE_APP_URL` is empty until the app is in the stores, and is added to the shared text once it is set).
- A frame, an ornament under the title and a pattern of eight-pointed stars that fades out towards the middle, so the text always sits on a calm ground.
- Three styles, **Emerald** (the brand gradient), **Night** and **Cream** (`constants/share-theme.ts`). The card keeps its own colors in light and dark mode, because it is a picture people send around.
- At least 4:5 (the Instagram portrait shape); a long dua makes it taller and its text a little smaller (`getCardTextScale` in `lib/share/card-layout.ts`).
- The picture is always taken from a copy of the card drawn **off screen at 360 px wide** and saved at **1080 px wide** (`CARD_EXPORT_WIDTH`), so it looks the same on every phone, whatever size the preview is.
- The **Card** screen shows a preview and lets the person change the style and switch the transliteration, translation and source on or off (a part the dua does not have is not offered). These choices apply to every action in the sheet, including Copy text.

**Add by code** (the "Flow: user code" below) is built into the sheet: tap the dashed **+ Add by code** cell, type the code in the search field and tap **Find**.

**Trying it with the dummy data.** The app starts as a guest, and the share sheet then sends as the sample user in `data/data.json` (Ibrahim Yusuf, who has five kindred). Codes to type: `SA-4K7M` (Sara A.: not kindred, so it asks **Save as kindred?**), `MA-GEXW` (Maryam A.: already kindred, so the question is skipped), `IY-6C9A` (your own code, ignored), `ZZ-2222` (nobody: "No user with that code..."), `hello` (cannot be a code). More than 10 lookups in a minute are refused, as the backend will do. Set `REQUIRE_SIGN_IN_TO_SHARE` in `constants/share-config.ts` to `true` to ask guests to sign in before sending to kindred (the apps in the bottom row still work).

#### Flow: user code (adding kindred)

- **Getting a code.** At first sign-in the backend builds the code: your two initials plus 4 random characters (`generateUniqueUserCode` in `lib/user-code.ts`). It checks that nobody has it and tries again if someone does. A name change never changes it. The profile shows it as `BG-7K3M` with a **Copy** button and a **Reset code** option.
- **Adding someone while sharing.**
  - The receiver tells the sender their code.
  - The sender taps Share, then **Add by code**, and types it. Case, spaces and hyphens don't matter, so `bg 7k3m` works.
  - If the text can't be a code, the app says so without making a request. The sender's own code is ignored.
  - The backend looks the code up, limited to about 10 lookups a minute per user (`createLookupLimiter` in `lib/kindred.ts` is the same rule for the dummy data).
  - If nobody has it, the app says: "No user with that code. Check it and try again."
  - If someone does, a confirmation shows their avatar and first name plus last initial.
  - After confirming, the app asks **Save as kindred?** (with the groups to put them in, optional). **Yes** adds a kindred row; **No** leaves it as a one-off share. If they're already kindred, the app skips the question.
- **Resetting.** A new code replaces the old one, and the old code stops working immediately. Kindred and shares are unaffected.

#### Flow: shares

- **Sending.** The sender opens a dua and taps Share. They pick kindred in the grid, a group, or someone by code. Each person gets one share with `status: "pending"` (`buildShares` in `lib/kindred.ts`; someone who already has the same item waiting from the sender is skipped, and the sheet says so).
- **Receiving.** The recipient sees pending shares and can accept or decline. A declined share changes nothing. **No screen for this yet:** it is the next piece of work (see the to do list).
- **On accept** (the rules are in code in `lib/share-rules.ts`):
  - Collection: its name is compared with the recipient's collections, ignoring case and extra spaces (`hasDuplicateCollection`).
  - Dua: the recipient picks a collection, and the app checks whether it already holds a dua with the same `source` and `reference` (`findDuplicateDua`).
  - If there's no duplicate, the item is copied into their library as if they made it: the copy gets a new id and `sharedBy` set to the sender; a dua copy also gets `origin: "shared"`; a collection copy gets `isUserCreated: true`, and its duas come with it (`buildSharedDuaCopy`, `buildSharedCollectionCopy`).
  - The share becomes `accepted` and gets a `respondedAt` date (`respondToShare`).
- **After.** The copy is the recipient's own. Edits by either person don't reach the other, and if it was shared onward, `sharedBy` is the person who sent it on.

**Files.** `components/share/` has the sheet (`share-dua-sheet.tsx`, with the two screens `share-picker-step.tsx` and `share-card-step.tsx`), the grid, the Add by code steps (`code-flow.tsx`), the bottom row (`share-actions-row.tsx`) and the card (`share-card.tsx`, `share-card-background.tsx`). The state is in two hooks: `useSharePicker` (who is picked, the code flow) and `useShareCard` (the card and its actions). Every change to kindred and shares goes through `useKindredActions` (like `useUserActions`), so a backend replaces it in one place. The `kindred` Redux slice holds the `kindred` and `shares` tables and is saved as `kindred:v1`. `lib/kindred.ts` has the pure rules (they are tested), `lib/share/` has taking the picture, saving, the apps and the shared text, and `constants/share-config.ts` / `share-theme.ts` the settings and colors.

**Native modules.** The share sheet adds `react-native-view-shot` (takes the picture), `expo-media-library` (saves it), `react-native-share` (sends it straight to an app) and `expo-build-properties` (needed by react-native-share's config plugin). Their settings are in `app.json` (the photo permission texts, and the apps the share plugin may open). After pulling this change run `npm install` and rebuild a development build (`npx expo prebuild` then `npx expo run:android` / `run:ios`). In Expo Go the app still works, but the apps in the bottom row open the system share sheet instead, and on Android saving to photos is limited.

**Collection Export:**
- **PDF Download:** see [PDF export](#pdf-export)
  - Entire collection exportable
  - User choice of content (a dialog of switches, see below)
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
  - PDF generation: `expo-print` (HTML to PDF on the device), `expo-sharing`, `expo-file-system`, `expo-asset` (see [PDF export](#pdf-export)). `pdf-lib` was ruled out because it cannot shape Arabic text
  - Share functionality: `react-native-share` (send the card picture straight to WhatsApp, Instagram, Facebook, X, Telegram, Messenger), `react-native-view-shot` (takes the picture of the card), `expo-media-library` (saves it), `expo-sharing` (system share sheet). See [Share Features](#share-features)
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
- [x] Dua data model (source, reference, translations, collection, info, origin) loaded from `data/dua.json`
- [x] Reusable collection icon library (see [Icon Library](#icon-library))
- [x] Splash screen
- [x] Dhikr collection (18 dhikr duas in `data/dua.json`)
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
  <!-- - [x] Form with title, Arabic, translation, collection, source and reference
  - [x] Transliteration (optional)
  - [ ] Info (rich text) field
  - [x] Multi-collection assignment (the user's own collections only)
  - [x] Create a collection from the form ("+" pill), made only when the dua is saved
  - [x] Save to local cache -->
  - [ ] Save to backend
- [ ] **Collection Management:**
  <!-- - [x] Collection screen: name, dua count, numbered list with source line, search
  - [x] Filter by surah or hadith name (menu above Appearance), and search by those names -->
  <!-- - [x] Create custom collections (together with their first dua) -->
  <!-- - [x] Add a dua to one or more collections from the Dua screen's **Save to collection** sheet (the + in the bottom bar) -->
  - [ ] Collection description
  <!-- - [x] Sort duas within collections -->
  - [ ] Edit/delete collections
- [ ] **Dua Detail View:**
  - [ ] Arabic text display
  - [ ] Translation (toggle on/off)
  - [ ] Transliteration (toggle on/off)
  - [ ] Collections indicator
  - [ ] Bookmark icon
  - [ ] Share button
  - [ ] Open it from the Collection and Bookmark lists
<!-- - [ ] **Tasbih Counter:** -->
  <!-- - [x] Simple counter screen -->
  <!-- - [ ] Customizable counters per dua -->
  <!-- - [ ] Preset counters for morning/evening adhkar -->
<!-- - [ ] **Bookmark System:** -->
  <!-- - [x] Bookmark screen with all saved duas, the collections each one is in, search, and the surah / hadith filter -->
  <!-- - [ ] Save/unsave duas -->
  <!-- - [x] Remove a bookmark from the list -->
- [ ] **Profile Screen:**
  <!-- - [x] Basic settings (appearance, language) -->
  - [ ] Today's Islamic date
<!-- - [x] Local caching for offline access -->
- [ ] Cloud sync for collections

### AI & Advanced Input
- [ ] **Image OCR:**
  <!-- - [x] Camera integration (UI done) -->
  <!-- - [x] Gallery image upload (UI done) -->
  - [ ] Text extraction from images (placeholder until the backend `POST /api/duas/scan` exists: Google Vision with the Arabic language hint)
  <!-- - [x] Review and edit scanned text (fills in the manual form, with the Auto-filled tags) -->
  - [ ] Auto-detect translation (the backend returns it when it can; matching the scanned Arabic against the built-in duas first would give better translations)
- [ ] **AI generated dua:**
  <!-- - [x] Prompt screen with examples and a "the AI can make mistakes" note (UI done) -->
  - [ ] The AI call (placeholder until the backend `POST /api/duas/generate` exists)
  - [ ] "Refine suggestion" (ask again with a change, instead of starting over)
- [ ] **Source verification agent (backend):** an AI agent that checks the source and reference of every image-scanned and AI-generated dua before it is saved. It must not allow a wrong source: when the Quran reference does not match the Arabic, or the hadith does not exist or is not in that collection, it rejects it and tells the user the **right source** (surah and verse, or the hadith collection and number), which the form can then fill in. Until it exists, the form's source lock ("Are you sure?" when the source of an image or AI dua is changed) is the only guard, and the AI warning tells users to check the source
- [ ] Authenticate the scan and generate calls (send the user's token) and rate-limit them per user on the backend
- [ ] **AI Chat Assistant:**
  <!-- - [x] Chat interface on Explore screen (UI done; replies are a placeholder) -->
  - [ ] Conversation history (the chat is not saved by design)
  - [ ] Suggested prompts
  - [ ] Dua recommendations
  - [ ] Islamic Q&A
  - [ ] Save AI suggestions to collections
- [ ] **AI Priority Collection:**
  - [ ] Auto-create for Ramadan/Dhul Hijjah
  - [ ] Fixed position at top-left
  - [ ] AI icon indicator
- [ ] **Search Functionality:**
  <!-- - [x] Search all duas by title, transliteration, Arabic and translation (Tasbih dua picker, Collection screen, Bookmark screen)
  - [x] Search by surah and hadith name (Collection and Bookmark screens) -->
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
- [x] **Share Card Generator:** (built; still to check on real iOS and Android devices, see [Share Features](#share-features))
  - [x] Beautiful card design (three styles, off-screen capture at 1080 px)
  - [x] Include Arabic, translation, transliteration (and source)
  - [x] App watermark
  - [x] Save as image
  - [x] Share to social media (WhatsApp, Instagram, Facebook, X, Telegram, Messenger, and any app through More)
  - [x] Copy text to clipboard
  - [ ] Check the picture and the direct share to each app on real devices (the card is drawn off screen, and iOS and Android differ)
  - [ ] Share a whole collection (the same sheet, with a collection card)
<!-- - [x] **PDF Export:**
  - [x] Export entire collections (pre-made and the user's own)
  - [x] Customizable content (cover page, translation, transliteration, source, notes, times to recite, one dua per page)
  - [x] Print-ready formatting (A4, page numbers, app logo and name on every page)
  - [ ] Check the layout on real iOS and Android devices (see [PDF export](#pdf-export)) -->

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
- [x] Share duas with kindred: the share sheet (kindred grid, groups, Add by code, "Save as kindred?" the first time a person found by code is not kindred yet), sending creates pending shares (dummy data; see [Flow: shares](#flow-shares))
- [ ] Receive shares: a screen for pending shares with accept and decline, the duplicate checks and the copy (the rules are already in `lib/share-rules.ts`)
- [ ] Manage kindred: see and edit your kindred and their groups, remove someone
- [x] Toasts: `useToast()`, native on Android and an in-app banner on iOS; success-only alerts replaced, share sheet messages moved to toasts (see [Toasts](#toasts))
- [ ] Check toasts on a real iPhone and Android phone (the banner inside a Modal and after a modal screen closes)
- [ ] Backend for kindred, user-code lookup and shares (the lookup limit, `shares` and `user_kindred` tables)
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
