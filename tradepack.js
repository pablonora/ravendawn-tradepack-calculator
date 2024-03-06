function calculateTradepackCost(tradepack) {
  return tradepack.items
    .map((item) => (item.total = Number(item.amount) * Number(item.price ?? 0)))
    .reduce((a, b) => a + b);
}

function calculateTradepackProfitMargin(route, tradepack) {
  const tradepackCost = calculateTradepackCost(tradepack);
  const tradepackProfit = calculateTradepackValue(route, tradepack);
  return tradepackProfit - tradepackCost;
}

function prepareUniqueItems() {
  window.appData.uniqueItems = window.appData.uniqueItems
    .sort()
    .map((uniqueItem) => ({
      name: uniqueItem,
      price: 0,
    }));
}

function preparePercentages() {
  window.appData.tradepacks.forEach((tradepack) => {
    tradepack.info.percentage = 100;
  });
}

function prepareRoutes() {
  window.appData.routes = [
    { name: "Seabeeze - Orca Bay (713)", value: 713 },
    { name: "Seabreeze - Margrove (943)", value: 943 },
    { name: "Seabreeze - Tarmire (1011)", value: 1011 },
    { name: "Seabreeze - Ravencrest (1115)", value: 1115 },
    { name: "Seabreeze - Riverend (1528)", value: 1528 },
    { name: "Seabreeze - Darzuac (1687)", value: 1687 },
    { name: "Seabreeze - Defiance (1888)", value: 1888 },
    { name: "Ravencrest - Margrove (233)", value: 233 },
    { name: "Ravencrest - Tarmire (392)", value: 392 },
    { name: "Ravencrest - Orca Bay (402)", value: 402 },
    { name: "Ravencrest - Riverend (412)", value: 412 },
    { name: "Ravencrest - Darzuac (577)", value: 577 },
    { name: "Ravencrest - Defiance (773)", value: 773 },
    { name: "Margrove - Orca Bay (437)", value: 437 },
    { name: "Margrove - Riverend (584)", value: 584 },
    { name: "Margrove - Tarmire (626)", value: 626 },
    { name: "Margrove - Darzuac (811)", value: 811 },
    { name: "Margrove - Defiance (945)", value: 945 },
  ];

  window.appData.routeTileCount = window.appData.routes[0].value;
}

function prepareGlobalModifiers() {
  window.appData.globalProfitModifiers = {
    reputationPerk: 0.05,
    warChannel: 0.2,
  };

  window.appData.globalProfitModifier = 1;
}

const TRADEPACK_BASE_VALUE = 10000;
const TRADEPACK_TILE_VALUE = 6;
function calculateTradepackValue(routeTileCount, tradepack) {
  const tradepackValue =
    (TRADEPACK_BASE_VALUE + TRADEPACK_TILE_VALUE * routeTileCount) *
    (Number(tradepack.info.percentage) / 100) *
    window.appData.globalProfitModifier;

  return Math.ceil(tradepackValue);
}
