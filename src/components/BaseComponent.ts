/**
 * Represents the base component for the application.
 * Provides common functionality for all components, including attaching to a DOM element.
 * @abstract
 */
export abstract class BaseComponent {

  /**
 * Represents the base component for the application.
 * Provides common functionality for all components, including attaching to a DOM element.
 * @abstract
 */
  protected element: HTMLElement

  /**
 * Creates a new instance of BaseComponent and associates it with an HTML element by its ID.
 * @constructor
 * @param {string} elementId - The ID of the HTML element to attach the component to.
 * @throws {Error} Throws an error if the element with the given ID is not found.
 */

  constructor(elementId: string) {
    this.element = document.getElementById(elementId) as HTMLElement
    if (!this.element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }
  }

  /**
 * Renders the component. 
 * Each derived class must implement its own rendering logic.
 * @abstract
 */

  abstract render(): void

  // abstract render1(...args: any[]): void 


}

