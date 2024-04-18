# SkiHub

This project is a single-page application (SPA) built using React for the frontend and JSON Server as a mock backend. It allows users to plan trips, manage reservations, and review resorts. The application features client-side routing, AJAX requests for CRUD operations, custom form validations, and reusable components.

- Demo Youtube Link: https://youtu.be/PuY3Ar_krmc?si=-9DlJ3tCYPW_XNw_

## Prerequisites

- Node.js (v12.x or newer)
- npm (v6.x or newer)

You can download and install them from [Node.js official website](https://nodejs.org/).

## Installing `json-server`

To install `json-server`, follow these steps:

Linux and macOS:
```bash
npm install -g json-server
```

Then from within this project, run the API with:
```bash
npx json-server --watch db.json
```

## Run this Project Locally
```bash
npm run start
```

# Features

## Client-Side Routing

- **React Router**: Manages all app navigation, enabling seamless user experiences without full page reloads.
- **Configured Routes**:
  - **Home**: Accessible via `/`, serves as the landing page.
  - **Admin Panel**: Located at `/admin`, for administrative functions.
  - **Resort Details**: Dynamic route `/resort/:resortId` that shows details for a specific resort.
  - **Plan a Trip**: Route `/plan-trip` allows users to plan new trips.
- **Nested Routes and Dynamic Segments**: Utilizes nested routes to structure the application effectively, with dynamic segments for accessing specific resorts or administrative tasks.

## AJAX Requests

- **CRUD Operations**: Implements CRUD (Create, Read, Update, Delete) operations across various components.
  - **GET**: Fetches data, used in viewing resorts, trip details, and comments.
  - **POST**: Creates new entries, such as new trips, resort bookings, or comments.
  - **PUT/PATCH**: Updates existing entries, such as modifying trip details or updating resort information.
  - **DELETE**: Removes existing entries, used for deleting comments, trips, or bookings.
- These requests are integral for managing components like comments, trip planning, and administrative tasks, ensuring dynamic and interactive user experiences.

## Form Validation

- **Custom Validation Logic**: Validates all user inputs through React state, ensuring data integrity without relying on default HTML form validation.
- **Contextual Error Messages**: Provides specific error messages beside or below each form field, aiding users in correcting their inputs promptly and accurately.

## Reusable Components

- **Modal Dialog**: A versatile modal component used for various confirmations throughout the application, such as confirming the deletion of a reservation or submitting a review.
- **Configurable Props**: The modal supports customization through props, allowing it to be adapted for different messages and actions, thereby increasing its utility across the app.

## Toast Notifications

- **React Toastify**: Integrated to provide real-time feedback for user actions like adding, deleting, or updating data, enhancing the interactivity and responsiveness of the application.

## Additional Features

- **Comment System**: Users can add comments to resort pages, complete with timestamps, enhancing user engagement and providing valuable feedback mechanisms.
- **Bookmark/Favorites System**: Enables users to bookmark or favorite resorts for quick and easy access in future sessions, mimicking a personalized experience.

These features collectively enhance the functionality and user experience of the application, making it a comprehensive tool for travel planning and management.
