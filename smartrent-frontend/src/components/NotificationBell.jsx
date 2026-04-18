import React, { useEffect, useState } from 'react';
import { createSignalRConnection } from '../utils/signalrConnection';
import { notificationService } from '../services/notificationService'; // لعمل GET للإشعارات من API العضو 3

const NotificationBell = ({ token }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // جلب الإشعارات القديمة عند تحميل الصفحة لأول مرة
        const fetchInitialNotifications = async () => {
            try {
                const data = await notificationService.getUserNotifications();
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (err) {
                console.error("Error fetching notifications", err);
            }
        };

        fetchInitialNotifications();

        // إعداد وتشغيل اتصال SignalR باستخدام الكود اللي أنت عملته
        const connection = createSignalRConnection(token);

        connection.start()
            .then(() => {
                console.log("Connected to SignalR Hub!");
                
                // الاستماع للإشعارات الجديدة (الحدث ReceiveNotification يرسله العضو 3)
                connection.on("ReceiveNotification", (notification) => {
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                });
            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        return () => {
            connection.stop();
        };
    }, [token]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="notification-container" style={{ position: 'relative' }}>
            <button onClick={toggleDropdown} className="bell-button">
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <h4>الإشعارات</h4>
                    {notifications.length === 0 ? (
                        <p>لا توجد إشعارات</p>
                    ) : (
                        notifications.map((n, index) => (
                            <div key={index} className={`notification-item ${n.isRead ? '' : 'unread'}`}>
                                <p>{n.message}</p>
                                <small>{new Date(n.createdAt).toLocaleString()}</small>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;