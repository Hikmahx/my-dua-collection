import { combineReducers } from '@reduxjs/toolkit'
import duasReducer from './duasSlice'
import exampleReducer from './exampleSlice'
import settingsReducer from './settingsSlice'
import tasbihReducer from './tasbihSlice'
import userReducer from './userSlice'

const rootReducer = combineReducers({
  example: exampleReducer,
  duas: duasReducer,
  settings: settingsReducer,
  tasbih: tasbihReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
