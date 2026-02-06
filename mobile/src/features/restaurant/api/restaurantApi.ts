import apiClient from '@/core/api/client';
import { Restaurant, MenuItem, Category, RestaurantSearchParams } from '../types';

// Mock categories
export const mockCategories: Category[] = [
    { id: '1', name: 'Hamburguesas', icon: '🍔', slug: 'hamburguesas' },
    { id: '2', name: 'Pizza', icon: '🍕', slug: 'pizza' },
    { id: '3', name: 'Sushi', icon: '🍣', slug: 'sushi' },
    { id: '4', name: 'Pollo', icon: '🍗', slug: 'pollo' },
    { id: '5', name: 'Vegano', icon: '🥗', slug: 'vegano' },
    { id: '6', name: 'Postres', icon: '🍰', slug: 'postres' },
    { id: '7', name: 'Bebidas', icon: '🥤', slug: 'bebidas' },
    { id: '8', name: 'Mexicana', icon: '🌮', slug: 'mexicana' },
];

// Mock restaurants
const mockRestaurants: Restaurant[] = [
    {
        id: '1',
        name: 'Burger King',
        description: 'Las mejores hamburguesas a la parrilla',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        rating: 4.5,
        reviewCount: 1250,
        deliveryTime: '25-35 min',
        deliveryFee: 5.0,
        minimumOrder: 15.0,
        distance: 1.2,
        isOpen: true,
        categories: ['Hamburguesas', 'Pollo'],
        location: { latitude: -12.0464, longitude: -77.0428 },
        address: 'Av. Larco 1234, Miraflores',
    },
    {
        id: '2',
        name: 'Pizza Hut',
        description: 'Pizza fresca y deliciosa',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        rating: 4.3,
        reviewCount: 890,
        deliveryTime: '30-40 min',
        deliveryFee: 6.0,
        minimumOrder: 20.0,
        distance: 2.5,
        isOpen: true,
        categories: ['Pizza'],
        location: { latitude: -12.0564, longitude: -77.0528 },
        address: 'Av. Benavides 567, Miraflores',
    },
    {
        id: '3',
        name: 'Sushi Master',
        description: 'Auténtico sushi japonés',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        rating: 4.7,
        reviewCount: 2100,
        deliveryTime: '35-45 min',
        deliveryFee: 8.0,
        minimumOrder: 30.0,
        distance: 3.1,
        isOpen: true,
        categories: ['Sushi'],
        location: { latitude: -12.0664, longitude: -77.0628 },
        address: 'Calle Los Pinos 890, San Isidro',
    },
    {
        id: '4',
        name: 'KFC',
        description: 'Pollo frito crujiente',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',
        rating: 4.2,
        reviewCount: 1500,
        deliveryTime: '20-30 min',
        deliveryFee: 4.5,
        minimumOrder: 12.0,
        distance: 0.8,
        isOpen: true,
        categories: ['Pollo'],
        location: { latitude: -12.0364, longitude: -77.0328 },
        address: 'Av. Pardo 345, Miraflores',
    },
    {
        id: '5',
        name: 'Green Life',
        description: 'Comida saludable y vegana',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        rating: 4.6,
        reviewCount: 780,
        deliveryTime: '25-35 min',
        deliveryFee: 7.0,
        minimumOrder: 18.0,
        distance: 1.9,
        isOpen: false,
        categories: ['Vegano'],
        location: { latitude: -12.0764, longitude: -77.0728 },
        address: 'Calle Las Flores 123, Barranco',
    },
];

// Mock menu items
const mockMenuItems: Record<string, MenuItem[]> = {
    '1': [
        {
            id: '1-1',
            name: 'Whopper',
            description: 'Hamburguesa clásica con carne a la parrilla, tomate, lechuga y cebolla',
            price: 18.9,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            category: 'Hamburguesas',
            isAvailable: true,
            preparationTime: 15,
        },
        {
            id: '1-2',
            name: 'Chicken Royale',
            description: 'Hamburguesa de pollo crujiente con mayonesa y lechuga',
            price: 16.9,
            image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
            category: 'Hamburguesas',
            isAvailable: true,
            preparationTime: 12,
        },
        {
            id: '1-3',
            name: 'Papas Fritas Grandes',
            description: 'Papas fritas crujientes',
            price: 6.9,
            category: 'Acompañamientos',
            isAvailable: true,
            preparationTime: 5,
        },
    ],
    '2': [
        {
            id: '2-1',
            name: 'Pizza Pepperoni Personal',
            description: 'Pizza con pepperoni y queso mozzarella',
            price: 22.9,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
            category: 'Pizza',
            isAvailable: true,
            preparationTime: 20,
        },
        {
            id: '2-2',
            name: 'Pizza Hawaiana Familiar',
            description: 'Pizza con jamón, piña y queso',
            price: 45.9,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
            category: 'Pizza',
            isAvailable: true,
            preparationTime: 25,
        },
    ],
    '3': [
        {
            id: '3-1',
            name: 'Sushi Roll Clásico',
            description: '10 piezas de sushi roll con salmón y aguacate',
            price: 35.9,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
            category: 'Sushi',
            isAvailable: true,
            preparationTime: 30,
        },
        {
            id: '3-2',
            name: 'Nigiri Variado',
            description: '8 piezas de nigiri variado',
            price: 42.9,
            image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
            category: 'Sushi',
            isAvailable: true,
            preparationTime: 25,
        },
    ],
};

/**
 * Get restaurants by location
 * TODO: Replace with actual API call when backend is ready
 */
export const getRestaurants = async (
    params: RestaurantSearchParams
): Promise<Restaurant[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter and sort mock data
    let results = [...mockRestaurants];

    // Filter by open status
    if (params.filters?.isOpen !== undefined) {
        results = results.filter(r => r.isOpen === params.filters?.isOpen);
    }

    // Filter by category
    if (params.filters?.categoryId) {
        const category = mockCategories.find(c => c.id === params.filters?.categoryId);
        if (category) {
            results = results.filter(r => r.categories.includes(category.name));
        }
    }

    // Sort results
    if (params.filters?.sortBy === 'distance') {
        results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (params.filters?.sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
    }

    return results;
};

/**
 * Get restaurant by ID
 * TODO: Replace with actual API call when backend is ready
 */
export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const restaurant = mockRestaurants.find(r => r.id === id);
    return restaurant || null;
};

/**
 * Get menu items for a restaurant
 * TODO: Replace with actual API call when backend is ready
 */
export const getMenu = async (restaurantId: string): Promise<MenuItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return mockMenuItems[restaurantId] || [];
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockCategories;
};
