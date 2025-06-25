document.getElementById("booingForm").addEventListener("submit", function(e){
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
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
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
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