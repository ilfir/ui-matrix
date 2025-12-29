docker build -t ui-matrix-project .
docker run --name ui-matrix -p 3000:3000 ui-matrix-project
