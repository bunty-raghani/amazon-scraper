import fixText from "./fixtext";

const product = async (query) => {
  const product_page = await (
    await fetch(`https://www.amazon.in/dp/${query}`)
  ).text();
  var price = null;
  var original_price = null;
  var savings = null;

  try {
    var pricediv = product_page.split(/<div id="corePriceDisplay_desktop_feature_div".*>/g);
    //console.log("pricediv[0]: "+pricediv[0]);
    //console.log("pricediv[8]: "+pricediv[0].split('<span class="a-offscreen">')[8]);
    
    /*for (let i = 0; i<pricediv[0].split('<span class="a-offscreen">').length; i++) {
      console.log("pricediv[`i`]: " +i + " : "+pricediv[0].split('<span class="a-offscreen">')[i]);
    }*/
    original_price = pricediv[0]
        .split('<span class="a-offscreen">')[11]
        .split("</span>")[0];

    savings = pricediv[0]
        .split('<span class="a-offscreen">')[14]
        .split("</span>")[0];

    try {
      price = pricediv[0]
          .split(
              '<span class="a-price a-text-price a-size-medium apexPriceToPay" data-a-size="b" data-a-color="price">'
          )[1]
          .split("</span>")[0];
      if (price.includes(">")) {
        price = price.split(">")[1];
      }

    } catch (pe) {}
    if (price === null) {
      price = pricediv[0]
          .split(/<span class="a-price-whole">/g)[1]
          .split("</span>")[0];
    }
  } catch (error) {}

  if (original_price !== null) {
    original_price = parseFloat(
        original_price.replace("₹", "").replace(/,/g, "").trim()
    );
  }
  if (savings !== null) {
    savings = parseFloat(
        savings.replace("₹", "").replace(/,/g, "").trim()
    );
  }
  if (price !== null) {
    price = parseFloat(price.replace("₹", "").replace(/,/g, "").trim());
  }

  try {
    var image = product_page
      .split('<div id="imgTagWrapperId" class="imgTagWrapper">')[1]
      .split('data-old-hires="')[1]
      .split('"')[0]
      .replaceAll("\n", "");
    if (image === "") {
      var image = product_page
        .split('<div id="imgTagWrapperId" class="imgTagWrapper">')[1]
        .split('data-a-dynamic-image="{&quot;')[1]
        .split("&quot;")[0]
        .replaceAll("\n", "");
    }
  } catch (e) {
    var image = null;
  }

  return JSON.stringify(
    {
      status: true,
      query,
      name: fixText(
          product_page
              .split(
                  '<span id="productTitle" class="a-size-large product-title-word-break">'
              )[1]
              .split("</span>")[0]
      ),
      image,
      price,
      original_price,
      savings,
      product_link: `https://www.amazon.in/dp/${query}/?&tag=techgeek4yu-21`,
    },
    null,
    2
  );
};

export default product;