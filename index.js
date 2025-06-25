window.addEventListener("DOMContentLoaded", loadBookings);

document.getElementById("booingForm").addEventListener("submit", function(e){
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const checkIn = newDate(document.getElementById("checkIn").value);
    const checkOut = newDate(document.getElementById("checkOut").value);
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const hotel = document.getElementById("hotel").value;
    const meals = document.getElementById("meals").checked;

    const nights = (checkOut-checkIn) / (1000*60*60);
    if (hours<= 0) {
        alert("please enter valid check-in and checkn-out time");
        return;
    }

    const adultRate = meals ? (250/24) : (100/24);
    const childRate = meals ? (120/24) : (50/24);

    const totalCost = hours * ((adults * adultRate) + (children * childRate));

    const booking = {
        destination,
        checkIn:checkIn.toISOString(),
        checkOut:checkOut.toISOString(),
        adults,
        children,
        hotel,
        mealsIncluded: meals,
        hours: Math.round(hours),
        totalCost: Math.round(totalCost)
    };

    fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(booking)
    })
    .then(res => res.json())
    .then(data => {
        alert("Trip booed successfully!\nHours: ${Math.round(hours)}\nTotal Cost: ${totalCost.toFixed(2)}");
        document.getElementById("bookingForm").reset();
        updatePricePreview();
    })
    .catch(error => {
        console.error("booking failed");
    });
});

document.getElementById("meals").addEventListener("change", function(e){
    if (e.target.checked) {
        comsole.log("Meals included");
    } else{
        console.log("Meals not included");
    }
});

document.getElementById("child").addEventListener("input", function(e) {
    const value = parseInt(e.target.value);
    if(value < 0){
        alert("enter a valid number.");
        e.target.value = ""
    }
});

const fieldsToWatch = ["checkIn","checkOut","adults","child","meals"];
fieldsToWatch.forEach(Id => {
    document.getElementById(id).addEventListener("input", updatePricePreview);
    document.getElementById(id).addEventListener("change", updatePricePreview);
});

function updatePricePreview() {
    const checkIn = newDate(document.getElementById("checkIn").value);
    const checkOut = newDate(document.getElementById("checkOut").value);
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const hotel = document.getElementById("hotel").value;
    const meals = document.getElementById("meals").checked;

    const hours = (checkOut-checkIn) / (1000*60*60);
    if (hours <= 0){
        document.getElementById("pricePreview").innerHTML = "<strong>Total Price:</strong> $0";
        return;
    }

    const adultRate = meals ? (250/24) : (100/24);
    const childRate = meals ? (120/24) : (50/24);
    const totalCost = hours * ((adults * adultRate) + (children * childRate));

    document.getElementById("pricePreview").innerHTML =
    "<strong>Total Price:</strong> ${totalCost.toFixed(2)} for ${Math.round(hours)} hour(s)";
}

function loadBookings() {
  fetch("http://localhost:3000/bookings")
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
          <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
            <p><strong>Destination:</strong> ${booking.destination}</p>
            <p><strong>Hotel:</strong> ${booking.hotel}</p>
            <p><strong>Adults:</strong> ${booking.adults} | <strong>Children:</strong> ${booking.children}</p>
            <p><strong>Meals Included:</strong> ${booking.mealsIncluded ? "Yes" : "No"}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Total Hours:</strong> ${booking.hours}</p>
            <p><strong>Total Cost:</strong> $${booking.totalCost}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Error loading bookings:", err);
    });
}