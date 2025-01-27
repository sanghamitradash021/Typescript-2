/**
 * A class for managing and displaying notifications on the screen.
 */
export class Notification {

    /** 
     * Singleton instance of the notification element. 
     * @private
     */
    private static instance: HTMLElement;

    /**
     * Creates and retrieves the singleton notification element.
     * If the element doesn't exist, it is created dynamically and styled.
     * @returns The singleton HTML element used for displaying notifications.
     * @private
     */

    private static getInstance(): HTMLElement {
        if (!Notification.instance) {
            Notification.instance = document.createElement("div");
            Notification.instance.className = "notification";
            document.body.appendChild(Notification.instance);


            const style = document.createElement("style");
            style.textContent = `
          .notification {
            position: fixed;
            top: 10px; /* position it at the top */
            right: 10px; /* position it at the right */
            background-color: #333;
            color: #fff;
            padding: 15px 25px;
            border-radius: 5px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
            z-index: 1000; /* make sure it's above other content */
          }
  
          .notification.show {
            opacity: 1;
            visibility: visible;
          }
        `;
            document.head.appendChild(style);
        }
        return Notification.instance;
    }

    /**
     * Displays a notification with the given message for a specified duration.
     * If no duration is specified, the default duration is 3000ms.
     * @param message - The message to display in the notification.
     * @param duration - The duration (in milliseconds) for which the notification is shown. Defaults to 3000ms.
     */

    static show(message: string, duration = 3000): void {
        const notification = Notification.getInstance();
        notification.textContent = message;
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, duration);
    }
}
