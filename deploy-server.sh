git pull
docker build -t ui-matrix-project .
docker save -o ui-matrix-project.tar ui-matrix-project
docker load -i ui-matrix-project.tar
docker run -p 3000:3000 ui-matrix-project
echo "OR RUN IN STACKS"