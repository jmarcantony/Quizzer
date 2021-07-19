function checkMatch() {
    const password = document.getElementById("password").value;
    const retypedPassword = document.getElementById("retyped_password").value;
    const submit = document.getElementById("submit");

    if (retypedPassword === password) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
}
