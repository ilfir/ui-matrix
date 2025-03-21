# ui-matrix-project

## Description
Matrix 5x5

## Getting Started

### Prerequisites
- Docker
- Node.js

### Installing
1. Clone the repository:
    ```sh
    git clone https://github.com/ilfir/ui-matrix.git
    cd ui-matrix-project
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

### Deploying to Docker

1. Build the Docker image:
    ```sh
    docker build -t ui-matrix-project .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 3000:3000 ui-matrix-project
    ```

### Running on Another Server

1. Build the Docker image on your local machine:
    ```sh
    docker build -t ui-matrix-project .
    ```

2. Save the Docker image to a tar file:
    ```sh
    docker save -o ui-matrix-project.tar ui-matrix-project
    ```

3. Transfer the tar file to the remote server:
    ```sh
    scp ui-matrix-project.tar user@remote-server:/path/to/destination
    ```

4. SSH into the remote server:
    ```sh
    ssh user@remote-server
    ```

5. Load the Docker image from the tar file on the remote server:
    ```sh
    docker load -i /path/to/destination/ui-matrix-project.tar
    ```

6. Run the Docker container on the remote server:
    ```sh
    docker run -p 3000:3000 ui-matrix-project
    ```

Your project should now be accessible at `http://<remote-server-ip>:3000`.