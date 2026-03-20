import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, getHeaders } from './config/api';

const CountryContext = createContext();

export const useCountry = () => {
    const context = useContext(CountryContext);
    if (!context) {
        throw new Error('useCountry must be used within CountryProvider');
    }
    return context;
};

export const CountryProvider = ({ children }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countries, setCountries] = useState([]);

    // Detect user's country from browser locale or default to France
    useEffect(() => {
        const detectCountry = () => {
            const locale = navigator.language || navigator.userLanguage;
            const countryCode = locale.split('-')[1] || 'FR'; // Default to FR (France)
            return countryCode;
        };

        const defaultCountryCode = detectCountry();

        // Fetch countries and set default
        fetch(API_ENDPOINTS.COUNTRIES, { headers: getHeaders() })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCountries(data);
                    const defaultCountry = data.find(c => c.code === defaultCountryCode) || data.find(c => c.code === 'FR') || data[0];
                    setSelectedCountry(defaultCountry);
                } else {
                    console.error('Invalid countries data format:', data);
                }
            })
            .catch(err => console.error('Failed to fetch countries:', err));
    }, []);

    const changeCountry = (country) => {
        setSelectedCountry(country);
    };

    return (
        <CountryContext.Provider value={{ selectedCountry, countries, changeCountry }}>
            {children}
        </CountryContext.Provider>
    );
};
