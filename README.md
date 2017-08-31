# PyLith Parameter Viewer

Web-browser application to view PyLith parameter JSON files created by
`pylithinfo` or generated when running `pylith`.

## Installation

See [INSTALL.md](INSTALL.md) for installation instructions.

## Running the parameter viewer

1. Change to the parametersgui directory containing the index.html
   file and start the web server. You can change the default port
   (9000) for the web server using the `--port=PORT` command line
   argument to `pylith_paramviewer`.

  ```
  cd parametersguis
  pylith_paramviewer
  ```

2. Point your web-browser to `http://127.0.0.1:9000`.

3. Load the sample JSON file `sample_parameters.json` or other file by
   clicking on the `Choose File` button.

### Reloading a file

If you regenerate the JSON parameter file, simply click on the
`Reload` button to reload the currently selected JSON parameter
file. The time stamp embedded in the parameter file corresponding to
the time it was generated is shown below the filename.

### Parameter information

The Parameter tab (selected by default) displays the information about
the parameters.

The left panel shows the hierarchy of parameters as a tree. You can
expand/collapse the tree by clicking on the triangles or `Expand all`
and `Collapse all` buttons.

Selecting a component in the left panel by clicking on the component
type (red text) will display detailed information about the component
in the right panel.

### Version information

The Version tab displays the version information for PyLith.

## Installation (Development Version)

1. Clone repository

  ```
  git clone https://github.com/baagaard-usgs/pylith_parameters.git
  cd pylith_parameters
  ```

2. Install dependencies

  1. Install [Node.js](https://nodejs.org)
  2. Use node to install JavaScript libraries (dependencies)
  3. Start development web server.

  ```
  npm install
  npm start
  ```
