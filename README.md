# Deeshu - A Comprehensive Relationship App

Deeshu is a feature-rich application designed to help couples strengthen their bond through shared activities, communication, and memory-keeping. It provides a private and intimate space for partners to grow together, manage their lives, and cherish their special moments.

## Features

This application comes with a wide range of features to enhance the relationship between partners:

*   **Authentication:** Secure user registration and login functionality.
*   **Dashboard:** A centralized view of all your activities, goals, and upcoming events.
*   **Partner Connection:**
    *   **Find Your Partner:** Search for and send a connection request to your partner.
    *   **Connection Requests:** Manage incoming connection requests.
*   **Communication:**
    *   **Real-time Chat:** Instant messaging to stay connected throughout the day.
*   **Shared Space:**
    *   **Shared Calendar:** Keep track of important dates, anniversaries, and shared events.
    *   **Common Goals:** Set and track goals you want to achieve together.
*   **Memory Lane:**
    *   **Scrapbook:** A digital scrapbook to save your favorite photos and memories.
    *   **Memories:** A dedicated space to reminisce about your past experiences together.
*   **Personal Tools:**
    *   **Notes:** A simple note-taking feature for personal reminders or thoughts.
*   **User Profile:** Manage your profile information and settings.
*   **Notifications:** Stay updated with real-time notifications for important events and messages.

## Tech Stack

*   **Frontend:** React, Tailwind CSS
*   **Backend:** Firebase (Firestore, Authentication, Storage)
*   **Build Tool:** Vite

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (or yarn) installed on your machine.
*   A Firebase project set up.

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/Himanshukumar56/deeshu.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**
    *   Create a `.env` file in the root of the project.
    *   Add your Firebase project configuration to the `.env` file. It should look like this:
        ```
        VITE_API_KEY=your_api_key
        VITE_AUTH_DOMAIN=your_auth_domain
        VITE_PROJECT_ID=your_project_id
        VITE_STORAGE_BUCKET=your_storage_bucket
        VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
        VITE_APP_ID=your_app_id
        ```
4.  **Run the app**
    ```sh
    npm run dev
    ```

This will start the development server, and you can view the application in your browser at `http://localhost:5173`.
