#!/bin/bash

if [ $# == 1 ]; then
    VERSION=$1
else
    VERSION="X.X.X"
fi

mkdir -p parametersgui
rm -fr parametersgui/*
npm run build
cp -r public/* parametersgui
tar -zcvf pylith_parameters-${VERSION}.tgz parametersgui
rm -fr parametersgui

exit 0
