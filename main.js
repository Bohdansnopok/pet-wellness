document.addEventListener("DOMContentLoaded", () => {
  const accordionButtons = document.querySelectorAll(
    ".accordion__item__dark-bg",
  );

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      if (!answer || !answer.classList.contains("accordion__item__answer"))
        return;

      button.classList.toggle("active");
      answer.classList.toggle("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const minusBtn = document.getElementById("minus");
  const plusBtn = document.getElementById("plus");
  const inputField = document.getElementById("quantity");

  minusBtn.addEventListener("click", () => {
    let currentValue = parseInt(inputField.value);
    if (currentValue > inputField.min) {
      inputField.value = currentValue - 1;
    }
  });

  plusBtn.addEventListener("click", () => {
    let currentValue = parseInt(inputField.value);
    if (currentValue < inputField.max) {
      inputField.value = currentValue + 1;
    }
  });
});

let popUp = document.querySelector(".order-pop-up");
let popUpOverlay = document.querySelector(".overlay");
let popUpOpenBtn = document.querySelectorAll(".btn");
let popUpCloseBtn = document.querySelector(".order-pop-up__crosshair");

function openPopUp() {
  popUp.classList.add("active");
  popUpOverlay.classList.add("active");
  document.body.classList.add("modal-open");
}

function closePopUp() {
  popUp.classList.remove("active");
  popUpOverlay.classList.remove("active");
  document.body.classList.remove("modal-open");
}

popUpOpenBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    openPopUp();
  });
});

popUpOverlay.addEventListener("click", closePopUp);

popUpCloseBtn.addEventListener("click", (event) => {
  event.preventDefault();
  closePopUp();
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Дані про товари
  const productsData = [
    {
      id: 0,
      name: "1 дифузор + 2 змінні картриджі",
      price: 890,
      oldPrice: 1412,
    },
    {
      id: 1,
      name: "2 дифузори + 4 змінні картриджі",
      price: 1440,
      oldPrice: 2880,
    },
    {
      id: 2,
      name: "Додаткові змінні картриджі",
      price: 390,
      oldPrice: 560,
    },
  ];

  // 2. Стан кошика
  let state = {
    mainProductIndex: 0,
    extraProductAdded: false,
    extraQuantity: 1,
  };

  // 3. Селектори
  const cards = document.querySelectorAll(
    ".order-pop-up__improvements__improvement",
  );
  const basketContainer = document.querySelector(".order-pop-up__products");
  const totalPriceElement = document.querySelector(
    ".order-pop-up__to-pay .new-price",
  );

  // Елементи в 3-й картці для динамічного оновлення ціни
  const extraCardPrice = cards[2].querySelector(".new-price");

  const btnMinus = document.getElementById("minus");
  const btnPlus = document.getElementById("plus");
  const inputQty = document.getElementById("quantity");

  // --- ФУНКЦІЇ ---

  function formatPrice(price) {
    return `₴ ${price.toLocaleString()}`;
  }

  function calculateDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return "";
    return `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
  }

  function syncCardPrices() {
    cards.forEach((card, index) => {
      const product = productsData[index];
      const cardNewPrice = card.querySelector(".new-price");
      const cardOldPrice = card.querySelector(".old-price");
      const cardDiscount = card.querySelector(".discount");

      if (!product || !cardNewPrice) return;

      if (index === 2) {
        const currentPrice = product.price * state.extraQuantity;
        const currentOldPrice = product.oldPrice * state.extraQuantity;

        cardNewPrice.textContent = formatPrice(currentPrice);
        if (cardOldPrice) {
          cardOldPrice.textContent = formatPrice(currentOldPrice);
        }
        if (cardDiscount) {
          cardDiscount.textContent = calculateDiscount(
            product.price,
            product.oldPrice,
          );
        }
        return;
      }

      if (!cardOldPrice) return;
      cardNewPrice.textContent = formatPrice(product.price);
      cardOldPrice.textContent = formatPrice(product.oldPrice);
      if (cardDiscount) {
        cardDiscount.textContent = calculateDiscount(product.price, product.oldPrice);
      }
    });
  }

  // Оновлення цін ТІЛЬКИ всередині 3-ї картки (візуально при кліку на +/-)
  function updateExtraCardDisplay() {
    const basePrice = productsData[2].price;
    const baseOldPrice = productsData[2].oldPrice;
    const extraCardOldPrice = cards[2].querySelector(".old-price");
    const extraCardDiscount = cards[2].querySelector(".discount");

    extraCardPrice.textContent = formatPrice(basePrice * state.extraQuantity);
    if (extraCardOldPrice) {
      extraCardOldPrice.textContent = formatPrice(
        baseOldPrice * state.extraQuantity,
      );
    }
    if (extraCardDiscount) {
      extraCardDiscount.textContent = calculateDiscount(basePrice, baseOldPrice);
    }
  }

  // Головна функція оновлення всього поп-апу
  function updateUI() {
    let totalSum = 0;
    let htmlContent = "";

    // 1. Основний товар
    if (state.mainProductIndex !== null) {
      const mainProd = productsData[state.mainProductIndex];
      totalSum += mainProd.price;
      htmlContent += generateProductHTML(
        mainProd.name,
        mainProd.price,
        mainProd.oldPrice,
      );
    }

    // 2. Додатковий товар
    if (state.extraProductAdded) {
      const extraProd = productsData[2];
      const currentExtraPrice = extraProd.price * state.extraQuantity;
      const currentExtraOldPrice = extraProd.oldPrice * state.extraQuantity;
      totalSum += currentExtraPrice;
      htmlContent += generateProductHTML(
        `${extraProd.name} (x${state.extraQuantity})`,
        currentExtraPrice,
        currentExtraOldPrice,
      );
    }

    // Рендер списку та фінальної суми
    basketContainer.innerHTML =
      htmlContent ||
      '<div style="color: gray; padding: 10px 0;">Оберіть товари для замовлення</div>';
    totalPriceElement.textContent = formatPrice(totalSum);

    // Кнопки
    cards.forEach((card, index) => {
      const btn = card.querySelector(".btn");
      if (index < 2) {
        const isActive = index === state.mainProductIndex;
        btn.textContent = isActive ? "Вибрано" : "Вибрати";
        btn.style.backgroundColor = isActive ? "#d4a017" : "";
      } else {
        btn.textContent = state.extraProductAdded ? "Вибрано" : "Вибрати";
        btn.style.backgroundColor = state.extraProductAdded ? "#d4a017" : "";
      }
    });

    syncCardPrices();
    updateExtraCardDisplay();
  }

  function generateProductHTML(name, price, oldPrice = null) {
    const oldPriceHTML =
      oldPrice !== null
        ? `<div class="old-price" style="text-decoration: line-through; color: #999; font-size: 0.9em;">₴ ${oldPrice.toLocaleString()}</div>`
        : "";
    const discountHTML =
      oldPrice !== null
        ? `<div class="discount">${calculateDiscount(price, oldPrice)}</div>`
        : "";

    return `
            <div class="order-pop-up__products__item flex-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px;">
                <div class="product">${name}</div>
                <div class="prices" style="text-align: right;">
                    <div class="new-price" style="font-weight: bold;">₴ ${price.toLocaleString()}</div>
                    ${oldPriceHTML}
                    ${discountHTML}
                </div>
            </div>
        `;
  }

  // --- ОБРОБНИКИ ---

  cards.forEach((card, index) => {
    card.querySelector(".btn").onclick = () => {
      if (index < 2) {
        state.mainProductIndex =
          state.mainProductIndex === index ? null : index;
      } else {
        state.extraProductAdded = !state.extraProductAdded;
      }
      updateUI();
    };
  });

  // Кнопки + та - працюють завжди
  btnPlus.onclick = () => {
    state.extraQuantity++;
    inputQty.value = state.extraQuantity;
    // Оновлюємо цифри в картці незалежно від того, чи додано товар
    updateExtraCardDisplay();
    // Якщо товар вже в кошику — оновлюємо і нижній блок
    if (state.extraProductAdded) updateUI();
  };

  btnMinus.onclick = () => {
    if (state.extraQuantity > 1) {
      state.extraQuantity--;
      inputQty.value = state.extraQuantity;
      updateExtraCardDisplay();
      if (state.extraProductAdded) updateUI();
    }
  };

  inputQty.onchange = (e) => {
    state.extraQuantity = Math.max(1, parseInt(e.target.value) || 1);
    updateExtraCardDisplay();
    if (state.extraProductAdded) updateUI();
  };

  // Ініт
  updateUI();
});
