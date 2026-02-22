# Project Context

## Overview
This project is the Next.js frontend for "Fork the Bill", an application designed to facilitate splitting restaurant bills among multiple people. It allows users to upload receipts for automatic item extraction, claim items, view real-time updates, and share bills via QR codes. The primary tech stack includes Next.js 15 with App Router, TypeScript, React 19, Tailwind CSS, and Axios for API communication. It interacts with an external backend API.

## Architecture
The application follows a client-server architecture, with the Next.js application acting as a thin client consuming a separate backend API. It leverages Next.js's App Router for file-based routing and server-side rendering (SSR) for initial page loads and SEO optimization. UI components are built with React and styled using Tailwind CSS. API interactions are managed through an Axios instance, configured with a base URL sourced from environment variables. During development, API requests are proxied via `next.config.ts` rewrites to mitigate CORS issues.

## Core Workflows
1.  **Expense Creation/Upload**: A user uploads a restaurant receipt image (likely via `src/components/ReceiptUpload.tsx`), which is sent to the backend API via `POST /expense/upload`. The backend processes the image to extract items and create an initial expense.
2.  **Expense Viewing**: After creation or by navigating to a specific slug (e.g., `http://localhost:3000/expense-slug-123`), the `src/app/[slug]/page.tsx` route fetches expense details using `GET /expense/:slug`. The `src/components/ExpenseView.tsx` component then renders the expense, its items, and associated people.
3.  **Item Claiming/Unclaiming**: Users interact with the `ExpenseView` to claim items.
    *   **Claim Item**: A `POST` request is made to `/expense/:slug/items/:itemId/claim` with a `personId` in the payload (ClaimItemRequest) to assign an item to a person.
    *   **Unclaim Item**: A `DELETE` request is made to `/expense/:slug/items/:itemId/claim/:personId` to remove a person's claim on an item.
4.  **Adding People**: Users can add new participants to an existing expense by sending a `POST` request to `/expense/:slug/people`.
5.  **Updating Expense**: General expense details can be updated via a `PUT` request to `/expense/:slug`.
Data moves from user input (e.g., receipt image, person name, claim actions) to the frontend application, which then dispatches requests to the backend API. Backend responses update the local state and UI, providing real-time feedback.

## Data Models & State
Data models are defined in `src/types/index.ts`, distinguishing between backend API response/request structures and frontend-adapted structures.

### Backend API Response Types
*   **`ItemResponse`**: Represents a single item on a bill.
    *   `id: string`
    *   `name: string`
    *   `price: number`
    *   `quantity: number`
    *   `totalQuantity: number`
    *   `claimedBy: string[]` (Array of *person IDs* who claimed this item)
*   **`PersonResponse`**: Represents a person participating in the bill.
    *   `id: string`
    *   `name: string`
    *   `itemsClaimed: string[]` (Array of *item IDs* claimed by this person)
    *   `amountOwed: number`
    *   `subtotal: number`
    *   `taxShare: number`
    *   `serviceChargeShare: number`
    *   `discountShare: number`
    *   `totalOwed: number`
    *   `finished: boolean` (API uses 'finished' for completion status)
*   **`ExpenseResponse`**: The root object for a bill, containing items and people.
    *   `id: string`
    *   `slug: string` (Unique URL-friendly identifier)
    *   `restaurantName: string`
    *   `createdAt: string`
    *   `payerName: string`
    *   `totalAmount: number`
    *   `subtotal: number`
    *   `tax: number`
    *   `serviceCharge: number`
    *   `discount: number`
    *   `items: ItemResponse[]`
    *   `people: PersonResponse[]`

### Backend API Request Types
*   **`ItemRequest`**: For creating/updating items (e.g., in an expense PUT).
    *   `id?: string`
    *   `name: string`
    *   `price: number`
*   **`PersonRequest`**: For adding/updating people.
    *   `name: string`
    *   `itemsClaimed?: string[]`
    *   `amountOwed?: number`, `subtotal?`, `taxShare?`, `serviceChargeShare?`, `discountShare?`, `totalOwed?`
    *   `isFinished?: boolean` (Note: Frontend type naming for `finished`)
*   **`ExpenseRequest`**: For creating/updating an expense.
    *   `payerName: string`
    *   `totalAmount: number`, `subtotal`, `tax`, `serviceCharge`, `discount`
    *   `items: ItemRequest[]`
    *   `people?: PersonRequest[]`
*   **`ClaimItemRequest`**: For claiming an item.
    *   `personId: string`

### Frontend Internal Types (Adapter for UI)
*   **`Item`**: Similar to `ItemResponse`, but `claimedBy` stores *person names* for display.
*   **`Person`**: Similar to `PersonResponse`, but `isFinished: boolean` (normalized boolean naming).
*   **`Expense`**: Similar to `ExpenseResponse`, but uses frontend `Item` and `Person` types.
*   **`ExpenseSummary`**: Aggregates an `Expense` object with a `splitSummary` map (`[personName: string]: number`).
*   **`ApiError`**: Standard error response structure (`timestamp`, `status`, `error`, `message`, `path`).

## API & Interfaces
The application interacts with a backend API (defaulting to `http://localhost:8080`, configurable via `NEXT_PUBLIC_API_BASE_URL`). All API calls are made via an Axios instance configured in `src/api/client.ts`.

### Endpoints:
*   **`POST /expense/upload`**
    *   **Purpose**: Upload a restaurant receipt image for processing.
    *   **Payload**: `FormData` containing the image file (implied from "upload receipt image").
    *   **Response**: `ExpenseResponse` for the newly created expense.
*   **`GET /expense/:slug`**
    *   **Purpose**: Retrieve details for a specific expense.
    *   **Parameters**: `slug` (path parameter, `string`) - unique identifier for the expense.
    *   **Response**: `ExpenseResponse`.
*   **`POST /expense/:slug/items/:itemId/claim`**
    *   **Purpose**: Claim a specific item on an expense by a person.
    *   **Parameters**: `slug` (path parameter), `itemId` (path parameter, `string`).
    *   **Payload**: `ClaimItemRequest` (`{ personId: string }`).
    *   **Response**: Updated `ExpenseResponse`.
*   **`DELETE /expense/:slug/items/:itemId/claim/:personId`**
    *   **Purpose**: Unclaim a specific item on an expense by a person.
    *   **Parameters**: `slug` (path parameter), `itemId` (path parameter, `string`), `personId` (path parameter, `string`).
    *   **Response**: Updated `ExpenseResponse`.
*   **`PUT /expense/:slug`**
    *   **Purpose**: Update an existing expense's details (e.g., restaurant name, total, items, etc.).
    *   **Parameters**: `slug` (path parameter).
    *   **Payload**: `ExpenseRequest`.
    *   **Response**: Updated `ExpenseResponse`.
*   **`POST /expense/:slug/people`**
    *   **Purpose**: Add a new person to an existing expense.
    *   **Parameters**: `slug` (path parameter).
    *   **Payload**: `PersonRequest` (minimally, just `{ name: string }`).
    *   **Response**: Updated `ExpenseResponse`.

## Key Components
*   **`src/app/`**: Next.js App Router root.
    *   **`layout.tsx`**: Defines the root layout for all pages.
    *   **`page.tsx`**: The homepage of the application (likely for starting a new expense).
    *   **`[slug]/page.tsx`**: Dynamic route for viewing a specific expense, fetching data via `GET /expense/:slug`.
    *   **`globals.css`**: Global Tailwind CSS styles.
*   **`src/components/`**: Reusable React components.
    *   **`CreateExpensePage.tsx`**: Likely the component for initiating a new expense, possibly integrating `ReceiptUpload`.
    *   **`ExpenseView.tsx`**: Displays the details of an expense, including items and people, and handles interactions like claiming items.
    *   **`ReceiptUpload.tsx`**: Component responsible for handling receipt image uploads to the backend.
*   **`src/api/`**: API client configuration and utility.
    *   **`client.ts`**: Configures and exports the Axios instance for backend API calls.
    *   **`config.ts`**: Centralizes environment-dependent API base URL.
*   **`src/hooks/`**: Custom React hooks.
    *   **`usePersonName.ts`**: A custom hook, possibly for generating unique person names or managing person-related state.
*   **`src/types/`**: TypeScript type definitions for data models and API contracts.
*   **`src/utils/`**: Utility functions.
    *   **`imageCompression.ts`**: Utility for client-side image compression before upload.

## Dependencies & Environment
### Key Dependencies:
*   **`next`**: Next.js framework (v15.5.9)
*   **`react`**, **`react-dom`**: React UI library (v19.1.0)
*   **`axios`**: Promise-based HTTP client for API requests (v1.12.2)
*   **`tailwindcss`**: Utility-first CSS framework (v3.4.18)
*   **`react-qr-code`**: For generating QR codes (v2.0.18)
*   **`unique-names-generator`**: Utility for generating unique, readable names (v4.7.1)
*   **`typescript`**: Language for type safety.
*   **`@tailwindcss/forms`**: Tailwind CSS plugin for better form element styling.
*   **`eslint`**, **`eslint-config-next`**: Linting tools for code quality.

### Environment Variables:
*   **`NEXT_PUBLIC_API_BASE_URL`**: The base URL for the backend API.
    *   Configured in `.env.local`.
    *   Default value is `http://localhost:8080` if not set, as defined in `env.config.ts`.
    *   Accessible on both client and server sides due to the `NEXT_PUBLIC_` prefix.

## Development Notes
*   **Next.js App Router**: The project utilizes Next.js App Router for routing, favoring server components where applicable for performance and SEO.
*   **TypeScript**: Strongly typed throughout the codebase, with explicit interfaces for API payloads and local state (`src/types/index.ts`). Note the minor differences in naming conventions and data representation for `claimedBy` (IDs vs. names) and `isFinished`/`finished` between backend and frontend types.
*   **API Rewrites**: `next.config.ts` includes an `async rewrites` configuration that proxies `/api/:path*` requests to the backend API. In development, this targets `http://localhost:8080`, simplifying API calls and avoiding CORS issues. In production, it targets `NEXT_PUBLIC_API_BASE_URL`.
*   **Styling**: Tailwind CSS is used for all styling, configured via `tailwind.config.ts` and integrated with `@tailwindcss/forms`.
*   **Image Optimization**: `next.config.ts` includes `images.domains` configuration for `localhost`, indicating that images might be served from the local development server or a specific domain.
*   **Build/Dev Performance**: `npm run dev` and `npm run build` use the `--turbopack` flag for faster compilation.