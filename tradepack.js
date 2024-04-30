function calculateTradepackCost(tradepack) {
  return tradepack.items
    .map((item) => (item.total = Number(item.amount) * Number(item.price ?? 0)))
    .reduce((a, b) => a + b);
}

function calculateTradepackProfitMargin(route, tradepack) {
  const tradepackCost = calculateTradepackCost(tradepack);
  const tradepackSellValue = calculateTradepackValue(route, tradepack);
  return tradepackSellValue - tradepackCost;
}

function prepareTradepacks() {
  prepareVisibility();
  prepareUniqueItems();
  preparePercentages();
  prepareRoutes();
  prepareGlobalModifiers();
}

function prepareVisibility() {
  window.appData.tradepacks.forEach(
    (tradepack) => (tradepack.info.visible = true)
  );
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
  window.appData.routes = {
    places: {
      Riverend: 0,
      Margrove: 1,
      "Orca Bay": 2,
      Seabreeze: 3,
      Tarmire: 4,
      Darzuac: 5,
      Gilea: 6,
      Glaceford: 7,
      Ravencrest: 8,
      Defiance: 9,
    },
    table:  [
      //                Riverend Margrove Orca Bay Seabreeze Tarmire Darzuac Gilea Glaceford Ravencrest Defiance
      /* Riverend */   [   0,      586,     814,     1528,     517,    535,   1135,   881,     414,       361  ],
      /* Margrove */   [  586,      0,      437,      943,     626,    811,   979,    508,     233,       946  ],
      /* Orca Bay */   [  814,     437,      0,       713,     298,    888,   541,    945,     402,      1175  ],
      /* Seabreeze */  [ 1528,     943,     713,       0,     1011,   1600,   699,    787,    1115,      1888  ],
      /* Tarmire */    [  517,     626,     298,     1011,      0,     589,   617,   1133,     392,       877  ],
      /* Darzuac */    [  535,     810,     888,     1600,     589,     0,    1207,  1318,     577,       485  ],
      /* Gilea */      [ 1135,     979,     541,      699,     617,   1207,     0,   1486,     745,      1494  ],
      /* Glaceford */  [  881,     508,     945,      787,    1133,   1318,   1486,    0,      741,      1242  ],
      /* Ravencrest */ [  414,     233,     402,     1115,     392,    577,    745,   741,      0,        774  ],
      /* Defiance */   [  361,     946,    1175,     1888,     877,    485,   1495,  1242,     774,        0   ]
    ]
  }
  
  window.appData.from = 0;
  window.appData.to = 0;
  window.appData.routeTileCount =
    window.appData.routes.table[window.appData.from][window.appData.to];
}

function prepareGlobalModifiers() {
  window.appData.globalProfitModifiers = {
    reputation5Perk: {
      value: 0.05,
      enabled: false,
    },
    reputation10Perk: {
      value: 0.1,
      enabled: false,
    },
    warChannel: {
      value: 0.2,
      enabled: false,
    },
  };

  window.appData.globalProfitModifier = 1;
}

const TRADEPACK_BASE_VALUE = 20000;
const TRADEPACK_TILE_VALUE = 12;
function calculateTradepackValue(routeTileCount, tradepack) {
  const tradepackValue =
    ((TRADEPACK_BASE_VALUE + (TRADEPACK_TILE_VALUE * routeTileCount)) *
    (Number(tradepack.info.percentage) / 100)) * window.appData.globalProfitModifier;

  return Math.ceil(tradepackValue);
}

function loadFromLocalStorage() {
  const appData = JSON.parse(localStorage.getItem("appData"));
  return appData;
}
