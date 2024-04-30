document.body.style.display = "flex";
const pageColumnLeft = append(document.body, "div", null, "col-md-8");
const pageColumnRight = append(document.body, "div", null, "col-md-4");
let leftScreenContainerElement;
let rightScreenContainerElement;

function drawPage() {
  const appData = loadFromLocalStorage();
  if (appData) {
    window.appData = appData;
  } else {
    prepareTradepacks();
  }

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
  window.appData.tradepacks = window.appData.tradepacks.sort(
    (a, b) =>
      calculateTradepackProfitMargin(window.appData.routeTileCount, b) -
      calculateTradepackProfitMargin(window.appData.routeTileCount, a)
  );
  window.appData.tradepacks.forEach((tradepack, index) => {
    tradepack.order = index;
    if (tradepack.info.visible) {
      pageColumnContainer.appendChild(createTradepack(tradepack));
    }
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
  const percentageInput = append(percentageWrapper, "input", null, {
    classList: "form-control",
    name: "percentageWrapper",
  });
  setupInput(
    percentageInput,
    tradepack.info.percentage,
    onPercentageChange,
    [tradepack],
    1000
  );
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
    `#${tradepack.order + 1 ?? 1}`,
    "card-text text-end"
  );
  const calculatedTradepackProfitMargin = calculateTradepackProfitMargin(
    window.appData.routeTileCount,
    tradepack
  );
  tradepack.info.profitMargin = append(
    tradepackProfitMargin,
    "span",
    "Profit margin",
    "ms-2 mr-2"
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

  const places = Object.keys(window.appData.routes.places);

  const mappedFromPlaces = places.map((place) => ({
    name: place,
    value: window.appData.routes.places[place],
  }));

  const mappedToPlaces = places.map((place) => ({
    name: `${place} (${
      window.appData.routes.table[window.appData.from][
        window.appData.routes.places[place]
      ]
    })`,
    value: window.appData.routes.places[place],
  }));

  const locationWrapper = append(
    configWrapper,
    "div",
    null,
    "input-group mb-3"
  );
  append(locationWrapper, "label", "Route", "input-group-text");
  const locationFromSelect = append(
    locationWrapper,
    "select",
    null,
    "form-select"
  );
  setupSelect(
    locationFromSelect,
    mappedFromPlaces,
    window.appData.from ?? 0,
    onLocationChange,
    ["from"]
  );
  const locationToSelect = append(
    locationWrapper,
    "select",
    null,
    "form-select"
  );
  setupSelect(
    locationToSelect,
    mappedToPlaces,
    window.appData.to ?? 0,
    onLocationChange,
    ["to"]
  );

  const modifiersWrapper = append(configWrapper, "div", null);
  modifiersWrapper.style.display = "flex";
  modifiersWrapper.style.justifyContent = "space-around";

  const reputation5PerkModifier = append(
    modifiersWrapper,
    "div",
    null,
    "form-check form-switch"
  );
  const reputation5PerkModifierInput = append(
    reputation5PerkModifier,
    "input",
    null,
    {
      name: "reputation5PerkModifierInput",
      classList: "form-check-input",
      type: "checkbox",
      role: "switch",
      checked: window.appData.globalProfitModifiers.reputation5Perk.enabled,
      id: "reputation5PerkModifierInput",
    }
  );
  setupInput(reputation5PerkModifierInput, false, onModifierChange, [
    "reputation5Perk",
  ]);
  append(reputation5PerkModifier, "label", "Reputation Perk (5%)", {
    classList: "form-check-label",
    htmlFor: "reputation5PerkModifierInput",
  });

  const reputation10PerkModifier = append(
    modifiersWrapper,
    "div",
    null,
    "form-check form-switch"
  );
  const reputation10PerkModifierInput = append(
    reputation10PerkModifier,
    "input",
    null,
    {
      name: "reputation10PerkModifierInput",
      classList: "form-check-input",
      type: "checkbox",
      role: "switch",
      checked: window.appData.globalProfitModifiers.reputation10Perk.enabled,
      id: "reputation10PerkModifierInput",
    }
  );
  setupInput(reputation10PerkModifierInput, false, onModifierChange, [
    "reputation10Perk",
  ]);
  append(reputation10PerkModifier, "label", "Reputation Perk (10%)", {
    classList: "form-check-label",
    htmlFor: "reputation10PerkModifierInput",
  });

  const warChannelModifier = append(
    modifiersWrapper,
    "div",
    null,
    "form-check form-switch"
  );
  const warChannelModifierInput = append(warChannelModifier, "input", null, {
    name: "warChannelModifier",
    classList: "form-check-input",
    type: "checkbox",
    role: "switch",
    checked: window.appData.globalProfitModifiers.warChannel.enabled,
    id: "warChannelModifier",
  });
  setupInput(warChannelModifierInput, false, onModifierChange, ["warChannel"]);
  append(warChannelModifier, "label", "War channel (20%)", {
    classList: "form-check-label",
    htmlFor: "warChannelModifier",
  });

  const mappedFromTradepacks = window.appData.tradepacks.map((tradepack) => ({
    name: tradepack.info.name,
    value: tradepack.info.name,
  }));
  const tradepackFilterWrapper = append(
    configWrapper,
    "div",
    null,
    "input-group mb-3"
  );
  append(tradepackFilterWrapper, "label", "Filter", "input-group-text");
  const tradepackFilterFromSelect = append(
    tradepackFilterWrapper,
    "select",
    null,
    {
      classList: "form-select",
      multiple: true,
    }
  );
  setupSelectMultiple(
    tradepackFilterFromSelect,
    mappedFromTradepacks,
    window.appData.tradepacksSelected ?? mappedFromTradepacks,
    onTradepackFilterChange,
    ["filter"]
  );

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
    const priceInput = append(priceWrapper, "input", null, {
      name: "priceWrapper",
      value: uniqueItem.price,
      classList: "form-control",
    });
    setupInput(priceInput, uniqueItem.price, onPriceChange, [uniqueItem]);
  });

  return configWrapper;
}

function onPriceChange(uniqueItem, event) {
  if (event.target.value < 0 || !/^\d+$/g.test(event.target.value)) {
    event.target.value = 0;
  }

  event.target.value = event.target.value.replace(/^0+/, "");
  if (event.target.value === "") {
    event.target.value = "0";
  }
  uniqueItem.price = event.target.value;

  window.appData.tradepacks.forEach((tradepack) => {
    tradepack.items.forEach((item) => {
      if (item.name === uniqueItem.name) {
        item.price = uniqueItem.price;
        item.total = item.price * item.amount;
      }
    });
  });

  localStorage.setItem("appData", JSON.stringify(window.appData));

  renderLeftScreen(leftScreenContainerElement);
}

function onPercentageChange(tradepack, event) {
  tradepack.info.percentage = event.target.value;

  localStorage.setItem("appData", JSON.stringify(window.appData));

  renderLeftScreen(leftScreenContainerElement);
}

function onLocationChange(location, event) {
  if (location === "from") {
    window.appData.from = event.target.value;
  } else if (location === "to") {
    window.appData.to = event.target.value;
  }

  window.appData.routeTileCount =
    window.appData.routes.table[window.appData.from][window.appData.to];

  localStorage.setItem("appData", JSON.stringify(window.appData));

  renderLeftScreen(leftScreenContainerElement);
  renderRightScreen(rightScreenContainerElement);
}

function onModifierChange(modifier, event) {
  if (event.target.checked) {
    window.appData.globalProfitModifier +=
      window.appData.globalProfitModifiers[modifier].value;
    window.appData.globalProfitModifiers[modifier].enabled = true;
  } else {
    window.appData.globalProfitModifier -=
      window.appData.globalProfitModifiers[modifier].value;
    window.appData.globalProfitModifiers[modifier].enabled = false;
  }

  localStorage.setItem("appData", JSON.stringify(window.appData));

  renderLeftScreen(leftScreenContainerElement);
}

function onTradepackFilterChange(modifier, event) {
  window.appData.tradepacks.forEach((tradepack) => {
    tradepack.info.visible = false;
    Array.from(event.target.selectedOptions).forEach((tradepackSelected) => {
      if (tradepack.info.name === tradepackSelected.value)
        tradepack.info.visible = true;
    });
  });

  localStorage.setItem("appData", JSON.stringify(window.appData));
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
  inputFunctionArgs = [],
  debounceTime = 300
) {
  inputElement.value = inputInitValue;

  const debouncedInputHandler = debounce(
    inputFunction.bind(inputElement, ...inputFunctionArgs),
    debounceTime
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
    if (index === Number(selectInitValue)) {
      option.selected = true;
    }
  });

  selectElement.addEventListener(
    "change",
    selectFunction.bind(selectElement, ...selectFunctionArgs)
  );
}

function setupSelectMultiple(
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
    if (selectInitValue.includes(selectValue)) {
      option.selected = true;
    }
  });

  selectElement.addEventListener(
    "change",
    selectFunction.bind(selectElement, ...selectFunctionArgs)
  );
}
