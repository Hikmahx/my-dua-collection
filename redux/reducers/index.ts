import { combineReducers } from '@reduxjs/toolkit'
import collectionsReducer from './collectionsSlice'
import duasReducer from './duasSlice'
import exampleReducer from './exampleSlice'
import kindredReducer from './kindredSlice'
import notificationsReducer from './notificationsSlice'
import settingsReducer from './settingsSlice'
import tasbihReducer from './tasbihSlice'
import userReducer from './userSlice'

const rootReducer = combineReducers({
  example: exampleReducer,
  duas: duasReducer,
  collections: collectionsReducer,
  kindred: kindredReducer,
  notifications: notificationsReducer,
  settings: settingsReducer,
  tasbih: tasbihReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
