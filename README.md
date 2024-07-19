# Task Management App

## Description

This is a task management application created with angular and NGRX for state management. It includes characteristics for tasks and user management (The latter will be available soon).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Running Unit Tests](#running-unit-tests)
- [Project Structure](#project-structure)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v20 or later)
- npm (v10 or later)
- Angular CLI (v18 or later)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/arayavalencia96/task-management-app.git
   cd task-management-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

## Running the Project

```sh
ng serve
```

## Running Unit Tests

```sh
ng test
```

Con covertura:

```sh
ng test:coverage
```

## Project Structure

```plaintext
data/
src/
  app/
    core/
      store/
        pagination/
    features/
      tasks/
        components/
        models/
        store/
      users/
        components/
        models/
        store/
    shared/
      components/
        modal/
    store/
    app.config.ts
    app.routes.ts
    ...
  index.html
  main.ts
```
