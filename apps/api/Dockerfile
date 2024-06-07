FROM docker.io/node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies needed for fetching and installing wunderctl
RUN apk add --no-cache curl

# Download and install the wunderctl binary
RUN apk add --no-cache curl && \
    curl -fSL "https://github.com/wundergraph/wundergraph/releases/download/v0.180.0/wunderctl_0.180.0_Linux_x86_64.tar.gz" -o wunderctl.tar.gz && \
    cat wunderctl.tar.gz | tar -xz -C /usr/local/bin && \
    rm wunderctl.tar.gz

    
# Copy the necessary files
COPY package.json /app/
COPY .wundergraph ./.wundergraph

# Set environment variables as needed
ENV CI=true \
    WG_COPY_BIN_PATH=/usr/local/bin/wunderctl \
    WG_NODE_URL=http://127.0.0.1:9991 \
    WG_NODE_INTERNAL_URL=http://127.0.0.1:9993 \
    WG_NODE_HOST=0.0.0.0 \
    WG_NODE_PORT=9991 \
    WG_NODE_INTERNAL_PORT=9993 \
    WG_SERVER_URL=http://127.0.0.1:9992 \
    WG_SERVER_HOST=127.0.0.1 \
    WG_SERVER_PORT=9992 \
    WG_PUBLIC_NODE_URL=https://next-visioncreator.fly.dev

# Install npm dependencies
RUN npm install

# Generate the WunderGraph configuration
RUN wunderctl generate --wundergraph-dir=.wundergraph

# Expose only the node, server is private
EXPOSE 9991

# Command to run the application
CMD wunderctl start --wundergraph-dir=.wundergraph