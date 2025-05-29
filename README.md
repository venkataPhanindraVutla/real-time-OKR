# MyOKR - Modern OKR Management Application

## Overview

MyOKR is a web-based Objectives and Key Results (OKR) management application designed to help individuals and teams create, manage, and track their goals effectively. Built with React, Shadcn, Typescript and Supabase, MyOKR provides a clean and intuitive interface for setting objectives, defining key results, and monitoring progress.

## Features

-   **User Authentication and Authorization:** Secure user authentication and authorization to protect sensitive data and ensure that only authorized users can access specific features.
-   **Hierarchical Structure:** Implementation of the following hierarchy: Organization > Departments > Teams > Users, allowing for a clear and organized structure for managing OKRs.
-   **Team OKRs:** Teams can create and manage their own OKRs, which are then assigned to individual users within the team.
-   **CRUD Operations for OKRs:** Full CRUD (Create, Read, Update, Delete) operations for managing OKRs, making it easy to create, modify, and remove objectives and key results.
-   **Progress Tracking System:** A visual progress tracking system for monitoring the progress of OKRs, providing insights into how well objectives are being met.
-   **Modern User Interface:** A user-friendly and responsive UI that works seamlessly across different devices.

## Technologies Used

-   **Frontend:** React, Typescript, Shadcn
-   **Backend:** Supabase
-   **Database:** Supabase (PostgreSQL)
-   **Authentication:** Supabase Auth

## Database Schema

The database schema consists of the following tables:

-   **organizations:**
    -   id (uuid, primary key)
    -   name (text)
    -   description (text)
    -   created_at (timestamptz)
    -   updated_at (timestamptz)
    -   created_by (uuid)
-   **departments:**
    -   id (uuid, primary key)
    -   organization_id (uuid, foreign key to organizations.id)
    -   name (text)
    -   description (text)
    -   created_at (timestamptz)
    -   updated_at (timestamptz)
    -   created_by (uuid)
-   **teams:**
    -   id (uuid, primary key)
    -   department_id (uuid, foreign key to departments.id)
    -   name (text)
    -   description (text)
    -   created_at (timestamptz)
    -   updated_at (timestamptz)
    -   created_by (uuid)
-   **okrs:**
    -   id (uuid, primary key)
    -   team_id (uuid, foreign key to teams.id)
    -   assigned_user_id (uuid, foreign key to profiles.id)
    -   title (text)
    -   description (text)
    -   progress (int4)
    -   status (text)
    -   due_date (date)
    -   created_at (timestamptz)
    -   updated_at (timestamptz)
    -   created_by (uuid)
-   **key_results:**
    -   id (uuid, primary key)
    -   okr_id (uuid, foreign key to okrs.id)
    -   title (text)
    -   target_value (numeric)
    -   current_value (numeric)
    -   unit (text)
    -   progress (int4)
    -   created_at (timestamptz)
    -   updated_at (timestamptz)
    -   created_by (uuid)
-   **user_teams:**
    -   id (uuid, primary key)
    -   user_id (uuid, foreign key to profiles.id)
    -   team_id (uuid, foreign key to teams.id)
    -   role (text)
    -   created_at (timestamptz)
-   **profiles:**
    -   id (uuid, primary key, referencing auth.users.id)
    -   email (text)
    -   full_name (text)
    -   avatar_url (text)
    -   created_at (timestamptz)
    -   updated_at (timestamptz)

## Getting Started

### Prerequisites

-   Node.js
-   npm

### Installation

1.  Clone the repository:

    ```bash
    git clone [repository URL]
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure Supabase:

    -   [Provide instructions on how to set up Supabase]

4.  Set up environment variables:

    -   Create a `.env` file in the root directory.
    -   Add the following environment variables:
        -   `NEXT_PUBLIC_SUPABASE_URL`=[Your Supabase URL]
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`=[Your Supabase Anon Key]

5.  Run the application:

    ```bash
    npm run dev
    ```

6.  Open your browser and navigate to `http://localhost:[port]`.

## Live deployment

- https://real-time-okr.vercel.app

## Reference

-   [SugarOKR](https://sugarokr.com/)
