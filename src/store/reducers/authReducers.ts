// src/store/reducers/authReducer.ts
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// State interface
export interface AuthState {
    isAuthenticated: boolean;
    user: any;
}

// Action interface
export interface AuthAction {
    type: string;
    payload?: any;
}

// Initial state of the auth context
export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

// Reducer function
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case LOGIN:
            return { ...state, isAuthenticated: true, user: action.payload };
        case LOGOUT:
            return { ...state, isAuthenticated: false, user: null };
        default:
            return state;
    }
};
