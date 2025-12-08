// utils
const EMAIL_RECEPIENT = "bahaisongscontact@gmail.com";

export function sanitizeInput(value) {
	const tempDiv = document.createElement("div");
	tempDiv.textContent = value;
	return tempDiv.innerHTML;
}

export function checkFormValidity(form, submitButton) {
	let isFormValid = true;

	form.querySelectorAll(
		"input[required], select[required], textarea[required]"
	).forEach((field) => {
		if (field.dataset.touched && !field.checkValidity()) {
			field.classList.add("is-invalid");
			isFormValid = false;
		} else if (field.dataset.touched) {
			field.classList.remove("is-invalid");
		}
	});

	submitButton.disabled = !isFormValid;
}

export function attachValidationEvents(form, submitButton) {
	form.querySelectorAll(
		"input[required], select[required], textarea[required]"
	).forEach((field) => {
		field.addEventListener("input", function () {
			field.dataset.touched = true;
			field.value = sanitizeInput(field.value);
			checkFormValidity(form, submitButton);
		});

		field.addEventListener("blur", function () {
			field.dataset.touched = true;
			field.value = sanitizeInput(field.value);
			checkFormValidity(form, submitButton);
		});
	});
}

export function sendEmail(subject, body) {
	const mailToLink = `mailto:${EMAIL_RECEPIENT}?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(body)}`;
	window.location.href = mailToLink;
}
