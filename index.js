const baseURL = "https://phase-01-project-server.onrender.com";

window.addEventListener("DOMContentLoaded", () =>{
  loadBookings();
  setupEventListeners();
});

function setupEventListeners() {
  const fieldsToWatch = ["destination","checkIn","checkOut","adults","children","hotel","meals"];


  fieldsToWatch.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", updatePricePreview);
      element.addEventListener("change", updatePricePreview);
    }
  });

}


document.getElementById("bookingForm").addEventListener("submit", function(e){
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const checkIn = new Date(document.getElementById("checkIn").value);
    const checkOut = new Date(document.getElementById("checkOut").value);
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const hotel = document.getElementById("hotel").value;
    const meals = document.getElementById("meals").checked;

    const nights = (checkOut-checkIn) / (1000*60*60*24);
    if (nights <= 0) {
        alert("please enter valid check-in and checkn-out time");
        return;
    }

    const adultRate = meals ? 250 : 100;
    const childRate = meals ? 120 : 50;

    const totalCost = nights * ((adults * adultRate) + (children * childRate));

    const booking = {
        destination,
        checkIn:checkIn.toISOString(),
        checkOut:checkOut.toISOString(),
        adults,
        children,
        hotel,
        mealsIncluded: meals,
        nights: Math.round(nights),
        totalCost: Math.round(totalCost)
    };

    fetch(`${baseURL}/bookings`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(booking),
    })
    .then(res => res.json())
    .then(data => {
        alert(`Trip booked successfully!\nNights: ${Math.round(hours)}\nTotal Cost: ${totalCost.toFixed(2)}`);
        document.getElementById("bookingForm").reset();
        updatePricePreview();
        loadBookings();
    })
    .catch(error => {
        console.error("booking failed");
    });
});

document.getElementById("meals").addEventListener("change", function(e){
    if (e.target.checked) {
        console.log("Meals included");
    } else{
        console.log("Meals not included");
    }
});

document.getElementById("children").addEventListener("input", function(e) {
    const value = parseInt(e.target.value);
    if(value < 0){
        alert("enter a valid number.");
        e.target.value = ""
    }
});

  fieldsToWatch.forEach(Id => {
     const element =document.getElementById(id);
     if(element) {
        element.addEventListener("input", updatePricePreview);
        element.addEventListener("change", updatePricePreview)
     }
});

function updatePricePreview() {
    const checkIn = new Date(document.getElementById("checkIn").value);
    const checkOut = new Date(document.getElementById("checkOut").value);
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const hotel = document.getElementById("hotel").value;
    const meals = document.getElementById("meals").checked;

    const nights = (checkOut-checkIn) / (1000*60*60*24);
    if (nights <= 0){
        document.getElementById("pricePreview").innerHTML = "<strong>Total Price:</strong> $${totalCost.toFixed(2)} for ${Math.round(nights)} nigts(s)";
        return;
    }

    const adultRate = meals ? 250 : 100;
    const childRate = meals ? 120 : 50;
    const totalCost = nights * ((adults * adultRate) + (children * childRate));

    document.getElementById("pricePreview").innerHTML =
    "<strong>Total Price:</strong> ${totalCost.toFixed(2)} for ${Math.round(hours)} hour(s)";
}

function loadBookings() {
  fetch(`${baseURL}/bookings`)
    .then(res => res.json())
    .then(data => {
      const display = document.getElementById("bookingsDisplay");
      display.innerHTML = "<h3>Booked Trips:</h3>";

      if (data.length === 0) {
        display.innerHTML += "<p>No bookings yet.</p>";
        return;
      }

      data.forEach(booking => {
        display.innerHTML += `
          <div>
            <p><strong>Destination:</strong> ${booking.destination}</p>
            <p><strong>Hotel:</strong> ${booking.hotel}</p>
            <p><strong>Adults:</strong> ${booking.adults} | <strong>Children:</strong> ${booking.children}</p>
            <p><strong>Meals Included:</strong> ${booking.mealsIncluded ? "Yes" : "No"}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Total Hours:</strong> ${booking.hours}</p>
            <p><strong>Total Cost:</strong> $${booking.totalCost}</p>
            <button onclick="editBooking(${booking.id})">Edit</button>
            <button onclick="deleteBooking(${booking.id})">Delete</button>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Error loading bookings:", err);
    });
}


