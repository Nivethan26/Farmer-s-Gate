# AgriLink Lanka - Frontend

## Overview

AgriLink Lanka is a modern agricultural marketplace platform connecting Sri Lankan farmers with smart buyers. The frontend is built with cutting-edge web technologies to provide a seamless user experience.

## Technologies

- **Vite** - Fast build tool and dev server
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **Framer Motion** - Smooth animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd Farmer-s-Gate/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── catalog/        # Product catalog components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── store/              # Redux store and slices
├── utils/              # Utility functions
├── assets/             # Static assets
├── i18n/               # Translation files
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Key Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Multi-language Support** - English, Sinhala, Tamil
- **Product Catalog** - Advanced filtering and search
- **Shopping Cart** - Real-time cart management
- **User Authentication** - Secure login and registration
- **Farmer Dashboard** - Product management for sellers
- **Buyer Dashboard** - Order tracking and history
- **Modern UI/UX** - Smooth animations and transitions

## Development

### Code Quality

```bash
# Run linter
npm run lint
```

### Adding New Components

Use the shadcn CLI to add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=your_api_url
```

## Internationalization

Translation files are located in `src/i18n/locales/`. To add a new language:

1. Create a new translation file in the locales directory
2. Add the language configuration to `i18n/config.ts`
3. Add language switcher option in `LanguageSwitcher.tsx`

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## License

Copyright © 2025 AgriLink Lanka. All rights reserved.
