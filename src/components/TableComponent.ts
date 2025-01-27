import { BaseComponent } from "./BaseComponent.ts";
import type { EventEmitter } from "./EventListener.ts";
import type { FormData } from "./Interfaces.ts";

/**
 * Represents a table component that renders data in a tabular format
 * and allows actions like editing, deleting, and restoring entries.
 */

export class TableComponent extends BaseComponent {
  private eventEmitter: EventEmitter;

  /**
   * Constructs a TableComponent instance.
   * @param {string} elementId - The ID of the DOM element where the table is rendered.
   * @param {EventEmitter} eventEmitter - An event emitter for handling custom events.
   */

  constructor(elementId: string, eventEmitter: EventEmitter) {
    super(elementId);
    this.eventEmitter = eventEmitter;
  }
  /**
   * Renders the table with the provided data.
   * @param {FormData[]} [data] - An optional array of data objects to populate the table.
   */

  render(data?: FormData[]): void {
    const tableRows =
      data && data.length > 0
        ? data
          .map(
            (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.phone}</td>
        <td>${item.email}</td>
        
        <td>${item.country}</td>
        
        <td>
          <div class="action-buttons">
            <button class="edit" data-id="${item.id}" title="Edit">✏️</button>
            <button class="delete" data-id="${item.id}" title="Delete">🗑️</button>
            <button class="restore" data-id="${item.id}" title="Restore">↩️</button>
          </div>
        </td>
      </tr>
    `
          )
          .join("")
        : `<tr><td colspan="10">No data available</td></tr>`;

    this.element.innerHTML = `
      <style>
        .table-container {
          margin-top: 20px;
          overflow-x: auto;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background-color: #fff;
          overflow: hidden;
        }
        th, td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        th {
          background-color: #007bff;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 14px;
        }
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        tr:hover {
          background-color: #e9ecef;
          transition: background-color 0.3s ease;
        }
        .action-buttons {
          display: flex;
          justify-content: space-around;
          gap: 5px;
        }
        .edit, .delete, .restore {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .edit {
          background-color: #28a745;
          color: white;
        }
        .edit:hover {
          background-color: #218838;
        }
        .delete {
          background-color: #dc3545;
          color: white;
        }
        .delete:hover {
          background-color: #c82333;
        }
        .restore {
          background-color: #ffc107;
          color: #212529;
        }
        .restore:hover {
          background-color: #e0a800;
        }
        #restoreButton {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #17a2b8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        #restoreButton:hover {
          background-color: #138496;
        }
        @media (max-width: 768px) {
          th, td {
            padding: 10px;
          }
          .action-buttons {
            flex-direction: column;
            gap: 5px;
          }
          .edit, .delete, .restore {
            width: 100%;
          }
        }
      </style>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              
              <th>Country</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      
    `;

    this.addEventListeners();
  }
  /**
   * Adds event listeners to the table and its elements for user interaction.
   */

  private addEventListeners(): void {
    this.element.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("edit")) {
        const id = target.getAttribute("data-id");
        this.eventEmitter.emit("editItem", id);
      } else if (target.classList.contains("delete")) {
        const id = target.getAttribute("data-id");
        if (!document.querySelector(".delete-popup")) {
          this.openDeleteConfirmationPopup(id);
        }
      } else if (target.classList.contains("restore")) {
        const id = target.getAttribute("data-id");
        this.openRestorePopup(id);
      }
    });
  }

  /**
   * Opens a confirmation popup for deleting an item.
   * @param {string | null} id - The ID of the item to be deleted.
   */

  private openDeleteConfirmationPopup(id: string | null): void {
    if (!id) return;

    const popup = document.createElement("div");
    popup.className = "delete-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <input type="text" id="deleteConfirmationInput" placeholder="Type 'delete' to confirm" />
        <div class="popup-actions">
          <button id="confirmDeleteButton">Delete</button>
          <button id="cancelDeleteButton">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    const confirmButton = popup.querySelector(
      "#confirmDeleteButton"
    ) as HTMLElement;
    const cancelButton = popup.querySelector(
      "#cancelDeleteButton"
    ) as HTMLElement;
    const inputField = popup.querySelector(
      "#deleteConfirmationInput"
    ) as HTMLInputElement;

    confirmButton.addEventListener("click", () => {
      if (inputField.value.trim().toLowerCase() === "delete") {
        this.eventEmitter.emit("deleteData", id);
        document.body.removeChild(popup);
      } else {
        alert("Please type 'delete' to confirm.");
      }
    });

    cancelButton.addEventListener("click", () => {
      document.body.removeChild(popup);
    });

    this.addPopupStyles();
  }

  /**
   * Adds custom styles for the confirmation popup.
   */

  private addPopupStyles(): void {
    const style = document.createElement("style");
    style.textContent = `
      .delete-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .popup-content {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        width: 400px;
        max-width: 90%;
      }

      .popup-content h3 {
        margin-bottom: 15px;
        color: #dc3545;
      }

      .popup-content p {
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
      }

      .popup-content input {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 16px;
      }

      .popup-actions {
        display: flex;
        justify-content: space-between;
      }

      .popup-actions button {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .popup-actions button#confirmDeleteButton {
        background-color: #dc3545;
        color: white;
      }

      .popup-actions button#confirmDeleteButton:hover {
        background-color: #c82333;
      }

      .popup-actions button#cancelDeleteButton {
        background-color: #6c757d;
        color: white;
      }

      .popup-actions button#cancelDeleteButton:hover {
        background-color: #5a6268;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Opens a restore popup displaying deleted items.
   * @param {any} id - The ID of the item to be restored.
   */

  private openRestorePopup(id: any): void {
    let restoreData: any = localStorage.getItem("appStateDeletedData")
      ? localStorage.getItem("appStateDeletedData")
      : "[]";
    restoreData = JSON.parse(restoreData);
    restoreData = restoreData.filter((filterdata: any) => filterdata.id == id);
    console.log("restoreData", restoreData);
    const popup = document.createElement("div");
    popup.className = "restore-popup";
    popup.innerHTML = `
    <div class="popup-content">
      <h3>Restore Data</h3>
      <ul>
        ${restoreData
        .map(
          (item: any) => `
            <li>
              <strong>Name:</strong> ${item.name}<br>
              <strong>Phone:</strong> ${item.phone}<br>
              <strong>Email:</strong> ${item.email}<br>
              <strong>Timestamp:</strong> ${item.timeStamp}
              <button class="restore-action-button" data-id="${item.id}">Restore</button>
            </li>
          `
        )
        .join("")}
      </ul>
      <button id="closeRestorePopup">Close</button>
    </div>
  `;

    document.body.appendChild(popup);

    const closeButton = popup.querySelector(
      "#closeRestorePopup"
    ) as HTMLElement;
    closeButton.addEventListener("click", () => {
      document.body.removeChild(popup);
    });

    const restoreButtons = popup.querySelectorAll(".restore-action-button");
    restoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const rowData = restoreData.find(
          (item: any) => item.id === button.getAttribute("data-id")
        );
        document.body.removeChild(popup);
        this.handleRestore(rowData);
      });
    });

    this.addRestorePopupStyles();
  }

  /**
   * Handles the restoration of a deleted item.
   * @param {any} rowData - The data of the item to restore.
   */

  private handleRestore(rowData: any) {
    this.restoreDeleteItem(rowData.id);
    this.eventEmitter.emit("formSubmit", rowData);
  }
  /**
   * Adds custom styles for the restore popup.
   */

  private addRestorePopupStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .restore-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup-content {
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      text-align: center;
      width: 500px;
      max-width: 90%;
      font-family: 'Arial', sans-serif;
    }

    .popup-content h3 {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
      color: #007bff;
    }

    .popup-content ul {
      list-style: none;
      padding: 0;
      margin: 0 0 20px 0;
      text-align: left;
      max-height: 300px;
      overflow-y: auto;
    }

    .popup-content ul li {
      margin-bottom: 15px;
      font-size: 16px;
      line-height: 1.6;
      color: #555;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .popup-content ul li strong {
      color: #333;
    }

    .restore-action-button {
      padding: 8px 16px;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #28a745;
      color: white;
      margin-top: 10px;
      transition: background-color 0.3s ease;
    }

    .restore-action-button:hover {
      background-color: #218838;
    }

    .popup-content button#closeRestorePopup {
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background-color: #6c757d;
      color: white;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    .popup-content button#closeRestorePopup:hover {
      background-color: #5a6268;
    }
  `;
    document.head.appendChild(style);
  }


  /**
   * Restores a deleted item by emitting an event.
   * @param {string} id - The ID of the item to restore.
   */

  private restoreDeleteItem(id: string): void {
    this.eventEmitter.emit("restoreDeleteData", id);
  }
}
