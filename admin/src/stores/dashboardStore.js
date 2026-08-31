import { create } from 'zustand';
import { fetchWithAuth } from '../utils/api';
import socketService from '../services/socket';

const initialDashboardData = {
    salesMetrics: { totalOrders: 0, totalSales: 0 },
    customerMetrics: { registeredUsers: 0 },
    inventoryMetrics: { outOfStockProducts: 0, totalProducts: 0, stockLevel: '0%' },
    financeMetrics: { successfulPayments: 0, failedPayments: 0, paymentSuccessRate: '0%' },
    recentActivity: {
        recentOrders: {
            data: [],
            pagination: { page: 1, pageSize: 5, totalItems: 0, totalPages: 0 },
        },
        recentProducts: {
            data: [],
            pagination: { page: 1, pageSize: 5, totalItems: 0, totalPages: 0 },
        },
    },
};

let socketUnsubscribers = [];

export const useDashboardStore = create((set, get) => ({
    timePeriod: 'weekly',
    loading: true,
    error: null,
    dashboardData: initialDashboardData,
    ordersPage: 1,
    productsPage: 1,
    salesChartData: [],
    salesChartLoading: false,

    fetchDashboardData: async () => {
        const { timePeriod, ordersPage, productsPage } = get();

        set({ loading: true });

        try {
            const data = await fetchWithAuth(
                `/dash-metrics?timePeriod=${timePeriod}&ordersPage=${ordersPage}&productsPage=${productsPage}&pageSize=5`
            );

            if (!data) return; 

            if (data.ok && data.success) {
                set({ dashboardData: data.data, error: null, loading: false });
            } else {
                set({ error: 'Failed to fetch dashboard data', loading: false });
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            set({ error: err.message || 'Failed to fetch dashboard data', loading: false });
        }
    },

    fetchSalesChart: async (days = 7) => {
        set({ salesChartLoading: true });

        try {
            const data = await fetchWithAuth(`/sales-chart?days=${days}`);

            if (!data) return;

            if (data.ok && data.success) {
                set({ salesChartData: data.data, salesChartLoading: false });
            } else {
                console.error('Failed to fetch sales chart data');
                set({ salesChartLoading: false });
            }
        } catch (err) {
            console.error('Error fetching sales chart data:', err);
            set({ salesChartLoading: false });
        }
    },

    handleRefresh: () => {
        get().fetchDashboardData();
        get().fetchSalesChart();
    },

    handleTimePeriodChange: (e) => {
        set({ timePeriod: e.target.value });
        get().fetchDashboardData();
    },

    handleOrdersPagination: (direction) => {
        const { ordersPage, dashboardData } = get();
        const totalPages = dashboardData.recentActivity.recentOrders.pagination.totalPages;

        if (direction === 'prev' && ordersPage > 1) {
            set({ ordersPage: ordersPage - 1 });
            get().fetchDashboardData();
        } else if (direction === 'next' && ordersPage < totalPages) {
            set({ ordersPage: ordersPage + 1 });
            get().fetchDashboardData();
        }
    },

    handleProductsPagination: (direction) => {
        const { productsPage, dashboardData } = get();
        const totalPages = dashboardData.recentActivity.recentProducts.pagination.totalPages;

        if (direction === 'prev' && productsPage > 1) {
            set({ productsPage: productsPage - 1 });
            get().fetchDashboardData();
        } else if (direction === 'next' && productsPage < totalPages) {
            set({ productsPage: productsPage + 1 });
            get().fetchDashboardData();
        }
    },

    initSocketListeners: () => {
        if (socketUnsubscribers.length > 0) return;

        socketService.connect();

        const refetch = () => get().fetchDashboardData();

        socketUnsubscribers = [
            socketService.subscribe('new-order', refetch),
            socketService.subscribe('product-updated', refetch),
            socketService.subscribe('inventory-changed', refetch),
        ];
    },

    teardownSocketListeners: () => {
        socketUnsubscribers.forEach((unsubscribe) => unsubscribe());
        socketUnsubscribers = [];
    }
}));