# DesignPro: Ceiling & Wall Calculator

DesignPro is a specialized web application designed to simplify the process of estimating materials and costs for suspended ceiling and modern fluted wall paneling projects. It provides an intuitive interface for users to input dimensions and select materials, offering instant calculations and a 2D visualizer to aid in project planning.

The application features two main tools:
1.  **CeilingCalc Pro:** For calculating materials for 2x2 grid suspended ceilings.
2.  **Wall Designer:** For designing and calculating materials for modern fluted panel feature walls.

## Core Features

- **Dynamic Material Calculation:** Instantly calculates the required quantity of panels, tees, clips, screws, and other materials based on user-provided dimensions.
- **Cost Estimation:** Provides a detailed cost breakdown for all materials, including optional items and labor, helping users budget effectively.
- **Interactive 2D Visualizer:** The Wall Designer includes a real-time visualizer that renders a 2D preview of the feature wall, including panel colors, textures, feature areas, and even a preview of a mounted TV.
- **Waste Optimization Logic:** The calculator for wall panels intelligently computes the number of panels needed, accounting for cuts and minimizing waste for rooms taller than the standard panel height.
- **Customizable Designs:** Users can choose from various design styles (Solid, Alternating, Custom Patterns) and a palette of panel colors and textures.
- **Responsive Design:** A mobile-first interface ensures a seamless experience across all devices.

## Technology Stack

This project is built with a modern, robust, and scalable tech stack.

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React](https://reactjs.org/)
- **Component Library:** [ShadCN/UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible, and reusable components.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- **Form Management:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema validation.
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend & AI

- **AI Framework:** [Genkit](https://firebase.google.com/docs/genkit) - Used for integrating generative AI features. (Note: No AI features are currently implemented but the foundation is in place).
- **Hosting:** Firebase App Hosting

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/designpro.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd designpro
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Development Server

To start the local development server, run the following command:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code for errors and style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
