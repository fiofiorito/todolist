module.exports.getDate = getDate;

function getDate() {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("es-AR", options);
    return day;
}

module.exports.todayIsName = todayIsName;

function todayIsName() {
    let today = new Date();
    let currentDay = today.getDay();
    let cDay = "";
// switch case
switch (currentDay) {
    case 0:
        cDay = "Sunday"
        break;
    case 1:
        cDay = "Monday"
        break;
    case 2:
        cDay = "Tuesday"
        break;
    case 3:
        cDay = "Wednesday"
        break;
    case 4:
        cDay = "Thursday"
        break;
    case 5:
        cDay = "Friday"
        break;
    case 6:
        cDay = "Saturday"
        break;
    default:
        console.log("Error: current day is " + cDay);
        break;
    }
    return cDay;
}