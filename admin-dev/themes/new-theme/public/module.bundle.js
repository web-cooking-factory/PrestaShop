/******/!function(e){function t(i){if(o[i])return o[i].exports;var n=o[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,t),n.l=!0,n.exports}// webpackBootstrap
/******/
var o={};t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,o,i){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=437)}({206:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=o(36),n=o(267),l=o(268);(0,window.$)(function(){var e=new i.a;new l.a,new n.a(e)})},267:function(e,t,o){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n=function(){function e(e,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),l=window.$,r=function(){function e(t){i(this,e),this.moduleCardController=t,this.DEFAULT_MAX_RECENTLY_USED=10,this.DEFAULT_MAX_PER_CATEGORIES=6,this.DISPLAY_GRID="grid",this.DISPLAY_LIST="list",this.CATEGORY_RECENTLY_USED="recently-used",this.currentCategoryDisplay={},this.currentDisplay="",this.isCategoryGridDisplayed=!1,this.currentTagsList=[],this.currentRefCategory=null,this.currentRefStatus=null,this.currentSorting=null,this.baseAddonsUrl="https://addons.prestashop.com/",this.pstaggerInput=null,this.lastBulkAction=null,this.isUploadStarted=!1,this.recentlyUsedSelector="#module-recently-used-list .modules-list",this.modulesList=[],this.addonsCardGrid=null,this.addonsCardList=null,this.moduleShortList=".module-short-list",this.seeMoreSelector=".see-more",this.seeLessSelector=".see-less",this.moduleItemGridSelector=".module-item-grid",this.moduleItemListSelector=".module-item-list",this.categorySelectorLabelSelector=".module-category-selector-label",this.categorySelector=".module-category-selector",this.categoryItemSelector=".module-category-menu",this.addonsLoginButtonSelector="#addons_login_btn",this.categoryResetBtnSelector=".module-category-reset",this.moduleInstallBtnSelector="input.module-install-btn",this.moduleSortingDropdownSelector=".module-sorting-author select",this.categoryGridSelector="#modules-categories-grid",this.categoryGridItemSelector=".module-category-item",this.addonItemGridSelector=".module-addons-item-grid",this.addonItemListSelector=".module-addons-item-list",this.upgradeAllSource=".module_action_menu_upgrade_all",this.upgradeAllTargets="#modules-list-container-update .module_action_menu_upgrade:visible",this.bulkActionDropDownSelector=".module-bulk-actions",this.bulkItemSelector=".module-bulk-menu",this.bulkActionCheckboxListSelector=".module-checkbox-bulk-list input",this.bulkActionCheckboxGridSelector=".module-checkbox-bulk-grid input",this.checkedBulkActionListSelector=this.bulkActionCheckboxListSelector+":checked",this.checkedBulkActionGridSelector=this.bulkActionCheckboxGridSelector+":checked",this.bulkActionCheckboxSelector="#module-modal-bulk-checkbox",this.bulkConfirmModalSelector="#module-modal-bulk-confirm",this.bulkConfirmModalActionNameSelector="#module-modal-bulk-confirm-action-name",this.bulkConfirmModalListSelector="#module-modal-bulk-confirm-list",this.bulkConfirmModalAckBtnSelector="#module-modal-confirm-bulk-ack",this.placeholderGlobalSelector=".module-placeholders-wrapper",this.placeholderFailureGlobalSelector=".module-placeholders-failure",this.placeholderFailureMsgSelector=".module-placeholders-failure-msg",this.placeholderFailureRetryBtnSelector="#module-placeholders-failure-retry",this.statusSelectorLabelSelector=".module-status-selector-label",this.statusItemSelector=".module-status-menu",this.statusResetBtnSelector=".module-status-reset",this.addonsConnectModalBtnSelector="#page-header-desc-configuration-addons_connect",this.addonsLogoutModalBtnSelector="#page-header-desc-configuration-addons_logout",this.addonsImportModalBtnSelector="#page-header-desc-configuration-add_module",this.dropZoneModalSelector="#module-modal-import",this.dropZoneModalFooterSelector="#module-modal-import .modal-footer",this.dropZoneImportZoneSelector="#importDropzone",this.addonsConnectModalSelector="#module-modal-addons-connect",this.addonsLogoutModalSelector="#module-modal-addons-logout",this.addonsConnectForm="#addons-connect-form",this.moduleImportModalCloseBtn="#module-modal-import-closing-cross",this.moduleImportStartSelector=".module-import-start",this.moduleImportProcessingSelector=".module-import-processing",this.moduleImportSuccessSelector=".module-import-success",this.moduleImportSuccessConfigureBtnSelector=".module-import-success-configure",this.moduleImportFailureSelector=".module-import-failure",this.moduleImportFailureRetrySelector=".module-import-failure-retry",this.moduleImportFailureDetailsBtnSelector=".module-import-failure-details-action",this.moduleImportSelectFileManualSelector=".module-import-start-select-manual",this.moduleImportFailureMsgDetailsSelector=".module-import-failure-details",this.moduleImportConfirmSelector=".module-import-confirm",this.initSortingDropdown(),this.initBOEventRegistering(),this.initCurrentDisplay(),this.initSortingDisplaySwitch(),this.initBulkDropdown(),this.initSearchBlock(),this.initCategorySelect(),this.initCategoriesGrid(),this.initActionButtons(),this.initAddonsSearch(),this.initAddonsConnect(),this.initAddModuleAction(),this.initDropzone(),this.initPageChangeProtection(),this.initPlaceholderMechanism(),this.initFilterStatusDropdown(),this.fetchModulesList(),this.getNotificationsCount(),this.initializeSeeMore()}return n(e,[{key:"initFilterStatusDropdown",value:function(){var e=this,t=l("body");t.on("click",e.statusItemSelector,function(){e.currentRefStatus=parseInt(l(this).data("status-ref"),10),l(e.statusSelectorLabelSelector).text(l(this).find("a:first").text()),l(e.statusResetBtnSelector).show(),e.updateModuleVisibility()}),t.on("click",e.statusResetBtnSelector,function(){l(e.statusSelectorLabelSelector).text(l(this).find("a").text()),l(this).hide(),e.currentRefStatus=null,e.updateModuleVisibility()})}},{key:"initBulkDropdown",value:function(){var e=this,t=l("body");t.on("click",e.getBulkCheckboxesSelector(),function(){var t=l(e.bulkActionDropDownSelector);l(e.getBulkCheckboxesCheckedSelector()).length>0?t.closest(".module-top-menu-item").removeClass("disabled"):t.closest(".module-top-menu-item").addClass("disabled")}),t.on("click",e.bulkItemSelector,function(){if(0===l(e.getBulkCheckboxesCheckedSelector()).length)return void l.growl.warning({message:window.translate_javascripts["Bulk Action - One module minimum"]});e.lastBulkAction=l(this).data("ref");var t=e.buildBulkActionModuleList(),o=l(this).find(":checked").text().toLowerCase();l(e.bulkConfirmModalListSelector).html(t),l(e.bulkConfirmModalActionNameSelector).text(o),"bulk-uninstall"===e.lastBulkAction?l(e.bulkActionCheckboxSelector).show():l(e.bulkActionCheckboxSelector).hide(),l(e.bulkConfirmModalSelector).modal("show")}),t.on("click",this.bulkConfirmModalAckBtnSelector,function(t){t.preventDefault(),t.stopPropagation(),l(e.bulkConfirmModalSelector).modal("hide"),e.doBulkAction(e.lastBulkAction)})}},{key:"initBOEventRegistering",value:function(){window.BOEvent.on("Module Disabled",this.onModuleDisabled,this),window.BOEvent.on("Module Uninstalled",this.updateTotalResults,this)}},{key:"onModuleDisabled",value:function(){var e=this;e.getModuleItemSelector();l(".modules-list").each(function(){e.updateTotalResults()})}},{key:"initPlaceholderMechanism",value:function(){var e=this;l(e.placeholderGlobalSelector).length&&e.ajaxLoadPage(),l("body").on("click",e.placeholderFailureRetryBtnSelector,function(){l(e.placeholderFailureGlobalSelector).fadeOut(),l(e.placeholderGlobalSelector).fadeIn(),e.ajaxLoadPage()})}},{key:"ajaxLoadPage",value:function(){var e=this;l.ajax({method:"GET",url:window.moduleURLs.catalogRefresh}).done(function(t){if(!0===t.status){void 0===t.domElements&&(t.domElements=null),void 0===t.msg&&(t.msg=null);var o=document.styleSheets[0];o.insertRule?o.insertRule(".modules-list,.module-sorting-menu{display: none}",o.cssRules.length):o.addRule&&o.addRule(".modules-list,.module-sorting-menu","{display: none}",-1),l(e.placeholderGlobalSelector).fadeOut(800,function(){l.each(t.domElements,function(e,t){l(t.selector).append(t.content)}),l(".modules-list").fadeIn(800).css("display","flex"),l(".module-sorting-menu").fadeIn(800),l('[data-toggle="popover"]').popover(),e.initCurrentDisplay(),e.fetchModulesList()})}else l(e.placeholderGlobalSelector).fadeOut(800,function(){l(e.placeholderFailureMsgSelector).text(t.msg),l(e.placeholderFailureGlobalSelector).fadeIn(800)})}).fail(function(t){l(e.placeholderGlobalSelector).fadeOut(800,function(){l(e.placeholderFailureMsgSelector).text(t.statusText),l(e.placeholderFailureGlobalSelector).fadeIn(800)})})}},{key:"fetchModulesList",value:function(){var e=this,t=void 0,o=void 0;e.modulesList=[],l(".modules-list").each(function(){t=l(this),t.find(".module-item").each(function(){o=l(this),e.modulesList.push({domObject:o,id:o.data("id"),name:o.data("name").toLowerCase(),scoring:parseFloat(o.data("scoring")),logo:o.data("logo"),author:o.data("author").toLowerCase(),version:o.data("version"),description:o.data("description").toLowerCase(),techName:o.data("tech-name").toLowerCase(),childCategories:o.data("child-categories"),categories:String(o.data("categories")).toLowerCase(),type:o.data("type"),price:parseFloat(o.data("price")),active:parseInt(o.data("active"),10),access:o.data("last-access"),display:o.hasClass("module-item-list")?e.DISPLAY_LIST:e.DISPLAY_GRID,container:t}),o.remove()})}),e.addonsCardGrid=l(this.addonItemGridSelector),e.addonsCardList=l(this.addonItemListSelector),e.updateModuleVisibility(),l("body").trigger("moduleCatalogLoaded")}},{key:"updateModuleSorting",value:function(){var e=this;if(e.currentSorting){var t="asc",o=e.currentSorting,i=o.split("-");i.length>1&&(o=i[0],"desc"===i[1]&&(t="desc"));var n=function(e,t){var i=e[o],n=t[o];return"access"===o&&(i=new Date(i).getTime(),n=new Date(n).getTime(),i=isNaN(i)?0:i,n=isNaN(n)?0:n),i<n?-1:i>n?1:0};e.modulesList.sort(n),"desc"===t&&e.modulesList.reverse()}}},{key:"updateModuleContainerDisplay",value:function(){var e=this;l(".module-short-list").each(function(){var t=l(this),o=t.find(".module-item").length;if(e.currentRefCategory&&e.currentRefCategory!==String(t.find(".modules-list").data("name"))||null!==e.currentRefStatus&&0===o||0===o&&String(t.find(".modules-list").data("name"))===e.CATEGORY_RECENTLY_USED||e.currentTagsList.length>0&&0===o)return void t.hide();t.show(),o>=e.DEFAULT_MAX_PER_CATEGORIES?t.find(e.seeMoreSelector+", "+e.seeLessSelector).show():t.find(e.seeMoreSelector+", "+e.seeLessSelector).hide()})}},{key:"updateModuleVisibility",value:function(){var e=this;e.updateModuleSorting(),l(e.recentlyUsedSelector).find(".module-item").remove(),l(".modules-list").find(".module-item").remove();for(var t=void 0,o=void 0,i=void 0,n=void 0,r=void 0,a=e.modulesList.length,s={},u=0;u<a;u+=1)o=e.modulesList[u],o.display===e.currentDisplay&&(t=!0,i=e.currentRefCategory===e.CATEGORY_RECENTLY_USED?e.CATEGORY_RECENTLY_USED:o.categories,null!==e.currentRefCategory&&(t&=i===e.currentRefCategory),null!==e.currentRefStatus&&(t&=o.active===e.currentRefStatus),e.currentTagsList.length&&(n=!1,l.each(e.currentTagsList,function(e,t){r=t.toLowerCase(),n|=-1!==o.name.indexOf(r)||-1!==o.description.indexOf(r)||-1!==o.author.indexOf(r)||-1!==o.techName.indexOf(r)}),t&=n),e.currentDisplay!==e.DISPLAY_LIST||e.currentTagsList.length||(void 0===e.currentCategoryDisplay[i]&&(e.currentCategoryDisplay[i]=!1),s[i]||(s[i]=0),i===e.CATEGORY_RECENTLY_USED?s[i]>=e.DEFAULT_MAX_RECENTLY_USED&&(t&=e.currentCategoryDisplay[i]):s[i]>=e.DEFAULT_MAX_PER_CATEGORIES&&(t&=e.currentCategoryDisplay[i]),s[i]+=1),t&&(e.currentRefCategory===e.CATEGORY_RECENTLY_USED?l(e.recentlyUsedSelector).append(o.domObject):o.container.append(o.domObject)));e.updateModuleContainerDisplay(),e.currentTagsList.length&&l(".modules-list").append(this.currentDisplay===e.DISPLAY_GRID?this.addonsCardGrid:this.addonsCardList),e.updateTotalResults()}},{key:"initPageChangeProtection",value:function(){var e=this;l(window).on("beforeunload",function(){if(!0===e.isUploadStarted)return"It seems some critical operation are running, are you sure you want to change page ? It might cause some unexepcted behaviors."})}},{key:"buildBulkActionModuleList",value:function(){var e=this.getBulkCheckboxesCheckedSelector(),t=this.getModuleItemSelector(),o=0,i="",n=void 0;return l(e).each(function(){return 10===o?(i+="- ...",!1):(n=l(this).closest(t),i+="- "+n.data("name")+"<br/>",o+=1,!0)}),i}},{key:"initAddonsConnect",value:function(){var e=this;"#"===l(e.addonsConnectModalBtnSelector).attr("href")&&(l(e.addonsConnectModalBtnSelector).attr("data-toggle","modal"),l(e.addonsConnectModalBtnSelector).attr("data-target",e.addonsConnectModalSelector)),"#"===l(e.addonsLogoutModalBtnSelector).attr("href")&&(l(e.addonsLogoutModalBtnSelector).attr("data-toggle","modal"),l(e.addonsLogoutModalBtnSelector).attr("data-target",e.addonsLogoutModalSelector)),l("body").on("submit",e.addonsConnectForm,function(t){t.preventDefault(),t.stopPropagation(),l.ajax({method:"POST",url:l(this).attr("action"),dataType:"json",data:l(this).serialize(),beforeSend:function(){l(e.addonsLoginButtonSelector).show(),l('button.btn[type="submit"]',e.addonsConnectForm).hide()}}).done(function(t){1===t.success?location.reload():(l.growl.error({message:t.message}),l(e.addonsLoginButtonSelector).hide(),l('button.btn[type="submit"]',e.addonsConnectForm).fadeIn())})})}},{key:"initAddModuleAction",value:function(){var e=this,t=l(e.addonsImportModalBtnSelector);t.attr("data-toggle","modal"),t.attr("data-target",e.dropZoneModalSelector)}},{key:"initDropzone",value:function(){var e=this,t=l("body"),o=l(".dropzone");t.on("click",this.moduleImportFailureRetrySelector,function(){l(e.moduleImportSuccessSelector+","+e.moduleImportFailureSelector+","+e.moduleImportProcessingSelector).fadeOut(function(){setTimeout(function(){l(e.moduleImportStartSelector).fadeIn(function(){l(e.moduleImportFailureMsgDetailsSelector).hide(),l(e.moduleImportSuccessConfigureBtnSelector).hide(),o.removeAttr("style")})},550)})}),t.on("hidden.bs.modal",this.dropZoneModalSelector,function(){l(e.moduleImportSuccessSelector+", "+e.moduleImportFailureSelector).hide(),l(e.moduleImportStartSelector).show(),o.removeAttr("style"),l(e.moduleImportFailureMsgDetailsSelector).hide(),l(e.moduleImportSuccessConfigureBtnSelector).hide(),l(e.dropZoneModalFooterSelector).html(""),l(e.moduleImportConfirmSelector).hide()}),t.on("click",".dropzone:not("+this.moduleImportSelectFileManualSelector+", "+this.moduleImportSuccessConfigureBtnSelector+")",function(e,t){void 0===t&&(e.stopPropagation(),e.preventDefault())}),t.on("click",this.moduleImportSelectFileManualSelector,function(e){e.stopPropagation(),e.preventDefault(),l(".dz-hidden-input").trigger("click",["manual_select"])}),t.on("click",this.moduleImportModalCloseBtn,function(){!0!==e.isUploadStarted&&l(e.dropZoneModalSelector).modal("hide")}),t.on("click",this.moduleImportSuccessConfigureBtnSelector,function(e){e.stopPropagation(),e.preventDefault(),window.location=l(this).attr("href")}),t.on("click",this.moduleImportFailureDetailsBtnSelector,function(){l(e.moduleImportFailureMsgDetailsSelector).slideDown()});var i={url:window.moduleURLs.moduleImport,acceptedFiles:".zip, .tar",paramName:"file_uploaded",maxFilesize:50,uploadMultiple:!1,addRemoveLinks:!0,dictDefaultMessage:"",hiddenInputContainer:e.dropZoneImportZoneSelector,timeout:0,addedfile:function(){e.animateStartUpload()},processing:function(){},error:function(t,o){e.displayOnUploadError(o)},complete:function(t){if("error"!==t.status){var o=l.parseJSON(t.xhr.response);void 0===o.is_configurable&&(o.is_configurable=null),void 0===o.module_name&&(o.module_name=null),e.displayOnUploadDone(o)}e.isUploadStarted=!1}};o.dropzone(l.extend(i))}},{key:"animateStartUpload",value:function(){var e=this,t=l(".dropzone");e.isUploadStarted=!0,l(e.moduleImportStartSelector).hide(0),t.css("border","none"),l(e.moduleImportProcessingSelector).fadeIn()}},{key:"animateEndUpload",value:function(e){l(this.moduleImportProcessingSelector).finish().fadeOut(e)}},{key:"displayOnUploadDone",value:function(e){var t=this;t.animateEndUpload(function(){if(!0===e.status){if(!0===e.is_configurable){var o=window.moduleURLs.configurationPage.replace(/:number:/,e.module_name);l(t.moduleImportSuccessConfigureBtnSelector).attr("href",o),l(t.moduleImportSuccessConfigureBtnSelector).show()}l(t.moduleImportSuccessSelector).fadeIn()}else void 0!==e.confirmation_subject?t.displayPrestaTrustStep(e):(l(t.moduleImportFailureMsgDetailsSelector).html(e.msg),l(t.moduleImportFailureSelector).fadeIn())})}},{key:"displayOnUploadError",value:function(e){var t=this;t.animateEndUpload(function(){l(t.moduleImportFailureMsgDetailsSelector).html(e),l(t.moduleImportFailureSelector).fadeIn()})}},{key:"displayPrestaTrustStep",value:function(e){var t=this,o=t.moduleCardController._replacePrestaTrustPlaceholders(e),i=e.module.attributes.name;l(this.moduleImportConfirmSelector).html(o.find(".modal-body").html()).fadeIn(),l(this.dropZoneModalFooterSelector).html(o.find(".modal-footer").html()).fadeIn(),l(this.dropZoneModalFooterSelector).find(".pstrust-install").off("click").on("click",function(){l(t.moduleImportConfirmSelector).hide(),l(t.dropZoneModalFooterSelector).html(""),t.animateStartUpload(),l.post(e.module.attributes.urls.install,{"actionParams[confirmPrestaTrust]":"1"}).done(function(e){t.displayOnUploadDone(e[i])}).fail(function(e){t.displayOnUploadError(e[i])}).always(function(){t.isUploadStarted=!1})})}},{key:"getBulkCheckboxesSelector",value:function(){return this.currentDisplay===this.DISPLAY_GRID?this.bulkActionCheckboxGridSelector:this.bulkActionCheckboxListSelector}},{key:"getBulkCheckboxesCheckedSelector",value:function(){return this.currentDisplay===this.DISPLAY_GRID?this.checkedBulkActionGridSelector:this.checkedBulkActionListSelector}},{key:"getModuleItemSelector",value:function(){return this.currentDisplay===this.DISPLAY_GRID?this.moduleItemGridSelector:this.moduleItemListSelector}},{key:"getNotificationsCount",value:function(){var e=this;l.getJSON(window.moduleURLs.notificationsCount,e.updateNotificationsCount).fail(function(){})}},{key:"updateNotificationsCount",value:function(e){var t={to_configure:l("#subtab-AdminModulesNotifications"),to_update:l("#subtab-AdminModulesUpdates")};for(var o in t)0!==t[o].length&&t[o].find(".notification-counter").text(e[o])}},{key:"initAddonsSearch",value:function(){var e=this;l("body").on("click",e.addonItemGridSelector+", "+e.addonItemListSelector,function(){var t="";e.currentTagsList.length&&(t=encodeURIComponent(e.currentTagsList.join(" "))),window.open(e.baseAddonsUrl+"search.php?search_query="+t,"_blank")})}},{key:"initCategoriesGrid",value:function(){var e=this;l("body").on("click",this.categoryGridItemSelector,function(t){t.stopPropagation(),t.preventDefault();var o=l(this).data("category-ref");return e.currentTagsList.length&&(e.pstaggerInput.resetTags(!1),e.currentTagsList=[]),!!l(e.categoryItemSelector+'[data-category-ref="'+o+'"]').length&&(!0===e.isCategoryGridDisplayed&&(l(e.categoryGridSelector).fadeOut(),e.isCategoryGridDisplayed=!1),l(e.categoryItemSelector+'[data-category-ref="'+o+'"]').click(),!0)})}},{key:"initCurrentDisplay",value:function(){this.currentDisplay=""===this.currentDisplay?this.DISPLAY_LIST:this.DISPLAY_GRID}},{key:"initSortingDropdown",value:function(){var e=this;e.currentSorting=l(this.moduleSortingDropdownSelector).find(":checked").attr("value"),e.currentSorting||(e.currentSorting="access-desc"),l("body").on("change",e.moduleSortingDropdownSelector,function(){e.currentSorting=l(this).find(":checked").attr("value"),e.updateModuleVisibility()})}},{key:"doBulkAction",value:function(e){var t=this,o=l("#force_bulk_deletion").prop("checked"),i={"bulk-uninstall":"uninstall","bulk-disable":"disable","bulk-enable":"enable","bulk-disable-mobile":"disable_mobile","bulk-enable-mobile":"enable_mobile","bulk-reset":"reset"};if(void 0===i[e])return l.growl.error({message:window.translate_javascripts["Bulk Action - Request not found"].replace("[1]",e)}),!1;var n=this.getBulkCheckboxesCheckedSelector();if(l(n).length<=0)return!1;var r=[],a=void 0;l(n).each(function(){a=l(this).data("tech-name"),r.push({techName:a,actionMenuObj:l(this).closest(".module-checkbox-bulk-list").next()})});var s=void 0,u=void 0,c=void 0;return l.each(r,function(n,r){s=r.actionMenuObj,a=r.techName,u=i[e],void 0!==t.moduleCardController&&(c=l(t.moduleCardController.moduleActionMenuLinkSelector+u,s),c.length>0?t.moduleCardController._requestToController(u,c,o):l.growl.error({message:window.translate_javascripts["Bulk Action - Request not available for module"].replace("[1]",u).replace("[2]",a)}))}),!0}},{key:"initActionButtons",value:function(){var e=this;l("body").on("click",e.moduleInstallBtnSelector,function(e){var t=l(this),o=l(t.next());e.preventDefault(),t.hide(),o.show(),l.ajax({url:t.data("url"),dataType:"json"}).done(function(){o.fadeOut()})}),l("body").on("click",e.upgradeAllSource,function(t){t.preventDefault(),l(e.upgradeAllTargets).click()})}},{key:"initCategorySelect",value:function(){var e=this,t=l("body");t.on("click",e.categoryItemSelector,function(){e.currentRefCategory=l(this).data("category-ref"),e.currentRefCategory=e.currentRefCategory?String(e.currentRefCategory).toLowerCase():null,l(e.categorySelectorLabelSelector).text(l(this).data("category-display-name")),l(e.categoryResetBtnSelector).show(),e.updateModuleVisibility()}),t.on("click",e.categoryResetBtnSelector,function(){var t=l(e.categorySelector).attr("aria-labelledby"),o=t.charAt(0).toUpperCase(),i=t.slice(1),n=o+i;l(e.categorySelectorLabelSelector).text(n),l(this).hide(),e.currentRefCategory=null,e.updateModuleVisibility()})}},{key:"initSearchBlock",value:function(){var e=this,t=this;t.pstaggerInput=l("#module-search-bar").pstagger({onTagsChanged:function(e){t.currentTagsList=e,t.updateModuleVisibility()},onResetTags:function(){t.currentTagsList=[],t.updateModuleVisibility()},inputPlaceholder:window.translate_javascripts["Search - placeholder"],closingCross:!0,context:t}),l("body").on("click",".module-addons-search-link",function(t){t.preventDefault(),t.stopPropagation(),window.open(l(e).attr("href"),"_blank")})}},{key:"initSortingDisplaySwitch",value:function(){var e=this;l("body").on("click",".module-sort-switch",function(){var t=l(this).data("switch"),o=l(this).hasClass("active-display");void 0!==t&&!1===o&&(e.switchSortingDisplayTo(t),e.currentDisplay=t)})}},{key:"switchSortingDisplayTo",value:function(e){e!==this.DISPLAY_GRID&&e!==this.DISPLAY_LIST||(l(".module-sort-switch").removeClass("module-sort-active"),l("#module-sort-"+e).addClass("module-sort-active"),this.currentDisplay=e,this.updateModuleVisibility())}},{key:"initializeSeeMore",value:function(){var e=this;l(e.moduleShortList+" "+e.seeMoreSelector).on("click",function(){e.currentCategoryDisplay[l(this).data("category")]=!0,l(this).addClass("d-none"),l(this).closest(e.moduleShortList).find(e.seeLessSelector).removeClass("d-none"),e.updateModuleVisibility()}),l(e.moduleShortList+" "+e.seeLessSelector).on("click",function(){e.currentCategoryDisplay[l(this).data("category")]=!1,l(this).addClass("d-none"),l(this).closest(e.moduleShortList).find(e.seeMoreSelector).removeClass("d-none"),e.updateModuleVisibility()})}},{key:"updateTotalResults",value:function(){var e=function(e,t){var o=e.text().split(" ");o[0]=t,e.text(o.join(" "))},t=l(".module-short-list");if(t.length>0)t.each(function(){var t=l(this);e(t.find(".module-search-result-wording"),t.next(".modules-list").find(".module-item").length)});else{var o=l(".modules-list").find(".module-item").length;e(l(".module-search-result-wording"),o);var i=self.currentDisplay===self.DISPLAY_LIST?this.addonItemListSelector:this.addonItemGridSelector;l(i).toggle(o!==this.modulesList.length/2),0===o&&l(".module-addons-search-link").attr("href",this.baseAddonsUrl+"search.php?search_query="+encodeURIComponent(this.currentTagsList.join(" ")))}}}]),e}();t.a=r},268:function(e,t,o){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n=function(){function e(e,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),l=window.$,r=function(){function e(){i(this,e),e.handleImport(),e.handleEvents()}return n(e,null,[{key:"handleImport",value:function(){function e(){setTimeout(function(){o.removeClass("onclick"),o.addClass("validate",450,t)},2250)}function t(){setTimeout(function(){o.removeClass("validate")},1250)}var o=l("#module-import");o.click(function(){o.addClass("onclick",250,e)})}},{key:"handleEvents",value:function(){l("body").on("click","a.module-read-more-grid-btn, a.module-read-more-list-btn",function(e){e.preventDefault();var t=l(e.target).data("target");l.get(e.target.href,function(e){l(t).html(e),l(t).modal()})})}}]),e}();t.a=r},36:function(e,t,o){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l=function(){function e(e,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),r=window.$,a={on:function(e,t,o){document.addEventListener(e,function(e){void 0!==o?t.call(o,e):t(e)})},emitEvent:function(e,t){var o=document.createEvent(t);o.initEvent(e,!0,!0),document.dispatchEvent(o)}},s=function(){function e(){i(this,e),this.moduleActionMenuLinkSelector="button.module_action_menu_",this.moduleActionMenuInstallLinkSelector="button.module_action_menu_install",this.moduleActionMenuEnableLinkSelector="button.module_action_menu_enable",this.moduleActionMenuUninstallLinkSelector="button.module_action_menu_uninstall",this.moduleActionMenuDisableLinkSelector="button.module_action_menu_disable",this.moduleActionMenuEnableMobileLinkSelector="button.module_action_menu_enable_mobile",this.moduleActionMenuDisableMobileLinkSelector="button.module_action_menu_disable_mobile",this.moduleActionMenuResetLinkSelector="button.module_action_menu_reset",this.moduleActionMenuUpdateLinkSelector="button.module_action_menu_upgrade",this.moduleItemListSelector=".module-item-list",this.moduleItemGridSelector=".module-item-grid",this.moduleItemActionsSelector=".module-actions",this.moduleActionModalDisableLinkSelector="a.module_action_modal_disable",this.moduleActionModalResetLinkSelector="a.module_action_modal_reset",this.moduleActionModalUninstallLinkSelector="a.module_action_modal_uninstall",this.forceDeletionOption="#force_deletion",this.initActionButtons()}return l(e,[{key:"initActionButtons",value:function(){var e=this;r(document).on("click",this.forceDeletionOption,function(){var t=r(e.moduleActionModalUninstallLinkSelector,r("div.module-item-list[data-tech-name='"+r(this).attr("data-tech-name")+"']"));!0===r(this).prop("checked")?t.attr("data-deletion","true"):t.removeAttr("data-deletion")}),r(document).on("click",this.moduleActionMenuInstallLinkSelector,function(){return r("#modal-prestatrust").length&&r("#modal-prestatrust").modal("hide"),e._dispatchPreEvent("install",this)&&e._confirmAction("install",this)&&e._requestToController("install",r(this))}),r(document).on("click",this.moduleActionMenuEnableLinkSelector,function(){return e._dispatchPreEvent("enable",this)&&e._confirmAction("enable",this)&&e._requestToController("enable",r(this))}),r(document).on("click",this.moduleActionMenuUninstallLinkSelector,function(){return e._dispatchPreEvent("uninstall",this)&&e._confirmAction("uninstall",this)&&e._requestToController("uninstall",r(this))}),r(document).on("click",this.moduleActionMenuDisableLinkSelector,function(){return e._dispatchPreEvent("disable",this)&&e._confirmAction("disable",this)&&e._requestToController("disable",r(this))}),r(document).on("click",this.moduleActionMenuEnableMobileLinkSelector,function(){return e._dispatchPreEvent("enable_mobile",this)&&e._confirmAction("enable_mobile",this)&&e._requestToController("enable_mobile",r(this))}),r(document).on("click",this.moduleActionMenuDisableMobileLinkSelector,function(){return e._dispatchPreEvent("disable_mobile",this)&&e._confirmAction("disable_mobile",this)&&e._requestToController("disable_mobile",r(this))}),r(document).on("click",this.moduleActionMenuResetLinkSelector,function(){return e._dispatchPreEvent("reset",this)&&e._confirmAction("reset",this)&&e._requestToController("reset",r(this))}),r(document).on("click",this.moduleActionMenuUpdateLinkSelector,function(){return e._dispatchPreEvent("update",this)&&e._confirmAction("update",this)&&e._requestToController("update",r(this))}),r(document).on("click",this.moduleActionModalDisableLinkSelector,function(){return e._requestToController("disable",r(e.moduleActionMenuDisableLinkSelector,r("div.module-item-list[data-tech-name='"+r(this).attr("data-tech-name")+"']")))}),r(document).on("click",this.moduleActionModalResetLinkSelector,function(){return e._requestToController("reset",r(e.moduleActionMenuResetLinkSelector,r("div.module-item-list[data-tech-name='"+r(this).attr("data-tech-name")+"']")))}),r(document).on("click",this.moduleActionModalUninstallLinkSelector,function(t){r(t.target).parents(".modal").on("hidden.bs.modal",function(o){return e._requestToController("uninstall",r(e.moduleActionMenuUninstallLinkSelector,r("div.module-item-list[data-tech-name='"+r(t.target).attr("data-tech-name")+"']")),r(t.target).attr("data-deletion"))}.bind(t))})}},{key:"_getModuleItemSelector",value:function(){return r(this.moduleItemListSelector).length?this.moduleItemListSelector:this.moduleItemGridSelector}},{key:"_confirmAction",value:function(e,t){var o=r("#"+r(t).data("confirm_modal"));return 1!=o.length||(o.first().modal("show"),!1)}},{key:"_confirmPrestaTrust",value:function(e){var t=this,o=this._replacePrestaTrustPlaceholders(e);o.find(".pstrust-install").off("click").on("click",function(){var i=r(t.moduleActionMenuInstallLinkSelector,'.module-item[data-tech-name="'+e.module.attributes.name+'"]'),n=i.parent("form");r("<input>").attr({type:"hidden",value:"1",name:"actionParams[confirmPrestaTrust]"}).appendTo(n),i.click(),o.modal("hide")}),o.modal()}},{key:"_replacePrestaTrustPlaceholders",value:function(e){var t=r("#modal-prestatrust"),o=e.module.attributes;if("PrestaTrust"===e.confirmation_subject&&t.length){var i=o.prestatrust.status?"success":"warning";return o.prestatrust.check_list.property?(t.find("#pstrust-btn-property-ok").show(),t.find("#pstrust-btn-property-nok").hide()):(t.find("#pstrust-btn-property-ok").hide(),t.find("#pstrust-btn-property-nok").show(),t.find("#pstrust-buy").attr("href",o.url).toggle(null!==o.url)),t.find("#pstrust-img").attr({src:o.img,alt:o.name}),t.find("#pstrust-name").text(o.displayName),t.find("#pstrust-author").text(o.author),t.find("#pstrust-label").attr("class","text-"+i).text(o.prestatrust.status?"OK":"KO"),t.find("#pstrust-message").attr("class","alert alert-"+i),t.find("#pstrust-message > p").text(o.prestatrust.message),t}}},{key:"_dispatchPreEvent",value:function(e,t){var o=jQuery.Event("module_card_action_event");return r(t).trigger(o,[e]),!1===o.isPropagationStopped()&&!1===o.isImmediatePropagationStopped()&&!1!==o.result}},{key:"_requestToController",value:function(e,t,o){var i=this,l=t.closest(this.moduleItemActionsSelector),s=t.closest("form"),u=r('<button class="btn-primary-reverse onclick unbind spinner "></button>'),c="//"+window.location.host+s.attr("action"),d=s.serializeArray();return"true"!==o&&!0!==o||d.push({name:"actionParams[deletion]",value:!0}),r.ajax({url:c,dataType:"json",method:"POST",data:d,beforeSend:function(){l.hide(),l.after(u)}}).done(function(t){if(void 0===(void 0===t?"undefined":n(t)))r.growl.error({message:"No answer received from server"});else{var o=Object.keys(t)[0];if(!1===t[o].status)void 0!==t[o].confirmation_subject&&i._confirmPrestaTrust(t[o]),r.growl.error({message:t[o].msg});else{r.growl.notice({message:t[o].msg});var s=null,u=null;"uninstall"==e?(l.fadeOut(function(){s=i._getModuleItemSelector().replace(".",""),u=l.parents("."+s).first(),u.remove()}),a.emitEvent("Module Uninstalled","CustomEvent")):"disable"==e?(s=i._getModuleItemSelector().replace(".",""),u=l.parents("."+s).first(),u.addClass(s+"-isNotActive"),u.attr("data-active","0"),a.emitEvent("Module Disabled","CustomEvent")):"enable"==e&&(s=i._getModuleItemSelector().replace(".",""),u=l.parents("."+s).first(),u.removeClass(s+"-isNotActive"),u.attr("data-active","1"),a.emitEvent("Module Enabled","CustomEvent")),l.replaceWith(t[o].action_menu_html)}}}).always(function(){l.fadeIn(),u.remove()}),!1}}]),e}();t.a=s},437:function(e,t,o){e.exports=o(206)}});