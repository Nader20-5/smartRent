import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaCheckDouble, FaRegBellSlash } from 'react-icons/fa';
import { createSignalRConnection } from '../utils/signalrConnection';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell = ({ token }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            try {
                const response = await getNotifications();
                const fetchedItems = response.items || response || [];
                setNotifications(fetchedItems);
                setUnreadCount(fetchedItems.filter(n => !n.isRead).length);
            } catch (err) {
                console.error("Error fetching notifications", err);
            }
        };

        fetchInitialNotifications();

        const connection = createSignalRConnection(token);

        connection.start()
            .then(() => {
                console.log("Connected to SignalR Hub!");
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleMarkAllAsRead = async (e) => {
        e.stopPropagation();
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read if unread
        if (!notification.isRead) {
            try {
                await markAsRead(notification.id);
                setNotifications(prev => prev.map(n => 
                    n.id === notification.id ? { ...n, isRead: true } : n
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }

        setIsOpen(false);

        // Navigate if there's a link
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <div className="notification-container" ref={dropdownRef}>
            <button onClick={handleToggle} className="bell-button">
                <FaBell />
                {unreadCount > 0 && <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="mark-read-btn">
                                <FaCheckDouble style={{ marginRight: '4px' }} />
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="notification-body">
                        {notifications.length === 0 ? (
                            <div className="empty-state">
                                <FaRegBellSlash className="empty-icon" />
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((n, index) => (
                                <div 
                                    key={n.id || index} 
                                    className={`notification-item ${n.isRead ? '' : 'unread'}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="notification-item-header">
                                        <h5 className="notification-title">{n.title || 'Notification'}</h5>
                                        <span className="notification-time">{formatTime(n.createdAt)}</span>
                                    </div>
                                    <p className="notification-message">{n.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;