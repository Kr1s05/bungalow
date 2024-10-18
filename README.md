# Reservation Management Web Application

This project is a web application that provides a system for managing reservations, exclusively accessible to the manager.

## Documentation

The project follows a **client-server architecture** with the following components:

1. **Frontend Application**: Built using React, this provides the user interface for the manager to interact with the system.
2. **Backend API**: Developed in Go with the Gin framework, this handles business logic, reservation management, and communication with the database.
3. **Relational Database**: Stores reservation data and other relevant information.

Authentication is handled through **Auth0**, ensuring that only authorized managers can access the application.
