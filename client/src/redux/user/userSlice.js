import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signInStart(state) {
            state.loading=true;
            state.error=false;
        },
        signInSuccess(state, action) {
            state.currentUser = action.payload;
            state.loading=false;
            state.error=false;
        },
        signInFail(state, action) {
            state.loading=false;
            state.error = action.payload;
        },
        userUpdateStart(state) {
            state.loading=true;
            state.error=false;
        },
        updateSuccess(state, action) {
            state.loading=false;
            state.error=false;
            state.currentUser = action.payload;
        },
        updateUserFail(state, action) {
            state.loading=false;
            state.error=action.payload;
        }
    }
})

export const {signInStart, signInSuccess, signInFail, userUpdateStart, updateSuccess, updateUserFail} = userSlice.actions;
export default userSlice.reducer;