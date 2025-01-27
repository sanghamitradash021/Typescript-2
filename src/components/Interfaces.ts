/**
 * Interface representing the structure of form data.
 */
export interface FormData {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  age: number;
  country: string;
  state: string;
  city: string;
  zip: string;
  restoreData: any[];
  timeStamp: string
}

/**
 * Interface representing a country and its associated states.
 */

export interface Country {
  name: string;
  states: State[];
}

/**
 * Interface representing a state and its associated cities.
 */

export interface State {
  name: string;
  cities: string[];
}

/**
 * Interface for managing event listeners.
 */

export interface EventListener {
  /**
   * Registers a callback function to a specific event.
   * @param eventName - Name of the event to listen for.
   * @param callback - Callback function to execute when the event is triggered.
   */
  on(eventName: string, callback: (...args: any[]) => void): void;

  /**
  * Emits an event, invoking all associated callbacks.
  * @param eventName - Name of the event to emit.
  * @param args - Arguments to pass to the callback functions.
  */
  emit(eventName: string, ...args: any[]): void;
}

// export interface StateManager {
//   addData(data: FormData): void
//   getData(): FormData[]
//   updateData(id: string, data: FormData): void
//   deleteData(id: string): void
//   restoreData(index: number): void
//   getLastThreeSubmissions(): FormData[]
// }

/**
 * Interface for managing application state, including data storage and retrieval.
 */

export interface StateManager {

  /**
   * Retrieves the current stored data.
   * @returns An array of `FormData` objects.
   */
  getData(): FormData[];

  /**
   * Sets the current stored data.
   * @param data - An array of `FormData` objects to store.
   */
  setData(data: FormData[]): void;

  /**
  * Retrieves the deleted data.
  * @returns An array of `FormData` objects that have been deleted.
  */
  getDeletedData(): FormData[];

  /**
   * Sets the deleted data.
   * @param data - An array of `FormData` objects to mark as deleted.
   */
  setDeletedData(data: FormData[]): void;
}
