<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

namespace PrestaShop\PrestaShop\Core\Domain\Meta\Exception;

/**
 * Is thrown when meta constraints are violated
 */
class MetaConstraintException extends MetaException
{
    /**
     * When meta page name is invalid
     */
    public const INVALID_PAGE_NAME = 1;

    /**
     * When meta url_rewrite is invalid
     */
    public const INVALID_URL_REWRITE = 2;

    /**
     * When meta page title is invalid
     */
    public const INVALID_PAGE_TITLE = 3;

    /**
     * When meta description is invalid
     */
    public const INVALID_META_DESCRIPTION = 4;
}
