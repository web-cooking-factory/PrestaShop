// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import {createCartRuleTest, deleteCartRuleTest} from '@commonTests/BO/catalog/cartRule';
import {bulkDeleteProductsTest} from '@commonTests/BO/catalog/product';
import {createCurrencyTest, deleteCurrencyTest} from '@commonTests/BO/international/currency';
import {enableEcoTaxTest, disableEcoTaxTest} from '@commonTests/BO/international/ecoTax';
import deleteNonOrderedShoppingCarts from '@commonTests/BO/orders/shoppingCarts';

import {
  boDashboardPage,
  boLoginPage,
  boOrdersPage,
  boOrdersCreatePage,
  boProductsPage,
  boProductsCreatePage,
  boProductsCreateTabPricingPage,
  boStockPage,
  type BrowserContext,
  dataCurrencies,
  dataCustomers,
  dataProducts,
  FakerCartRule,
  FakerProduct,
  type Page,
  utilsCore,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_BO_orders_orders_createOrders_addProductToTheCart';

/*
Pre-condition:
- Enable ecoTax
- Create new currency
- Create 6 products:
  * Pack of products
  * Out of stock allowed
  * Out of stock not allowed
  * With specific price
  * With ecoTax
  * With cart rule
- Delete non-ordered shopping carts
- Get the available stock of available demo products : demo_1, demo_11, demo_14, demo_18
Scenario:
- Go to create order page and choose default customer
- Add to cart non-existent product and check the error message
- Add to cart standard simple product and check details
- Add to cart the same product and check details
- Add to cart standard product with combination and check details
- Add to cart virtual product and check details
- Add to cart pack of products (min quantity = 2) and check error message
- Increase quantity of pack of product and check details
- Add to cart customized product and check error message
- Add customized text and check details
- Add to cart product out of stock allowed and check details
- Add to cart product out of stock not allowed and check error message
- Add to cart product with specific price and check details
- Add to cart product with ecoTax and check details
- Add to cart product with cart rule and check details
- Check the gift product
- Increase quantity of product with cart rule and check details
- Remove product and check that the gift is removed
- Select another currency and check it
- Select another language and check it
Post-condition:
- Delete created products
- Delete cart rule
- Delete currency
- Disable ecoTax
 */
describe('BO - Orders - Create order : Add a product to the cart', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  // Variable used for available stock of simple product
  let availableStockSimpleProduct: number = 0;
  // Variable used for available stock of combination product
  let availableStockCombinationProduct: number = 0;
  // Variable used for available stock of virtual product
  let availableStockVirtualProduct: number = 0;
  // Variable used for available stock of customized product
  let availableStockCustomizedProduct: number = 0;
  let createProductMessage: string|null = '';
  let updateProductMessage: string|null = '';

  const pastDate: string = utilsDate.getDateFormat('yyyy-mm-dd', 'past');
  // Constant used to add a prefix to created products
  const prefixNewProduct: string = 'TOTEST';
  // Data to create pack of products with minimum quantity = 2
  const packOfProducts: FakerProduct = new FakerProduct({
    name: `Pack of products ${prefixNewProduct}`,
    type: 'pack',
    pack: [
      {
        reference: 'demo_13',
        quantity: 1,
      },
      {
        reference: 'demo_7',
        quantity: 1,
      },
    ],
    price: 12.65,
    taxRule: 'No tax',
    quantity: 197,
    minimumQuantity: 2,
    stockLocation: 'stock 3',
    lowStockLevel: 3,
    behaviourOutOfStock: 'Default behavior',
  });
  // Data to create product out of stock allowed
  const productOutOfStockAllowed: FakerProduct = new FakerProduct({
    name: `Out of stock allowed ${prefixNewProduct}`,
    type: 'standard',
    taxRule: 'No tax',
    quantity: -12,
    minimumQuantity: 1,
    lowStockLevel: 3,
    behaviourOutOfStock: 'Allow orders',
  });
  // Data to create product out of stock not allowed
  const productOutOfStockNotAllowed: FakerProduct = new FakerProduct({
    name: `Out of stock not allowed ${prefixNewProduct}`,
    type: 'standard',
    taxRule: 'No tax',
    quantity: -15,
    minimumQuantity: 1,
    lowStockLevel: 3,
    behaviourOutOfStock: 'Deny orders',
  });
  // Data to create product with specific price
  const productWithSpecificPrice: FakerProduct = new FakerProduct({
    name: `Product with specific price ${prefixNewProduct}`,
    type: 'standard',
    taxRule: 'No tax',
    quantity: 20,
    specificPrice: {
      attributes: null,
      discount: 50,
      startingAt: 2,
      reductionType: '%',
    },
  });
  // Data to create product with ecotax
  const productWithEcoTax: FakerProduct = new FakerProduct({
    name: `Product with ecotax ${prefixNewProduct}`,
    type: 'standard',
    taxRule: 'No tax',
    quantity: 20,
    minimumQuantity: 1,
    ecoTax: 10,
  });
  // Data to create product with cart rule
  const productWithCartRule: FakerProduct = new FakerProduct({
    name: `Product with cart rule ${prefixNewProduct}`,
    type: 'standard',
    taxRule: 'No tax',
    quantity: 50,
    minimumQuantity: 1,
    stockLocation: 'stock 1',
    lowStockLevel: 3,
    behaviourOutOfStock: 'Default behavior',
  });
  // Data to create cart rule
  const newCartRuleData: FakerCartRule = new FakerCartRule({
    applyDiscountTo: 'Specific product',
    dateFrom: pastDate,
    product: productWithCartRule.name,
    freeShipping: true,
    discountType: 'Amount',
    discountPercent: 20,
    discountAmount: {
      value: 20,
      currency: 'EUR',
      tax: 'Tax excluded',
    },
    freeGift: true,
    freeGiftProduct: dataProducts.demo_13,
  });
  // Data to add customized value for product
  const customizedValue: string = 'Test';
  const customizedProduct: FakerProduct = new FakerProduct({
    name: dataProducts.demo_14.name,
    reference: dataProducts.demo_14.reference,
    price: dataProducts.demo_14.priceTaxExcluded,
    thumbImage: dataProducts.demo_14.thumbImage,
  });

  // Pre-condition: Enable EcoTax
  enableEcoTaxTest(`${baseContext}_preTest_1`);

  // Pre-condition: Create currency
  createCurrencyTest(dataCurrencies.mad, `${baseContext}_preTest_2`);

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  // Pre-condition: Create 6 products
  describe('PRE-TEST: Create 6 products in BO', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Catalog > Products\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductsPage', baseContext);

      await boDashboardPage.goToSubMenu(page, boDashboardPage.catalogParentLink, boDashboardPage.productsLink);
      await boProductsPage.closeSfToolBar(page);

      const pageTitle = await boProductsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boProductsPage.pageTitle);
    });

    [
      packOfProducts,
      productOutOfStockAllowed,
      productOutOfStockNotAllowed,
      productWithSpecificPrice,
      productWithEcoTax,
      productWithCartRule,
    ].forEach((product: FakerProduct, index: number) => {
      if (index === 0) {
        it('should click on \'New product\' button and check new product modal', async function () {
          await testContext.addContextItem(this, 'testIdentifier', `clickOnNewProductButton${index}`, baseContext);

          const isModalVisible = await boProductsPage.clickOnNewProductButton(page);
          expect(isModalVisible).to.be.eq(true);
        });

        it(`should choose '${product.type} product'`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `chooseStandardProduct${index}`, baseContext);

          await boProductsPage.selectProductType(page, product.type);

          const pageTitle = await boProductsCreatePage.getPageTitle(page);
          expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
        });
      }

      it('should go to new product page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToNewProductPage${index}`, baseContext);

        if (index !== 0) {
          await boProductsCreatePage.clickOnNewProductButton(page);
        } else {
          await boProductsPage.clickOnAddNewProduct(page);
        }

        const pageTitle = await boProductsCreatePage.getPageTitle(page);
        expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
      });

      if (index !== 0) {
        it(`should choose '${product.type} product'`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `chooseStandardProduct${index}`, baseContext);

          await boProductsCreatePage.chooseProductType(page, product.type);

          const pageTitle = await boProductsCreatePage.getPageTitle(page);
          expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
        });
      }

      it(`create product '${product.name}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createProduct${index}`, baseContext);

        createProductMessage = await boProductsCreatePage.setProduct(page, product);
        expect(createProductMessage).to.equal(boProductsCreatePage.successfulUpdateMessage);

        // Add specific price
        if (product === productWithSpecificPrice) {
          await boProductsCreatePage.goToTab(page, 'pricing');
          await boProductsCreateTabPricingPage.clickOnAddSpecificPriceButton(page);

          createProductMessage = await boProductsCreateTabPricingPage.setSpecificPrice(
            page,
            productWithSpecificPrice.specificPrice,
          );
          expect(createProductMessage).to.equal(boProductsCreatePage.successfulCreationMessage);
        }
        // Add eco tax
        if (product === productWithEcoTax) {
          await boProductsCreatePage.goToTab(page, 'pricing');
          await boProductsCreateTabPricingPage.addEcoTax(page, productWithEcoTax.ecoTax);

          updateProductMessage = await boProductsCreatePage.saveProduct(page);
          expect(updateProductMessage).to.equal(boProductsCreatePage.successfulUpdateMessage);
        }
      });
    });
  });

  // Pre-condition: Create cart rule and apply the discount to 'productWithCartRule'
  createCartRuleTest(newCartRuleData, baseContext);

  // Pre-condition: Delete non ordered shopping carts
  deleteNonOrderedShoppingCarts(baseContext);

  // Pre-condition: Get the available stock of demo products
  describe('PRE-TEST: Get the available stock of the ordered demo products', async () => {
    it('should go to \'Catalog > Stocks\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToStocksPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.catalogParentLink,
        boDashboardPage.stocksLink,
      );

      const pageTitle = await boStockPage.getPageTitle(page);
      expect(pageTitle).to.contains(boStockPage.pageTitle);
    });

    it('should get the Available stock of the simple product \'demo_11\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'getAvailableStockOfDemo11', baseContext);

      await boStockPage.simpleFilter(page, dataProducts.demo_11.name);

      availableStockSimpleProduct = parseInt(await boStockPage.getTextColumnFromTableStocks(page, 1, 'available'), 10);
      expect(availableStockSimpleProduct).to.be.above(0);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilter1', baseContext);

      const numberOfProductsAfterReset = await boStockPage.resetFilter(page);
      expect(numberOfProductsAfterReset).to.be.above(1);
    });

    it('should get the Available stock of the product with combinations \'demo_1\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'getAvailableStockDemo1', baseContext);

      await boStockPage.simpleFilter(page, dataProducts.demo_1.name);

      availableStockCombinationProduct = parseInt(await boStockPage.getTextColumnFromTableStocks(page, 1, 'available'), 10);
      expect(availableStockCombinationProduct).to.be.above(0);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilter2', baseContext);

      const numberOfProductsAfterReset = await boStockPage.resetFilter(page);
      expect(numberOfProductsAfterReset).to.be.above(1);
    });

    it('should get the Available stock of the virtual product \'demo_18\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'getAvailableStockDemo18', baseContext);

      await boStockPage.simpleFilter(page, dataProducts.demo_18.name);

      availableStockVirtualProduct = parseInt(await boStockPage.getTextColumnFromTableStocks(page, 1, 'available'), 10);
      expect(availableStockVirtualProduct).to.be.above(0);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilter3', baseContext);

      const numberOfProductsAfterReset = await boStockPage.resetFilter(page);
      expect(numberOfProductsAfterReset).to.be.above(1);
    });

    it('should get the Available stock of the customized product \'demo_14\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'getAvailableStockDemo14', baseContext);

      await boStockPage.simpleFilter(page, dataProducts.demo_14.name);

      availableStockCustomizedProduct = parseInt(await boStockPage.getTextColumnFromTableStocks(page, 1, 'available'), 10);
      expect(availableStockCustomizedProduct).to.be.above(0);
    });
  });

  // 1 - Go to create order page
  describe('Go to create order page', async () => {
    it('should go to \'Orders > Orders\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToOrdersPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.ordersParentLink,
        boDashboardPage.ordersLink,
      );
      await boOrdersPage.closeSfToolBar(page);

      const pageTitle = await boOrdersPage.getPageTitle(page);
      expect(pageTitle).to.contains(boOrdersPage.pageTitle);
    });

    it('should go to create order page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCreateOrderPage', baseContext);

      await boOrdersPage.goToCreateOrderPage(page);

      const pageTitle = await boOrdersCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boOrdersCreatePage.pageTitle);
    });

    it(`should choose customer ${dataCustomers.johnDoe.firstName} ${dataCustomers.johnDoe.lastName}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'chooseDefaultCustomer', baseContext);

      await boOrdersCreatePage.searchCustomer(page, dataCustomers.johnDoe.email);

      const isCartsTableVisible = await boOrdersCreatePage.chooseCustomer(page);
      expect(isCartsTableVisible, 'History block is not visible!').to.eq(true);
    });
  });

  // 2 - Add products to the cart
  describe('Add some products to cart and check details', async () => {
    it('should search for a non-existent product and check the error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchNonExistentProduct', baseContext);

      const alertMessage = await boOrdersCreatePage.searchProductAndGetAlert(page, 'non existent');
      expect(alertMessage).to.equal(boOrdersCreatePage.noProductFoundText);
    });

    it('should add to cart \'Standard simple product\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addStandardSimpleProduct', baseContext);

      const productToSelect = `${dataProducts.demo_11.name} - €${dataProducts.demo_11.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, dataProducts.demo_11, productToSelect);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page);
      await Promise.all([
        expect(result.image).to.contains(dataProducts.demo_11.thumbImage),
        expect(result.description).to.equal(dataProducts.demo_11.name),
        expect(result.reference).to.equal(dataProducts.demo_11.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(availableStockSimpleProduct),
        expect(result.price).to.equal(dataProducts.demo_11.price),
      ]);
    });

    it('should add to cart the same \'Standard simple product\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addStandardSimpleProduct2', baseContext);

      const productToSelect = `${dataProducts.demo_11.name} - €${dataProducts.demo_11.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, dataProducts.demo_11, productToSelect);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page);
      await Promise.all([
        expect(result.image).to.contains(dataProducts.demo_11.thumbImage),
        expect(result.description).to.equal(dataProducts.demo_11.name),
        expect(result.reference).to.equal(dataProducts.demo_11.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(availableStockSimpleProduct),
        expect(result.price).to.equal(dataProducts.demo_11.price * 2),
      ]);
    });

    it('should add to cart \'Standard product with combinations\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addStandardCombinationsProduct', baseContext);

      await boOrdersCreatePage.addProductToCart(page, dataProducts.demo_1, dataProducts.demo_1.name);
      const discountValue = await utilsCore.percentage(dataProducts.demo_1.price, dataProducts.demo_1.specificPrice.discount);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 2);
      await Promise.all([
        expect(result.image).to.contains(dataProducts.demo_1.coverImage),
        expect(result.description).to.equal(`${dataProducts.demo_1.name} S - White`),
        expect(result.reference).to.equal(dataProducts.demo_1.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(availableStockCombinationProduct),
        expect(result.price).to.equal(parseFloat((dataProducts.demo_1.price - discountValue).toFixed(2))),
      ]);
    });

    it('should add to cart \'Virtual product\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addVirtualProduct', baseContext);

      const productToSelect = `${dataProducts.demo_18.name} - €${dataProducts.demo_18.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, dataProducts.demo_18, productToSelect);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 3);
      await Promise.all([
        expect(result.image).to.contains(dataProducts.demo_18.thumbImage),
        expect(result.description).to.equal(dataProducts.demo_18.name),
        expect(result.reference).to.equal(dataProducts.demo_18.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(availableStockVirtualProduct),
        expect(result.price).to.equal(dataProducts.demo_18.price),
      ]);
    });

    it('should add to cart \'Pack of products( min quantity = 2)\' and check error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addPackOfProducts', baseContext);

      const productToSelect = `${packOfProducts.name} - €${packOfProducts.price.toFixed(2)}`;
      const alertMessage = await boOrdersCreatePage.addProductToCartAndGetAlert(
        page,
        packOfProducts.name,
        productToSelect,
      );
      expect(alertMessage).to.equal('You must add a minimum quantity of 2');
    });

    it('should increase the quantity of \'Pack of products\' and add it to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'increaseQuantityPackOfProducts', baseContext);

      const productToSelect = `${packOfProducts.name} - €${packOfProducts.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, packOfProducts, productToSelect, 2);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 4);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(packOfProducts.name),
        expect(result.reference).to.equal(packOfProducts.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(packOfProducts.quantity),
        expect(result.price).to.equal(packOfProducts.price * 2),
      ]);
    });

    it('should add to cart \'Customized product\' and check error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchCustomizedProduct', baseContext);

      const productToSelect = `${dataProducts.demo_14.name} - €${dataProducts.demo_14.priceTaxExcluded.toFixed(2)}`;

      const alertMessage = await boOrdersCreatePage.addProductToCartAndGetAlert(page, dataProducts.demo_14.name, productToSelect);
      expect(alertMessage).to.equal('Please fill in all the required fields.');
    });

    it('should add customized text to \'Customized product\' and add it to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addCustomizedValueAndAddToCart', baseContext);

      const productToSelect = `${customizedProduct.name} - €${customizedProduct.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, customizedProduct, productToSelect, 1, customizedValue);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 5);
      await Promise.all([
        expect(result.image).to.contains(customizedProduct.thumbImage),
        expect(result.description).to.equal(
          `${customizedProduct.name} Type your text here : ${customizedValue}`),
        expect(result.reference).to.equal(customizedProduct.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(availableStockCustomizedProduct),
        expect(result.price).to.equal(customizedProduct.price),
      ]);
    });

    it('should add to cart product \'Out of stock allowed\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToCartProductOutOfStockAllowed', baseContext);

      const productToSelect = `${productOutOfStockAllowed.name} - €${productOutOfStockAllowed.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, productOutOfStockAllowed, productToSelect);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 6);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(productOutOfStockAllowed.name),
        expect(result.reference).to.equal(productOutOfStockAllowed.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(productOutOfStockAllowed.quantity),
        expect(result.price).to.equal(productOutOfStockAllowed.price),
      ]);
    });

    it('should add to cart product \'Out of stock not allowed\' and check error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToCartProductOutOfStockNotAllowed', baseContext);

      const productToSelect = `${productOutOfStockNotAllowed.name} - €${productOutOfStockNotAllowed.price.toFixed(2)}`;
      const alertMessage = await boOrdersCreatePage.addProductToCartAndGetAlert(
        page,
        productOutOfStockNotAllowed.name,
        productToSelect,
      );
      expect(alertMessage).to.equal('There are not enough products in stock.');
    });

    it('should add to cart product \'With specific price\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToCartProductWithSpecificPrice', baseContext);

      const productToSelect = `${productWithSpecificPrice.name} - €${productWithSpecificPrice.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, productWithSpecificPrice, productToSelect, 2);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 7);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(productWithSpecificPrice.name),
        expect(result.reference).to.equal(productWithSpecificPrice.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(productWithSpecificPrice.quantity),
        expect(result.price).to.equal(productWithSpecificPrice.price),
      ]);
    });

    it('should add to cart product \'With ecotax\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToCartProductWithEcoTax', baseContext);

      const productToSelect = `${productWithEcoTax.name} - €${productWithEcoTax.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, productWithEcoTax, productToSelect, 1);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 8);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(productWithEcoTax.name),
        expect(result.reference).to.equal(productWithEcoTax.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(productWithEcoTax.quantity),
        expect(result.price).to.equal(productWithEcoTax.price),
      ]);
    });

    it('should add to cart product \'With cart rule\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToCartProductWithCartRule', baseContext);

      const productToSelect = `${productWithCartRule.name} - €${productWithCartRule.price.toFixed(2)}`;
      await boOrdersCreatePage.addProductToCart(page, productWithCartRule, productToSelect, 1);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 9);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(productWithCartRule.name),
        expect(result.reference).to.equal(productWithCartRule.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(productWithCartRule.quantity),
        expect(result.price).to.equal(productWithCartRule.price),
      ]);
    });

    it('should check the gift product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkGiftProduct', baseContext);

      const result = await boOrdersCreatePage.getProductGiftDetailsFromTable(page, 10);
      await Promise.all([
        expect(result.image).to.contains(dataProducts.demo_13.coverImage),
        expect(result.description).to.equal(dataProducts.demo_13.name),
        expect(result.reference).to.equal(dataProducts.demo_13.reference),
        expect(result.basePrice).to.equal('Gift'),
        expect(result.quantity).to.equal(1),
        expect(result.price).to.equal('Gift'),
      ]);
    });

    it('should increase the quantity of the product \'With cart rule\' and check details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'increaseQuantityOfProductWithCartRule', baseContext);

      await boOrdersCreatePage.addProductQuantity(page, 2, 9);

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 9);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(productWithCartRule.name),
        expect(result.reference).to.equal(productWithCartRule.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(productWithCartRule.quantity),
        expect(result.price).to.equal(productWithCartRule.price * 2),
      ]);
    });

    it('should remove the product \'With cart rule\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'removeProduct', baseContext);

      const isProductNotVisible = await boOrdersCreatePage.removeProduct(page, 9);
      expect(isProductNotVisible, 'Product is still visible in the cart!').to.eq(true);
    });

    it('should check that the gift is removed from the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkThatTheGiftIsRemoved', baseContext);

      const isGiftNotVisible = await boOrdersCreatePage.isProductNotVisibleInCart(page, 10);
      expect(isGiftNotVisible, 'The gift is still visible in the cart!').to.eq(true);
    });

    it('should select another currency and check that the price is changed', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectAnotherCurrency', baseContext);

      await boOrdersCreatePage.selectAnotherCurrency(page, 'Moroccan Dirham (MAD)');

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 8);
      await Promise.all([
        expect(result.image).to.contains('en-default-small_default.jpg'),
        expect(result.description).to.equal(productWithEcoTax.name),
        expect(result.reference).to.equal(productWithEcoTax.reference),
        expect(result.quantityMin).to.equal(1),
        expect(result.quantityMax).to.equal(productWithEcoTax.quantity),
        expect(result.price).to.not.equal(productWithEcoTax.price),
      ]);
    });

    it('should select another language and check that the language is changed', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectAnotherLanguage', baseContext);

      await boOrdersCreatePage.selectAnotherLanguage(page, 'Français (French)');
      await boOrdersCreatePage.waitForVisibleProductImage(page, 3, dataProducts.demo_18.thumbImageFR ?? '');

      const result = await boOrdersCreatePage.getProductDetailsFromTable(page, 3);
      expect(result.description).to.contains(dataProducts.demo_18.nameFR);
    });
  });

  // Post-condition: Delete the created products
  bulkDeleteProductsTest(prefixNewProduct, `${baseContext}_postTest_1`);

  // Post-condition: Disable EcoTax
  disableEcoTaxTest(`${baseContext}_postTest_2`);

  // Post-condition: Delete currency
  deleteCurrencyTest(dataCurrencies.mad, `${baseContext}_postTest_3`);

  // Post-condition: Delete cart rule
  deleteCartRuleTest(newCartRuleData.name, `${baseContext}_postTest_4`);
});
