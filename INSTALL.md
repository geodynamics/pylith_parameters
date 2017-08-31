# Installation Instructions

## End-User Installation

The PyLith Parameter Viewer is included in the PyLith binary
distributions and PyLith Docker container for versions 2.1.5 and
later. Additionally, the PyLith Installer will install the Parameter
Viewer by default.

For manual installation you can download the PyLith Parameter Viewer
tarball from the PyLith software page
(\url{https://geodynamics.org/cig/software/pylith/}). After
downloading the tarball, unpack it. We recommend unpacking the tarball
in the top-level PyLith directory.
```
# Go to the top-level PyLith directory
$$ cd pylith
# Unpack the tarball
$$ tar -xvf pylith_parameters-1.0.1.tgz
```

## Developer

You must have [Node.js](https://nodejs.org) installed.

### Installation

```
# Clone the repository
$$ git clone https://github.com/geodynamics/pylith_parameters.git
$$ cd pylith_parameters
# Install dependencies using Node pacakge manager
$$ npm install
# Build application and run development server.
$$ npm start
```

### Deployment

To deploy the application to
https://geodynamics.github.io/pylith_parameters,
```
$$ npm deploy
```

### Tarball for release

To create the tarball for release and use by the PyLith Installer and
binaries,
```
$$ make_tarball.sh VERSION
```
