let selectedRow = null;


// ================================
// DOM Elements
// ================================

const employeeForm = document.getElementById("employeeForm");

const employeeTable = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];

const submitBtn = document.getElementById("submitBtn");

const formTitle = document.getElementById("formTitle");

const employeeCount = document.getElementById("employeeCount");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");


// ================================
// Form Submit
// ================================

employeeForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const formData = readFormData();


    if (selectedRow === null) {

        insertNewRecord(formData);

        showToast(
            "Employee Added",
            "Employee record has been created successfully."
        );

    } else {

        updateRecord(formData);

        showToast(
            "Employee Updated",
            "Employee information has been updated successfully."
        );

    }


    resetForm();

    updateEmployeeCount();

    updateEmptyState();

});


// ================================
// Read Form Data
// ================================

function readFormData() {

    return {

        fullName:
            document.getElementById("fullName")
                .value
                .trim(),

        empCode:
            document.getElementById("empCode")
                .value
                .trim(),

        salary:
            document.getElementById("salary")
                .value
                .trim(),

        city:
            document.getElementById("city")
                .value
                .trim()
    };

}


// ================================
// Create Employee
// ================================

function insertNewRecord(data) {

    const newRow = employeeTable.insertRow();


    // Employee Name
    const nameCell = newRow.insertCell(0);

    nameCell.innerHTML = `
        <div class="employee-name">

            <div class="employee-avatar">
                ${getInitials(data.fullName)}
            </div>

            <span class="name-text">
                ${escapeHTML(data.fullName)}
            </span>

        </div>
    `;


    // Employee Code
    const codeCell = newRow.insertCell(1);

    codeCell.innerHTML = `
        <span class="emp-code">
            ${escapeHTML(data.empCode)}
        </span>
    `;


    // Salary
    const salaryCell = newRow.insertCell(2);

    salaryCell.innerHTML = `
        <span
            class="salary"
            data-salary="${escapeHTML(data.salary)}"
        >
            ${formatSalary(data.salary)}
        </span>
    `;


    // City
    const cityCell = newRow.insertCell(3);

    cityCell.innerHTML = `
        <span class="city">
            ${escapeHTML(data.city)}
        </span>
    `;


    // Actions
    const actionCell = newRow.insertCell(4);

    actionCell.innerHTML = `
        <div class="action-buttons">

            <button
                type="button"
                class="action-btn edit-btn"
                onclick="onEdit(this)"
                title="Edit Employee"
            >
                <i class="fa-solid fa-pen"></i>
            </button>

            <button
                type="button"
                class="action-btn delete-btn"
                onclick="onDelete(this)"
                title="Delete Employee"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;

}


// ================================
// Edit Employee
// ================================

function onEdit(button) {

    selectedRow =
        button.closest("tr");


    document.getElementById("fullName").value =
        selectedRow
            .querySelector(".name-text")
            .textContent
            .trim();


    document.getElementById("empCode").value =
        selectedRow
            .querySelector(".emp-code")
            .textContent
            .trim();


    document.getElementById("salary").value =
        selectedRow
            .querySelector(".salary")
            .dataset.salary;


    document.getElementById("city").value =
        selectedRow
            .querySelector(".city")
            .textContent
            .trim();


    // Change form into Edit Mode
    formTitle.textContent = "Update Employee";

    submitBtn.innerHTML = `
        <i class="fa-solid fa-check"></i>
        <span>Update Employee</span>
    `;


    document
        .querySelector(".form-card")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


// ================================
// Update Employee
// ================================

function updateRecord(data) {

    selectedRow.querySelector(".name-text").textContent =
        data.fullName;


    selectedRow.querySelector(".employee-avatar").textContent =
        getInitials(data.fullName);


    selectedRow.querySelector(".emp-code").textContent =
        data.empCode;


    const salaryElement =
        selectedRow.querySelector(".salary");


    salaryElement.textContent =
        formatSalary(data.salary);


    salaryElement.dataset.salary =
        data.salary;


    selectedRow.querySelector(".city").textContent =
        data.city;

}


// ================================
// Delete Employee
// ================================

function onDelete(button) {

    const row = button.closest("tr");

    const employeeName =
        row
            .querySelector(".name-text")
            .textContent
            .trim();


    const confirmation = confirm(
        `Are you sure you want to delete ${employeeName}?`
    );


    if (!confirmation) {
        return;
    }


    row.remove();


    resetForm();

    updateEmployeeCount();

    updateEmptyState();


    showToast(
        "Employee Deleted",
        "Employee record has been removed successfully."
    );

}


// ================================
// Reset Form
// ================================

function resetForm() {

    employeeForm.reset();

    selectedRow = null;


    formTitle.textContent =
        "Add Employee";


    submitBtn.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        <span>Add Employee</span>
    `;

}


// Listen to actual Reset button
employeeForm.addEventListener("reset", function () {

    setTimeout(() => {

        selectedRow = null;

        formTitle.textContent =
            "Add Employee";


        submitBtn.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            <span>Add Employee</span>
        `;

    }, 0);

});


// ================================
// Employee Count
// ================================

function updateEmployeeCount() {

    employeeCount.textContent =
        employeeTable.rows.length;

}


// ================================
// Empty State
// ================================

function updateEmptyState() {

    if (employeeTable.rows.length === 0) {

        document.getElementById("employeeList")
            .style.display = "none";

        emptyState.style.display = "block";

    } else {

        document.getElementById("employeeList")
            .style.display = "table";

        emptyState.style.display = "none";

    }

}


// ================================
// Search Employees
// ================================

searchInput.addEventListener("input", function () {

    const searchValue =
        this.value
            .toLowerCase()
            .trim();


    const rows =
        employeeTable.querySelectorAll("tr");


    rows.forEach(function (row) {

        const rowText =
            row.textContent.toLowerCase();


        if (rowText.includes(searchValue)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});


// ================================
// Get Employee Initials
// ================================

function getInitials(name) {

    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// ================================
// Format Salary
// ================================

function formatSalary(salary) {

    const amount =
        Number(salary);


    if (isNaN(amount)) {

        return salary;

    }


    return `Rs. ${amount.toLocaleString("en-PK")}`;

}


// ================================
// Toast Notification
// ================================

function showToast(title, message) {

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");


    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2800);

}


// ================================
// Basic HTML Protection
// ================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


// Initial page state
updateEmployeeCount();

updateEmptyState();