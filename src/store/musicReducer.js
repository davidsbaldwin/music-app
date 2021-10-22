import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: {
        title: "English",
        src: "usa.jpg",
    },
    user: null,
    songs: [],
    song: {},
    isPlaying: false,
};

export const counterSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {
        // language Mode
        setLanguageMode: (state, { payload }) => {
            state.language = payload;
        },

        // authentication
        setUser: (state, { payload }) => {
            state.user = payload;
        },

        // Songs configuration
        setSongs: (state, { payload }) => {
            state.songs = payload;
        },

        // Song configuration
        setSong: (state, { payload }) => {
            state.song = payload;
        },
        setIsPlaying: (state, { payload }) => {
            state.isPlaying = payload;
        },
        setPreviousSong: (state, { payload }) => {
            const currentIndex = state.songs.findIndex((song) => song._id === payload._id);
            if (currentIndex <= 0) return;
            state.song = state.songs[currentIndex - 1];
        },
        setNextSong: (state, { payload }) => {
            const currentIndex = state.songs.findIndex((song) => song._id === payload._id);
            if (currentIndex < 0 || currentIndex === state.songs.length - 1) return;
            state.song = state.songs[currentIndex + 1];
        },
    },
});

// Action creators are generated for each case reducer function
export const { setSongs, setSong, setNextSong, setPreviousSong, setIsPlaying, setUser, setLanguageMode } = counterSlice.actions;

export default counterSlice.reducer;