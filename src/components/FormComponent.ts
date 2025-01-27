import { BaseComponent } from "./BaseComponent.ts";
import type { EventEmitter } from "./EventListener.ts";
import { type FormData, type Country, type State } from "./Interfaces.ts";
import { validateField } from "./validation.ts";

/**
 * FormComponent class manages rendering, validation, and submission of a dynamic form.
 * @extends BaseComponent
 */
export class FormComponent extends BaseComponent {
  private eventEmitter: EventEmitter;
  private countries: Country[];
  private isEditMode = false;
  private editId: string | null = null;
  private errors: { [key: string]: string } = {};

  /**
  * Constructs the FormComponent.
  * @param {string} elementId - The ID of the DOM element to attach the form.
  * @param {EventEmitter} eventEmitter - The event emitter for handling events.
  */

  constructor(elementId: string, eventEmitter: EventEmitter) {
    super(elementId);
    this.eventEmitter = eventEmitter;
    this.countries = this.getCountries();
  }
  /**
   * Retrieves a list of countries with their states and cities.
   * @returns {Country[]} - List of countries.
   */

  private getCountries(): Country[] {
    return [
      {
        name: "INDIA",
        states: [
          { name: "Uttar Pradesh", cities: ["Prayagraj", "Ayodhya"] },
          { name: "Odisha", cities: ["Puri", "Bhubaneswar"] },
        ],
      },
      {
        name: "USA",
        states: [
          { name: "California", cities: ["Los Angeles", "San Francisco"] },
          { name: "New York", cities: ["New York City", "Buffalo"] },
        ],
      },
      {
        name: "Canada",
        states: [
          { name: "Ontario", cities: ["Toronto", "Ottawa"] },
          { name: "Quebec", cities: ["Montreal", "Quebec City"] },
        ],
      },
    ];
  }
  /**
   * Creates a dropdown HTML element with specified options.
   * @param {string} id - The ID for the dropdown element.
   * @param {string[]} options - The options for the dropdown.
   * @param {string} label - The label for the dropdown.
   * @returns {string} - The generated HTML string for the dropdown.
   */

  private createDropdown(id: string, options: string[], label: string): string {
    const optionsHtml = options
      .map((option) => `<option value="${option}">${option}</option>`)
      .join("");
    return `
    <div class="form-group">
      <label for="${id}">${label}</label>
      <div class="input-wrapper">
        <select id="${id}" name="${id}">
          <option value="">Select ${label}</option>
          ${optionsHtml}
        </select>
        <span class="validation-icon error" data-field="${id}">!</span>
        <span class="validation-icon success" data-field="${id}">✓</span>
      </div>
      <span class="error-message" data-field="${id}"></span>
    </div>
  `;
  }

  /**
   * Creates an input field HTML element.
   * @param {string} id - The ID for the input field.
   * @param {string} label - The label for the input field.
   * @param {string} type - The input type (e.g., text, email, date).
   * @param {string} [value=""] - The default value for the input field.
   * @returns {string} - The generated HTML string for the input field.
   */

  private createInputField(
    id: string,
    label: string,
    type: string,
    value = ""
  ): string {
    return `
    <div class="form-group">
      <label for="${id}">${label}</label>
      <div class="input-wrapper">
        <input type="${type}" id="${id}" name="${id}" value="${value}">
        <span class="validation-icon error" data-field="${id}">!</span>
        <span class="validation-icon success" data-field="${id}">✓</span>
      </div>
      <span class="error-message" data-field="${id}"></span>
    </div>
  `;
  }

  /**
   * Renders the form to the DOM.
   * @param {FormData} [editData] - The data to populate the form for editing.
   */

  render(editData?: FormData): void {
    this.isEditMode = !!editData;
    this.editId = editData?.id || null;

    const countryDropdown = this.createDropdown(
      "country",
      this.countries.map((country) => country.name),
      "Country"
    );

    this.element.innerHTML = `
      <style>
        .form-container {
          width: 100%;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
          transition: color 0.3s ease;
        }
        .input-wrapper {
          position: relative;
        }
        input, select {
          width: 100%;
          padding: 12px;
          border: 2px solid #ced4da;
          border-radius: 4px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        }
        .validation-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .validation-icon.error {
          color: #dc3545;
        }
        .validation-icon.success {
          color: #28a745;
        }
        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 5px;
          display: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        button[type="submit"] {
          width: 100%;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s ease;
        }
        button[type="submit"]:hover {
          background-color: #0056b3;
        }
        button[type="submit"]:active {
          transform: scale(0.98);
        }
        .form-group.error input,
        .form-group.error select {
          border-color: #dc3545;
          animation: shake 0.5s ease-in-out;
        }
        .form-group.success input,
        .form-group.success select {
          border-color: #28a745;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @media (max-width: 768px) {
          .form-container {
            padding: 15px;
          }
          input, select, button[type="submit"] {
            font-size: 14px;
          }
        }
      </style>
      <form id="dataForm" class="form-container">
        ${this.createInputField("name", "Name", "text", editData?.name || "")}
        ${this.createInputField("phone", "Phone", "tel", editData?.phone || "")}
        ${this.createInputField(
      "email",
      "Email",
      "email",
      editData?.email || ""
    )}
        ${this.createInputField(
      "dob",
      "Date of Birth",
      "date",
      editData?.dob || ""
    )}
        ${this.createInputField(
      "age",
      "Age",
      "number",
      editData?.age?.toString() || ""
    )}
        ${countryDropdown}
        ${this.createDropdown("state", [], "State")}
        ${this.createDropdown("city", [], "City")}
        ${this.createInputField("zip", "ZIP", "text", editData?.zip || "")}
        <button type="submit">${this.isEditMode ? "Update" : "Submit"}</button>
      </form>
    `;

    this.addEventListeners();

    if (editData) {
      this.populateDropdowns(editData);
    }
  }

  /**
   * Adds event listeners to the form and its elements.
   */

  private addEventListeners(): void {
    const form = this.element.querySelector("#dataForm") as HTMLFormElement;
    const countrySelect = this.element.querySelector(
      "#country"
    ) as HTMLSelectElement;
    const stateSelect = this.element.querySelector(
      "#state"
    ) as HTMLSelectElement;
    const citySelect = this.element.querySelector("#city") as HTMLSelectElement;

    form.addEventListener("submit", this.handleSubmit.bind(this));

    countrySelect.addEventListener(
      "change",
      this.handleCountryChange.bind(this)
    );
    stateSelect.addEventListener("change", this.handleStateChange.bind(this));
    citySelect.addEventListener("change", () => this.validateField("city"));

    const phoneField = this.element.querySelector("#phone") as HTMLInputElement;
    phoneField.addEventListener("input", () => {
      this.validateField("phone");
    });
    [
      "name",
      "phone",
      "email",
      "dob",
      "age",
      "country",
      "state",
      "city",
      "zip",
    ].forEach((fieldName) => {
      const field = this.element.querySelector(`#${fieldName}`) as
        | HTMLInputElement
        | HTMLSelectElement;
      field.addEventListener("blur", () => this.validateField(fieldName));
      field.addEventListener("input", () => this.validateField(fieldName));
    });

    this.element.querySelectorAll(".validation-icon.error").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const field = (e.target as HTMLElement).getAttribute("data-field");
        if (field) {
          this.validateField(field);
        }
      });
    });
  }

  /**
   * Handles form submission.
   * @param {Event} e - The submit event.
   */

  private handleSubmit(e: Event): void {
    e.preventDefault();
    if (this.validateForm()) {
      const formData = new FormData(e.target as HTMLFormElement);
      const data: FormData = {
        id: this.editId || Date.now().toString(),
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        dob: formData.get("dob") as string,
        age: Number.parseInt(formData.get("age") as string),
        country: formData.get("country") as string,
        state: formData.get("state") as string,
        city: formData.get("city") as string,
        zip: formData.get("zip") as string,
        restoreData: [],
        timeStamp: new Date().toISOString(),
      };

      if (this.isEditMode) {
        this.eventEmitter.emit("updateFormData", data);
      } else {
        this.eventEmitter.emit("formSubmit", data);
      }
      (e.target as HTMLFormElement).reset();
      this.isEditMode = false;
      this.editId = null;
      this.render();
    }
  }

  private handleCountryChange(): void {
    const countrySelect = this.element.querySelector(
      "#country"
    ) as HTMLSelectElement;
    const citySelect = this.element.querySelector("#city") as HTMLSelectElement;

    const selectedCountry = this.countries.find(
      (country) => country.name === countrySelect.value
    );
    if (selectedCountry) {
      this.updateStateDropdown(selectedCountry.states);
      citySelect.innerHTML = '<option value="">Select City</option>';
    }
    this.validateField("country");
  }

  private handleStateChange(): void {
    const countrySelect = this.element.querySelector(
      "#country"
    ) as HTMLSelectElement;
    const stateSelect = this.element.querySelector(
      "#state"
    ) as HTMLSelectElement;

    const selectedCountry = this.countries.find(
      (country) => country.name === countrySelect.value
    );
    const selectedState = selectedCountry?.states.find(
      (state) => state.name === stateSelect.value
    );
    if (selectedState) {
      this.updateCityDropdown(selectedState.cities);
    }
    this.validateField("state");
  }

  private updateStateDropdown(states: State[]): void {
    const stateSelect = this.element.querySelector(
      "#state"
    ) as HTMLSelectElement;
    stateSelect.innerHTML = '<option value="">Select State</option>';
    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state.name;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });
  }

  private updateCityDropdown(cities: string[]): void {
    const citySelect = this.element.querySelector("#city") as HTMLSelectElement;
    citySelect.innerHTML = '<option value="">Select City</option>';
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  private populateDropdowns(data: FormData): void {
    const countrySelect = this.element.querySelector(
      "#country"
    ) as HTMLSelectElement;
    const stateSelect = this.element.querySelector(
      "#state"
    ) as HTMLSelectElement;
    const citySelect = this.element.querySelector("#city") as HTMLSelectElement;

    countrySelect.value = data.country;
    const selectedCountry = this.countries.find(
      (country) => country.name === data.country
    );
    if (selectedCountry) {
      this.updateStateDropdown(selectedCountry.states);
      stateSelect.value = data.state;
      const selectedState = selectedCountry.states.find(
        (state) => state.name === data.state
      );
      if (selectedState) {
        this.updateCityDropdown(selectedState.cities);
        citySelect.value = data.city;
      }
    }
  }

  private validateField(fieldName: string): void {
    const field = this.element.querySelector(`#${fieldName}`) as
      | HTMLInputElement
      | HTMLSelectElement;
    const errorMessage = validateField(fieldName, field.value);

    const formGroup = field.closest(".form-group") as HTMLElement;
    const errorIcon = formGroup.querySelector(
      `.validation-icon.error`
    ) as HTMLElement;
    const successIcon = formGroup.querySelector(
      `.validation-icon.success`
    ) as HTMLElement;
    const errorMessageElement = formGroup.querySelector(
      `.error-message`
    ) as HTMLElement;

    if (errorMessage) {
      this.errors[fieldName] = errorMessage;
      formGroup.classList.add("error");
      formGroup.classList.remove("success");
      errorIcon.style.display = "inline";
      errorIcon.style.opacity = "1";
      successIcon.style.display = "none";
      successIcon.style.opacity = "0";
      errorMessageElement.textContent = errorMessage;
      errorMessageElement.style.display = "block";
      errorMessageElement.style.opacity = "1";
    } else {
      delete this.errors[fieldName];
      formGroup.classList.remove("error");
      formGroup.classList.add("success");
      errorIcon.style.display = "none";
      errorIcon.style.opacity = "0";
      successIcon.style.display = "inline";
      successIcon.style.opacity = "1";
      errorMessageElement.textContent = "";
      errorMessageElement.style.display = "none";
      errorMessageElement.style.opacity = "0";
    }
  }

  private validateForm(): boolean {
    let isValid = true;
    [
      "name",
      "phone",
      "email",
      "dob",
      "age",
      "country",
      "state",
      "city",
      "zip",
    ].forEach((fieldName) => {
      this.validateField(fieldName);
      if (this.errors[fieldName]) {
        isValid = false;
      }
    });
    return isValid;
  }
}
