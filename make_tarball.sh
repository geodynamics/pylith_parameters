#!/bin/bash

if [ $# == 1 ]; then
    VERSION=$1
else
    VERSION="X.X.X"
fi

# Verify package.json 'homepage' is https://geodynamics.github.io/.
mkdir -p parametersgui
rm -fr parametersgui/*
npm run build
cp -r build/* parametersgui
tar -zcvf pylith_parameters-${VERSION}.tar.gz parametersgui
rm -fr parametersgui

exit 0
