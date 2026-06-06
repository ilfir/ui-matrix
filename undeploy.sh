#!/bin/bash
# Undeploy the UI Matrix Docker container
docker rm -f ui-matrix 2>/dev/null || echo "Container not running"
echo "UI Matrix undeployed."
