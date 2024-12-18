# ./vendor/bin/behat -c tests/Integration/Behaviour/behat.yml -s product --tags product-management-shop-collection
@restore-products-before-feature
@clear-cache-before-feature
@restore-shops-after-feature
@restore-languages-after-feature
@reset-img-after-feature
@clear-cache-after-feature
@product-multishop
@product-management-shop-collection
Feature: Copy product from shop to shop.
  As a BO user I want to be able to copy product from shop to shop.

  Background:
    Given I enable multishop feature
    And language with iso code "en" is the default one
    And language "english" with locale "en-US" exists
    And language "french" with locale "fr-FR" exists
    And attribute group "Size" named "Size" in en language exists
    And attribute group "Color" named "Color" in en language exists
    And attribute "S" named "S" in en language exists
    And attribute "M" named "M" in en language exists
    And attribute "L" named "L" in en language exists
    And attribute "White" named "White" in en language exists
    And attribute "Black" named "Black" in en language exists
    And attribute "Blue" named "Blue" in en language exists
    And manufacturer studioDesign named "Studio Design" exists
    And manufacturer graphicCorner named "Graphic Corner" exists
    And shop "shop1" with name "test_shop" exists
    And shop group "default_shop_group" with name "Default" exists
    And I add a shop "shop2" with name "test_second_shop" and color "red" for the group "default_shop_group"
    And I add a shop group "test_second_shop_group" with name "Test second shop group" and color "green"
    And I add a shop "shop3" with name "test_third_shop" and color "blue" for the group "test_second_shop_group"
    And I add a shop "shop4" with name "test_shop_without_url" and color "blue" for the group "test_second_shop_group"
    And single shop context is loaded
    And language "french" with locale "fr-FR" exists
    And I add product "product" to shop "shop1" with following information:
      | name[en-US] | magic staff |
      | type        | standard    |
    And default shop for product product is shop1
    And I set following shops for product "product":
      | source shop | shop1                   |
      | shops       | shop1,shop2,shop3,shop4 |
    Then product product is associated to shops "shop1,shop2,shop3,shop4"

  Scenario: I can update product information for specific shops
    #
    ## First check that the content is the same for all shops and have the default values
    #
    Then product "product" should have following options for shops "shop1,shop2,shop3,shop4":
      | product option      | value |
      | visibility          | both  |
      | available_for_order | true  |
      | online_only         | false |
      | show_price          | true  |
      | condition           | new   |
      | show_condition      | false |
      | manufacturer        |       |
    Then product product should have following prices information for shops "shop1,shop2,shop3,shop4":
      | price           | 0               |
      | ecotax          | 0               |
      | tax rules group | US-FL Rate (6%) |
      | on_sale         | false           |
      | wholesale_price | 0               |
      | unit_price      | 0               |
      | unity           |                 |
    And product "product" should have following seo options for shops "shop1,shop2,shop3,shop4":
      | redirect_type   | default |
      | redirect_target |         |
    And product product should have following shipping information for shops "shop1,shop2,shop3,shop4":
      | width                                   | 0       |
      | height                                  | 0       |
      | depth                                   | 0       |
      | weight                                  | 0       |
      | additional_shipping_cost                | 0       |
      | delivery time notes type                | default |
      | delivery time in stock notes[en-US]     |         |
      | delivery time in stock notes[fr-FR]     |         |
      | delivery time out of stock notes[en-US] |         |
      | delivery time out of stock notes[fr-FR] |         |
    And product "product" should have following stock information for shops "shop1,shop2,shop3,shop4":
      | pack_stock_type     | default |
      | minimal_quantity    | 1       |
      | low_stock_threshold | 0       |
      | low_stock_alert     | false   |
      | available_date      |         |
    And product "product" should have following details:
      | product detail | value |
      | isbn           |       |
      | upc            |       |
      | ean13          |       |
      | mpn            |       |
      | reference      |       |
    # Product status
    And product "product" should be disabled for shops "shop1,shop2,shop3,shop4"
    ## Multilang fields
    Then product "product" localized "name" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value       |
      | en-US  | magic staff |
      | fr-FR  |             |
    And product "product" localized "description" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "description_short" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    Then product "product" localized "meta_title" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "meta_description" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "link_rewrite" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value       |
      | en-US  | magic-staff |
      | fr-FR  |             |
    And product "product" localized "available_now_labels" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "available_later_labels" for shops "shop1,shop2,shop3,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    #
    ## Now update fields for shop2 and shop3
    #
    When I update product "product" for shops "shop2,shop3" with following values:
      # Basic information
      | name[en-US]                             | cool magic staff                |
      | name[fr-FR]                             | baton magique cool              |
      | description[en-US]                      | such a cool magic staff         |
      | description[fr-FR]                      | tellement cool ce baton magique |
      | description_short[en-US]                | cool magic staff                |
      | description_short[fr-FR]                | baton magique cool              |
      # Options
      | visibility                              | catalog                         |
      | available_for_order                     | false                           |
      | online_only                             | true                            |
      | show_price                              | false                           |
      | condition                               | used                            |
      | show_condition                          | true                            |
      | manufacturer                            | studioDesign                    |
      # Prices
      | price                                   | 100.99                          |
      | ecotax                                  | 0                               |
      | tax rules group                         | US-AL Rate (4%)                 |
      | on_sale                                 | true                            |
      | wholesale_price                         | 70                              |
      | unit_price                              | 10                              |
      | unity                                   | bag of ten                      |
      # SEO
      | meta_title[en-US]                       | magic staff meta title          |
      | meta_description[en-US]                 | magic staff meta description    |
      | link_rewrite[en-US]                     | magic-staff                     |
      | meta_title[fr-FR]                       | titre baton magique cool        |
      | meta_description[fr-FR]                 | description baton magique cool  |
      | link_rewrite[fr-FR]                     | baton-magique-cool              |
      | redirect_type                           | 404                             |
      | redirect_target                         |                                 |
      # Shipping
      | width                                   | 10.5                            |
      | height                                  | 6                               |
      | depth                                   | 7                               |
      | weight                                  | 0.5                             |
      | additional_shipping_cost                | 12                              |
      | delivery time notes type                | specific                        |
      | delivery time in stock notes[en-US]     | product in stock                |
      | delivery time in stock notes[fr-FR]     | produit en stock                |
      | delivery time out of stock notes[en-US] | product out of stock            |
      | delivery time out of stock notes[fr-FR] | produit en rupture de stock     |
      # Stock
      | pack_stock_type                         | products_only                   |
      | minimal_quantity                        | 24                              |
      | low_stock_threshold                     | 0                               |
      | low_stock_alert                         | false                           |
      | available_date                          | 1969-09-16                      |
      | available_now_labels[en-US]             | get it now                      |
      | available_now_labels[fr-FR]             | chope le maintenant             |
      | available_later_labels[en-US]           | too late bro                    |
      | available_later_labels[fr-FR]           | trop tard mec                   |
      # Details common to all shops
      | isbn                                    | 978-3-16-148410-0               |
      | upc                                     | 72527273070                     |
      | ean13                                   | 978020137962                    |
      | mpn                                     | mpn1                            |
      | reference                               | ref1                            |
      # Status
      | active                                  | true                            |
    #
    ## Now check the content for shop2 and shop3 match with the provided udpates
    #
    Then product "product" should have following options for shops "shop2,shop3":
      | product option      | value        |
      | visibility          | catalog      |
      | available_for_order | false        |
      | online_only         | true         |
      | show_price          | false        |
      | condition           | used         |
      | show_condition      | true         |
      | manufacturer        | studioDesign |
    Then product product should have following prices information for shops "shop2,shop3":
      | price           | 100.99          |
      | ecotax          | 0               |
      | tax rules group | US-AL Rate (4%) |
      | on_sale         | true            |
      | wholesale_price | 70              |
      | unit_price      | 10              |
      | unity           | bag of ten      |
    And product "product" should have following seo options for shops "shop2,shop3":
      | redirect_type   | 404 |
      | redirect_target |     |
    And product product should have following shipping information for shops "shop2,shop3":
      | width                                   | 10.5                        |
      | height                                  | 6                           |
      | depth                                   | 7                           |
      | weight                                  | 0.5                         |
      | additional_shipping_cost                | 12                          |
      | delivery time notes type                | specific                    |
      | delivery time in stock notes[en-US]     | product in stock            |
      | delivery time in stock notes[fr-FR]     | produit en stock            |
      | delivery time out of stock notes[en-US] | product out of stock        |
      | delivery time out of stock notes[fr-FR] | produit en rupture de stock |
    And product "product" should have following stock information for shops "shop2,shop3":
      | pack_stock_type     | products_only |
      | minimal_quantity    | 24            |
      | low_stock_threshold | 0             |
      | low_stock_alert     | false         |
      | available_date      | 1969-09-16    |
    And product "product" should have following details:
      | product detail | value             |
      | isbn           | 978-3-16-148410-0 |
      | upc            | 72527273070       |
      | ean13          | 978020137962      |
      | mpn            | mpn1              |
      | reference      | ref1              |
    # Product status
    And product "product" should be enabled for shops "shop2,shop3"
    ## Multilang fields
    Then product "product" localized "name" for shops "shop2,shop3" should be:
      | locale | value              |
      | en-US  | cool magic staff   |
      | fr-FR  | baton magique cool |
    And product "product" localized "description" for shops "shop2,shop3" should be:
      | locale | value                           |
      | en-US  | such a cool magic staff         |
      | fr-FR  | tellement cool ce baton magique |
    And product "product" localized "description_short" for shops "shop2,shop3" should be:
      | locale | value              |
      | en-US  | cool magic staff   |
      | fr-FR  | baton magique cool |
    Then product "product" localized "meta_title" for shops "shop2,shop3" should be:
      | locale | value                    |
      | en-US  | magic staff meta title   |
      | fr-FR  | titre baton magique cool |
    And product "product" localized "meta_description" for shops "shop2,shop3" should be:
      | locale | value                          |
      | en-US  | magic staff meta description   |
      | fr-FR  | description baton magique cool |
    And product "product" localized "link_rewrite" for shops "shop2,shop3" should be:
      | locale | value              |
      | en-US  | magic-staff        |
      | fr-FR  | baton-magique-cool |
    And product "product" localized "available_now_labels" for shops "shop2,shop3" should be:
      | locale | value               |
      | en-US  | get it now          |
      | fr-FR  | chope le maintenant |
    And product "product" localized "available_later_labels" for shops "shop2,shop3" should be:
      | locale | value         |
      | en-US  | too late bro  |
      | fr-FR  | trop tard mec |
    #
    ## Now check the content for shop1 and shop4, it should still be the default values everywhere
    ## except for the values that are common to all shops
    #
    Then product "product" should have following options for shops "shop1,shop4":
      | product option      | value        |
      | visibility          | both         |
      | available_for_order | true         |
      | online_only         | false        |
      | show_price          | true         |
      | condition           | new          |
      | show_condition      | false        |
      | manufacturer        | studioDesign |
    Then product product should have following prices information for shops "shop1,shop4":
      | price           | 0               |
      | ecotax          | 0               |
      | tax rules group | US-FL Rate (6%) |
      | on_sale         | false           |
      | wholesale_price | 0               |
      | unit_price      | 0               |
      | unity           |                 |
    And product "product" should have following seo options for shops "shop1,shop4":
      | redirect_type   | default |
      | redirect_target |         |
    And product product should have following shipping information for shops "shop1,shop4":
      | width                                   | 10.5     |
      | height                                  | 6        |
      | depth                                   | 7        |
      | weight                                  | 0.5      |
      | additional_shipping_cost                | 0        |
      | delivery time notes type                | specific |
      | delivery time in stock notes[en-US]     |          |
      | delivery time in stock notes[fr-FR]     |          |
      | delivery time out of stock notes[en-US] |          |
      | delivery time out of stock notes[fr-FR] |          |
    And product "product" should have following stock information for shops "shop1,shop4":
      | pack_stock_type     | default |
      | minimal_quantity    | 1       |
      | low_stock_threshold | 0       |
      | low_stock_alert     | false   |
      | available_date      |         |
    And product "product" should have following details:
      | product detail | value             |
      | isbn           | 978-3-16-148410-0 |
      | upc            | 72527273070       |
      | ean13          | 978020137962      |
      | mpn            | mpn1              |
      | reference      | ref1              |
    # Product status
    And product "product" should be disabled for shops "shop1,shop4"
    ## Multilang fields
    Then product "product" localized "name" for shops "shop1,shop4" should be:
      | locale | value       |
      | en-US  | magic staff |
      | fr-FR  |             |
    And product "product" localized "description" for shops "shop1,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "description_short" for shops "shop1,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    Then product "product" localized "meta_title" for shops "shop1,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "meta_description" for shops "shop1,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "link_rewrite" for shops "shop1,shop4" should be:
      | locale | value       |
      | en-US  | magic-staff |
      | fr-FR  |             |
    And product "product" localized "available_now_labels" for shops "shop1,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |
    And product "product" localized "available_later_labels" for shops "shop1,shop4" should be:
      | locale | value |
      | en-US  |       |
      | fr-FR  |       |

  Scenario: I can update product stock for specific shops
    Given product "product" should have following stock information for shops "shop1,shop2,shop3,shop4":
      | out_of_stock_type | default |
      | quantity          | 0       |
      | location          |         |
    When I update product "product" stock for shops "shop2,shop3" with following information:
      | out_of_stock_type | not_available |
      | delta_quantity    | 69            |
      | location          | upa           |
    Then product "product" should have following stock information for shops "shop2,shop3":
      | out_of_stock_type | not_available |
      | location          | upa           |
      | quantity          | 69            |
    And product "product" last stock movements for shops "shop2,shop3" should be:
      | employee   | delta_quantity |
      | Puff Daddy | 69             |
    And product "product" should have following stock information for shops "shop1,shop4":
      | out_of_stock_type | default |
      | quantity          | 0       |
      | location          |         |
    And product "product" should have no stock movements for shops "shop1,shop4"
    # Update different shops and check the appropriate stock and movements for each one
    When I update product "product" stock for shops "shop1,shop2" with following information:
      | delta_quantity | 12      |
      | location       | nowhere |
    # Shop1
    Then product "product" should have following stock information for shop shop1:
      | location | nowhere |
      | quantity | 12      |
    And product "product" last stock movements for shop shop1 should be:
      | employee   | delta_quantity |
      | Puff Daddy | 12             |
    # Shop2
    And product "product" should have following stock information for shop shop2:
      | location | nowhere |
      | quantity | 81      |
    And product "product" last stock movements for shop shop2 should be:
      | employee   | delta_quantity |
      | Puff Daddy | 12             |
      | Puff Daddy | 69             |
    # Shop3
    And product "product" should have following stock information for shop shop3:
      | location | upa |
      | quantity | 69  |
    And product "product" last stock movements for shop shop3 should be:
      | employee   | delta_quantity |
      | Puff Daddy | 69             |
    # Shop4
    And product "product" should have following stock information for shop shop4:
      | location |   |
      | quantity | 0 |
    And product "product" should have no stock movements for shop shop4
