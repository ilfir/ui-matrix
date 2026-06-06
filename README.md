# ui-matrix

## Description

An interactive 5x5 letter matrix web application built with vanilla HTML, CSS, and JavaScript. Features include letter grid input, word search functionality, settings configuration, and result display. The app runs locally via `http-server` or in a Docker container.

## Getting Started

### Prerequisites
- Docker (optional)
- Node.js

### Installing

1. Clone the repository:
    ```sh
    git clone https://github.com/ilfir/ui-matrix.git
    cd ui-matrix
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running Locally

1. Start the application:
    ```sh
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000`.

### Deploying with Docker Compose

1. Start the app using Docker Compose:
    ```sh
    docker-compose up
    ```

2. Open your browser and navigate to `http://localhost:3000`.

### Deploying to Docker (manual)

1. Build the Docker image:
    ```sh
    docker build -t ui-matrix .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 3000:3000 ui-matrix
    ```

### Deploying to Another Server

1. Build the Docker image on your local machine:
    ```sh
    docker build -t ui-matrix .
    ```

2. Save the Docker image to a tar file:
    ```sh
    docker save -o ui-matrix.tar ui-matrix
    ```

3. Transfer the tar file to the remote server:
    ```sh
    scp ui-matrix.tar user@remote-server:/path/to/destination
    ```

4. SSH into the remote server:
    ```sh
    ssh user@remote-server
    ```

5. Load the Docker image from the tar file on the remote server:
    ```sh
    docker load -i /path/to/destination/ui-matrix.tar
    ```

6. Run the Docker container on the remote server:
    ```sh
    docker run -p 3000:3000 ui-matrix
    ```

Your project should now be accessible at `http://<remote-server-ip>:3000`.