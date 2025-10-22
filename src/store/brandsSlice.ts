import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

interface BrandsState {
  brands: Brand[];
}

const initialState: BrandsState = {
  brands: [],
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.brands = action.payload;
    },
    addBrand: (state, action: PayloadAction<Brand>) => {
      state.brands.push(action.payload);
    },
    deleteBrand: (state, action: PayloadAction<number>) => {
      state.brands = state.brands.filter(brand => brand.id !== action.payload);
    },
    updateBrand: (state, action: PayloadAction<Brand>) => {
      const index = state.brands.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
  },
});

export const { setBrands, addBrand, deleteBrand, updateBrand } = brandsSlice.actions;
export default brandsSlice.reducer;
