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

namespace PrestaShopBundle\ApiPlatform\OpenApi\Factory;

use ApiPlatform\JsonSchema\DefinitionNameFactoryInterface;
use ApiPlatform\JsonSchema\ResourceMetadataTrait;
use ApiPlatform\JsonSchema\Schema;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use ApiPlatform\Metadata\Resource\Factory\ResourceNameCollectionFactoryInterface;
use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ArrayObject;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;

/**
 * This service decorates the main service that builds the Open API schema. It waits for the whole generation
 * to be done so that all types, schemas and example are correctly extracted. Then it applies the custom mapping,
 * when defined, so that the schema reflects the expected format for the API not the one in the domain logic from
 * CQRS commands.
 */
class CQRSOpenApiFactory implements OpenApiFactoryInterface
{
    use ResourceMetadataTrait;

    protected PropertyAccessorInterface $propertyAccessor;

    public function __construct(
        private readonly OpenApiFactoryInterface $decorated,
        private readonly ResourceNameCollectionFactoryInterface $resourceNameCollectionFactory,
        // No property promotion for this one since it's already defined in the ResourceMetadataTrait
        ResourceMetadataCollectionFactoryInterface $resourceMetadataFactory,
        private readonly DefinitionNameFactoryInterface $definitionNameFactory,
    ) {
        $this->resourceMetadataFactory = $resourceMetadataFactory;
        $this->propertyAccessor = PropertyAccess::createPropertyAccessorBuilder()
            ->disableExceptionOnInvalidIndex()
            ->disableExceptionOnInvalidPropertyPath()
            ->getPropertyAccessor()
        ;
    }

    public function __invoke(array $context = []): OpenApi
    {
        $parentOpenApi = $this->decorated->__invoke($context);

        foreach ($this->resourceNameCollectionFactory->create() as $resourceClass) {
            $resourceMetadataCollection = $this->resourceMetadataFactory->create($resourceClass);

            foreach ($resourceMetadataCollection as $resourceMetadata) {
                /** @var Operation $operation */
                foreach ($resourceMetadata->getOperations() as $operation) {
                    if (empty($operation->getExtraProperties()['CQRSCommand']) || empty($operation->getExtraProperties()['CQRSCommandMapping'])) {
                        continue;
                    }

                    $inputClass = $this->findOutputClass($operation->getClass(), Schema::TYPE_INPUT, $operation, []);
                    if (null === $inputClass) {
                        continue;
                    }

                    // Build the operation name like SchemaFactory does so that we have the proper definition in the schema matching this operation
                    $definitionName = $this->definitionNameFactory->create($operation->getClass(), 'json', $inputClass, $operation, []);
                    if (!$parentOpenApi->getComponents()->getSchemas()->offsetExists($definitionName)) {
                        continue;
                    }

                    /** @var ArrayObject $definition */
                    $definition = $parentOpenApi->getComponents()->getSchemas()->offsetGet($definitionName);
                    if (empty($definition['properties'])) {
                        continue;
                    }

                    foreach ($operation->getExtraProperties()['CQRSCommandMapping'] as $apiPath => $cqrsPath) {
                        // Replace properties that are scanned from CQRS command to their expected API path
                        if ($this->propertyAccessor->isReadable($definition['properties'], $cqrsPath) || $this->propertyAccessor->isWritable($definition['properties'], $cqrsPath)) {
                            // Automatic value from context are simply remove from the schema, the others are "moved" to match the expected property path
                            if (!str_starts_with($apiPath, '[_context]')) {
                                $this->propertyAccessor->setValue($definition['properties'], $apiPath, $this->propertyAccessor->getValue($definition['properties'], $cqrsPath));
                            }

                            // Use property path to set null, the null values will then be cleaned in a second loop (because unset cannot use property path as an input)
                            $this->propertyAccessor->setValue($definition['properties'], $cqrsPath, null);
                        }
                    }

                    // Now clean the values that were set to null by the previous loop
                    foreach ($definition['properties'] as $propertyName => $propertyValue) {
                        if (null === $propertyValue) {
                            unset($definition['properties'][$propertyName]);
                        }
                    }
                }
            }
        }

        return $parentOpenApi;
    }
}
