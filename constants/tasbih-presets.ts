/**
 * The 10 duas shown in the Tasbih picker before the user searches (ids from data/data.json).
 * Order here = order in the list. Every other dua is found through the search box.
 */
export const TASBIH_PRESET_IDS: string[] = [
  'dhikr-subhanallah',
  'dhikr-alhamdulillah',
  'dhikr-allahu-akbar',
  'dhikr-la-ilaha-illallah',
  'dhikr-astaghfirullah',
  'dhikr-subhanallahi-wa-bihamdihi',
  'dhikr-subhanallahil-azeem',
  'dhikr-la-hawla',
  'dhikr-salawat',
  'dhikr-hasbunallah',
]

export const DEFAULT_DHIKR_ID = TASBIH_PRESET_IDS[0]
