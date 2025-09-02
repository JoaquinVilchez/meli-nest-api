# Estructura del Proyecto - API de MercadoLibre (NestJS)

## Descripción General
Este es un proyecto de API REST desarrollado en NestJS que simula la funcionalidad de MercadoLibre, incluyendo gestión de productos, tiendas, usuarios, categorías, preguntas y reseñas.

## Arquitectura de Entidades

### 1. **User (Usuario)**
- **Propósito**: Gestión de usuarios del sistema
- **Campos principales**:
  - `id`: Identificador único
  - `email`, `passwordHash`: Autenticación
  - `firstName`, `lastName`, `nickname`: Información personal
  - `role`: Rol del usuario (CUSTOMER, ADMIN, MODERATOR)
  - `phone`, `address`: Información de contacto
  - `isActive`: Estado de la cuenta
  - `emailVerifiedAt`: Verificación de email
- **Relaciones**: Conecta con Questions, Answers y Reviews

### 2. **Category (Categoría)**
- **Propósito**: Clasificación jerárquica de productos
- **Campos principales**:
  - `id`: Identificador único
  - `name`: Nombre de la categoría
  - `slug`: URL amigable
  - `parentId`: Categoría padre (estructura jerárquica)
  - `isActive`: Estado de la categoría
- **Relaciones**: 
  - Auto-referencial (parentId)
  - Conecta con Products y Stores

### 3. **Store (Tienda)**
- **Propósito**: Representa las tiendas que venden productos
- **Campos principales**:
  - `id`: Identificador único
  - `storeCode`: Código único de la tienda
  - `name`, `slug`: Información de la tienda
  - `description`: Descripción opcional
  - `categories`: Categorías en las que opera
  - `logo`, `banner`: Elementos visuales
  - `isVerified`: Estado de verificación
- **Relaciones**: Conecta con Products y Categories

### 4. **Product (Producto)**
- **Propósito**: Entidad central del sistema de comercio
- **Campos principales**:
  - `id`: Identificador único
  - `title`, `description`, `longDescription`: Información del producto
  - `price`, `currency`: Información de precios (ARS, USD, EUR, BRL, MXN)
  - `category`: Categoría del producto
  - `store`: Tienda que lo vende
  - `reviews`: Reseñas del producto
  - `rating`: Calificación promedio
  - `questions`: Preguntas sobre el producto
  - `images`: Galería de imágenes
  - `condition`: Estado (new, used)
  - `shipping`: Tipo de envío (free, standard, premium)
  - `stock`: Cantidad disponible
- **Relaciones**: Conecta con Category, Store, Reviews y Questions

### 5. **Question (Pregunta)**
- **Propósito**: Sistema de preguntas y respuestas sobre productos
- **Campos principales**:
  - `id`: Identificador único
  - `product`: Producto sobre el que se pregunta
  - `user`: Usuario que hace la pregunta
  - `content`: Contenido de la pregunta
  - `answers`: Respuestas a la pregunta
  - `isAnswered`: Estado de respuesta
- **Relaciones**: Conecta con Product, User y Answer

### 6. **Answer (Respuesta)**
- **Propósito**: Respuestas a las preguntas de productos
- **Campos principales**:
  - `id`: Identificador único
  - `question`: Pregunta a la que responde
  - `user`: Usuario que responde
  - `content`: Contenido de la respuesta
- **Relaciones**: Conecta con Question y User

### 7. **Review (Reseña)**
- **Propósito**: Sistema de calificaciones y comentarios
- **Campos principales**:
  - `id`: Identificador único
  - `user`: Usuario que hace la reseña
  - `product`: Producto reseñado
  - `rating`: Calificación (numérica)
  - `comment`: Comentario de la reseña
- **Relaciones**: Conecta con User y Product

## Relaciones del Sistema

### Relaciones Principales:
1. **User ↔ Product**: A través de Questions, Answers y Reviews
2. **Product ↔ Category**: Un producto pertenece a una categoría
3. **Product ↔ Store**: Un producto pertenece a una tienda
4. **Store ↔ Category**: Una tienda puede operar en múltiples categorías
5. **Category ↔ Category**: Estructura jerárquica (parentId)
6. **Question ↔ Answer**: Una pregunta puede tener múltiples respuestas

### Patrones de Población (Populate):
- **Products**: Se pueden poblar con Categories, Stores y Questions
- **Reviews**: Se pueden poblar con Users y Products
- **Questions**: Se pueden poblar con Users y Answers
- **Stores**: Se pueden poblar con Categories
- **Answers**: Se pueden poblar con Users

## Características Técnicas

### Constantes del Sistema:
- **Monedas**: ARS, USD, EUR, BRL, MXN
- **Condiciones**: new, used
- **Envíos**: free, standard, premium
- **Roles de Usuario**: customer, admin, moderator

### Patrones de Diseño:
- **Soft References**: Las relaciones pueden ser strings (IDs) o objetos completos
- **Timestamps**: Todas las entidades tienen createdAt y updatedAt
- **Slugs**: URLs amigables para Categories y Stores
- **Verificación**: Sistema de verificación para Stores
- **Estados**: Campos isActive para control de estado

## Flujo de Datos
1. **Usuarios** se registran y pueden hacer preguntas, respuestas y reseñas
2. **Tiendas** se crean y se asocian a categorías
3. **Productos** se crean asociados a tiendas y categorías
4. **Preguntas y respuestas** se generan sobre productos
5. **Reseñas** se crean para calificar productos
6. **Categorías** organizan jerárquicamente todo el catálogo

Este sistema permite una experiencia completa de e-commerce con funcionalidades de marketplace, incluyendo gestión de múltiples vendedores, sistema de preguntas y respuestas, y calificaciones de productos.
