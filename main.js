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

popUpOpenBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    popUp.classList.toggle("active");
    popUpOverlay.classList.toggle("active");
  });
});

popUpOverlay.addEventListener('click', () => {
    popUp.classList.remove("active");
    popUpOverlay.classList.remove("active");
})

document.addEventListener("DOMContentLoaded", () => {
  // 1. Дані про товари
  const productsData = [
    {
      id: 0,
      name: "1 дифузор + 2 змінні картриджі",
      price: 790,
      oldPrice: 990,
    },
    {
      id: 1,
      name: "2 дифузори + 4 змінні картриджі",
      price: 1490,
      oldPrice: 1980,
    },
    { id: 2, name: "Додаткові змінні картриджі", price: 790, oldPrice: 990 },
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
  const extraCardOldPrice = cards[2].querySelector(".old-price");

  const btnMinus = document.getElementById("minus");
  const btnPlus = document.getElementById("plus");
  const inputQty = document.getElementById("quantity");

  // --- ФУНКЦІЇ ---

  // Оновлення цін ТІЛЬКИ всередині 3-ї картки (візуально при кліку на +/-)
  function updateExtraCardDisplay() {
    const basePrice = productsData[2].price;
    const baseOldPrice = productsData[2].oldPrice;

    extraCardPrice.textContent = `₴ ${(basePrice * state.extraQuantity).toLocaleString()}`;
    extraCardOldPrice.textContent = `₴ ${(baseOldPrice * state.extraQuantity).toLocaleString()}`;
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
    totalPriceElement.textContent = `₴ ${totalSum.toLocaleString()}`;

    // Кнопки
    cards.forEach((card, index) => {
      const btn = card.querySelector(".btn");
      if (index < 2) {
        const isActive = index === state.mainProductIndex;
        btn.textContent = isActive ? "Видалити" : "Додати";
        btn.style.backgroundColor = isActive ? "#cc0000" : "";
      } else {
        btn.textContent = state.extraProductAdded ? "Видалити" : "Додати";
        btn.style.backgroundColor = state.extraProductAdded ? "#cc0000" : "";
      }
    });

    updateExtraCardDisplay();
  }

  function generateProductHTML(name, price, oldPrice) {
    return `
            <div class="order-pop-up__products__item flex-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px;">
                <div class="product">${name}</div>
                <div class="prices" style="text-align: right;">
                    <div class="new-price" style="font-weight: bold;">₴ ${price.toLocaleString()}</div>
                    <div class="old-price" style="text-decoration: line-through; color: #999; font-size: 0.9em;">₴ ${oldPrice.toLocaleString()}</div>
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
