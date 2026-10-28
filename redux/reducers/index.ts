import { combineReducers } from '@reduxjs/toolkit'
import duasReducer from './duasSlice'
import exampleReducer from './exampleSlice'
import settingsReducer from './settingsSlice'

const rootReducer = combineReducers({
  example: exampleReducer,
  duas: duasReducer,
  settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
