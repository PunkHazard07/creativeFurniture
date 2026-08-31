import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../redux/authSlice';
import cartReducer from '../redux/cartSlice';

export function renderWithProviders(ui, { preloadedState = {}, route = '/' } = {}) {
const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    },
    preloadedState,
});

const utils = render(
    <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
);

return { store, ...utils };
}