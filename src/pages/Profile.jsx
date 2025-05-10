import { useEffect, useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [ordersSummary, setOrdersSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [cart, setCart] = useState({ items: [], total: 0 });
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }

        const fetchUserAndOrders = async () => {
            setLoading(true);
            // setCart({ items: [], total: 0 });
            try {
                // Fetch User Profile
                const userRes = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!userRes.ok) throw new Error('Failed to fetch user profile');
                const userData = await userRes.json();
                setUser(userData.user);
                console.log(userData);
                // setCart(userData.cart);


                // Fetch Orders
                const ordersRes = await fetch(`${import.meta.env.VITE_BASE_URL}/userOrders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const ordersData = await ordersRes.json();
                if (!ordersData.success) throw new Error(ordersData.message || 'Failed to fetch orders');

                const orders = ordersData.orders;

                // Summarize order statuses
                const summary = {
                    totalOrders: orders.length,
                    pendingOrders: 0,
                    shippedOrders: 0,
                    deliveredOrders: 0,
                    cancelledOrders: 0,
                };

                orders.forEach(order => {
                    switch (order.status) {
                        case 'Pending': summary.pendingOrders++; break;
                        case 'Shipped': summary.shippedOrders++; break;
                        case 'Delivered': summary.deliveredOrders++; break;
                        case 'Cancelled': summary.cancelledOrders++; break;
                        default: break;
                    }
                });

                setOrdersSummary(summary);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">User Info</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
                {/* <p><strong>Cart Items:</strong> {cart.items.length}</p> */}
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">Orders Summary</h2>
                <p><strong>Total Orders:</strong> {ordersSummary.totalOrders}</p>
                <p><strong>Pending Orders:</strong> {ordersSummary.pendingOrders}</p>
                <p><strong>Shipped Orders:</strong> {ordersSummary.shippedOrders}</p>
                <p><strong>Delivered Orders:</strong> {ordersSummary.deliveredOrders}</p>
                <p><strong>Cancelled Orders:</strong> {ordersSummary.cancelledOrders}</p>
            </div>
        </div>
    );
};

export default Profile;
