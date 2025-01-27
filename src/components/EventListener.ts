import type { EventListener } from "./Interfaces.js";

/**
 * Implements an event emitter that allows adding, emitting, and removing event listeners.
 * @implements {EventListener}
 */

export class EventEmitter implements EventListener {
  /**
   * Stores event listeners for various event names.
   * @private
   * @type {{ [eventName: string]: ((...args: unknown[]) => void)[] }}
   */
  private listeners: { [eventName: string]: ((...args: unknown[]) => void)[] } = {};

  /**
   * Registers a listener callback for a specific event name.
   * @param {string} eventName - The name of the event to listen for.
   * @param {(...args: unknown[]) => void} callback - The callback function to execute when the event is emitted.
   */

  on(eventName: string, callback: (...args: any[]) => void): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }
  /**
   * Emits an event and invokes all listener callbacks associated with the event.
   * @param {string} eventName - The name of the event to emit.
   * @param {...unknown[]} args - Additional arguments to pass to the listener callbacks.
   */

  emit(eventName: string, ...args: unknown[]): void {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args));
    }
  }

  /**
  * Removes a specific listener callback for an event.
  * @param {string} eventName - The name of the event.
  * @param {(...args: unknown[]) => void} callback - The callback function to remove.
  */

  remove(eventName: string, callback: (...args: unknown[]) => void): void {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      this.listeners[eventName] = eventListeners.filter(
        (listener) => listener !== callback
      );
    }
  }
}
