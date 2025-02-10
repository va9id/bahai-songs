import { attachValidationEvents, checkFormValidity, sanitizeInput, sendEmail } from "/src/js/form.js";

function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    form.querySelectorAll("input, select, textarea").forEach((field) => {
        field.value = sanitizeInput(field.value);
    });

    const name = document.getElementById("contact-form-name").value.trim();
    const subject = document.getElementById("contact-form-subject").value;
    const msg = document.getElementById("contact-form-msg").value.trim();

    const body = `${msg}\n\nRegards,\n${name}`;
    sendEmail(subject, body);
}

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const submitButton = document.getElementById("contact-form-btn");
    attachValidationEvents(form, submitButton);
    form.addEventListener("submit", handleContactFormSubmit);
    checkFormValidity(form, submitButton);
}

// contact form validation
document.addEventListener("DOMContentLoaded", initContactForm);