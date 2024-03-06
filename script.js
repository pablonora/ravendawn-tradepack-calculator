document.body.style.display = "flex";
const pageColumnLeft = append(document.body, "div", null, "col-md-8");
const pageColumnRight = append(document.body, "div", null, "col-md-4");
let leftScreenContainerElement;
let rightScreenContainerElement;

function drawPage() {
  prepareUniqueItems();
  preparePercentages();
  prepareRoutes();
  prepareGlobalModifiers();

  renderLeftScreen();
  renderRightScreen();
}

drawPage();

function renderLeftScreen() {
  if (leftScreenContainerElement) {
    pageColumnLeft.removeChild(leftScreenContainerElement);
  }

  const pageColumnContainer = append(
    pageColumnLeft,
    "div",
    null,
    "d-flex flex-wrap justify-content-between"
  );
  window.appData.tradepacks.forEach((tradepack) => {
    pageColumnContainer.appendChild(createTradepack(tradepack));
  });

  leftScreenContainerElement = pageColumnContainer;
}

function renderRightScreen() {
  if (rightScreenContainerElement) {
    pageColumnRight.removeChild(rightScreenContainerElement);
  }

  const pageColumnContainer = append(pageColumnRight, "div");
  pageColumnContainer.appendChild(createTradepackConfig());

  rightScreenContainerElement = pageColumnContainer;
}

function createTradepack(tradepack) {
  const tradepackContainer = document.createElement("div");
  tradepackContainer.classList = "card mb-3 flex-grow-1 flex-shrink-1";

  const tradepackCard = append(tradepackContainer, "div", null, "row g-0");

  const cardImage = append(
    tradepackCard,
    "div",
    null,
    "d-flex align-items-center justify-content-center"
  );
  append(cardImage, "img", tradepack.info.img, "img-fluid rounded-start");

  const cardBodyWrapper = append(tradepackCard, "div", null);
  const cardBody = append(cardBodyWrapper, "div", null, "card-body");

  const cardHeader = append(
    cardBody,
    "div",
    null,
    "d-flex justify-content-center"
  );
  append(
    cardHeader,
    "h5",
    tradepack.info.name,
    "text-center align-self-end me-2"
  );

  const percentageWrapper = append(cardHeader, "div", null, "input-group");
  percentageWrapper.style.width = "90px";
  const percentageInput = append(
    percentageWrapper,
    "input",
    null,
    "form-control"
  );
  setupInput(percentageInput, tradepack.info.percentage, onPercentageChange, [
    tradepack,
  ]);
  append(percentageWrapper, "span", "%", "input-group-text");

  append(cardBody, "div", createTradepackItemTable(tradepack));

  const tradepackSellPrice = append(
    cardBody,
    "p",
    "Sell price",
    "card-text mb-0 text-end"
  );
  const calculatedTradepackSellValue = calculateTradepackValue(
    window.appData.routeTileCount,
    tradepack
  );
  append(tradepackSellPrice, "span", `${calculatedTradepackSellValue}`, "ms-2");

  const tradepackCost = append(
    cardBody,
    "p",
    "Cost",
    "card-text mb-0 text-end"
  );
  const calculatedTradepackCost = calculateTradepackCost(tradepack);
  append(
    tradepackCost,
    "span",
    `${calculatedTradepackCost >= 0 ? calculatedTradepackCost : ""}`,
    "ms-2" + (calculatedTradepackCost > 0 ? " text-danger" : " text-success")
  );

  const tradepackProfitMargin = append(
    cardBody,
    "p",
    "Profit margin",
    "card-text text-end"
  );
  const calculatedTradepackProfitMargin = calculateTradepackProfitMargin(
    window.appData.routeTileCount,
    tradepack
  );
  append(
    tradepackProfitMargin,
    "span",
    `${calculatedTradepackProfitMargin}`,
    "ms-2" +
      (calculatedTradepackProfitMargin <= 0 ? " text-danger" : " text-success")
  );

  return tradepackContainer;
}

function createTradepackItemTable(tradepack) {
  const itemTable = document.createElement("table");
  itemTable.classList = "table table-striped";
  const tableHeader = append(
    itemTable,
    "thead",
    null,
    "bg-secondary table-dark"
  );

  append(tableHeader, "th", "", { scope: "col" });
  append(tableHeader, "th", "Name", { scope: "col" });
  append(tableHeader, "th", "Amount", { scope: "col" });
  append(tableHeader, "th", "Price", { scope: "col" });
  append(tableHeader, "th", "Total", { scope: "col" });

  const tableBody = append(itemTable, "tbody");
  tradepack.items.forEach((tradepackItem) => {
    const tableRow = append(tableBody, "tr");
    const tableImgTd = append(tableRow, "td");
    append(tableImgTd, "img", tradepackItem.img, "d-flex");
    append(tableRow, "td", tradepackItem.name);
    append(tableRow, "td", tradepackItem.amount);
    append(tableRow, "td", `${tradepackItem.price ?? 0}`);
    append(tableRow, "td", `${tradepackItem.total ?? 0}`);
  });

  return itemTable;
}

function createTradepackConfig() {
  const configWrapper = document.createElement("div");

  const locationWrapper = append(
    configWrapper,
    "div",
    null,
    "input-group mb-3"
  );
  append(locationWrapper, "label", "Route", "input-group-text");
  const locationSelect = append(locationWrapper, "select", null, "form-select");
  setupSelect(locationSelect, window.appData.routes, 0, onLocationChange);

  const modifiersWrapper = append(configWrapper, "div", null);
  modifiersWrapper.style.display = "flex";
  modifiersWrapper.style.justifyContent = "space-around";

  const reputationPerkModifier = append(
    modifiersWrapper,
    "div",
    null,
    "form-check form-switch"
  );
  const reputationPerkModifierInput = append(
    reputationPerkModifier,
    "input",
    null,
    {
      classList: "form-check-input",
      type: "checkbox",
      role: "switch",
      id: "reputationPerkModifier",
    }
  );
  setupInput(reputationPerkModifierInput, false, onModifierChange, [
    "reputationPerk",
  ]);
  append(reputationPerkModifier, "label", "Reputation Perk (5%)", {
    classList: "form-check-label",
    htmlFor: "reputationPerkModifier",
  });

  const warChannelModifier = append(
    modifiersWrapper,
    "div",
    null,
    "form-check form-switch"
  );
  const warChannelModifierInput = append(warChannelModifier, "input", null, {
    classList: "form-check-input",
    type: "checkbox",
    role: "switch",
    id: "warChannelModifier",
  });
  setupInput(warChannelModifierInput, false, onModifierChange, ["warChannel"]);
  append(warChannelModifier, "label", "War channel (20%)", {
    classList: "form-check-label",
    htmlFor: "warChannelModifier",
  });

  const itemTable = append(configWrapper, "table", null, "table table-striped");
  const tableHeader = append(
    itemTable,
    "thead",
    null,
    "bg-secondary table-dark"
  );

  append(tableHeader, "th", "", { scope: "col" });
  append(tableHeader, "th", "Name", { scope: "col" });
  append(tableHeader, "th", "Price", { scope: "col" });

  const tableBody = append(itemTable, "tbody");
  window.appData.uniqueItems.forEach((uniqueItem) => {
    const tableRow = append(tableBody, "tr");
    const tableImgTd = append(tableRow, "td");
    append(tableImgTd, "img", uniqueItem.img);
    append(tableRow, "td", uniqueItem.name);
    const tablePriceTd = append(tableRow, "td");
    const priceWrapper = append(tablePriceTd, "div", null, "input-group");
    append(priceWrapper, "span", "$", "input-group-text");
    const priceInput = append(priceWrapper, "input", null, "form-control");
    setupInput(priceInput, uniqueItem.price, onPriceChange, [
      priceInput,
      uniqueItem,
    ]);
  });

  return configWrapper;
}

function onPriceChange(priceInput, uniqueItem, event) {
  priceInput.value = event.target.value;

  window.appData.tradepacks.forEach((tradepack) => {
    tradepack.items.forEach((item) => {
      if (item.name === uniqueItem.name) {
        item.price = event.target.value;
        item.total = item.price * item.amount;
      }
    });
  });

  renderLeftScreen(leftScreenContainerElement);
}

function onPercentageChange(tradepack, event) {
  tradepack.info.percentage = event.target.value;

  renderLeftScreen(leftScreenContainerElement);
}

function onLocationChange(event) {
  window.appData.routeTileCount = event.target.value;

  renderLeftScreen(leftScreenContainerElement);
}

function onModifierChange(modifier, event) {
  if (event.target.checked) {
    window.appData.globalProfitModifier +=
      window.appData.globalProfitModifiers[modifier];
  } else {
    window.appData.globalProfitModifier -=
      window.appData.globalProfitModifiers[modifier];
  }

  renderLeftScreen(leftScreenContainerElement);
}

function append(where, element, node, props) {
  const htmlElement = document.createElement(element);

  if (node == null) {
    //do nothing;
  } else if (element === "img") {
    htmlElement.src = node;
  } else if (node.trim) {
    htmlElement.innerText = node;
  } else {
    htmlElement.appendChild(node);
  }

  if (props) {
    if (props.trim) {
      htmlElement.classList = props;
    } else {
      Object.assign(htmlElement, props);
    }
  }

  where.appendChild(htmlElement);
  return htmlElement;
}

function debounce(mainFunction, delay) {
  // Declare a variable called 'timer' to store the timer ID
  let timer;

  // Return an anonymous function that takes in any number of arguments
  return function (...args) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
}

function setupInput(
  inputElement,
  inputInitValue,
  inputFunction,
  inputFunctionArgs = []
) {
  inputElement.value = inputInitValue;

  const debouncedInputHandler = debounce(
    inputFunction.bind(inputElement, ...inputFunctionArgs),
    300
  );

  if (inputElement.type === "checkbox") {
    inputElement.addEventListener("change", debouncedInputHandler);
  } else {
    inputElement.addEventListener("focus", () =>
      inputElement.setSelectionRange(0, inputElement.value?.length ?? 0)
    );
    inputElement.addEventListener("input", debouncedInputHandler);
  }
}

function setupSelect(
  selectElement,
  selectValues,
  selectInitValue,
  selectFunction,
  selectFunctionArgs = []
) {
  selectValues.forEach((selectValue, index) => {
    const option = append(selectElement, "option");
    option.value = selectValue.value;
    option.text = selectValue.name;
    if (index === selectInitValue) {
      option.selected = true;
    }
  });

  selectElement.addEventListener(
    "change",
    selectFunction.bind(selectElement, ...selectFunctionArgs)
  );
}
