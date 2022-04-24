import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import findIndex from 'lodash/findIndex';

export type State = {
  isSignedIn: boolean;
  name: string;
  email: string;
  breeds: BreedType[];
};

export type BreedType = {
  name: string;
  img: string;
  fav: boolean;
  subs?: BreedType[];
};

const initialState: State = {
  isSignedIn: false,
  name: '',
  email: '',
  breeds: [],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    login: (
      state: State,
      action: PayloadAction<{name: string; email: string}>,
    ) => {
      state.isSignedIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: _ => initialState,
    setBreeds: (state: State, action) => {
      const breeds = Object.keys(action.payload);
      const newBreeds = breeds.map(breed => {
        return {
          name: breed,
          subs: action.payload[breed].map((sub: string) => ({
            name: sub,
            img: '',
            fav: false,
          })),
          img: '',
          fav: false,
        };
      });
      state.breeds = newBreeds;
    },
    setBreedImg: (
      state: State,
      action: PayloadAction<{name: string; imgs: string[]}>,
    ) => {
      const index = findIndex(
        state.breeds,
        (breed: BreedType) => breed.name === action.payload.name,
      );
      state.breeds[index].img = action.payload.imgs[0];
      if ((state.breeds[index].subs ?? []).length > 0) {
        state.breeds[index].subs = state.breeds[index].subs?.map(sub => ({
          ...sub,
          img: action.payload.imgs.filter(ig =>
            ig.includes(`${action.payload.name}-${sub.name}`),
          )[0],
        }));
      }
    },
    setBreedFav: (state: State, action: PayloadAction<{name: string}>) => {
      const nameParts = action.payload.name.split('-');
      const index = findIndex(
        state.breeds,
        (breed: BreedType) => breed.name === nameParts[0],
      );
      if (nameParts[1]) {
        const index2 = findIndex(
          state.breeds[index].subs,
          (breed: BreedType) => breed.name === nameParts[1],
        );
        (state.breeds[index].subs as BreedType[])[index2].fav = !(
          state.breeds[index].subs as BreedType[]
        )[index2].fav;
      } else {
        state.breeds[index].fav = !state.breeds[index].fav;
      }
    },
  },
});

export const {login, logout, setBreeds, setBreedImg, setBreedFav} =
  appSlice.actions;

export default appSlice.reducer;
