# Data folder

Everything the app reads as data lives here. Each file is one resource and will become one table on the backend. All values in the files are generated, so none of it is real: emails use `example.com`, and ids are UUIDs.

- `data.json` is the entry point. `index.ts` loads the files and exports them as `data`. `types.ts` has the types (the `Dua` type is in `redux/reducers/duasSlice.ts` and the collection type is in `constants/collections.ts`).
- **Required** means the field is always there. **Optional** means it can be missing, and a missing optional field is left out of the object, not set to `""`. The one exception is an API reply, where `null` can stand in for a missing value, and the app treats `null` and missing the same way.
- Field names are camelCase. Dates are ISO 8601 strings in UTC (`2026-10-25T07:33:00Z`).
- Only `dua.json` and `collection.json` are read by the app today. The other files are ready-made data for login, favorites, friends and sharing.

## data.json

The entry point.

| Field | Type | Required | Notes |
|---|---|---|---|
| `version` | number | Required | Format version of the data. Raise it when a file changes in a way that breaks older code. |
| `currentUserId` | string | Required | The sample user's id. The app does not sign this user in at launch (it starts as a guest). Must be an `id` in `user.json`. |
| `resources` | object | Required | Resource name to file name: `duas`, `collections`, `users`, `userFavorites`, `friends`, `shares`. |

JSON files cannot import each other, so a new resource is added in `data.json` and in `index.ts`.

## dua.json

The built-in duas. An array of `Dua` objects without `isFavorite`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | Required | Unique. Built-in duas have readable ids (`"1"`, `"dhikr-subhanallah"`). A shared copy gets a new id. |
| `title` | string | Required | |
| `arabicText` | string | Required | |
| `transliteration` | string | Optional | An empty string counts as missing, and the Dua screen hides the block. 14 built-in duas (the Arabic-only dhikr) have `""`. |
| `translations` | object | Required | Language code to text, with at least one language. Every built-in dua has `en`. |
| `categories` | string[] | Required | Ids of the pre-made collections the dua belongs to (one or more for built-in duas). Each should match a collection `id`. A dua the user adds has `[]`: the user's collections list it in their own `duaIds` instead. |
| `source` | `"quran"` or `"hadith"` | Optional | Use it together with `reference`. |
| `reference` | string | Optional | Quran: `"21:87"` or `"11:39-42"`. Hadith: `"Muslim 596"`. Use it together with `source`. |
| `info` | string (HTML) | Optional | Written in the rich editor. Only shown as formatted text. |
| `repeat` | number | Optional | How many times the dua is recited, a whole number of 1 or more. Missing means 1. |
| `audioUrl` | string | Optional | Reserved for audio recitations. Nothing reads it yet: the Dua screen's audio button was replaced by the **Save to collection** button. No built-in dua has one. |
| `origin` | `"builtin"`, `"manual"`, `"ai"`, `"image"` or `"shared"` | Required | Where the dua came from. Anything but `builtin` can be edited and deleted. |
| `sharedBy` | string | Optional | The id of the user who shared it. Present only on a shared copy (`origin: "shared"`). Missing when the user made the dua themselves. |
| `iconPath` | string | Optional | Path to the icon SVG. Every built-in dua has one. |

`isFavorite` is not stored in the file. Who favorited what is in `user_favorites.json`.

Note: dua `"4"` has `origin: "manual"` although it ships with the app. The app treats a dua as built-in when its id is in `dua.json`, so this causes no harm, but the value is probably a leftover.

## collection.json

The collections on the home grid. An array of `CollectionDef` objects.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | Required | Unique. The same text that duas list in `categories`. Pre-made collections have readable ids (`"Morning"`). A collection made or received later gets a new id. |
| `name` | string | Required | Shown on the card. For a collection received through a share, this is what the duplicate check compares. |
| `iconKey` | string | Required | One of `COLLECTION_ICON_KEYS` in `components/icons/collection-icons`. |
| `isUserCreated` | boolean | Optional | `true` for a collection the user made or received through a share. Missing means pre-made. |
| `duaIds` | string[] | Optional | Only on a collection the user made (never empty: a collection is created together with its first dua, and is deleted when its last dua is deleted from the library): the ids of its duas in the order shown. Pre-made collections have none: their duas are the ones that name them in `categories`. Ids of duas that no longer exist are skipped. |
| `sharedBy` | string | Optional | The id of the user who shared it. Missing when the user made it themselves. |

## user.json

People who signed in with Google or Facebook. An array of `User` objects.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Required | Unique. This is what friends, favorites and shares point to. |
| `userCode` | string | Required | Unique, 6 characters without the hyphen (`"BG7K3M"`). See [User code](#user-code). |
| `email` | string | Optional | Missing when the provider did not give one (Facebook can leave it out). Shown in the friend picker. |
| `firstName` | string | Required | |
| `lastName` | string | Optional | Missing when the provider gave a single name. |
| `avatar` | object | Required | The same `AvatarConfig` as the Settings avatar. |
| `avatar.gender` | `"male"` or `"female"` | Required | |
| `avatar.skin`, `avatar.hair`, `avatar.shirt`, `avatar.cap`, `avatar.hijab` | string (`#RRGGBB`) | Required | `cap` shows on the male avatar and `hijab` on the female one, but both are always stored. |
| `authProvider` | `"google"` or `"facebook"` | Required | |
| `providerUserId` | string | Required | The id Google or Facebook gave this person. |
| `createdAt` | date string | Required | |
| `updatedAt` | date string | Required | Not earlier than `createdAt`. |

## user_favorites.json

One row per favorite dua. An array of `UserFavorite` objects. A row is unique on `userId` + `duaId`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `userId` | string | Required | An `id` in `user.json`. |
| `duaId` | string | Required | An `id` in `dua.json`. |
| `position` | number | Required | Where the dua is in this user's favorites: a whole number from 0, with no gaps or repeats for the same user. It is the order the user arranged them in (Reorder on the Favorites screen), and the Dua screen goes through the favorites in this order. A newly favorited dua goes last. |
| `createdAt` | date string | Required | When the dua was favorited. It does not decide the order. |

## friends.json

People a user has added as a friend (`user_friends`). An array of `UserFriend` objects. A row is unique on `userId` + `friendId`.

Friendship goes one way. If Ali adds Sara, Sara is not Ali's friend until she adds him. The friend's avatar, email and name are not stored here: the friend picker reads them from `user.json`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `userId` | string | Required | The user who added the friend. |
| `friendId` | string | Required | The friend's user `id`. Never the same as `userId`. |
| `groups` | string[] | Required | Any of `"family"`, `"friends"`, `"mosque"` (`FRIEND_GROUPS`), no repeats. Can be an empty array when no group was picked. |
| `createdAt` | date string | Required | |

## shares.json

A dua or collection one user sent to another. An array of `Share` objects.

A share is a request. Nothing reaches the recipient's library until they accept. On accept, the app copies the item into their library as if they had made it, after the duplicate checks below.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Required | Unique. |
| `type` | `"dua"` or `"collection"` | Required | |
| `targetId` | string | Required | The dua `id` or collection `id` that was sent, depending on `type`. |
| `senderId` | string | Required | A user `id`. |
| `recipientId` | string | Required | A user `id`, never the same as `senderId`. The recipient does not have to be a friend. |
| `status` | `"pending"`, `"accepted"` or `"declined"` | Required | |
| `createdAt` | date string | Required | |
| `respondedAt` | date string | Optional | Set when the recipient accepts or declines, and missing while `status` is `pending`. |

In the mock data, `targetId` points to built-in duas and collections, because those are the only ones in the files. A real share usually points to something the sender created. When a share is accepted, the copy is made by the backend and is not in these files.

## Rules

### User code

- **Format:** two initials, then 4 random characters, shown as `BG-7K3M` and stored as `BG7K3M`. The random part uses the letters A-Z except I, L and O, and the digits 2-9 (31 characters), so there are about 923,000 codes per pair of initials.
- **Fallback:** `UU` replaces the initials when the last name is missing or a name does not start with a Latin letter (`UU-3E4R`). Accents are ignored (`É` counts as `E`).
- **Generated** once by the backend, at first sign-in. It checks that the code is free and tries again if it is not. A name change never changes the code.
- **Typing:** case, spaces and hyphens or dashes are ignored, so `bg 7k3m` finds `BG7K3M`. A text that cannot be a code is rejected without a request.
- **Confirmation:** a found user shows the avatar and first name plus last initial. When nobody has the code, the app says: "No user with that code. Check it and try again."
- **Abuse:** about 10 lookups a minute per user, and a user's own code is ignored.
- **Reset:** a user can get a new code. The old code stops working at once. Friends and shares use `id`, so they are not affected.
- The rules are in code in `lib/user-code.ts` (`generateUserCode`, `generateUniqueUserCode`, `normalizeUserCode`, `parseUserCodeInput`, `formatUserCode`).

### Sharing

- The sender picks friends, a group or a code. One `Share` is created per person, with `status: "pending"`.
- The recipient accepts or declines. A declined share changes nothing in their library.
- On accept, the item is copied into the recipient's library as if they had created it:
  - A shared dua gets a new `id`, `origin: "shared"` and `sharedBy` set to the sender. It goes into a collection the recipient chooses.
  - A shared collection gets a new `id`, `isUserCreated: true` and `sharedBy`, and its duas are copied with it.
  - If the item was itself shared to the sender, `sharedBy` is the person who sent it on (the direct sender).
  - A copy is its own item: later edits by either person do not reach the other.
- **Duplicate checks, on accept:**
  - A **collection** is a duplicate if the recipient already has one with the same name. The comparison ignores case and extra spaces.
  - A **dua** is a duplicate if the recipient's chosen collection already holds a dua with the same `source` and the same `reference`.

Example of a copy (not in `dua.json`):

```json
{
  "id": "7d1f3c52-6b0e-4f0a-9a62-2f1f6d2b8c11",
  "title": "Quranic Dua",
  "arabicText": "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّٰلِمِينَ",
  "transliteration": "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
  "translations": { "en": "There is no deity but You. Indeed, I have been of the wrongdoers." },
  "categories": ["Quranic"],
  "source": "quran",
  "reference": "21:87",
  "origin": "shared",
  "sharedBy": "95fc0d98-89c1-4d1e-aa18-b4a3a82715c9"
}
```

### Still to decide

- What happens on a duplicate: for a collection (merge into the existing one, skip, or keep both) and for a dua (skip it, or pick another collection). The checks above only find duplicates.
- Duas without `source` and `reference` cannot be matched by the dua check. A fallback would be to compare the Arabic text.
- A pre-made collection lists its duas through the duas' `categories`, but a collection the user made lists its own `duaIds`, so it can hold built-in duas too. When a shared collection is copied, its `duaIds` must point at duas the recipient has: a built-in dua is the same on every device, but an added dua has to be copied with the collection.
