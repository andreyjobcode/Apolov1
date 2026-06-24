# Apolo v1 - Actualizador de Sitios Ultrago

## Descripción

Apolo v1 es una herramienta diseñada para procesar información de productos
turísticos y generar contenido estructurado para sitios web de programas de
fidelización y viajes administrados por Ultrago.

El sistema recibe datos de vuelos, hoteles y promociones en formatos
predefinidos, los valida, clasifica, normaliza y organiza para posteriormente
generar bloques HTML listos para implementación.

## Objetivo

Automatizar el procesamiento de información turística y reducir el trabajo
manual requerido para la construcción de componentes web de programas de viajes,
garantizando consistencia en formatos, clasificación de destinos y generación de
código HTML.

---

## Funcionalidades Principales

### Procesamiento de Productos

- Vuelos
- Hoteles
- Promociones
- Actividades
- Disney
- Renta de autos

### Programas Compatibles

- PCO
- FICOHSA
- AUSTRO
- TYP
- BANORTE
- DAVIBANK
- COOPENAE
- BAC

### Automatizaciones

- Extracción de datos estructurados.
- Validación de campos requeridos.
- Clasificación de destinos nacionales e internacionales.
- Ordenamiento automático por precio.
- Normalización de formatos numéricos.
- Generación de HTML utilizando plantillas predefinidas.
- Numeración secuencial automática de registros.

---

## Flujo de Trabajo

1. Selección del programa.
2. Selección del tipo de producto.
3. Recepción de datos estructurados.
4. Extracción y validación de información.
5. Normalización de valores numéricos.
6. Clasificación de destinos.
7. Ordenamiento de resultados.
8. Generación de salida intermedia para validación.
9. Generación final de código HTML.

---

## Reglas de Clasificación

### Internacionales

Todos los destinos fuera de Colombia.

Ejemplos:

- Panamá
- Miami
- Madrid
- Ciudad de México
- Guatemala

### Nacionales

Todos los destinos dentro de Colombia.

Ejemplos:

- Bogotá
- Cartagena
- Medellín
- Santa Marta
- San Andrés

---

## Normalización de Datos

### Puntos

Entrada:

80,000 80.000

Salida:

80.000

### Precios

Entrada:

$3,091,045 $3.091.045

Salida:

$3.091.045

### Acumulación y Redención

Entrada:

2,975 2.975

Salida:

2.975

---

## Estructura del Proyecto

```text
Apolo-v1.md
│
├── Parámetros requeridos
├── Flujo de procesamiento
├── Validación de datos
├── Clasificación de productos
├── Normalización de formatos
├── Salidas intermedias
└── Plantillas HTML
```

## Consideraciones Importantes

- No modificar las estructuras HTML definidas.
- Mantener los nombres de variables y placeholders exactamente como están
  definidos.
- Respetar el orden de procesamiento establecido.
- La clasificación y ordenamiento deben ejecutarse antes de generar el HTML.
- Toda salida debe conservar el formato requerido por cada programa.

---

## Casos de Uso

- Actualización masiva de campañas turísticas.
- Generación de landing pages de viajes.
- Construcción de sliders de vuelos y hoteles.
- Automatización de promociones para programas de fidelización.
- Estandarización de contenido para múltiples marcas.

---

## Autor

**Marco Andrey Romero Acosta**

---

## Versión

**Apolo v1**
