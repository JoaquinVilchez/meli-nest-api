# Diagrama Entidad-Relación (DER) - API MercadoLibre

## Diagrama del Sistema

```mermaid
erDiagram
    USER {
        string id PK
        string email
        string passwordHash
        string firstName
        string lastName
        string nickname
        string avatar
        boolean isActive
        enum role
        string phone
        string address
        datetime emailVerifiedAt
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        string id PK
        string name
        string slug
        string parentId FK
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    STORE {
        string id PK
        string storeCode
        boolean isActive
        string name
        string slug
        string description
        string logo
        string banner
        boolean isVerified
        datetime verifiedAt
        datetime createdAt
        datetime updatedAt
    }

    PRODUCT {
        string id PK
        string title
        string description
        string longDescription
        number price
        enum currency
        string category FK
        string store FK
        number reviews
        number rating
        array images
        enum condition
        enum shipping
        number stock
        datetime createdAt
        datetime updatedAt
    }

    QUESTION {
        string id PK
        string product FK
        string user FK
        string content
        boolean isAnswered
        datetime createdAt
        datetime updatedAt
    }

    ANSWER {
        string id PK
        string question FK
        string user FK
        string content
        datetime createdAt
        datetime updatedAt
    }

    REVIEW {
        string id PK
        string user FK
        string product FK
        number rating
        string comment
        datetime createdAt
        datetime updatedAt
    }

    STORE_CATEGORY {
        string storeId FK
        string categoryId FK
    }

    %% Relaciones principales
    USER ||--o{ QUESTION : "hace"
    USER ||--o{ ANSWER : "responde"
    USER ||--o{ REVIEW : "escribe"

    PRODUCT ||--o{ QUESTION : "tiene"
    PRODUCT ||--o{ REVIEW : "recibe"
    PRODUCT }o--|| CATEGORY : "pertenece_a"
    PRODUCT }o--|| STORE : "vende"

    QUESTION ||--o{ ANSWER : "tiene"

    CATEGORY ||--o{ CATEGORY : "parentId"
    STORE ||--o{ STORE_CATEGORY : "opera_en"
    CATEGORY ||--o{ STORE_CATEGORY : "incluye"

    %% Relaciones de población (populate)
    PRODUCT ||--o{ REVIEW : "agrega_rating"
```

## Explicación de las Relaciones

### Relaciones 1:N (Uno a Muchos)
- **USER → QUESTION**: Un usuario puede hacer múltiples preguntas
- **USER → ANSWER**: Un usuario puede responder múltiples preguntas
- **USER → REVIEW**: Un usuario puede escribir múltiples reseñas
- **PRODUCT → QUESTION**: Un producto puede tener múltiples preguntas
- **PRODUCT → REVIEW**: Un producto puede recibir múltiples reseñas
- **QUESTION → ANSWER**: Una pregunta puede tener múltiples respuestas
- **CATEGORY → CATEGORY**: Categorías pueden tener subcategorías (jerarquía)
- **CATEGORY → PRODUCT**: Una categoría puede contener múltiples productos
- **STORE → PRODUCT**: Una tienda puede vender múltiples productos

### Relaciones 1:1 (Uno a Uno)
- **PRODUCT → CATEGORY**: Un producto pertenece a una sola categoría
- **PRODUCT → STORE**: Un producto pertenece a una sola tienda

## Tipos de Datos y Enums

### Enums Utilizados:
- **USER.role**: `customer`, `admin`, `moderator`
- **PRODUCT.currency**: `ARS`, `USD`, `EUR`, `BRL`, `MXN`
- **PRODUCT.condition**: `new`, `used`
- **PRODUCT.shipping**: `free`, `standard`, `premium`

### Campos Especiales:
- **Soft References**: Los campos FK pueden contener tanto IDs (string) como objetos completos (Populados)
- **Timestamps**: Todas las entidades tienen `createdAt` y `updatedAt`
- **Arrays**: PRODUCT.images, PRODUCT.questions

## Patrones de Población (Populate)

El sistema permite poblar las siguientes relaciones:
- **PRODUCTS**: Categories, Stores, Questions
- **REVIEWS**: Users, Products
- **QUESTIONS**: Users, Answers
- **STORES**: Categories
- **ANSWERS**: Users

## Flujo de Datos Principal

1. **Usuarios** se registran en el sistema
2. **Tiendas** se crean y se asocian a categorías
3. **Productos** se crean asociados a tiendas y categorías
4. **Usuarios** hacen preguntas sobre productos
5. **Usuarios** responden preguntas
6. **Usuarios** escriben reseñas de productos
7. **Sistema** calcula ratings promedio de productos basado en reseñas
