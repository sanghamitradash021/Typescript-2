
import { AppComponent } from "./components/AppComponent.ts"

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app")
  if (appElement) {
    new AppComponent("app")
  } else {
    console.error('Element with id "app" not found')
  }
})

