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
  - [Explore Screen](#explore-screen)
  - [Tasbih Screen](#tasbih-screen)
  - [Bookmark Screen](#bookmark-screen)
  - [Profile Screen](#profile-screen)
- [Dua Features](#dua-features)
  - [Adding Duas](#adding-duas)
  - [Dua Properties](#dua-properties)
  - [Collection Properties](#collection-properties)
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
- [Development Roadmap](#development-roadmap)
- [Author](#author)

## Overview

### Features

Users should be able to:

- **Dua Management:**
  - Add duas through image upload (OCR), manual entry, or AI assistance
  - Organize duas into multiple collections (like Instagram saves - a dua can belong to several collections)
  - Access Arabic text, transliteration, and translations with word-by-word analysis down to root words
  - Listen to audio recitations of duas
  - Track recitation with customizable tasbih counters (preset and custom)
  - Edit and delete user-created duas

- **Smart Organization:**
  - Create and manage custom collections
  - Reorganize collections with drag and drop (priority collections stay at top-left)
  - Filter collections: My Collections, Pre-made Collections, All Collections
  - Switch between grid and list views
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
  - Word-by-word translation with root word analysis (tap any word)
  - Historical context and scholarly commentary
  - Hadith and Quranic references
  - Benefits and virtues of each dua
  - "When to recite" guidance for occasions/timing

- **Additional Tools:**
  - Plain tasbih counter
  - 99 Names of Allah
  - Personal dua list/notepad (bullet points for personal duas)
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

- Repository URL: [GitHub Repository URL]
- Live App URL: [App Store/Play Store URL]
- Documentation: [Documentation URL]

## App Structure

### Screens

The app consists of **5 main screens** accessible via bottom navigation:

1. **Home** - Collections hub with grid/list view
2. **Explore** - Discovery, search, AI chat, and Islamic tools
3. **Tasbih** - Simple counter for dhikr
4. **Bookmark** - All saved/favorited duas
5. **Profile** - Settings, notifications, and personal content

### Navigation

**Bottom Navigation Bar:**
- Home
- Explore
- Tasbih
- Bookmark
- Profile

**Fixed Action Button (Home Screen Only):**
- "+" button for adding duas (image upload, manual entry, AI assistant)

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

- **Fixed "+" Button:**
  - Always visible on home screen
  - Opens modal with three options:
    1. Image Upload
    2. Manual Entry
    3. AI Assistant

**Collection Detail View:**
When tapping a collection, users see:
- Collection name and description
- Count of duas
- Grid/list view toggle
- Sort options: Date added, Alphabetical, Custom order
- Share entire collection button
- Print entire collection button
- List of duas with preview cards

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

### Tasbih Screen

**Primary Purpose:** Simple dhikr counter

**Features:**
- Large number display
- Tap to increment
- Reset button
- Clean, distraction-free interface
- Optional vibration/sound feedback

### Bookmark Screen

**Primary Purpose:** Quick access to saved duas

**Features:**
- All bookmarked/favorited duas
- Shows which collection each dua belongs to
- Grid/list view toggle
- Quick access to dua details
- Remove bookmark option

### Profile Screen

**Primary Purpose:** Settings and personal content

**Sections:**

1. **Personal Content:**
   - My Dua List/Notes (bullet points)
   - Previous AI chats history

2. **Islamic Calendar:**
   - Today's date in Islamic calendar
   - Gregorian date

3. **Notifications:**
   - Notification settings and preferences
   - Daily reminder configuration
   <!-- - Ramadan reminders toggle -->

4. **Appearance:**
   - Dark/Light mode toggle
   - Font size adjustment
   - Arabic text styling preferences

5. **Language & Translation:**
   - Translation language preferences
   - Multiple language support options

6. **Content:**
   - Notes/Dua journal
   - Personal dua list management

7. **About & Support:**
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
- **Source/reference** (text input for Hadith, Quran, etc.)
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
   - Source/reference (Hadith, Quran, etc.)

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

## Key Features

### Collections System

**Multi-Collection Assignment:**
- Like Instagram saves - a dua can belong to multiple collections
- Select multiple collections when adding a dua
- View all collections a dua belongs to from dua detail screen

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
- **Al Quran (by Greentech Apps Foundation)** - filter/menu icon, Word-by-word translation feature with root word analysis, translation & transliteration toggle, 
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

## Development Roadmap

### Phase 1 - Core Features (MVP)
- [ ] Authentication and user management (email required for cloud sync)
- [ ] Bottom navigation setup (5 screens)
- [ ] **Home Screen:**
  - [ ] Collections grid/list view
  - [ ] Filter tabs (My Collections, Pre-made, All)
  - [ ] Reorganizable collections
  - [ ] Fixed "+" button for adding duas
- [ ] **Manual Dua Entry:**
  - [ ] Form with all fields (Arabic, transliteration, translation, source, tags)
  - [ ] Multi-collection assignment
  - [ ] Save to local cache and backend
- [ ] **Collection Management:**
  - [ ] Create custom collections
  - [ ] View collection details
  - [ ] Sort duas within collections
  - [ ] Edit/delete collections
- [ ] **Dua Detail View:**
  - [ ] Arabic text display
  - [ ] Translation (toggle on/off)
  - [ ] Transliteration (toggle on/off)
  - [ ] Collections indicator
  - [ ] Bookmark icon
  - [ ] Share button
- [ ] **Tasbih Counter:**
  - [ ] Simple counter screen
  - [ ] Customizable counters per dua
  - [ ] Preset counters for morning/evening adhkar
- [ ] **Bookmark System:**
  - [ ] Save/unsave duas
  - [ ] Bookmark screen with all saved duas
- [ ] **Profile Screen:**
  - [ ] Basic settings (appearance, language)
  - [ ] Today's Islamic date
- [ ] Local caching for offline access
- [ ] Cloud sync for collections

### Phase 2 - AI & Advanced Input
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
  - [ ] Universal search on Explore screen
  - [ ] Search by Arabic text, meaning, tags
  - [ ] Filter and browse options

### Phase 3 - Enhanced Features
- [ ] **Audio Integration:**
  - [ ] Audio player for duas
  - [ ] Upload custom audio
  - [ ] Audio file hosting
- [ ] **Word-by-Word Translation:**
  - [ ] Tap-to-reveal word meanings
  - [ ] Root word analysis
  - [ ] Grammatical notes
  - [ ] Related vocabulary
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

### Phase 4 - Special Features & Optimization
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
- [ ] Prayer time integration (optional)
- [ ] Qibla direction finder
- [ ] Integration with Quran apps

## Author

- GitHub - [Your GitHub Profile]
- Email - [Your Email]
- LinkedIn - [Your LinkedIn Profile]
- Twitter/X - [Your Twitter Handle]

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