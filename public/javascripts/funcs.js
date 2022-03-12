let password = document.getElementById("password")
    , confirm_password = document.getElementById("confirm_password");

function validatePassword(){             // password validation function on password window
    if (password.value.length < 8)          // if pasword lenghts is smaller than 8
        password.setCustomValidity("Password must be at least 8 characters");
    else if(password.value !== confirm_password.value)      // if passwords don't match
        password.setCustomValidity("Passwords Don't Match");
    else
        password.setCustomValidity('');     // if validation passes, clear errors
}


password.onkeyup = validatePassword;         // validate password on keyup
confirm_password.onkeyup = validatePassword;   // validate confirmation password on keyup

(function () {

    document.addEventListener('DOMContentLoaded', function () {     // validate password on click
        document.getElementById("save_button").addEventListener("click", validatePassword)
    }, false);

})();