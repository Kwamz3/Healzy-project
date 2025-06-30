<<<<<<< HEAD
# Healzy Backend Spring

This is the backend for the Healzy application, built using Spring Boot. The application provides a RESTful API for managing flashcard sets and user authentication.

## Features

- User registration and login with JWT authentication.
- CRUD operations for flashcard sets.
- Secure endpoints with token-based authentication.

## Project Structure

```
healzy-backend-spring
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── healzy
│   │   │           ├── HealzyBackendSpringApplication.java
│   │   │           ├── controller
│   │   │           │   ├── AuthController.java
│   │   │           │   └── FlashcardSetController.java
│   │   │           ├── model
│   │   │           │   ├── FlashcardSet.java
│   │   │           │   ├── Flashcard.java
│   │   │           │   └── User.java
│   │   │           ├── repository
│   │   │           │   ├── FlashcardSetRepository.java
│   │   │           │   └── UserRepository.java
│   │   │           └── security
│   │   │               ├── JwtAuthenticationFilter.java
│   │   │               ├── JwtTokenProvider.java
│   │   │               └── SecurityConfig.java
│   │   └── resources
│   │       ├── application.properties
│   │       └── static
│   └── test
│       └── java
│           └── com
│               └── healzy
│                   └── HealzyBackendSpringApplicationTests.java
├── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd healzy-backend-spring
   ```

2. Update the `application.properties` file with your database connection settings.

3. Build the project:
   ```
   mvn clean install
   ```

4. Run the application:
   ```
   mvn spring-boot:run
   ```

### API Endpoints

- **User Registration**: `POST /api/auth/register`
- **User Login**: `POST /api/auth/login`
- **Create Flashcard Set**: `POST /api/flashcard-sets`
- **Get Flashcard Sets**: `GET /api/flashcard-sets`
- **Get Flashcard Set by ID**: `GET /api/flashcard-sets/{id}`
- **Update Flashcard Set**: `PUT /api/flashcard-sets/{id}`
- **Delete Flashcard Set**: `DELETE /api/flashcard-sets/{id}`

## License

This project is licensed under the MIT License. See the LICENSE file for details.
=======
# Healzy-project
>>>>>>> aeee1febc024278497a6c5ee853cdd7dbe04e433
