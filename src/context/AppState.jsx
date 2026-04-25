import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDatabase } from '../database/DatabaseManager';

// Create React context object. Allows data to be available to child components.
const AppStateContext = createContext(null);

// Function receives whatever is wrapped inside it. <AppStateProvider> ... <AppStateProvider>
export function AppStateProvider({ children }) {
    // useState() returns arr with a state value and a function to change value's state.
    // Initial values true and 0 used. Tracked by React and rerenders affected components.
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // UseEffect accepts code and dependency array.
    // Essentially app's startup routine. Runs after first render (i.e. react runs AppStateProvider and uses its return output)
    useEffect(() => {
        initializeDatabase();
        setIsLoading(false); // Marks that startup loading is finished.
    }, []); // Empty dependency array b/c initializing DB should only happen once

    const triggerRefresh = () => setRefreshKey((k) => k + 1); //pass function to iterate refreshkey by 1.

    return (
        // Provider takes whatever is passed into value available to all components wrapped in AppStateProvider
        <AppStateContext.Provider
            value = {{
                isLoading,
                refreshKey,
                triggerRefresh
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const ctx = useContext(AppStateContext); // Takes AppStateContext.Provider's value object.
    if (!ctx) throw new Error('useAppState must be used within AppStateProvider'); // If ctx is null, component likely not a child of AppStateProvider.
    return ctx; // Allows children of AppStateProvider to call ctx, which returns value, which contains the properties.
}
