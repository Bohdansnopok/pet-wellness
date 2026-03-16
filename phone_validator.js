// Допустимі коди операторів України
var validOperatorCodes = [
  "050",
  "063",
  "066",
  "067",
  "068",
  "073",
  "091",
  "092",
  "093",
  "094",
  "095",
  "096",
  "097",
  "098",
  "099",
];

// Знаходимо елементи форми
var orderForm = document.querySelector(".order-pop-up");
var nameInput = document.querySelectorAll(
  ".order-pop-up__form__label__input",
)[0];
var phoneInput = document.querySelectorAll(
  ".order-pop-up__form__label__input",
)[1];

// Додаємо контейнер для помилки телефону, якщо його немає
if (phoneInput && !document.getElementById("phoneError")) {
  var errorDiv = document.createElement("div");
  errorDiv.id = "phoneError";
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.display = "none";
  errorDiv.style.marginTop = "5px";
  phoneInput.parentNode.appendChild(errorDiv);
}

function normalizePhoneNumber(phone) {
  var digits = phone.replace(/\D/g, "");
  if (digits.startsWith("380")) return digits;
  if (digits.startsWith("0")) return "38" + digits;
  if (digits.length === 9) return "38" + digits;
  return digits;
}

function validatePhoneFull(phone) {
  var digits = phone.replace(/\D/g, "");
  if (digits.length !== 12) {
    return { valid: false, error: "Номер має бути +38 і 10 цифр" };
  }
  var operatorCode = digits.substr(2, 3);
  if (!validOperatorCodes.includes(operatorCode)) {
    return { valid: false, error: "Невірний код оператора: " + operatorCode };
  }
  return { valid: true, error: "" };
}

function showPhoneError(message) {
  var errorEl = document.getElementById("phoneError");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
  phoneInput.style.borderColor = "red";
}

function clearPhoneError() {
  var errorEl = document.getElementById("phoneError");
  if (errorEl) errorEl.style.display = "none";
  phoneInput.style.borderColor = "";
}

function formatPhoneNumber(input) {
  var cursorPos = input.selectionStart;
  var oldLength = input.value.length;
  var digits = input.value.replace(/\D/g, "");
  if (digits.length > 12) digits = digits.substring(0, 12);

  var newValue = "+" + digits;
  if (newValue === "+" || newValue === "+3" || digits === "") newValue = "+38";

  input.value = newValue;
  var newPos = cursorPos + (newValue.length - oldLength);
  if (newPos < 3) newPos = 3;
  input.setSelectionRange(newPos, newPos);
}

function validateAndShowError(phone) {
  var digits = phone.replace(/\D/g, "");
  if (digits.length >= 5) {
    var operatorCode = digits.substr(2, 3);
    if (!validOperatorCodes.includes(operatorCode)) {
      showPhoneError("Код " + operatorCode + " невірний");
      return;
    }
  }
  clearPhoneError();
}

// Прив'язка подій до інпуту телефону
if (phoneInput) {
  phoneInput.value = "+38";
  phoneInput.addEventListener("input", function (e) {
    setTimeout(function () {
      formatPhoneNumber(phoneInput);
      validateAndShowError(phoneInput.value);
    }, 1);
  });

  phoneInput.addEventListener("keydown", function (e) {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      phoneInput.selectionStart <= 3
    ) {
      e.preventDefault();
    }
  });

  phoneInput.addEventListener("paste", function (e) {
    e.preventDefault();
    var paste = (e.clipboardData || window.clipboardData).getData("text");
    var digits = paste.replace(/\D/g, "");
    phoneInput.value = "+38" + digits.replace(/^38/, "").substring(0, 10);
    formatPhoneNumber(phoneInput);
    validateAndShowError(phoneInput.value);
  });
}

// Функція збору даних про товари (адаптована під вашу розмітку)
function getOrderData() {
  var items = [];
  var productElements = document.querySelectorAll(
    ".order-pop-up__products .product",
  );
  productElements.forEach(function (el) {
    items.push({
      product_name: el.textContent.trim(),
      price:
        parseInt(
          document
            .querySelector(".order-pop-up__to-pay .new-price")
            .textContent.replace(/\D/g, ""),
        ) || 0,
      qty: 1,
    });
  });
  return items;
}

// Відправка форми
if (orderForm) {
  orderForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    var phone = phoneInput.value;
    var name = nameInput.value.trim();
    var normalizedPhone = normalizePhoneNumber(phone);

    var validation = validatePhoneFull("+" + normalizedPhone);
    if (!validation.valid) {
      showPhoneError(validation.error);
      return;
    }

    if (!name) {
      alert("Будь ласка, введіть імʼя");
      return;
    }

    var items = getOrderData();
    var urlParams = new URLSearchParams(window.location.search);

    var payload = {
      first_name: name,
      phone: normalizedPhone,
      main_product: items[0] || { product_name: "Дифузор", price: 0, qty: 1 },
      additional_products: items.slice(1),
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      redtrack_clickid:
        urlParams.get("clickid") || urlParams.get("redtrack_clickid"),
    };

    // Замість старого блоку з fetch використовуйте цей:
    try {
      // Виводимо дані в консоль для перевірки (можна видалити)
      console.log("Дані замовлення готові до відправки:", payload);

      // Імітуємо успішну обробку без запиту до сервера
      // Просто перенаправляємо користувача на сторінку успіху
      window.location.href = "/";
    } catch (error) {
      console.error("Виникла помилка:", error);
      alert("Сталася помилка при обробці замовлення.");
    }
  });
}
