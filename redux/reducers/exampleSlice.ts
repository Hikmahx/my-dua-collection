import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ExampleState {
  value: number
}

const initialState: ExampleState = { value: 0 }

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<number>) {
      state.value = action.payload
    },
    reset(state) {
      state.value = 0
    },
  },
})

export const { setValue, reset } = exampleSlice.actions
export default exampleSlice.reducer
