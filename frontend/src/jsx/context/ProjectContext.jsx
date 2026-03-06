import React, { createContext, useContext } from 'react';

export const ProjectContext = createContext(null);

export const usePrj = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("usePrj must be used within a ProjectProvider");
    }
    return context;
};
