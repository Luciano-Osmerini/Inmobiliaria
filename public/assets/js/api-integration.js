// API Configuration for Backend Integration
const API_BASE_URL = window.location.origin + '/api';

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    // Don't set Content-Type for FormData (multer needs multipart)
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const response = await fetch(API_BASE_URL + endpoint, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication functions
const API = {
    // Auth
    async login(credentials) {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
    },

    async logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return await apiCall('/auth/logout', { method: 'POST' });
    },

    async verifyToken() {
        return await apiCall('/auth/verify-token', { method: 'POST' });
    },

    // Properties
    async getAllProperties() {
        return await apiCall('/properties');
    },

    async getPropertiesByCategory(category) {
        return await apiCall(`/properties/category/${category}`);
    },

    async getProperty(id) {
        return await apiCall(`/properties/${id}`);
    },

    async createProperty(propertyData) {
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', propertyData.title);
        formData.append('description', propertyData.description);
        formData.append('price', propertyData.price);
        formData.append('category', propertyData.category);
        
        // Add images
        if (propertyData.images) {
            for (let i = 0; i < propertyData.images.length; i++) {
                formData.append('images', propertyData.images[i]);
            }
        }
        
        return await apiCall('/properties', {
            method: 'POST',
            body: formData
        });
    },

    async updateProperty(id, propertyData) {
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', propertyData.title);
        formData.append('description', propertyData.description);
        formData.append('price', propertyData.price);
        formData.append('category', propertyData.category);
        if (propertyData.status) {
            formData.append('status', propertyData.status);
        }
        
        // Add new images if any
        if (propertyData.images) {
            for (let i = 0; i < propertyData.images.length; i++) {
                formData.append('images', propertyData.images[i]);
            }
        }
        
        return await apiCall(`/properties/${id}`, {
            method: 'PUT',
            body: formData
        });
    },

    async deleteProperty(id) {
        return await apiCall(`/properties/${id}`, {
            method: 'DELETE'
        });
    },

    async deletePropertyImage(propertyId, imageId) {
        return await apiCall(`/properties/${propertyId}/images/${imageId}`, {
            method: 'DELETE'
        });
    },

    async setMainImage(propertyId, imageId) {
        return await apiCall(`/properties/${propertyId}/images/${imageId}/main`, {
            method: 'PATCH'
        });
    }
};

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Auto-redirect to login if not authenticated (for admin pages)
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Load properties for frontend carousels
async function loadPropertiesForCarousels() {
    try {
        const categories = [
            'carousel1', 'carousel2', 'carousel3', 
            'carousel4', 'carousel5', 'carousel6'
        ];
        
        const allPropertiesData = {};
        
        for (const category of categories) {
            try {
                const response = await API.getPropertiesByCategory(category);
                allPropertiesData[category] = response.data || [];
            } catch (error) {
                console.warn(`Error loading ${category}:`, error);
                allPropertiesData[category] = [];
            }
        }
        
        // Update carousels if function exists
        if (typeof updateAllCarousels === 'function') {
            updateAllCarousels(allPropertiesData);
        }
        
        return allPropertiesData;
    } catch (error) {
        console.error('Error loading properties for carousels:', error);
        return {};
    }
}

// Initialize API integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load properties for main site
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        loadPropertiesForCarousels();
    }
    
    // Check authentication for admin pages
    if (window.location.pathname.includes('admin')) {
        requireAuth();
    }
});