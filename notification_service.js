class NotificationService {
    constructor() {
        this.notifications = [
            "First notification!",
            "Important update",
            "New message received",
            "System alert",
            "Remember to check updates"
        ];
        this.currentIndex = 0;
    }

    start() {
        // Test notification immediately
        this.showNotification("Test notification - Starting service");

        // First scheduled notification after 10 seconds
        setTimeout(() => {
            this.showNotification();

            // Subsequent notifications every 5 minutes
            setInterval(() => {
                this.showNotification();
            }, 5 * 60 * 1000);

        }, 10 * 1000);
    }

    showNotification(customMessage = null) {
        const message = customMessage || this.notifications[this.currentIndex];
        const options = {
            body: message,
            icon: 'https://via.placeholder.com/64',
            requireInteraction: true,
            tag: 'notification-' + Date.now()
        };

        console.log('Sending notification:', message); // Debug log

        if (Notification.permission === 'granted') {
            new Notification("New Alert", options);
        }

        if (!customMessage) {
            this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
        }
    }
}