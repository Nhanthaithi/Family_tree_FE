import { createSlice } from "@reduxjs/toolkit";

const genealogySlice = createSlice({
  name: "genealogy",
  initialState: {
    dataGenealogy: null,
  },
  reducers: {
    setDataGenealogyTree: (state, action) => {
      state.dataGenealogy = action.payload;
    },
  },
});

const { actions, reducer } = genealogySlice;
export const { setDataGenealogyTree } = actions;
export default reducer;
