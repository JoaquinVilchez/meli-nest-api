# 🚀 API MercadoLibre Challenge - NestJS

## 📋 Descripción del Proyecto

API REST desarrollada en NestJS para el desafío técnico de MercadoLibre. Esta API proporciona todos los datos necesarios para soportar una página de detalle de productos, incluyendo gestión de productos, tiendas, usuarios, categorías, preguntas y reseñas.

## 🎯 Endpoint Principal

### **GET /products/:id** - Detalle de Producto

Este es el endpoint principal del challenge que proporciona todos los datos necesarios para una página de detalle de producto:

```bash
# Producto básico con rating y reviews calculados
GET /products/e0207c9f-6533-48cd-a64d-8c68345f5e0e

# Producto con información completa de categoría y tienda
GET /products/e0207c9f-6533-48cd-a64d-8c68345f5e0e?populate=["categories", "stores"]
```

**Características del endpoint principal:**
- ✅ **Información completa del producto** (título, descripción, precio, imágenes, etc.)
- ✅ **Rating calculado automáticamente** basado en reseñas
- ✅ **Conteo de reviews** del producto
- ✅ **Información de la tienda** (con populate)
- ✅ **Información de la categoría** (con populate)
- ✅ **Validación de datos** y manejo de errores
- ✅ **Documentación completa** en Swagger

## 📚 Documentación de la API (Swagger)

### **Acceso a la Documentación**

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

**🌐 [http://localhost:3000/api](http://localhost:3000/api)**

### **Características de la Documentación**

- ✅ **Documentación completa** de todos los endpoints
- ✅ **Esquemas de datos detallados** para requests y responses
- ✅ **Ejemplos realistas** para cada endpoint
- ✅ **Validaciones documentadas** con mensajes claros
- ✅ **Posibilidad de probar** endpoints directamente desde la interfaz
- ✅ **Organización por módulos** (products, categories, stores, users, reviews, questions)

### **Módulos Documentados**

- **🛍️ Products**: Gestión completa de productos
- **📂 Categories**: Gestión de categorías jerárquicas
- **🏪 Stores**: Gestión de tiendas
- **👥 Users**: Gestión de usuarios
- **⭐ Reviews**: Sistema de reseñas y calificaciones
- **❓ Questions**: Sistema de preguntas y respuestas

## 🛠️ Prerrequisitos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)

### Verificar instalaciones

```bash
# Verificar versión de Node.js
node --version

# Verificar versión de npm
npm --version

# Verificar versión de Git
git --version
```

## 🛠️ Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone git@github.com:JoaquinVilchez/meli-nest-api.git
cd meli-nest-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar la aplicación

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm run start:prod
```

## 🌐 Acceso a la API

Una vez que la aplicación esté ejecutándose:

- **URL base**: `http://localhost:3000`
- **Puerto por defecto**: `3000`
- **Puerto personalizable**: Configurable mediante variable de entorno `PORT`
- **Documentación Swagger**: `http://localhost:3000/api`

### Endpoints disponibles

La API incluye los siguientes módulos:

- **Categorías**: `/categories`
- **Productos**: `/products` (incluye el endpoint principal)
- **Tiendas**: `/stores`
- **Usuarios**: `/users`
- **Reseñas**: `/reviews`
- **Preguntas**: `/questions`

## 🔗 Funcionalidades Avanzadas

### Populate (Relaciones)

La API permite popular entidades relacionadas usando el parámetro `populate` en formato JSON array. Esto es útil para obtener datos completos en una sola consulta.

#### Sintaxis
```
?populate=["opcion1", "opcion2"]
```

#### Opciones disponibles por módulo:

**Productos** (`/products`):
- `["categories"]` - Incluye información completa de categorías
- `["stores"]` - Incluye información completa de tiendas
- `["categories", "stores"]` - Incluye ambas relaciones

**Tiendas** (`/stores`):
- `["categories"]` - Incluye información completa de categorías

**Reseñas** (`/reviews`):
- `["users"]` - Incluye información completa de usuarios
- `["products"]` - Incluye información completa de productos
- `["users", "products"]` - Incluye ambas relaciones

#### Ejemplos de uso:

```bash
# Obtener productos con sus categorías
GET /products?populate=["categories"]

# Obtener productos con categorías y tiendas
GET /products?populate=["categories", "stores"]

# Obtener tiendas con sus categorías
GET /stores?populate=["categories"]

# Obtener reseñas con usuarios y productos
GET /reviews?populate=["users", "products"]
```

### Paginación

La API incluye paginación automática para todos los endpoints de listado. Los parámetros de paginación son opcionales y tienen valores por defecto.

#### Parámetros de paginación:

- **`page`** (opcional): Número de página (por defecto: 1)
- **`limit`** (opcional): Elementos por página (por defecto: 50)
- **`pagination`** (opcional): Habilitar/deshabilitar paginación (por defecto: true)

#### Ejemplos de uso:

```bash
# Página 1 con 10 elementos por página
GET /products?page=1&limit=10

# Página 2 con 25 elementos por página
GET /products?page=2&limit=25

# Sin paginación (todos los elementos)
GET /products?pagination=false

# Solo especificar límite (página 1 por defecto)
GET /products?limit=20
```

#### Combinando populate y paginación:

```bash
# Productos con categorías, página 2, 15 por página
GET /products?populate=["categories"]&page=2&limit=15

# Tiendas con categorías, sin paginación
GET /stores?populate=["categories"]&pagination=false
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage de tests
npm run test:cov
```

## 🏗️ Arquitectura del Proyecto

### Tecnologías Utilizadas

- **NestJS**: Framework de Node.js para aplicaciones escalables
- **TypeScript**: Tipado estático para JavaScript
- **Class Validator**: Validación de DTOs
- **Swagger/OpenAPI**: Documentación automática de la API
- **JSON**: Persistencia de datos (sin base de datos real)

### Estructura de Módulos

```
src/
├── products/          # Módulo principal (endpoint principal)
├── categories/        # Gestión de categorías
├── stores/           # Gestión de tiendas
├── users/            # Gestión de usuarios
├── reviews/          # Sistema de reseñas
├── questions/        # Sistema de preguntas y respuestas
├── aggregation/      # Servicios de agregación (rating, reviews)
├── decorators/       # Decoradores personalizados
├── interceptors/     # Interceptores globales
└── utils/           # Utilidades y constantes
```

## 📊 Características Técnicas

- ✅ **Validación robusta** con class-validator
- ✅ **Manejo de errores** centralizado
- ✅ **Transformación de respuestas** consistente
- ✅ **Sistema de populate** para relaciones
- ✅ **Paginación** automática
- ✅ **Documentación Swagger** completa
- ✅ **Código limpio** con ESLint y Prettier
- ✅ **Pre-commit hooks** con Husky

## 🤖 Uso de IA en el Desarrollo

Este proyecto fue desarrollado con la asistencia de **Cursor AI**, una herramienta de desarrollo asistido por inteligencia artificial que mejoró significativamente la productividad y calidad del código.

### 🛠️ Asistencia de Cursor AI en:

#### **📊 Generación de Datos Mock**
- **Creación de archivos JSON** en la carpeta `/data` con datos realistas
- **Estructuración de entidades** (products, categories, stores, users, reviews, questions)
- **Datos coherentes** entre entidades relacionadas
- **Ejemplos realistas** de productos de MercadoLibre

#### **📚 Documentación General**
- **Generación de markdowns** explicativos del proyecto
- **Documentación de arquitectura** y estructura de entidades
- **Guías de ejecución** y setup del proyecto
- **Diagramas de entidad-relación** conceptuales

#### **📖 Documentación de Swagger**
- **Configuración completa** de Swagger/OpenAPI
- **Decoradores @ApiProperty** en todos los DTOs
- **Documentación de controladores** con @ApiOperation, @ApiResponse
- **Ejemplos realistas** para cada endpoint
- **Organización por módulos** en la documentación



♥️ ¡Espero que les guste, muchas gracias! ♥️ - Joaquín.