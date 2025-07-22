document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('otp-form');
  const otpSection = document.getElementById('otp-section');
  const otpInput = document.getElementById('otp');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const otpMsg = document.getElementById('otp-msg');

  // Send Code function
  window.sendCode = function () {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      alert("Please enter both name and email.");
      return;
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("generatedOTP", generatedCode);
    localStorage.setItem("pendingUser", JSON.stringify({ name, email }));

    alert(`Verification Code (for demo): ${generatedCode}`);
    otpSection.style.display = "block";
  };

  // Verify OTP on form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const enteredCode = otpInput.value.trim();
    const storedCode = localStorage.getItem("generatedOTP");
    const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));

    if (enteredCode === storedCode && pendingUser) {
      localStorage.setItem("user", JSON.stringify(pendingUser));
      localStorage.removeItem("pendingUser");
      localStorage.removeItem("generatedOTP");
      window.location.href = "index.html";
    } else {
      otpMsg.textContent = "Incorrect code. Try again.";
    }
  });
});
