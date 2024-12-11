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

namespace PrestaShopBundle\ApiPlatform\Normalizer;

use Doctrine\Inflector\Inflector;
use Doctrine\Inflector\InflectorFactory;
use ReflectionNamedType;
use ReflectionParameter;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AutoconfigureTag('prestashop.api.normalizers')]
class ValueObjectNormalizer implements NormalizerInterface, DenormalizerInterface
{
    public const VALUE_OBJECT_RETURNED_AS_SCALAR = 'value_object_returned_as_scalar';

    protected Inflector $inflector;

    /**
     * @var array<string, string[]>
     */
    protected array $allowedNamesByType = [];

    /**
     * @var array<string, ?ReflectionParameter>
     */
    protected array $constructorParameter = [];

    public function __construct(
        protected readonly ClassMetadataFactoryInterface $classMetadataFactory
    ) {
        $this->inflector = InflectorFactory::create()->build();
    }

    public function denormalize(mixed $data, string $type, ?string $format = null, array $context = [])
    {
        if (!$this->supportsDenormalization($data, $type)) {
            throw new InvalidArgumentException('Cannot denormalize to ' . $type);
        }

        if ($this->matchesConstructorParameter($data, $type)) {
            $parameterValue = $data;
        } else {
            $constructorParameter = $this->getConstructorParameter($type);
            $parameterValue = $constructorParameter->isDefaultValueAvailable() ? $constructorParameter->getDefaultValue() : null;
            foreach ($this->getAllowedValueNames($type) as $argumentName) {
                if (isset($data[$argumentName])) {
                    $parameterValue = $data[$argumentName];
                    break;
                }

                if (isset($data['value'][$argumentName])) {
                    $parameterValue = $data[$argumentName];
                    break;
                }
            }
        }

        if (!empty($context[self::VALUE_OBJECT_RETURNED_AS_SCALAR])) {
            return $parameterValue;
        }

        return new $type($parameterValue);
    }

    public function supportsDenormalization(mixed $data, string $type, ?string $format = null)
    {
        if (!$this->isValueObjectType($type)) {
            return false;
        }

        if ($this->matchesConstructorParameter($data, $type)) {
            return true;
        }

        if (!is_array($data)) {
            return false;
        }

        $allowedNames = $this->getAllowedValueNames($type);
        foreach ($allowedNames as $allowedName) {
            if (isset($data[$allowedName])) {
                return true;
            }
        }

        return false;
    }

    public function normalize(mixed $object, ?string $format = null, array $context = [])
    {
        if (!$this->isValueObject($object)) {
            throw new InvalidArgumentException('Expected object to be a ValueObject');
        }

        if (!empty($context[self::VALUE_OBJECT_RETURNED_AS_SCALAR])) {
            return $object->getValue();
        }

        $metadata = $this->classMetadataFactory->getMetadataFor($object);

        return [
            lcfirst($metadata->getReflectionClass()->getShortName()) => $object->getValue(),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null)
    {
        return $this->isValueObject($data);
    }

    protected function isValueObject(mixed $data): bool
    {
        return is_object($data)
            && !is_iterable($data)
            && method_exists($data, 'getValue')
            // Check that ValueObject is part of the namespace
            && str_contains(get_class($data), 'ValueObject')
            && $this->getConstructorParameter($data);
    }

    protected function isValueObjectType(string $type): bool
    {
        return class_exists($type)
            && method_exists($type, 'getValue')
            // Check that ValueObject is part of the namespace
            && str_contains($type, 'ValueObject')
            && $this->getConstructorParameter($type);
    }

    protected function matchesConstructorParameter(mixed $value, string $type): bool
    {
        $constructorParameter = $this->getConstructorParameter($type);

        // If the type is not strict we assume it MAY match
        if (!$constructorParameter || !$constructorParameter->hasType()) {
            return true;
        }

        $type = $constructorParameter->getType();
        if ($type instanceof ReflectionNamedType && $type->isBuiltin()) {
            $checkMethod = 'is_' . $type->getName();

            return $checkMethod($value);
        }

        return false;
    }

    protected function getAllowedValueNames(string $type): array
    {
        if (!isset($this->allowedNamesByType[$type])) {
            $className = substr($type, strrpos($type, '\\') + 1);

            $this->allowedNamesByType[$type] = [
                $this->inflector->camelize($className),
                $this->inflector->tableize($className),
            ];

            $constructorParameter = $this->getConstructorParameter($type);
            if ($constructorParameter && !in_array($constructorParameter->getName(), $this->allowedNamesByType[$type])) {
                $this->allowedNamesByType[$type][] = $constructorParameter->getName();
            }
            if (!in_array('value', $this->allowedNamesByType[$type])) {
                $this->allowedNamesByType[$type][] = 'value';
            }
        }

        return $this->allowedNamesByType[$type];
    }

    protected function getConstructorParameter(object|string $type): ?ReflectionParameter
    {
        $objectType = is_object($type) ? get_class($type) : $type;
        if (!array_key_exists($objectType, $this->constructorParameter)) {
            $metadata = $this->classMetadataFactory->getMetadataFor($type);
            if (!$metadata->getReflectionClass()->getConstructor()) {
                $this->constructorParameter[$objectType] = null;
            } elseif ($metadata->getReflectionClass()->getConstructor()->getNumberOfRequiredParameters() !== 1) {
                // ValueObject are supposed to have only one required parameter (if the convention evolves, this normalizer should evolve too)
                $this->constructorParameter[$objectType] = null;
            } else {
                $parameter = $metadata->getReflectionClass()->getConstructor()->getParameters()[0];
                if (!$parameter->hasType()) {
                    $this->constructorParameter[$objectType] = $parameter;
                } elseif (!($parameter->getType() instanceof ReflectionNamedType) || !$parameter->getType()->isBuiltin()) {
                    $this->constructorParameter[$objectType] = null;
                } else {
                    $this->constructorParameter[$objectType] = $parameter;
                }
            }
        }

        return $this->constructorParameter[$objectType] ?? null;
    }
}
