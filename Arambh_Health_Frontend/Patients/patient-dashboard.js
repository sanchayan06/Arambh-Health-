
const doctors = [

    {
        id: "DOC001",
        name: "Dr. Ananya Sharma",
        hospital: "AIIMS - New Delhi",
        specialization: "Cardiologist",
        designation: "Senior Consultant",
        experience: "12 years"
    },

    {
        id: "DOC002",
        name: "Dr. Rahul Mehta",
        hospital: "AIIMS - New Delhi",
        specialization: "Neurologist",
        designation: "Consultant Neurologist",
        experience: "9 years"
    },

    {
        id: "DOC003",
        name: "Dr. Priya Sen",
        hospital: "Apollo Hospitals",
        specialization: "Dermatologist",
        designation: "Senior Dermatologist",
        experience: "10 years"
    },

    {
        id: "DOC004",
        name: "Dr. Arjun Roy",
        hospital: "Apollo Hospitals",
        specialization: "General Physician",
        designation: "Consultant Physician",
        experience: "8 years"
    },

    {
        id: "DOC005",
        name: "Dr. Sneha Kapoor",
        hospital: "Fortis Healthcare",
        specialization: "Pediatrician",
        designation: "Senior Pediatrician",
        experience: "11 years"
    },

    {
        id: "DOC006",
        name: "Dr. Vikram Singh",
        hospital: "Fortis Healthcare",
        specialization: "Orthopedic Surgeon",
        designation: "Orthopedic Consultant",
        experience: "14 years"
    },

    {
        id: "DOC007",
        name: "Dr. Neha Gupta",
        hospital: "Max Super Speciality Hospital",
        specialization: "Cardiologist",
        designation: "Consultant Cardiologist",
        experience: "7 years"
    },

    {
        id: "DOC008",
        name: "Dr. Kunal Bose",
        hospital: "Max Super Speciality Hospital",
        specialization: "Neurologist",
        designation: "Senior Neurologist",
        experience: "13 years"
    },

    {
        id: "DOC009",
        name: "Dr. Riya Malhotra",
        hospital: "Manipal Hospital",
        specialization: "General Physician",
        designation: "Consultant Physician",
        experience: "6 years"
    }

];


/* =========================================================
   PATIENT
========================================================= */

let currentPatient = {

    name: "Rajib Sengupta",

    patientId: "PAT-2026-001",

    email: "patient@example.com"

};


/* =========================================================
   CONSULTATIONS
========================================================= */

let consultations =
    JSON.parse(
        localStorage.getItem("patientConsultations")
    ) || [];


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPatient();

        renderDoctors();

        renderConsultations();

        updateStatistics();

        setMinimumDate();

    }
);


/* =========================================================
   LOAD PATIENT
========================================================= */

function loadPatient() {

    const storedUser =
        sessionStorage.getItem("currentUser");

    if (storedUser) {

        try {

            const user =
                JSON.parse(storedUser);

            if (user.name) {

                currentPatient.name =
                    user.name;

            }

            if (user.patientId) {

                currentPatient.patientId =
                    user.patientId;

            }

        } catch (error) {

            console.log(
                "Could not read current user."
            );

        }

    }


    document.getElementById(
        "patientName"
    ).textContent =
        currentPatient.name;


    document.getElementById(
        "welcomeName"
    ).textContent =
        currentPatient.name;


    document.getElementById(
        "patientId"
    ).textContent =
        currentPatient.patientId;


    const firstLetter =
        currentPatient.name
            .charAt(0)
            .toUpperCase();


    document.getElementById(
        "profileAvatar"
    ).textContent =
        firstLetter;

}


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId, button) {

    document
        .querySelectorAll(".dashboard-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    const selected =
        document.getElementById(sectionId);


    if (selected) {

        selected.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    updatePageTitle(sectionId);

}


function showSectionById(sectionId) {

    const button =
        document.querySelector(
            `.nav-item[onclick*="'${sectionId}'"]`
        );


    showSection(
        sectionId,
        button
    );

}


function updatePageTitle(sectionId) {

    const titles = {

        overview: "Dashboard",

        doctors: "Find a Doctor",

        consultations: "My Consultations"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[sectionId] || "Dashboard";

}


/* =========================================================
   RENDER DOCTORS
========================================================= */

function renderDoctors() {

    const hospital =
        document.getElementById(
            "hospitalFilter"
        ).value.toLowerCase();


    const search =
        document.getElementById(
            "doctorSearch"
        ).value.toLowerCase();


    const specialization =
        document.getElementById(
            "specializationFilter"
        ).value.toLowerCase();


    const filteredDoctors =
        doctors.filter(doctor => {

            const matchesHospital =
                !hospital ||
                doctor.hospital.toLowerCase()
                    === hospital;


            const matchesName =
                !search ||
                doctor.name.toLowerCase()
                    .includes(search);


            const matchesSpecialization =
                !specialization ||
                doctor.specialization.toLowerCase()
                    === specialization;


            return (
                matchesHospital &&
                matchesName &&
                matchesSpecialization
            );

        });


    const container =
        document.getElementById(
            "doctorList"
        );


    if (filteredDoctors.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ?
                </div>

                <h3>No doctors found</h3>

                <p>
                    Try changing your hospital,
                    doctor name, or specialization filter.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        filteredDoctors
            .map(createDoctorCard)
            .join("");

}


/* =========================================================
   DOCTOR CARD
========================================================= */

function createDoctorCard(doctor) {

    const initials =
        doctor.name
            .replace("Dr. ", "")
            .split(" ")
            .map(name => name.charAt(0))
            .slice(0, 2)
            .join("");


    return `

        <div class="doctor-card">

            <div class="doctor-top">

                <div class="doctor-avatar">
                    ${initials}
                </div>

                <div>

                    <h3 class="doctor-name">
                        ${doctor.name}
                    </h3>

                    <div class="doctor-specialization">
                        ${doctor.specialization}
                    </div>

                </div>

            </div>


            <div class="doctor-details">

                <div class="doctor-detail">

                    <span>Hospital</span>

                    <span>
                        ${doctor.hospital}
                    </span>

                </div>


                <div class="doctor-detail">

                    <span>Designation</span>

                    <span>
                        ${doctor.designation}
                    </span>

                </div>


                <div class="doctor-detail">

                    <span>Experience</span>

                    <span>
                        ${doctor.experience}
                    </span>

                </div>

            </div>


            <button
                class="primary-btn"
                onclick="bookDoctor('${doctor.id}')"
            >
                Book Consultation
            </button>

        </div>

    `;

}


/* =========================================================
   DOCTOR FILTER EVENTS
========================================================= */

document
    .getElementById("hospitalFilter")
    .addEventListener(
        "change",
        renderDoctors
    );


document
    .getElementById("doctorSearch")
    .addEventListener(
        "input",
        renderDoctors
    );


document
    .getElementById("specializationFilter")
    .addEventListener(
        "change",
        renderDoctors
    );


/* =========================================================
   BOOK SPECIFIC DOCTOR
========================================================= */

function bookDoctor(doctorId) {

    const doctor =
        doctors.find(
            d => d.id === doctorId
        );


    if (!doctor) return;


    openBookingModal();


    document.getElementById(
        "bookingHospital"
    ).value =
        doctor.hospital;


    updateBookingDoctors();


    document.getElementById(
        "bookingDoctor"
    ).value =
        doctor.id;

}


/* =========================================================
   BOOKING MODAL
========================================================= */

function openBookingModal() {

    document
        .getElementById("bookingModal")
        .classList.add("show");

}


function closeBookingModal() {

    document
        .getElementById("bookingModal")
        .classList.remove("show");

}


/* =========================================================
   UPDATE BOOKING DOCTORS
========================================================= */

function updateBookingDoctors() {

    const hospital =
        document.getElementById(
            "bookingHospital"
        ).value;


    const doctorSelect =
        document.getElementById(
            "bookingDoctor"
        );


    doctorSelect.innerHTML = `

        <option value="">
            Select doctor
        </option>

    `;


    if (!hospital) return;


    doctors
        .filter(
            doctor =>
                doctor.hospital === hospital
        )
        .forEach(doctor => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                doctor.id;


            option.textContent =
                `${doctor.name} — ${doctor.specialization}`;


            doctorSelect.appendChild(
                option
            );

        });

}


/* =========================================================
   SET MINIMUM DATE
========================================================= */

function setMinimumDate() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "bookingDate"
    ).min = today;

}


/* =========================================================
   BOOKING SUBMISSION
========================================================= */

document
    .getElementById("bookingForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const hospital =
                document.getElementById(
                    "bookingHospital"
                ).value;


            const doctorId =
                document.getElementById(
                    "bookingDoctor"
                ).value;


            const date =
                document.getElementById(
                    "bookingDate"
                ).value;


            const time =
                document.getElementById(
                    "bookingTime"
                ).value;


            const reason =
                document.getElementById(
                    "bookingReason"
                ).value.trim();


            const doctor =
                doctors.find(
                    d => d.id === doctorId
                );


            if (!doctor) {

                alert(
                    "Please select a doctor."
                );

                return;

            }


            const consultation = {

                id:
                    "CONS-" +
                    Date.now(),

                patientId:
                    currentPatient.patientId,

                patientName:
                    currentPatient.name,

                doctorId:
                    doctor.id,

                doctorName:
                    doctor.name,

                specialization:
                    doctor.specialization,

                hospital:
                    hospital,

                date:
                    date,

                time:
                    time,

                reason:
                    reason,

                status:
                    "Pending",

                createdAt:
                    new Date().toISOString()

            };


            consultations.push(
                consultation
            );


            saveConsultations();


            this.reset();


            closeBookingModal();


            renderConsultations();

            updateStatistics();


            showSectionById(
                "consultations"
            );


            alert(
                "Consultation request submitted successfully."
            );

        }
    );


/* =========================================================
   SAVE CONSULTATIONS
========================================================= */

function saveConsultations() {

    localStorage.setItem(

        "patientConsultations",

        JSON.stringify(
            consultations
        )

    );

}


/* =========================================================
   RENDER CONSULTATIONS
========================================================= */

function renderConsultations(
    statusFilter = "all"
) {

    const container =
        document.getElementById(
            "consultationList"
        );


    let filtered =
        consultations;


    if (statusFilter !== "all") {

        filtered =
            consultations.filter(
                consultation =>
                    consultation.status ===
                    statusFilter
            );

    }


    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ◷
                </div>

                <h3>
                    No consultations found
                </h3>

                <p>
                    You don't have any
                    ${statusFilter === "all"
                        ? ""
                        : statusFilter.toLowerCase()}
                    consultation requests.
                </p>

                <button
                    class="secondary-btn"
                    onclick="openBookingModal()"
                >
                    Book Consultation
                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        filtered
            .slice()
            .reverse()
            .map(createConsultationCard)
            .join("");


    renderUpcomingConsultation();

}


/* =========================================================
   CONSULTATION CARD
========================================================= */

function createConsultationCard(
    consultation
) {

    const initials =
        consultation.doctorName
            .replace("Dr. ", "")
            .split(" ")
            .map(name => name.charAt(0))
            .slice(0, 2)
            .join("");


    const statusClass =
        consultation.status
            .toLowerCase();


    return `

        <div class="consultation-card">

            <div class="consultation-main">

                <div class="consultation-avatar">
                    ${initials}
                </div>


                <div class="consultation-info">

                    <h3>
                        ${consultation.doctorName}
                    </h3>

                    <p>
                        ${consultation.specialization}
                        •
                        ${consultation.hospital}
                    </p>

                    <div class="consultation-date">
                        ${formatDate(consultation.date)}
                        at
                        ${consultation.time}
                    </div>

                </div>

            </div>


            <span class="status ${statusClass}">
                ${consultation.status}
            </span>

        </div>

    `;

}


/* =========================================================
   CONSULTATION FILTER
========================================================= */

function filterConsultations(
    status,
    button
) {

    document
        .querySelectorAll(".consultation-tab")
        .forEach(tab => {

            tab.classList.remove(
                "active"
            );

        });


    button.classList.add("active");


    renderConsultations(status);

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        consultations.length;


    const pending =
        consultations.filter(
            c => c.status === "Pending"
        ).length;


    const confirmed =
        consultations.filter(
            c => c.status === "Confirmed"
        ).length;


    document.getElementById(
        "totalConsultations"
    ).textContent =
        total;


    document.getElementById(
        "pendingConsultations"
    ).textContent =
        pending;


    document.getElementById(
        "confirmedConsultations"
    ).textContent =
        confirmed;


    renderUpcomingConsultation();

}


/* =========================================================
   UPCOMING CONSULTATION
========================================================= */

function renderUpcomingConsultation() {

    const container =
        document.getElementById(
            "upcomingContainer"
        );


    const upcoming =
        consultations
            .filter(
                c =>
                    c.status === "Confirmed"
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )[0];


    if (!upcoming) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ◷
                </div>

                <h3>
                    No upcoming consultation
                </h3>

                <p>
                    Book a consultation with a doctor
                    to get started.
                </p>

                <button
                    class="secondary-btn"
                    onclick="showSectionById('doctors')"
                >
                    Find a Doctor
                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        createConsultationCard(
            upcoming
        );

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    sessionStorage.removeItem(
        "currentUser"
    );


    window.location.href = "../Login/index.html";

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document
    .getElementById("bookingModal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                closeBookingModal();

            }

        }
    );

