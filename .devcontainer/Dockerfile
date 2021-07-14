# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.187.0/containers/rust/.devcontainer/base.Dockerfile

FROM mcr.microsoft.com/vscode/devcontainers/rust:0-1

# [Optional] Uncomment this section to install additional packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# Install NVM
ENV NVM_DIR="/usr/local/share/nvm"
ENV NVM_SYMLINK_CURRENT=true \
    PATH=${NVM_DIR}/current/bin:${PATH}
COPY library-scripts/node-debian.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/node-debian.sh "${NVM_DIR}" && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# [Option] Install Node.js
ARG INSTALL_NODE="true"
ARG NODE_VERSION="lts/*"
RUN if [ "${INSTALL_NODE}" = "true" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

# cargo install
RUN su vscode -c "umask 0002 && cargo install wasm-pack && cargo install cargo-edit"
