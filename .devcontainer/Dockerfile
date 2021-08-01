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

# Install OpenCV and dependency
RUN apt-get update && apt-get install -y clang libclang-dev build-essential cmake pkg-config libgtk-3-dev libavcodec-dev libavformat-dev libswscale-dev libv4l-dev libxvidcore-dev libx264-dev libjpeg-dev libpng-dev libtiff-dev gfortran openexr libatlas-base-dev libtbb2 libtbb-dev libdc1394-22-dev && mkdir ~/opencv_build && cd ~/opencv_build && git clone https://github.com/opencv/opencv.git && git clone https://github.com/opencv/opencv_contrib.git && cd ~/opencv_build/opencv && mkdir build && cd build && cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D INSTALL_C_EXAMPLES=ON -D INSTALL_PYTHON_EXAMPLES=ON -D OPENCV_GENERATE_PKGCONFIG=ON -D OPENCV_EXTRA_MODULES_PATH=~/opencv_build/opencv_contrib/modules -D BUILD_EXAMPLES=ON ..  && make -j2 && make install && apt-get clean -y && rm -rf /var/lib/apt/lists/*

ENV OPENCV_INCLUDE_PATHS=/usr/local/include/opencv4/
ENV OPENCV_LINK_LIBS=/usr/local/lib,opencv_gapi,opencv_stitching,opencv_aruco,opencv_barcode,opencv_bgsegm,opencv_bioinspired,opencv_ccalib,opencv_dnn_objdetect,opencv_dnn_superres,opencv_dpm,opencv_face,opencv_freetype,opencv_fuzzy,opencv_hfs,opencv_img_hash,opencv_intensity_transform,opencv_line_descriptor,opencv_mcc,opencv_quality,opencv_rapid,opencv_reg,opencv_rgbd,opencv_saliency,opencv_stereo,opencv_structured_light,opencv_phase_unwrapping,opencv_superres,opencv_optflow,opencv_surface_matching,opencv_tracking,opencv_highgui,opencv_datasets,opencv_text,opencv_plot,opencv_videostab,opencv_videoio,opencv_wechat_qrcode,opencv_xfeatures2d,opencv_shape,opencv_ml,opencv_ximgproc,opencv_video,opencv_dnn,opencv_xobjdetect,opencv_objdetect,opencv_calib3d,opencv_imgcodecs,opencv_features2d,opencv_flann,opencv_xphoto,opencv_photo,opencv_imgproc,opencv_core
ENV OPENCV_LINK_PATHS=/root/opencv_build/opencv/build/lib/