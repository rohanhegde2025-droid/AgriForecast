# UI Specification

## Overview
Next.js App Router application with a clean, minimal, and professional SaaS feel built for farmers. 

## Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Authentication: NextAuth.js (Google Provider)
- Components: Minimalist custom components (rounded-xl, simple borders, robust spacing).

## Color System
- Background: `bg-white`
- Cards: `bg-neutral-50`
- Borders: `border-neutral-200`
- Text (Body): `text-neutral-500`
- Text (Heading): `text-neutral-900`
- Primary Element: `bg-neutral-900` (text-white)

## Pages

### 1. Landing Page (`/`)
- Hero Section: Badge, Heading, Subheading, Get Started CTA.
- Value Proposition: 3 value pillars (Predict Yield, Forecast Prices, Smart Recommendations).
- How it works: 3 clear steps.
- Target Audience: Clean dark block to separate layout sections.
- Footer: Simple copyright text.

### 2. Login Page (`/login`)
- Dedicated auth flow route.
- Centered card layout with "Continue with Google" button.

### 3. Dashboard (`/dashboard`)
- Protected route.
- Header: Welcome message.
- Navigation cards: Links to New Prediction, History, and Live Markets (Mock).
- Activity summary: Displays recent prediction links.

### 4. Prediction Page (`/predict`)
- Protected route.
- Farm Details: Crop, region, soil type inputs.
- Environment Details: Weather, rainfall, temperature, days to harvest.
- Method Details: Fertilizer and irrigation checkboxes.
- Results UI: Clean data blocks for yield and price, plus a dark card for reading the recommendation.

### 5. History Page (`/history`)
- Protected route.
- Clean data table listing past runs. (Currently supported by static UI mocks).

### 6. Settings Page (`/settings`)
- Protected route.
- User profile info derived from NextAuth session token.
- Secure "Log Out" functionality.
