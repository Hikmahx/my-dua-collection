import { combineReducers } from '@reduxjs/toolkit'
import duasReducer from './duasSlice'
import exampleReducer from './exampleSlice'

const rootReducer = combineReducers({
  example: exampleReducer,
  duas: duasReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
