// URL to paste the script on console
// https://wiki.ravendawn.online/index.php?title=Tradepacks

function processTableData() {
  const tradepacks = [];
  const uniqueItems = new Set();
  const uniqueImgs = new Set();

  const table = document.getElementsByClassName("wikitable sortable")[0];
  for (const child of table.children[1].children) {
    const tradepackImg =
      child.children[0].getElementsByTagName("img")[0].attributes.src.value;

    const info = {
      name: child.children[1].innerText,
      img: tradepackImg,
    };

    let images = child.children[2].getElementsByTagName("img");
    images = Array.from(images).map((image) => {
      const itemImg = image.attributes.src.value;
      uniqueImgs.add(itemImg);
      return itemImg;
    });

    const items = child.children[2].innerText.split(/,/g).map((item, index) => {
      const itemData = item.trim().split(/(?<=^\S+)\s/g);

      itemData[1] = itemData[1]
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase() + name.substring(1))
        .join(" ");

      uniqueItems.add(itemData[1]);

      return {
        name: itemData[1],
        amount: itemData[0],
        img: images[index],
      };
    });
    tradepacks.push({ info, items });
  }

  return {
    tradepacks: tradepacks.sort((a, b) => a.info.name - b.info.name),
    uniqueItems: Array.from(uniqueItems).sort(),
    uniqueImgs: Array.from(uniqueImgs).sort(),
  };
}

console.log(processTableData());
