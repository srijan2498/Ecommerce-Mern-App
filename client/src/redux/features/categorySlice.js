import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
    name : "categories",
    initialState : {
        categories : [],
    },
    reducers : {
        setCategories : (state, action) => {
            state.categories = action.payload
        }
    }
});

export const {setCategories} = categorySlice.actions;