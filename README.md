# Foodex

Foodex is a modern mobile food ordering application built with **React Native and Expo**. The application provides a complete food discovery and ordering experience with user authentication, menu browsing, search and filtering, item customization, shopping cart management, and user profile management.

The project uses **Appwrite** for authentication, database operations, and storage, while **Zustand** manages client-side authentication and cart state.

---

## Overview

Foodex is designed as a mobile-first food ordering platform where users can:

- Create an account
- Sign in and sign out
- Browse food items
- Explore food categories
- Search for menu items
- View detailed food information
- Customize menu items with toppings and sides
- Add customized items to a cart
- Increase or decrease quantities
- Review an order summary
- Manage their profile
- Update personal information

The application also includes local fallback data, allowing the menu and category experience to remain available when the Appwrite database does not contain data.

---

## Features

### Authentication

Foodex provides an Appwrite-powered authentication flow.

Users can:

- Create an account
- Sign in with email and password
- Sign out
- Maintain an authenticated session
- Retrieve their account information
- Store additional user information

During registration, users can provide:

- Full name
- Email
- Password
- Phone number
- Address

User profile information is stored in the Appwrite database.

---

## Home Screen

The home screen provides the main entry point into the application.

It includes:

- Promotional offers
- Delivery location
- Navigation to the cart
- Food discovery interface
- Food-focused visual presentation

The interface uses reusable components and responsive React Native layouts.

---

## Menu Discovery

Users can browse available food items through the menu interface.

Food items include information such as:

- Name
- Description
- Price
- Rating
- Calories
- Protein
- Category
- Available customizations

The application currently includes menu categories such as:

- Burgers
- Pizzas
- Burritos
- Sandwiches
- Wraps
- Bowls

---

## Search and Filtering

The application provides a dedicated search interface for finding food items.

Users can:

- Search by food name
- Filter by category
- Browse filtered results
- View menu items in a two-column layout

The search system communicates with Appwrite using database queries and also supports local fallback data.

---

## Food Details

Each food item has a dedicated details screen.

The details page provides:

- Food image
- Name
- Description
- Price
- Rating
- Delivery information
- Estimated delivery time
- Calories
- Protein
- Ingredient/customization information

Users can select additional toppings and sides before adding an item to the cart.

---

## Food Customization

Food items can be customized using available toppings and sides.

### Toppings

Examples include:

- Extra Cheese
- Jalapeños
- Onions
- Olives
- Mushrooms
- Tomatoes
- Bacon
- Avocado

### Sides

Examples include:

- Coke
- Fries
- Garlic Bread
- Chicken Nuggets
- Iced Tea
- Salad
- Potato Wedges
- Mozzarella Sticks
- Sweet Corn
- Choco Lava Cake

Customization prices are added to the base food price when calculating the cart total.

---

## Shopping Cart

The cart is managed using **Zustand**.

Users can:

- Add food items
- Add customized food items
- Increase item quantity
- Decrease item quantity
- Remove items
- Clear the cart
- View the number of items
- View the subtotal
- View delivery charges
- View discounts
- View the final total

The cart also distinguishes between the same food item with different customization combinations.

This allows, for example, two versions of the same burger with different toppings to be maintained separately.

---

## Order Summary

The cart provides an order summary containing:

```text
Subtotal
Delivery Fee
Discount
----------------
Total
```

The current application uses predefined delivery and discount values for the cart calculation.

The checkout interface is present as part of the application flow, while full payment processing is not implemented in the current codebase.

---

## User Profile

Authenticated users have access to a dedicated profile screen.

The profile displays:

- Profile picture
- Name
- Email
- Phone number
- Address
- User information
- Order statistics
- Review statistics
- Points information

Users can also access profile editing functionality and log out of the application.

---

## Profile Management

Users can edit their stored profile information.

The application communicates with Appwrite to update the corresponding user document.

Profile information includes:

- Name
- Email
- Phone
- Address
- Avatar

---

## Appwrite Integration

Appwrite provides the backend services used by Foodex.

The application integrates with:

### Appwrite Authentication

Used for:

- Account creation
- Email/password login
- Session management
- Logout
- Current-user retrieval

### Appwrite Database

Used for:

- User information
- Menu items
- Categories
- Customizations
- Menu-customization relationships

### Appwrite Storage

Used for:

- Menu item images
- Uploaded application assets

---

## Data Architecture

The application organizes food-related data into several Appwrite collections.

```text
Appwrite Database
│
├── Users
│
├── Categories
│
├── Menu Items
│
├── Customizations
│
└── Menu Customizations
```

Menu items are associated with categories, while menu customization records connect individual menu items with their available toppings and sides.

---

## Local Data Fallback

Foodex includes a local dataset that acts as a fallback when the Appwrite database does not contain menu or category records.

The local dataset contains:

- Food categories
- Menu items
- Food descriptions
- Prices
- Ratings
- Calories
- Protein values
- Available customizations

This hybrid approach makes the application easier to demonstrate and develop without requiring a populated backend at all times.

---

## State Management

Foodex uses **Zustand** for client-side state management.

### Authentication Store

The authentication store manages:

- Authentication status
- Current user
- Loading state
- Authenticated-user retrieval

### Cart Store

The cart store manages:

- Cart items
- Item quantities
- Customizations
- Cart totals
- Item removal
- Quantity updates
- Cart clearing

The cart logic also compares customization combinations to determine whether items should be merged or treated as separate cart entries.

---

## UI and Animation

The application uses a modern mobile interface with animated transitions and interactive elements.

Implemented UI features include:

- Animated authentication forms
- Animated profile sections
- Animated cart items
- Animated empty-cart state
- Promotional cards
- Custom buttons
- Custom inputs
- Search interface
- Category filters
- Food cards
- Bottom-tab navigation

React Native's `Animated` API is used for several transitions and entrance animations.

---

## Navigation

Foodex uses **Expo Router** for file-based navigation.

The application contains routes for:

```text
Authentication
│
├── Sign In
└── Sign Up

Main Application
│
├── Home
├── Search
├── Cart
└── Profile

Additional Screens
│
├── Menu Item Details
└── Edit Profile
```

The application also uses tab navigation for the primary sections of the application.

---

## Technology Stack

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- React Navigation
- NativeWind
- Tailwind CSS

### State Management

- Zustand

### Backend / Cloud Services

- Appwrite
- Appwrite Authentication
- Appwrite Database
- Appwrite Storage

### Monitoring

- Sentry

### Supporting Libraries

- React Native Reanimated
- React Native Gesture Handler
- React Native Safe Area Context
- React Native Async Storage
- Expo Haptics
- Expo Image
- Expo Font
- Expo AV
- Expo Web Browser

---

## Project Structure

```text
Foodex/
│
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── search.tsx
│   │   ├── cart.tsx
│   │   └── profile.tsx
│   │
│   ├── menu/
│   │   └── [id].tsx
│   │
│   ├── edit-profile.tsx
│   ├── _layout.tsx
│   └── global.css
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── components/
│   ├── CartButton
│   ├── CartItem
│   ├── CustomButton
│   ├── CustomInput
│   ├── Filter
│   ├── MenuCard
│   └── SearchBar
│
├── constants/
│
├── lib/
│   ├── appwrite.ts
│   ├── data.ts
│   ├── data-updated.ts
│   ├── seed.ts
│   └── useAppwrite.ts
│
├── store/
│   ├── auth.store.ts
│   └── cart.store.ts
│
├── scripts/
│
├── app.json
├── package.json
└── tsconfig.json
```

---

## Environment Configuration

Foodex uses environment variables for Appwrite configuration.

Create a local environment configuration containing the required Appwrite values:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
```

The Appwrite configuration is consumed by the application when initializing the Appwrite client.

Do not commit private credentials or sensitive environment configuration to a public repository.

---

## Installation

### Prerequisites

Make sure the development environment has:

- Node.js
- npm
- Expo CLI / Expo development tooling
- Android Studio for Android development, if required
- Xcode for iOS development, if required
- An Appwrite project configured for the application

### Clone the Repository

```bash
git clone https://github.com/codebyrifaf/Foodex.git
```

Navigate to the project:

```bash
cd Foodex
```

Install dependencies:

```bash
npm install
```

---

## Run the Application

Start the Expo development server:

```bash
npm start
```

For Android:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

For web:

```bash
npm run web
```

The application can also be opened through Expo's development workflow on a compatible physical device or emulator.

---

## Backend Setup

To use the full Appwrite-backed functionality:

1. Create an Appwrite project.
2. Configure the project endpoint.
3. Configure the application platform.
4. Create the required database.
5. Create the required collections.
6. Configure the collection attributes.
7. Create the required storage bucket.
8. Configure the environment variables.
9. Seed the menu and category data if required.

The project includes a `seed.ts` utility for populating Appwrite with categories, customizations, menu items, relationships, and uploaded images.

---

## Seeding Data

The seed utility prepares the Appwrite backend using the local dataset.

The process includes:

1. Clearing existing category records.
2. Clearing customization records.
3. Clearing menu records.
4. Clearing menu-customization relationships.
5. Clearing stored images.
6. Creating categories.
7. Creating customizations.
8. Uploading menu images.
9. Creating menu documents.
10. Creating menu-customization relationships.

This provides a repeatable way to populate the backend during development.

---

## Application Architecture

Foodex follows a client-focused mobile architecture:

```text
                 Foodex Mobile App
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
   UI Components    Zustand State    Expo Router
        |               |               |
        +---------------+---------------+
                        |
                        v
                 Appwrite Services
                  /      |       \
                 /       |        \
                v        v         v
          Authentication Database Storage
```

The separation between UI components, state management, service functions, and backend services keeps the application organized and makes individual parts easier to maintain.

---

## Error Handling and Monitoring

The application includes basic error handling through:

- `try/catch` service calls
- Loading states
- Error states
- User-facing alerts
- Sentry integration

Sentry is integrated into the Expo application for error monitoring and application diagnostics.

---

## Current Project Status

Foodex is a functional **food ordering application prototype** with a connected Appwrite backend.

The current implementation includes:

- Authentication
- User profiles
- Menu browsing
- Categories
- Search
- Filtering
- Food details
- Food customization
- Cart management
- Order calculations
- Appwrite integration
- Local fallback data
- Animated mobile UI

The current repository does **not** implement a complete production payment gateway or a complete backend order-processing workflow.

---

## Future Improvements

Potential future development areas include:

- Complete checkout workflow
- Payment gateway integration
- Order creation and persistence
- Order tracking
- Delivery status tracking
- Restaurant/store management
- Push notifications
- Order history backed by Appwrite
- Reviews and ratings persistence
- Favorites/wishlist
- Promotional coupon system
- More advanced cart persistence
- Improved offline support
- Automated testing
- Production-grade validation and security rules

---

## Learning Objectives

The project provides practical experience with:

- React Native application development
- Expo ecosystem
- TypeScript
- Mobile UI/UX implementation
- File-based navigation
- Cloud backend integration
- Authentication
- Database operations
- Cloud storage
- Client-side state management
- API/service abstraction
- Local fallback data
- Form handling
- Application animations
- Mobile application architecture

---

## Project Information

**Project:** Foodex  
**Type:** Mobile Food Ordering Application  
**Platform:** React Native / Expo  
**Language:** TypeScript  
**Backend:** Appwrite  
**State Management:** Zustand  
**Navigation:** Expo Router  
**Monitoring:** Sentry

---

## Author

**Rifaf**

Software Engineering Graduate  
Islamic University of Technology

GitHub:  
https://github.com/codebyrifaf

---

## License

This project is developed as a software engineering portfolio/application project. The repository is intended primarily for educational and demonstration purposes.
