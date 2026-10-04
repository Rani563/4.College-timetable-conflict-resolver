// ==========================================
// COLLEGE TIME TABLE CONFLICT RESOLVER
// ==========================================


// Available time slots
const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "02:00 - 03:00",
    "03:00 - 04:00"
];


// Available days
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];


// Timetable array
let timetable = [

    {
        subject: "Data Structures",
        faculty: "Dr. Kumar",
        room: "CSE-101",
        day: "Monday",
        time: "09:00 - 10:00",
        status: "Normal"
    },

    {
        subject: "DBMS",
        faculty: "Dr. Rani",
        room: "CSE-102",
        day: "Monday",
        time: "10:00 - 11:00",
        status: "Normal"
    },

    {
        subject: "Operating Systems",
        faculty: "Dr. Kumar",
        room: "CSE-103",
        day: "Monday",
        time: "11:00 - 12:00",
        status: "Normal"
    },

    // Intentional conflict
    {
        subject: "Java Programming",
        faculty: "Dr. Kumar",
        room: "CSE-104",
        day: "Monday",
        time: "09:00 - 10:00",
        status: "Conflict"
    },

    {
        subject: "Computer Networks",
        faculty: "Dr. Priya",
        room: "CSE-105",
        day: "Tuesday",
        time: "10:00 - 11:00",
        status: "Normal"
    }

];


// ==========================================
// DISPLAY TIMETABLE
// ==========================================

function displayTimetable() {

    const table =
        document.getElementById("timetable");

    table.innerHTML = "";


    timetable.forEach(item => {

        const row =
            document.createElement("tr");


        let statusClass =
            item.status.toLowerCase();


        row.innerHTML = `

            <td>${item.subject}</td>

            <td>${item.faculty}</td>

            <td>${item.room}</td>

            <td>${item.day}</td>

            <td>${item.time}</td>

            <td class="${statusClass}">
                ${item.status}
            </td>

        `;


        table.appendChild(row);

    });
}


// ==========================================
// CHECK CONFLICT
// ==========================================

function hasConflict(newClass) {

    for (let item of timetable) {

        // Same day and same time
        if (
            item.day === newClass.day &&
            item.time === newClass.time
        ) {

            // Same faculty
            if (
                item.faculty.toLowerCase() ===
                newClass.faculty.toLowerCase()
            ) {
                return "Faculty conflict";
            }


            // Same room
            if (
                item.room.toLowerCase() ===
                newClass.room.toLowerCase()
            ) {
                return "Room conflict";
            }
        }
    }


    return null;
}


// ==========================================
// ADD CLASS
// ==========================================

function addClass() {

    const subject =
        document.getElementById("subject")
        .value.trim();

    const faculty =
        document.getElementById("faculty")
        .value.trim();

    const room =
        document.getElementById("room")
        .value.trim();

    const day =
        document.getElementById("day")
        .value;

    const time =
        document.getElementById("time")
        .value;


    // Validation

    if (
        subject === "" ||
        faculty === "" ||
        room === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    const newClass = {

        subject: subject,

        faculty: faculty,

        room: room,

        day: day,

        time: time,

        status: "Normal"
    };


    const conflict =
        hasConflict(newClass);


    if (conflict !== null) {

        newClass.status = "Conflict";


        showResult(
            `⚠️ <b>${conflict}</b> detected for
            <b>${subject}</b> on
            ${day}, ${time}.`,
            "conflict"
        );

    }
    else {

        showResult(
            `✅ ${subject} added successfully.`,
            ""
        );
    }


    timetable.push(newClass);

    displayTimetable();


    // Clear inputs

    document.getElementById("subject").value = "";
    document.getElementById("faculty").value = "";
    document.getElementById("room").value = "";
}


// ==========================================
// FIND AVAILABLE SLOT
// ==========================================

function findAvailableSlot(classItem) {

    // Check every day
    for (let day of days) {

        // Check every time
        for (let time of timeSlots) {

            let conflict = false;


            for (let item of timetable) {

                if (
                    item.day === day &&
                    item.time === time
                ) {

                    // Faculty already occupied
                    if (
                        item.faculty.toLowerCase() ===
                        classItem.faculty.toLowerCase()
                    ) {
                        conflict = true;
                    }


                    // Room already occupied
                    if (
                        item.room.toLowerCase() ===
                        classItem.room.toLowerCase()
                    ) {
                        conflict = true;
                    }
                }
            }


            if (!conflict) {

                return {
                    day: day,
                    time: time
                };
            }
        }
    }


    return null;
}


// ==========================================
// RESOLVE CONFLICTS
// ==========================================

function resolveConflicts() {

    let conflictsFound = 0;
    let resolvedCount = 0;

    let messages = [];


    for (let item of timetable) {

        // Reset status
        item.status = "Normal";
    }


    for (let i = 0; i < timetable.length; i++) {

        const current = timetable[i];

        let conflict = false;


        // Compare with previous classes
        for (let j = 0; j < i; j++) {

            const previous = timetable[j];


            if (
                current.day === previous.day &&
                current.time === previous.time
            ) {

                // Faculty conflict
                if (
                    current.faculty.toLowerCase() ===
                    previous.faculty.toLowerCase()
                ) {
                    conflict = true;
                }


                // Room conflict
                if (
                    current.room.toLowerCase() ===
                    previous.room.toLowerCase()
                ) {
                    conflict = true;
                }
            }
        }


        if (conflict) {

            conflictsFound++;

            current.status = "Conflict";


            // Find alternative slot
            const newSlot =
                findAlternativeSlot(
                    current,
                    i
                );


            if (newSlot !== null) {

                current.day = newSlot.day;
                current.time = newSlot.time;

                current.status = "Resolved";

                resolvedCount++;


                messages.push(
                    `${current.subject}
                    → ${newSlot.day},
                    ${newSlot.time}`
                );
            }
        }
    }


    displayTimetable();


    if (conflictsFound === 0) {

        showResult(
            "✅ No timetable conflicts found.",
            ""
        );

        return;
    }


    showResult(
        `
        <b>🔧 Conflict Resolution Complete</b><br><br>

        Conflicts detected:
        <b>${conflictsFound}</b><br>

        Conflicts resolved:
        <b>${resolvedCount}</b><br><br>

        ${messages.join("<br>")}
        `,
        resolvedCount === conflictsFound
            ? ""
            : "warning"
    );
}


// ==========================================
// FIND ALTERNATIVE SLOT
// ==========================================

function findAlternativeSlot(classItem, currentIndex) {

    for (let day of days) {

        for (let time of timeSlots) {

            let available = true;


            for (let i = 0; i < timetable.length; i++) {

                if (i === currentIndex) {
                    continue;
                }


                const item = timetable[i];


                if (
                    item.day === day &&
                    item.time === time
                ) {

                    // Faculty conflict
                    if (
                        item.faculty.toLowerCase() ===
                        classItem.faculty.toLowerCase()
                    ) {
                        available = false;
                    }


                    // Room conflict
                    if (
                        item.room.toLowerCase() ===
                        classItem.room.toLowerCase()
                    ) {
                        available = false;
                    }
                }
            }


            if (available) {

                return {
                    day: day,
                    time: time
                };
            }
        }
    }


    return null;
}


// ==========================================
// SHOW RESULT
// ==========================================

function showResult(message, type) {

    const result =
        document.getElementById("result");


    result.innerHTML = `

        <div class="result-box ${type}">
            ${message}
        </div>

    `;
}


// ==========================================
// RESET
// ==========================================

function resetTable() {

    location.reload();
}


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayTimetable();