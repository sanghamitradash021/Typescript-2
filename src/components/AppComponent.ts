/*eslint-disable*/
import { BaseComponent } from "./BaseComponent.ts";
import { FormComponent } from "./FormComponent.ts";
import { TableComponent } from "./TableComponent.ts";
import { EventEmitter } from "./EventListener.ts";
import { AppStateManager } from "./StateManager.ts";
import type { FormData } from "./Interfaces.ts";
import { Notification } from "./Notification.ts";

/**
 * Represents the main application component.
 * @extends BaseComponent
 */

export class AppComponent extends BaseComponent {
  private formComponent: FormComponent | null = null;
  private tableComponent: TableComponent | null = null;
  private eventEmitter: EventEmitter;
  private stateManager: AppStateManager;
  private dataToBeRestore: any;

  /**
   * Creates an instance of the AppComponent.
   * @param {string} elementId - The ID of the root element where the component will be rendered.
   */

  constructor(elementId: string) {
    super(elementId);
    this.eventEmitter = new EventEmitter();
    this.stateManager = AppStateManager.getInstance();
    this.render();
    this.initializeComponents();
    this.addEventListeners();
  }

  /**
   * Renders the main application layout.
   */

  render(): void {
    this.element.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          display: flex;
          flex-direction: column;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .app-form-container, .app-table-container {
          width: 100%;
          margin-bottom: 20px;
        }
        .modal {
          display: none;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 90%;
          max-width: 500px;
        }
        button {
          margin: 5px;
          padding: 10px;
          cursor: pointer;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button:hover {
          background-color: #e0e0e0;
        }
        input[type="text"] {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        @media (min-width: 768px) {
          .container {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .app-form-container {
            width: 35%;
          }
          .app-table-container {
            width: 60%;
          }
        }
      </style>
      <div class="container">
        <div id="formContainer" class="app-form-container"></div>
        <div id="tableContainer" class="app-table-container"></div>
      </div>
      <div id="restoreModal" class="modal">
        <div class="modal-content">
          <h2>Restore Data</h2>
          <p>Choose a submission to restore:</p>
          <div id="restoreOptions"></div>
          <button id="confirmRestore">Confirm</button>
          <button id="cancelRestore">Cancel</button>
        </div>
      </div>
      <div id="deleteModal" class="modal">
        <div class="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this item? Type "delete" to confirm.</p>
          <input type="text" id="deleteConfirmInput" />
          <button id="confirmDelete">Confirm</button>
          <button id="cancelDelete">Cancel</button>
        </div>
      </div>
    `;
  }

  /**
   * Initializes the child components (form and table).
   */

  private initializeComponents(): void {
    this.formComponent = new FormComponent("formContainer", this.eventEmitter);
    this.tableComponent = new TableComponent(
      "tableContainer",
      this.eventEmitter
    );

    this.formComponent.render();
    this.tableComponent.render(this.stateManager.getData());
  }

  /**
   * Adds event listeners to handle various application events.
   */

  private addEventListeners(): void {
    this.eventEmitter.on("formSubmit", (data: FormData) => this.addData(data));
    this.eventEmitter.on("editItem", (id: string) => this.editItem(id));
    this.eventEmitter.on("updateFormData", (data: FormData) =>
      this.updateData(data)
    );
    this.eventEmitter.on("showDeleteConfirmation", (id: string) =>
      this.showDeleteConfirmation(id)
    );
    this.eventEmitter.on("showRestoreModal", () => this.showRestoreModal());

    // Add listener for the new delete event
    this.eventEmitter.on("deleteData", (id: string) =>
      this.handleDeleteData(id)
    );
    this.eventEmitter.on("restoreDeleteData", (id: string) =>
      this.handleRestoreDeleteData(id)
    );

    const confirmRestoreButton = document.getElementById(
      "confirmRestore"
    ) as HTMLButtonElement;
    const cancelRestoreButton = document.getElementById(
      "cancelRestore"
    ) as HTMLButtonElement;

    confirmRestoreButton.addEventListener("click", () => this.confirmRestore());
    cancelRestoreButton.addEventListener("click", () => this.cancelRestore());

    const confirmDeleteButton = document.getElementById(
      "confirmDelete"
    ) as HTMLButtonElement;
    const cancelDeleteButton = document.getElementById(
      "cancelDelete"
    ) as HTMLButtonElement;

    confirmDeleteButton.addEventListener("click", () => this.confirmDelete());
    cancelDeleteButton.addEventListener("click", () => this.cancelDelete());
  }

  /**
   * Adds new data to the application state.
   * @param {FormData} data - The data to be added.
   */

  private addData(data: FormData): void {
    const currentData = this.stateManager.getData();
    this.stateManager.setData([data, ...currentData]);
    if (this.tableComponent) {
      this.tableComponent.render(this.stateManager.getData());
    }
    Notification.show("Data submitted successfully");
  }

  /**
   * Edits an existing item in the application state.
   * @param {string} id - The ID of the item to be edited.
   */

  private editItem(id: string): void {
    const itemToEdit = this.stateManager
      .getData()
      .find((item) => item.id === id);
    if (itemToEdit && this.formComponent) {
      this.dataToBeRestore = itemToEdit;
      this.formComponent.render(itemToEdit);
    }
  }

  /**
   * Updates the existing data in the application state.
   * @param {FormData} data - The updated data.
   */

  private updateData(data: FormData): void {
    const currentData = this.stateManager.getData();
    const updatedData = currentData.map((item) =>
      item.id === data.id ? data : item
    );
    this.stateManager.deletedData = this.dataToBeRestore;
    this.stateManager.setData(updatedData);
    if (this.tableComponent) {
      this.tableComponent.render(this.stateManager.getData());
    }
    if (this.formComponent) {
      this.formComponent.render();
    }
    this.dataToBeRestore = null;
    Notification.show("Data updated successfully");
  }

  /**
   * Displays the delete confirmation modal.
   * @param {string} id - The ID of the item to delete.
   */

  private showDeleteConfirmation(id: string): void {
    const deleteModal = document.getElementById("deleteModal") as HTMLElement;
    const deleteConfirmInput = document.getElementById(
      "deleteConfirmInput"
    ) as HTMLInputElement;
    deleteConfirmInput.value = "";
    deleteModal.style.display = "block";
    deleteModal.setAttribute("data-id", id);
  }

  /**
   * Confirms deletion of an item from the application state.
   */

  private confirmDelete(): void {
    const deleteModal = document.getElementById("deleteModal") as HTMLElement;
    const deleteConfirmInput = document.getElementById(
      "deleteConfirmInput"
    ) as HTMLInputElement;
    const id = deleteModal.getAttribute("data-id");

    if (deleteConfirmInput.value.toLowerCase() === "delete" && id) {
      const currentData = this.stateManager.getData();
      const itemToDelete = currentData.find((item) => item.id === id);
      if (itemToDelete) {
        const updatedData = currentData.filter((item) => item.id !== id);
        this.stateManager.setData(updatedData);

        const currentDeletedData = this.stateManager.getDeletedData();
        this.stateManager.setDeletedData([
          itemToDelete,
          ...currentDeletedData.slice(0, 2),
        ]);

        if (this.tableComponent) {
          this.tableComponent.render(this.stateManager.getData());
        }

        // Emit the delete event
        this.eventEmitter.emit("deleteData", id);

        Notification.show("Data deleted successfully");
      }
      deleteModal.style.display = "none";
    } else {
      Notification.show("Please type 'delete' to confirm");
    }
  }

  /**
   * Cancels the delete operation and hides the modal.
   */

  private cancelDelete(): void {
    const deleteModal = document.getElementById("deleteModal") as HTMLElement;
    deleteModal.style.display = "none";
  }

  /**
   * Shows the restore modal with the last three deleted submissions.
   */

  private showRestoreModal(): void {
    const restoreModal = document.getElementById("restoreModal") as HTMLElement;
    const restoreOptions = document.getElementById(
      "restoreOptions"
    ) as HTMLElement;
    const lastThreeSubmissions = this.getLastThreeSubmissions();

    restoreOptions.innerHTML = lastThreeSubmissions
      .map((_item) => ``)
      .join("");

    restoreModal.style.display = "block";
  }

  /**
   * Confirms restoring a previously deleted item.
   */

  private confirmRestore(): void {
    const restoreModal = document.getElementById("restoreModal") as HTMLElement;
    const selectedOption = document.querySelector(
      'input[name="restoreOption"]:checked'
    ) as HTMLInputElement;
    if (selectedOption) {
      const index = Number.parseInt(selectedOption.value);
      this.restoreData(index);
      if (this.tableComponent) {
        this.tableComponent.render(this.stateManager.getData());
      }
      Notification.show("Data restored successfully");
      restoreModal.style.display = "none";
    }
  }

  /**
   * Cancels the restore operation and hides the modal.
   */

  private cancelRestore(): void {
    const restoreModal = document.getElementById("restoreModal") as HTMLElement;
    restoreModal.style.display = "none";
  }

  /**
   * Restores a specific item based on its index in the deleted data array.
   * @param {number} index - The index of the item to restore.
   */

  private restoreData(index: number): void {
    const deletedData = this.stateManager.getDeletedData();
    if (index >= 0 && index < deletedData.length) {
      const restoredItem = deletedData[index];
      const updatedDeletedData = deletedData.filter((_, i) => i !== index);
      this.stateManager.setDeletedData(updatedDeletedData);

      const currentData = this.stateManager.getData();
      this.stateManager.setData([...currentData, restoredItem]);
    }
  }

  /**
   * Retrieves the last three deleted submissions.
   * @returns {FormData[]} The last three deleted submissions.
   */

  private getLastThreeSubmissions(): FormData[] {
    return this.stateManager.getDeletedData().slice(0, 3);
  }

  /**
  * Handles the deletion of data.
  * @param {string} id - The ID of the data to delete.
  */
  private handleDeleteData(id: string): void {
    console.log(`Data with id ${id} has been deleted!`);
    const currentData = this.stateManager.getData();
    console.log("currentData", currentData);
    const foundItem = currentData.find((item) => item.id === id);
    this.stateManager.deletedData = foundItem;
    const updatedData = currentData.filter((item) => item.id !== id);
    this.stateManager.setData(updatedData);
    this.initializeComponents();
  }

  /**
   * Handles the restoration of deleted data.
   * @param {string} id - The ID of the data to restore.
   */
  private handleRestoreDeleteData(id: string): void {
    const currentData = this.stateManager.getData();
    // const foundItem = currentData.find((item) => item.id === id);
    // this.stateManager.deletedData = foundItem;
    this.stateManager.deletedData = null; // const foundItem = currentData.find((item) => item.id === id);

    const updatedData = currentData.filter((item) => item.id !== id);
    this.stateManager.setData(updatedData);
    this.initializeComponents();
  }
}
