# 🚀 Guía de Ejecución - API MercadoLibre con NestJS

## 📋 Prerrequisitos

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

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone git@github.com:JoaquinVilchez/meli-nest-api.git
cd meli-nest-api
```

### 2. Instalar dependencias

```bash
npm install
```

## 🏃‍♂️ Ejecución de la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

Este comando ejecuta la aplicación en modo watch, lo que significa que se reiniciará automáticamente cuando detecte cambios en el código.

## 🌐 Acceso a la API

Una vez que la aplicación esté ejecutándose:

- **URL base**: `http://localhost:3000`
- **Puerto por defecto**: `3000`
- **Puerto personalizable**: Configurable mediante variable de entorno `PORT`

### Endpoints disponibles

La API incluye los siguientes módulos:

- **Categorías**: `/categories`
- **Productos**: `/products`
- **Tiendas**: `/stores`
- **Usuarios**: `/users`
- **Reseñas**: `/reviews`

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