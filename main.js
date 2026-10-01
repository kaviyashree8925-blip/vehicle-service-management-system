document.addEventListener("DOMContentLoaded", () => {
  // Auto-dismiss flash messages after 6 seconds
  document.querySelectorAll(".alert-dismissible").forEach((el) => {
    setTimeout(() => bootstrap.Alert.getOrCreateInstance(el).close(), 6000);
  });

  // Print buttons (invoice page)
  document.querySelectorAll("[data-print]").forEach((btn) => btn.addEventListener("click", () => window.print()));

  // Appointment form: when a customer is chosen, load only that customer's vehicles
  const form = document.querySelector("form[data-vehicles-url]");
  if (form) {
    const customer = form.querySelector("#id_customer");
    const vehicle = form.querySelector("#id_vehicle");
    if (customer && vehicle) {
      const load = async (selected) => {
        vehicle.innerHTML = '<option value="">---------</option>';
        if (!customer.value) return;
        try {
          const response = await fetch(`${form.dataset.vehiclesUrl}?customer=${customer.value}`);
          const data = await response.json();
          data.vehicles.forEach((v) => {
            const option = document.createElement("option");
            option.value = v.id;
            option.textContent = v.label;
            option.selected = String(v.id) === String(selected);
            vehicle.appendChild(option);
          });
        } catch (err) {
          console.error("Could not load vehicles", err);
        }
      };
      customer.addEventListener("change", () => load(""));
      if (customer.value) load(vehicle.value);
    }
  }

  // Do not allow picking a past date when creating an appointment
  const dateInput = document.querySelector("#id_scheduled_date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    if (!dateInput.value || dateInput.value >= today) dateInput.min = today;
  }
});
