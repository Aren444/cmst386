// Date and Time in Footer

document.addEventListener("DOMContentLoaded", function ()  //makes js wait until page is loaded
 {
    const dt = document.getElementById("date-time");  //finds date and time on the page (<p> element) that this file is linked to

    function updateTime(){
        const now = new Date(); //grabs the updated date and time
        dt.textContent = now.toLocaleString(); //to display the date time in a readable way
    }

    updateTime();  // display to update constantly 
    setInterval(updateTime, 1000); //to update every second
});
