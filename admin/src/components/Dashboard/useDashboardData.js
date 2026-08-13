import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/api';
import socketService from '../../services/socket';

const initialDashboardData = {
  salesMetrics: { totalOrders: 0, totalSales: 0 },
  customerMetrics: { registeredUsers: 0 },
  inventoryMetrics: { outOfStockProducts: 0, totalProducts: 0, stockLevel: "0%" },
  financeMetrics: { successfulPayments: 0, failedPayments: 0, paymentSuccessRate: "0%" },
  recentActivity: {
    recentOrders: {
      data: [],
      pagination: { page: 1, pageSize: 5, totalItems: 0, totalPages: 0 }
    },
    recentProducts: {
      data: [],
      pagination: { page: 1, pageSize: 5, totalItems: 0, totalPages: 0 }
    }
  }
};

export const useDashboardData = () => {
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(initialDashboardData);

  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardMetrics(
        timePeriod,
        ordersPage,
        productsPage
      );

      if (response.success) {
        setDashboardData(response.data);
        setError(null);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [timePeriod, ordersPage, productsPage]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const handleOrdersPagination = (direction) => {
    if (direction === 'prev' && ordersPage > 1) {
      setOrdersPage(prev => prev - 1);
    } else if (direction === 'next' && ordersPage < dashboardData.recentActivity.recentOrders.pagination.totalPages) {
      setOrdersPage(prev => prev + 1);
    }
  };

  const handleProductsPagination = (direction) => {
    if (direction === 'prev' && productsPage > 1) {
      setProductsPage(prev => prev - 1);
    } else if (direction === 'next' && productsPage < dashboardData.recentActivity.recentProducts.pagination.totalPages) {
      setProductsPage(prev => prev + 1);
    }
  };

  // Set up Socket.io listeners for real-time updates
  useEffect(() => {
    socketService.connect();

    const newOrderSubscription = socketService.subscribe('new-order', () => {
      fetchDashboardData();
    });

    const productUpdatedSubscription = socketService.subscribe('product-updated', () => {
      fetchDashboardData();
    });

    const inventoryChangedSubscription = socketService.subscribe('inventory-changed', () => {
      fetchDashboardData();
    });

    return () => {
      newOrderSubscription();
      productUpdatedSubscription();
      inventoryChangedSubscription();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch initial data and refresh when dependencies change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    timePeriod,
    loading,
    error,
    dashboardData,
    ordersPage,
    productsPage,
    handleRefresh,
    handleTimePeriodChange,
    handleOrdersPagination,
    handleProductsPagination
  };
};