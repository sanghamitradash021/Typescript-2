import type { StateManager, FormData } from "./Interfaces.ts";

/**
 * Manages the application state, including storing, retrieving, 
 * and updating data in local storage, as well as handling deleted data.
 */

export class AppStateManager implements StateManager {

  /**
   * Singleton instance of AppStateManager.
   * @private
   */
  private static instance: AppStateManager;

  /**
   * Array of FormData objects representing the current state data.
   * @private
   */
  private data: FormData[] = [];
  public deletedData: any = null;

  /**
   * Private constructor to enforce singleton pattern.
   * Loads data from local storage upon initialization.
   * @private
   */

  private constructor() {
    this.loadData();
  }

  /**
   * Retrieves the singleton instance of AppStateManager.
   * If an instance doesn't exist, it creates one.
   * @returns The singleton instance of AppStateManager.
   */

  static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  /**
   * Saves the current state data to local storage.
   * Also stores deleted data in local storage if it exists.
   * @private
   */

  private saveData(): void {
    localStorage.setItem("appStateData", JSON.stringify(this.data));
    if (this.deletedData) {
      this.deleteData();
    }
  }

  /**
   * Handles the storage of deleted data in local storage.
   * Adds a timestamp to the deleted data before saving.
   * @private
   */
  private deleteData() {
    let getDeletedData: any = localStorage.getItem("appStateDeletedData")
      ? localStorage.getItem("appStateDeletedData")
      : "[]";
    this.deletedData.timeStamp = new Date().toISOString();
    getDeletedData = JSON.parse(getDeletedData);
    getDeletedData.push(this.deletedData);

    localStorage.setItem("appStateDeletedData", JSON.stringify(getDeletedData));
    this.deletedData = null;
  }

  /**
   * Loads state data and deleted data from local storage.
   * If no data exists in local storage, initializes empty structures.
   * @private
   */
  private loadData(): void {
    const savedData = localStorage.getItem("appStateData");
    const savedDeletedData = localStorage.getItem("appStateDeletedData");
    if (savedData) {
      this.data = JSON.parse(savedData);
    }
    if (savedDeletedData) {
      this.deletedData = JSON.parse(savedDeletedData);
    }
  }

  /**
   * Retrieves the current state data.
   * @returns An array of FormData objects representing the state data.
   */

  getData(): FormData[] {
    return this.data;
  }

  /**
   * Updates the state data with new data and saves it to local storage.
   * @param newData - The new array of FormData to set as the current state.
   */

  setData(newData: FormData[]): void {
    this.data = newData;
    this.saveData();
  }
  /**
   * Retrieves the deleted data from local storage.
   * @returns An array of FormData objects representing the deleted data.
   */

  getDeletedData(): FormData[] {
    let getDeletedData: any = localStorage.getItem("appStateDeletedData")
      ? localStorage.getItem("appStateDeletedData")
      : "[]";
    return JSON.parse(getDeletedData);
  }
  /**
   * Sets new deleted data, stores it, and updates the local storage.
   * @param newDeletedData - The new array of FormData to set as the deleted data.
   */

  setDeletedData(newDeletedData: FormData[]): void {
    this.deletedData = newDeletedData;
    this.saveData();
  }
}
