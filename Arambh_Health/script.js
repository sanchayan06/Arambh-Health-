// ========================================
// JEEVANSETU - MAIN JAVASCRIPT
// ========================================

console.log("Script.js loaded");


// ========================================
// CURRENT PAGE
// ========================================

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

let selectedPatientId = null;


// ========================================
// USER / LOCAL STORAGE HELPERS
// ========================================

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("ayushUser")) || null;
    } catch (error) {
        return null;
    }
}

function saveCurrentUser(user) {
    localStorage.setItem("ayushUser", JSON.stringify(user));
}

function getPatients() {
    try {
        return JSON.parse(localStorage.getItem("patients")) || [];
    } catch (error) {
        return [];
    }
}

function savePatients(patients) {
    localStorage.setItem("patients", JSON.stringify(patients));
}

function getConsultations() {
    try {
        return JSON.parse(localStorage.getItem("consultations")) || [];
    } catch (error) {
        return [];
    }
}

function saveConsultations(consultations) {
    localStorage.setItem(
        "consultations",
        JSON.stringify(consultations)
    );
}

function getStaff() {
    try {
        return JSON.parse(localStorage.getItem("staff")) || [];
    } catch (error) {
        return [];
    }
}

function saveStaff(staff) {
    localStorage.setItem("staff", JSON.stringify(staff));
}


// ========================================
// GENERAL HELPERS
// ========================================

function getDefaultPassword(role) {

    const passwords = {
        admin: "123@admin",
        doctor: "123@doctor",
        receptionist: "123@receptionist"
    };

    return passwords[String(role).toLowerCase()] || "";
}


function generatePatientId() {
    return "P" + Date.now();
}

function generateStaffId() {
    return "S" + Date.now();
}

function generateConsultationId() {
    return "C" + Date.now();
}


function formatRole(role) {

    if (!role) {
        return "N/A";
    }

    role = String(role);

    return (
        role.charAt(0).toUpperCase() +
        role.slice(1).toLowerCase()
    );
}


function formatDate(date) {

    if (!date) {
        return "N/A";
    }

    const dateObject = new Date(date);

    if (isNaN(dateObject.getTime())) {
        return date;
    }

    return dateObject.toLocaleDateString();
}


// ========================================
// INITIAL ADMIN ACCOUNT
// ========================================

function initializeAdminAccount() {

    const staff = getStaff();

    const adminExists = staff.some(function (member) {

        return (
            member.role &&
            String(member.role).toLowerCase() === "admin"
        );

    });


    if (!adminExists) {

        staff.push({

            id: "ADMIN001",
            name: "System Administrator",
            email: "admin@jeevansetu.com",
            phone: "123",
            dateOfJoining:
                new Date().toISOString().split("T")[0],
            role: "admin",
            password: "123@admin"

        });

        saveStaff(staff);
    }
}

initializeAdminAccount();


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const showPasswordBtn =
    document.getElementById("showPasswordBtn");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

if (passwordInput && showPasswordBtn) {

    // Prevent button from submitting the form
    showPasswordBtn.type = "button";

    showPasswordBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (passwordInput.type === "password") {

                passwordInput.type = "text";
                showPasswordBtn.textContent = "Hide";

            } else {

                passwordInput.type = "password";
                showPasswordBtn.textContent = "Show";

            }

        }
    );

} else {

    console.warn(
        "Password input or Show Password button not found."
    );

}


// ========================================
// FORGOT PASSWORD
// ========================================

if (forgotPasswordBtn) {

    forgotPasswordBtn.type = "button";

    forgotPasswordBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Password recovery is not available yet.\n\n" +
                "Please contact the system administrator."
            );

        }
    );

} else {

    console.warn(
        "Forgot Password button not found."
    );

}


// ========================================
// LOGIN FORM SUBMIT
// ========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const nameInput =
                document.getElementById("name");

            const emailInput =
                document.getElementById("email");

            const phoneInput =
                document.getElementById("phone");

            const roleInput =
                document.getElementById("role");


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";

            const role =
                roleInput
                    ? roleInput.value.trim().toLowerCase()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (
                !name ||
                !email ||
                !phone ||
                !role ||
                !password
            ) {

                alert(
                    "Please fill in all login details."
                );

                return;
            }


            const staff = getStaff();


            const member = staff.find(
                function (item) {

                    return (

                        item.name &&
                        item.email &&
                        item.role &&

                        item.name.toLowerCase() ===
                        name.toLowerCase() &&

                        item.email.toLowerCase() ===
                        email.toLowerCase() &&

                        String(item.phone) ===
                        String(phone) &&

                        String(item.role)
                            .toLowerCase() === role

                    );

                }
            );


            if (!member) {

                alert(
                    "No staff account matches the provided details."
                );

                return;
            }


            if (member.password !== password) {

                alert("Incorrect password.");

                return;
            }


            saveCurrentUser({

                id: member.id,
                name: member.name,
                email: member.email,
                phone: member.phone,
                role: member.role

            });


            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.type = "button";

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem("ayushUser");
            localStorage.removeItem("selectedPatientId");

            window.location.href = "Index.html";

        }
    );

}


// ========================================
// PAGE ACCESS CONTROL
// ========================================

function enforcePageAccess() {

    const publicPages = [
        "",
        "index.html"
    ];

    const user = getCurrentUser();


    if (
        !publicPages.includes(currentPage) &&
        !user
    ) {

        window.location.href = "Index.html";

        return;
    }


    const adminPages = [
        "manage-staff.html",
        "add-staff.html",
        "edit-staff.html"
    ];


    if (adminPages.includes(currentPage)) {

        if (
            !user ||
            String(user.role).toLowerCase() !== "admin"
        ) {

            alert(
                "Permission denied. Only Admins can access this page."
            );

            window.location.href =
                "dashboard.html";

        }

    }

}

enforcePageAccess();


// ========================================
// REGISTER PATIENT
// ========================================

const patientForm =
    document.getElementById("patientForm");

if (patientForm) {

    patientForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const user = getCurrentUser();

            const userRole =
                user
                    ? String(user.role).toLowerCase()
                    : "";


            if (
                !["doctor", "receptionist"]
                    .includes(userRole)
            ) {

                alert(
                    "Permission denied. Admins cannot register patients."
                );

                return;
            }


            const patientName =
                document
                    .getElementById("patientName")
                    .value
                    .trim();

            const patientAge =
                document
                    .getElementById("patientAge")
                    .value
                    .trim();

            const patientGender =
                document
                    .getElementById("patientGender")
                    .value;

            const patientPhone =
                document
                    .getElementById("patientPhone")
                    .value
                    .trim();

            const patientAddress =
                document
                    .getElementById("patientAddress")
                    .value
                    .trim();


            if (
                !patientName ||
                !patientAge ||
                !patientGender
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            const patient = {

                id: generatePatientId(),

                name: patientName,

                age: patientAge,

                gender: patientGender,

                phone: patientPhone,

                address: patientAddress,

                registeredDate:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };


            const patients = getPatients();

            patients.push(patient);

            savePatients(patients);


            alert(
                "Patient registered successfully."
            );


            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// DASHBOARD PATIENT TABLE
// ========================================

const patientTableBody =
    document.getElementById("patientTableBody");


function displayPatients(patients) {

    if (!patientTableBody) {
        return;
    }


    patientTableBody.innerHTML = "";


    if (patients.length === 0) {

        patientTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No patients registered.
                </td>
            </tr>
        `;

        return;
    }


    const user = getCurrentUser();

    const userRole =
        user
            ? String(user.role).toLowerCase()
            : "";


    const canEdit =
        ["doctor", "receptionist"]
            .includes(userRole);

    const canDelete =
        userRole === "doctor";


    patients.forEach(
        function (patient) {

            const row =
                document.createElement("tr");


            let actionButtons = `
                <button
                    type="button"
                    class="view-btn"
                    onclick="openConsultation('${patient.id}')"
                >
                    View
                </button>
            `;


            if (canEdit) {

                actionButtons += `
                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editPatient('${patient.id}')"
                    >
                        Edit
                    </button>
                `;

            }


            if (canDelete) {

                actionButtons += `
                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deletePatient('${patient.id}')"
                    >
                        Delete
                    </button>
                `;

            }


            row.innerHTML = `

                <td>${patient.id}</td>

                <td>${patient.name}</td>

                <td>${patient.age}</td>

                <td>${patient.gender}</td>

                <td>${patient.phone || "N/A"}</td>

                <td>${actionButtons}</td>

            `;


            patientTableBody.appendChild(row);

        }
    );

}


// ========================================
// EDIT PATIENT
// ========================================

function editPatient(patientId) {

    const user = getCurrentUser();

    const userRole =
        user
            ? String(user.role).toLowerCase()
            : "";


    if (
        !["doctor", "receptionist"]
            .includes(userRole)
    ) {

        alert("Permission denied.");

        return;
    }


    const patients = getPatients();

    const patientIndex =
        patients.findIndex(
            function (patient) {
                return patient.id === patientId;
            }
        );


    if (patientIndex === -1) {

        alert("Patient not found.");

        return;
    }


    const patient =
        patients[patientIndex];


    const newName =
        prompt(
            "Edit Patient Name:",
            patient.name
        );

    if (newName === null) {
        return;
    }


    const newAge =
        prompt(
            "Edit Patient Age:",
            patient.age
        );

    if (newAge === null) {
        return;
    }


    const newGender =
        prompt(
            "Edit Patient Gender:",
            patient.gender
        );

    if (newGender === null) {
        return;
    }


    const newPhone =
        prompt(
            "Edit Phone Number:",
            patient.phone || ""
        );

    if (newPhone === null) {
        return;
    }


    const newAddress =
        prompt(
            "Edit Address:",
            patient.address || ""
        );

    if (newAddress === null) {
        return;
    }


    patients[patientIndex] = {

        ...patient,

        name:
            newName.trim() ||
            patient.name,

        age:
            newAge.trim() ||
            patient.age,

        gender:
            newGender.trim() ||
            patient.gender,

        phone:
            newPhone.trim() ||
            patient.phone,

        address:
            newAddress.trim() ||
            patient.address

    };


    savePatients(patients);

    alert(
        "Patient details updated successfully."
    );


    displayPatients(getPatients());

}


// ========================================
// DELETE PATIENT
// ========================================

function deletePatient(patientId) {

    const user = getCurrentUser();


    if (
        !user ||
        String(user.role).toLowerCase() !== "doctor"
    ) {

        alert(
            "Permission denied. Only Doctors can delete patient records."
        );

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to delete this patient and all associated consultations?"
    );


    if (!confirmed) {
        return;
    }


    const updatedPatients =
        getPatients().filter(
            function (patient) {
                return patient.id !== patientId;
            }
        );


    const updatedConsultations =
        getConsultations().filter(
            function (consultation) {
                return consultation.patientId !== patientId;
            }
        );


    savePatients(updatedPatients);

    saveConsultations(
        updatedConsultations
    );


    if (
        selectedPatientId === patientId
    ) {

        selectedPatientId = null;

    }


    localStorage.removeItem(
        "selectedPatientId"
    );


    alert(
        "Patient and associated consultations deleted successfully."
    );


    displayPatients(
        getPatients()
    );

    updateDashboardStats();

}


// ========================================
// OPEN CONSULTATION
// ========================================

function openConsultation(patientId) {

    window.location.href =
        "Consultation.html?patient=" +
        encodeURIComponent(patientId);

}


// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateDashboardStats() {

    const patients =
        getPatients();

    const consultations =
        getConsultations();


    const totalPatients =
        document.getElementById(
            "totalPatients"
        );

    const totalConsultations =
        document.getElementById(
            "totalConsultations"
        );

    const todayPatients =
        document.getElementById(
            "todayPatients"
        );


    if (totalPatients) {

        totalPatients.textContent =
            patients.length;

    }


    if (totalConsultations) {

        totalConsultations.textContent =
            consultations.length;

    }


    if (todayPatients) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const count =
            patients.filter(
                function (patient) {

                    return (
                        patient.registeredDate ===
                        today
                    );

                }
            ).length;


        todayPatients.textContent =
            count;

    }

}


// ========================================
// DASHBOARD PATIENT SEARCH
// ========================================

const searchPatient =
    document.getElementById(
        "searchPatient"
    );


if (searchPatient) {

    searchPatient.addEventListener(
        "input",
        function () {

            const searchValue =
                searchPatient.value
                    .toLowerCase()
                    .trim();


            const filteredPatients =
                getPatients().filter(
                    function (patient) {

                        return (

                            String(patient.name || "")
                                .toLowerCase()
                                .includes(searchValue) ||

                            String(patient.id || "")
                                .toLowerCase()
                                .includes(searchValue)

                        );

                    }
                );


            displayPatients(
                filteredPatients
            );

        }
    );

}


// ========================================
// LOAD DASHBOARD
// ========================================

if (currentPage === "dashboard.html") {

    displayPatients(
        getPatients()
    );

    updateDashboardStats();

}


// ========================================
// CONSULTATION PATIENT SEARCH
// ========================================

const patientSearchInput =
    document.getElementById(
        "patientSearchInput"
    );

const patientDatalist =
    document.getElementById(
        "patientDatalist"
    );


function loadPatientOptions() {

    if (
        !patientSearchInput ||
        !patientDatalist
    ) {
        return;
    }


    const patients =
        getPatients();


    patientDatalist.innerHTML = "";


    patients.forEach(
        function (patient) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                `${patient.name} (${patient.id})`;


            patientDatalist.appendChild(
                option
            );

        }
    );

}


function findPatientFromInput(value) {

    const query =
        value.trim().toLowerCase();


    if (!query) {
        return null;
    }


    const patients =
        getPatients();


    return patients.find(
        function (patient) {

            return (

                String(patient.id)
                    .toLowerCase() ===
                query ||

                String(patient.name)
                    .toLowerCase() ===
                query ||

                `${patient.name} (${patient.id})`
                    .toLowerCase() ===
                query

            );

        }
    ) || null;

}


function selectPatientFromSearch() {

    if (!patientSearchInput) {
        return;
    }


    const value =
        patientSearchInput.value.trim();


    if (!value) {

        selectedPatientId = null;

        localStorage.removeItem(
            "selectedPatientId"
        );

        showSelectedPatient(null);

        return;
    }


    const patient =
        findPatientFromInput(value);


    if (patient) {

        selectedPatientId =
            patient.id;


        localStorage.setItem(
            "selectedPatientId",
            patient.id
        );


        showSelectedPatient(
            patient.id
        );


        loadConsultationHistory(
            patient.id
        );

    }

}


if (patientSearchInput) {

    patientSearchInput.addEventListener(
        "input",
        selectPatientFromSearch
    );

    patientSearchInput.addEventListener(
        "change",
        selectPatientFromSearch
    );

}


// ========================================
// SHOW SELECTED PATIENT
// ========================================

function showSelectedPatient(patientId) {

    const patientInfo =
        document.getElementById(
            "selectedPatientInfo"
        );


    if (!patientInfo) {
        return;
    }


    if (!patientId) {

        patientInfo.innerHTML = `

            <h2>Patient Details</h2>

            <p>
                Search for a patient using their
                Name or ID to view history.
            </p>

        `;


        loadConsultationHistory(null);

        return;
    }


    const patient =
        getPatients().find(
            function (item) {
                return item.id === patientId;
            }
        );


    if (!patient) {

        patientInfo.innerHTML = `

            <h2>Patient Not Found</h2>

            <p>
                No patient record found matching your query.
            </p>

        `;


        loadConsultationHistory(null);

        return;
    }


    patientInfo.innerHTML = `

        <h2>${patient.name}</h2>

        <p>
            <strong>Patient ID:</strong>
            ${patient.id}
        </p>

        <p>
            <strong>Age:</strong>
            ${patient.age}
        </p>

        <p>
            <strong>Gender:</strong>
            ${patient.gender}
        </p>

        <p>
            <strong>Phone:</strong>
            ${patient.phone || "N/A"}
        </p>

    `;

}


// ========================================
// CONSULTATION PERMISSIONS
// ========================================

function enforceConsultationPermissions() {

    const user =
        getCurrentUser();


    const userRole =
        user
            ? String(user.role).toLowerCase()
            : "";


    if (userRole === "doctor") {
        return;
    }


    const consultationFormElement =
        document.getElementById(
            "consultationForm"
        );


    if (!consultationFormElement) {
        return;
    }


    const textareas =
        consultationFormElement
            .querySelectorAll(
                "textarea"
            );


    const buttons =
        consultationFormElement
            .querySelectorAll(
                "button"
            );


    textareas.forEach(
        function (element) {

            element.readOnly = true;

            element.placeholder =
                "Read only (Doctor access required to edit)";

            element.style.backgroundColor =
                "#f8fafc";

            element.style.cursor =
                "not-allowed";

        }
    );


    buttons.forEach(
        function (button) {

            button.disabled = true;

            button.style.opacity =
                "0.5";

            button.style.cursor =
                "not-allowed";

        }
    );

}


// ========================================
// AI STRUCTURE BUTTON
// ========================================

const aiStructureBtn =
    document.getElementById(
        "aiStructureBtn"
    );


if (aiStructureBtn) {

    aiStructureBtn.type = "button";


    aiStructureBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const chiefComplaintInput =
                document.getElementById(
                    "chiefComplaint"
                );

            const presentIllnessInput =
                document.getElementById(
                    "presentIllness"
                );


            if (!chiefComplaintInput) {
                return;
            }


            const complaint =
                chiefComplaintInput.value.trim();


            const illness =
                presentIllnessInput
                    ? presentIllnessInput.value.trim()
                    : "";


            if (!complaint) {

                alert(
                    "Enter a chief complaint first."
                );

                return;
            }


            const aiComplaint =
                document.getElementById(
                    "aiComplaint"
                );

            const aiDuration =
                document.getElementById(
                    "aiDuration"
                );

            const aiSymptoms =
                document.getElementById(
                    "aiSymptoms"
                );

            const aiResultCard =
                document.getElementById(
                    "aiResultCard"
                );


            if (aiComplaint) {

                aiComplaint.textContent =
                    complaint;

            }


            if (aiDuration) {

                aiDuration.textContent =
                    extractDuration(illness);

            }


            if (aiSymptoms) {

                aiSymptoms.textContent =
                    "Review manually";

            }


            if (aiResultCard) {

                aiResultCard.style.display =
                    "block";

            }

        }
    );

}


// ========================================
// EXTRACT DURATION
// ========================================

function extractDuration(text) {

    const match =
        String(text).match(
            /(\d+\s*(day|days|week|weeks|month|months|year|years))/i
        );


    return match
        ? match[0]
        : "Not detected";

}


// ========================================
// SAVE CONSULTATION
// ========================================

const consultationForm =
    document.getElementById(
        "consultationForm"
    );


if (consultationForm) {

    consultationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            const userRole =
                user
                    ? String(user.role).toLowerCase()
                    : "";


            if (userRole !== "doctor") {

                alert(
                    "Permission denied. Only Doctors can save consultations."
                );

                return;
            }


            if (!selectedPatientId) {

                alert(
                    "Please search and select a valid patient first."
                );

                return;
            }


            const patientExists =
                getPatients().some(
                    function (patient) {

                        return (
                            patient.id ===
                            selectedPatientId
                        );

                    }
                );


            if (!patientExists) {

                alert(
                    "Selected patient no longer exists."
                );

                selectedPatientId = null;

                return;
            }


            const chiefComplaintInput =
                document.getElementById(
                    "chiefComplaint"
                );


            const chiefComplaint =
                chiefComplaintInput
                    ? chiefComplaintInput.value.trim()
                    : "";


            if (!chiefComplaint) {

                alert(
                    "Please enter the chief complaint."
                );

                return;
            }


            const consultation = {

                id:
                    generateConsultationId(),

                patientId:
                    selectedPatientId,

                doctorId:
                    user.id,

                doctorName:
                    user.name,

                date:
                    new Date()
                        .toLocaleDateString(),

                chiefComplaint:
                    chiefComplaint,

                presentIllness:
                    (
                        document.getElementById(
                            "presentIllness"
                        )?.value || ""
                    ).trim(),

                medicalHistory:
                    (
                        document.getElementById(
                            "medicalHistory"
                        )?.value || ""
                    ).trim(),

                familyHistory:
                    (
                        document.getElementById(
                            "familyHistory"
                        )?.value || ""
                    ).trim(),

                physicalExamination:
                    (
                        document.getElementById(
                            "physicalExamination"
                        )?.value || ""
                    ).trim(),

                doctorNotes:
                    (
                        document.getElementById(
                            "doctorNotes"
                        )?.value || ""
                    ).trim()

            };


            const consultations =
                getConsultations();


            consultations.push(
                consultation
            );


            saveConsultations(
                consultations
            );


            alert(
                "Consultation saved successfully."
            );


            consultationForm.reset();


            const patient =
                getPatients().find(
                    function (item) {

                        return (
                            item.id ===
                            selectedPatientId
                        );

                    }
                );


            if (
                patient &&
                patientSearchInput
            ) {

                patientSearchInput.value =
                    `${patient.name} (${patient.id})`;

            }


            showSelectedPatient(
                selectedPatientId
            );


            loadConsultationHistory(
                selectedPatientId
            );


            updateDashboardStats();

        }
    );

}


// ========================================
// CONSULTATION HISTORY
// ========================================

function loadConsultationHistory(patientId) {

    const historyContainer =
        document.getElementById(
            "consultationHistory"
        );


    if (!historyContainer) {
        return;
    }


    if (!patientId) {

        historyContainer.innerHTML = `

            <p class="empty-message">
                Search for a patient to view their consultation history.
            </p>

        `;

        return;
    }


    const patientConsultations =
        getConsultations().filter(
            function (consultation) {

                return (
                    consultation.patientId ===
                    patientId
                );

            }
        );


    historyContainer.innerHTML = "";


    if (
        patientConsultations.length === 0
    ) {

        historyContainer.innerHTML = `

            <p class="empty-message">
                No previous consultations found for this patient.
            </p>

        `;

        return;
    }


    const user =
        getCurrentUser();


    const userRole =
        user
            ? String(user.role).toLowerCase()
            : "";


    const isDoctor =
        userRole === "doctor";

    const isReceptionist =
        userRole === "receptionist";


    patientConsultations
        .slice()
        .reverse()
        .forEach(
            function (consultation) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "history-item";


                const doctorName =
                    consultation.doctorName ||
                    "Not available";


                const deleteButton =
                    isDoctor
                        ? `
                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteConsultation(
                                    '${consultation.id}',
                                    '${patientId}'
                                )"
                            >
                                Delete
                            </button>
                        `
                        : "";


                if (isReceptionist) {

                    item.innerHTML = `

                        <div class="consultation-header">

                            <h3>
                                Consultation - ${consultation.date}
                            </h3>

                        </div>

                        <p>
                            <strong>Doctor:</strong>
                            Dr. ${doctorName}
                        </p>

                        <p>
                            <strong>Complaint:</strong>
                            ${consultation.chiefComplaint}
                        </p>

                        <p>
                            <em>
                                Detailed clinical notes hidden
                                (Receptionist Access)
                            </em>
                        </p>

                    `;

                } else {

                    item.innerHTML = `

                        <div class="consultation-header">

                            <h3>
                                Consultation - ${consultation.date}
                            </h3>

                            ${deleteButton}

                        </div>

                        <p>
                            <strong>Doctor:</strong>
                            Dr. ${doctorName}
                        </p>

                        <p>
                            <strong>Complaint:</strong>
                            ${consultation.chiefComplaint}
                        </p>

                        <p>
                            <strong>Present Illness:</strong>
                            ${consultation.presentIllness || "N/A"}
                        </p>

                        <p>
                            <strong>Medical History:</strong>
                            ${consultation.medicalHistory || "N/A"}
                        </p>

                        <p>
                            <strong>Family History:</strong>
                            ${consultation.familyHistory || "N/A"}
                        </p>

                        <p>
                            <strong>Physical Examination:</strong>
                            ${consultation.physicalExamination || "N/A"}
                        </p>

                        <p>
                            <strong>Doctor Notes:</strong>
                            ${consultation.doctorNotes || "N/A"}
                        </p>

                    `;

                }


                historyContainer.appendChild(
                    item
                );

            }
        );

}


// ========================================
// DELETE CONSULTATION
// ========================================

function deleteConsultation(
    consultationId,
    patientId
) {

    const user =
        getCurrentUser();


    if (
        !user ||
        String(user.role).toLowerCase() !== "doctor"
    ) {

        alert(
            "Permission denied. Only Doctors can delete consultations."
        );

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to delete this consultation?"
    );


    if (!confirmed) {
        return;
    }


    const updatedConsultations =
        getConsultations().filter(
            function (consultation) {

                return (
                    consultation.id !==
                    consultationId
                );

            }
        );


    saveConsultations(
        updatedConsultations
    );


    alert(
        "Consultation deleted successfully."
    );


    loadConsultationHistory(
        patientId
    );


    updateDashboardStats();

}


// ========================================
// ADD STAFF
// ========================================

const staffForm =
    document.getElementById(
        "staffForm"
    );


if (staffForm) {

    staffForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (
                !user ||
                String(user.role).toLowerCase() !== "admin"
            ) {

                alert(
                    "Permission denied. Only Admins can add staff."
                );

                return;
            }


            const name =
                (
                    document.getElementById(
                        "staffName"
                    )?.value || ""
                ).trim();


            const email =
                (
                    document.getElementById(
                        "staffEmail"
                    )?.value || ""
                ).trim();


            const phone =
                (
                    document.getElementById(
                        "staffPhone"
                    )?.value || ""
                ).trim();


            const dateOfJoining =
                (
                    document.getElementById(
                        "staffDate"
                    )?.value || ""
                );


            const role =
                (
                    document.getElementById(
                        "staffRole"
                    )?.value || ""
                )
                    .trim()
                    .toLowerCase();


            if (
                !name ||
                !email ||
                !phone ||
                !dateOfJoining ||
                !role
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            if (
                !["doctor", "receptionist"]
                    .includes(role)
            ) {

                alert(
                    "Only Doctor or Receptionist accounts can be created here."
                );

                return;
            }


            const staff =
                getStaff();


            const emailExists =
                staff.some(
                    function (member) {

                        return (
                            member.email &&
                            member.email
                                .toLowerCase() ===
                            email.toLowerCase()
                        );

                    }
                );


            if (emailExists) {

                alert(
                    "A staff account with this email already exists."
                );

                return;
            }


            const newStaff = {

                id:
                    generateStaffId(),

                name:
                    name,

                email:
                    email,

                phone:
                    phone,

                dateOfJoining:
                    dateOfJoining,

                role:
                    role,

                password:
                    getDefaultPassword(role)

            };


            staff.push(
                newStaff
            );


            saveStaff(
                staff
            );


            alert(
                `Staff member added successfully.\n\nDefault Password: ${getDefaultPassword(role)}`
            );


            window.location.href =
                "manage-staff.html";

        }
    );

}


// ========================================
// STAFF TABLE
// ========================================

const staffTableBody =
    document.getElementById(
        "staffTableBody"
    );


function displayStaff(staffList) {

    if (!staffTableBody) {
        return;
    }


    staffTableBody.innerHTML = "";


    if (staffList.length === 0) {

        staffTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-row"
                >
                    No staff members found.
                </td>

            </tr>

        `;

        return;
    }


    staffList.forEach(
        function (member) {

            const row =
                document.createElement(
                    "tr"
                );


            const isAdmin =
                member.role &&
                String(member.role)
                    .toLowerCase() === "admin";


            const actionButtons =
                isAdmin
                    ? `
                        <span class="no-action">
                            Protected
                        </span>
                    `
                    : `
                        <div class="staff-actions">

                            <button
                                type="button"
                                class="edit-btn"
                                onclick="editStaff('${member.id}')"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="reset-btn"
                                onclick="resetStaffPassword('${member.id}')"
                            >
                                Reset Password
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteStaff('${member.id}')"
                            >
                                Delete
                            </button>

                        </div>
                    `;


            row.innerHTML = `

                <td>${member.name || "N/A"}</td>

                <td>${member.email || "N/A"}</td>

                <td>${member.phone || "N/A"}</td>

                <td>
                    ${formatDate(member.dateOfJoining)}
                </td>

                <td>
                    ${formatRole(member.role)}
                </td>

                <td>
                    ${actionButtons}
                </td>

            `;


            staffTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// EDIT STAFF
// ========================================

function editStaff(staffId) {

    const user =
        getCurrentUser();


    if (
        !user ||
        String(user.role).toLowerCase() !== "admin"
    ) {

        alert(
            "Permission denied. Only Admins can edit staff."
        );

        return;
    }


    window.location.href =
        "edit-staff.html?id=" +
        encodeURIComponent(staffId);

}


// ========================================
// LOAD EDIT STAFF PAGE
// ========================================

function loadEditStaffPage() {

    const editStaffFormElement =
        document.getElementById(
            "editStaffForm"
        );


    if (!editStaffFormElement) {
        return;
    }


    const user =
        getCurrentUser();


    if (
        !user ||
        String(user.role).toLowerCase() !== "admin"
    ) {

        alert(
            "Permission denied."
        );

        window.location.href =
            "dashboard.html";

        return;
    }


    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const staffId =
        urlParams.get("id");


    if (!staffId) {

        alert(
            "Staff member not selected."
        );

        window.location.href =
            "manage-staff.html";

        return;
    }


    const member =
        getStaff().find(
            function (item) {
                return item.id === staffId;
            }
        );


    if (!member) {

        alert(
            "Staff member not found."
        );

        window.location.href =
            "manage-staff.html";

        return;
    }


    if (
        String(member.role)
            .toLowerCase() === "admin"
    ) {

        alert(
            "Admin account details cannot be edited from this page."
        );

        window.location.href =
            "manage-staff.html";

        return;
    }


    const nameInput =
        document.getElementById(
            "editStaffName"
        );

    const emailInput =
        document.getElementById(
            "editStaffEmail"
        );

    const phoneInput =
        document.getElementById(
            "editStaffPhone"
        );

    const dateInput =
        document.getElementById(
            "editStaffDate"
        );

    const roleInput =
        document.getElementById(
            "editStaffRole"
        );


    if (nameInput) {
        nameInput.value =
            member.name || "";
    }

    if (emailInput) {
        emailInput.value =
            member.email || "";
    }

    if (phoneInput) {
        phoneInput.value =
            member.phone || "";
    }

    if (dateInput) {
        dateInput.value =
            member.dateOfJoining || "";
    }

    if (roleInput) {
        roleInput.value =
            member.role || "";
    }

}


// ========================================
// EDIT STAFF SUBMIT
// ========================================

const editStaffForm =
    document.getElementById(
        "editStaffForm"
    );


if (editStaffForm) {

    editStaffForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (
                !user ||
                String(user.role).toLowerCase() !== "admin"
            ) {

                alert(
                    "Permission denied."
                );

                return;
            }


            const urlParams =
                new URLSearchParams(
                    window.location.search
                );


            const staffId =
                urlParams.get("id");


            const staff =
                getStaff();


            const staffIndex =
                staff.findIndex(
                    function (member) {
                        return member.id === staffId;
                    }
                );


            if (staffIndex === -1) {

                alert(
                    "Staff member not found."
                );

                return;
            }


            const member =
                staff[staffIndex];


            const name =
                (
                    document.getElementById(
                        "editStaffName"
                    )?.value || ""
                ).trim();


            const email =
                (
                    document.getElementById(
                        "editStaffEmail"
                    )?.value || ""
                ).trim();


            const phone =
                (
                    document.getElementById(
                        "editStaffPhone"
                    )?.value || ""
                ).trim();


            const dateOfJoining =
                (
                    document.getElementById(
                        "editStaffDate"
                    )?.value || ""
                );


            const role =
                (
                    document.getElementById(
                        "editStaffRole"
                    )?.value || ""
                )
                    .toLowerCase();


            if (
                !name ||
                !email ||
                !phone ||
                !dateOfJoining ||
                !role
            ) {

                alert(
                    "Please fill in all fields."
                );

                return;
            }


            const duplicateEmail =
                staff.some(
                    function (item, index) {

                        return (

                            index !==
                            staffIndex &&

                            item.email &&

                            item.email
                                .toLowerCase() ===
                            email.toLowerCase()

                        );

                    }
                );


            if (duplicateEmail) {

                alert(
                    "Another staff member already uses this email."
                );

                return;
            }


            staff[staffIndex] = {

                ...member,

                name:
                    name,

                email:
                    email,

                phone:
                    phone,

                dateOfJoining:
                    dateOfJoining,

                role:
                    role

            };


            saveStaff(
                staff
            );


            alert(
                "Staff details updated successfully."
            );


            window.location.href =
                "manage-staff.html";

        }
    );

}


// ========================================
// RESET STAFF PASSWORD
// ========================================

function resetStaffPassword(staffId) {

    const user =
        getCurrentUser();


    if (
        !user ||
        String(user.role).toLowerCase() !== "admin"
    ) {

        alert(
            "Permission denied. Only Admins can reset passwords."
        );

        return;
    }


    const staff =
        getStaff();


    const staffIndex =
        staff.findIndex(
            function (member) {
                return member.id === staffId;
            }
        );


    if (staffIndex === -1) {

        alert(
            "Staff member not found."
        );

        return;
    }


    const member =
        staff[staffIndex];


    const confirmed =
        confirm(
            `Reset ${member.name}'s password to the default ${formatRole(member.role)} password?`
        );


    if (!confirmed) {
        return;
    }


    const defaultPassword =
        getDefaultPassword(
            member.role
        );


    staff[staffIndex].password =
        defaultPassword;


    saveStaff(
        staff
    );


    alert(
        `Password reset successfully.\n\nNew Default Password: ${defaultPassword}`
    );

}


// ========================================
// DELETE STAFF
// ========================================

function deleteStaff(staffId) {

    const user =
        getCurrentUser();


    if (
        !user ||
        String(user.role).toLowerCase() !== "admin"
    ) {

        alert(
            "Permission denied. Only Admins can delete staff."
        );

        return;
    }


    const staff =
        getStaff();


    const member =
        staff.find(
            function (item) {
                return item.id === staffId;
            }
        );


    if (!member) {

        alert(
            "Staff member not found."
        );

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${member.name}?`
        );


    if (!confirmed) {
        return;
    }


    const updatedStaff =
        staff.filter(
            function (item) {
                return item.id !== staffId;
            }
        );


    saveStaff(
        updatedStaff
    );


    alert(
        "Staff member deleted successfully."
    );


    displayStaff(
        updatedStaff
    );

}


// ========================================
// STAFF SEARCH
// ========================================

const searchStaff =
    document.getElementById(
        "searchStaff"
    );


if (searchStaff) {

    searchStaff.addEventListener(
        "input",
        function () {

            const query =
                searchStaff.value
                    .toLowerCase()
                    .trim();


            const filteredStaff =
                getStaff().filter(
                    function (member) {

                        return (

                            String(member.name || "")
                                .toLowerCase()
                                .includes(query) ||

                            String(member.email || "")
                                .toLowerCase()
                                .includes(query) ||

                            String(member.phone || "")
                                .toLowerCase()
                                .includes(query) ||

                            String(member.role || "")
                                .toLowerCase()
                                .includes(query)

                        );

                    }
                );


            displayStaff(
                filteredStaff
            );

        }
    );

}


// ========================================
// LOAD STAFF MANAGEMENT PAGE
// ========================================

if (currentPage === "manage-staff.html") {

    const user =
        getCurrentUser();


    if (
        user &&
        String(user.role).toLowerCase() === "admin"
    ) {

        displayStaff(
            getStaff()
        );

    }

}


// ========================================
// LOAD EDIT STAFF PAGE
// ========================================

if (currentPage === "edit-staff.html") {

    loadEditStaffPage();

}


// ========================================
// LOAD CONSULTATION PAGE
// ========================================

if (currentPage === "consultation.html") {

    loadPatientOptions();

    enforceConsultationPermissions();


    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const patientIdFromURL =
        urlParams.get("patient");


    if (patientIdFromURL) {

        const patient =
            getPatients().find(
                function (item) {

                    return (
                        item.id ===
                        patientIdFromURL
                    );

                }
            );


        if (patient) {

            selectedPatientId =
                patient.id;


            localStorage.setItem(
                "selectedPatientId",
                patient.id
            );


            if (patientSearchInput) {

                patientSearchInput.value =
                    `${patient.name} (${patient.id})`;

            }


            showSelectedPatient(
                patient.id
            );


            loadConsultationHistory(
                patient.id
            );

        }

    } else {

        const savedPatientId =
            localStorage.getItem(
                "selectedPatientId"
            );


        if (savedPatientId) {

            const patient =
                getPatients().find(
                    function (item) {

                        return (
                            item.id ===
                            savedPatientId
                        );

                    }
                );


            if (patient) {

                selectedPatientId =
                    patient.id;


                if (patientSearchInput) {

                    patientSearchInput.value =
                        `${patient.name} (${patient.id})`;

                }


                showSelectedPatient(
                    patient.id
                );


                loadConsultationHistory(
                    patient.id
                );

            }

        }

    }

}


// ========================================
// ADAPTIVE SIDEBAR
// ========================================

const sidebarToggleBtn =
    document.getElementById(
        "sidebarToggleBtn"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );


if (
    sidebarToggleBtn &&
    sidebar
) {

    sidebarToggleBtn.type =
        "button";


    sidebarToggleBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                window.innerWidth <= 650
            ) {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            } else {

                document.body.classList.toggle(
                    "sidebar-collapsed"
                );

            }

        }
    );

}


// ========================================
// CLOSE MOBILE SIDEBAR WHEN LINK IS CLICKED
// ========================================

const sidebarLinks =
    document.querySelectorAll(
        ".sidebar-menu a"
    );


sidebarLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 650
                ) {

                    sidebar?.classList.remove(
                        "mobile-open"
                    );

                }

            }
        );

    }
);


// ========================================
// END
// ========================================

console.log(
    "JeevanSetu JavaScript initialized successfully."
);

