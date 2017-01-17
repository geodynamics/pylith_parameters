// -*- JavaScript -*-
//
// ----------------------------------------------------------------------
//
// Brad T. Aagaard, U.S. Geological Survey
//
// This code was developed as part of the Computational Infrastructure
// for Geodynamics (http://geodynamics.org).
//
// Copyright (c) 2016-2017 University of California, Davis
//
// See COPYING for license information.
//
// ----------------------------------------------------------------------
//

import React from 'react';

class VersionPlatform extends React.Component {
    render() {
	return (
		<div className="version-package">
		<h3>Platform</h3>
		<dl>
		<dt>Hostname</dt><dd>{this.props.value.hostname}</dd>
		<dt>Operating system</dt><dd>{this.props.value.os}</dd>
		<dt>Kernel</dt><dd>{this.props.value.kernel}</dd>
		<dt>Version</dt><dd>{this.props.value.version}</dd>
		<dt>Processor</dt><dd>{this.props.value.processor}</dd>
		<dt>Machine</dt><dd>{this.props.value.machine}</dd>
		</dl>
		</div>
	);
    } // render
} // VersionSimple


class VersionSimple extends React.Component {
    render() {
	return (
		<div className="version-package">
		<h3>{this.props.name}</h3>
		<dl>
		<dt>Version</dt><dd><span className="version">{this.props.value.version}</span></dd>
		</dl>
		</div>
	);
    } // render
} // VersionSimple

class VersionGit extends React.Component {
    render() {
	if (this.props.value.isRelease) {
	    return (
		    <div className="version-package">
		    <h3>{this.props.name}</h3>
		    <dl>
		    <dt>Release</dt><dd><span className="version">v{this.props.value.version}</span></dd>
		    </dl>
		    </div>
	    );
	} else {
	    return (
		    <div className="version-package">
		    <h3>{this.props.name}</h3>
		    <dl>
		    <dt>Configured</dt><dd>{this.props.value.gitDate}</dd>
		    <dt>GIT branch</dt><dd>{this.props.value.gitBranch}</dd>
		    <dt>GIT revision</dt><dd><span className="version">{this.props.value.gitRevision}</span></dd>
		    <dt>GIT hash</dt><dd>{this.props.value.gitHash}</dd>
		    </dl>
		    </div>
	    );
	} // if/else
    } // render
} // VersionGit

class VersionPetsc extends React.Component {
    render() {
	if (this.props.value.isRelease) {
	    return (
		    <div className="version-package">
		    <h3>PETSc</h3>
		    <dl>
		    <dt>Release</dt><dd><span className="version">v{this.props.value.version}</span></dd>
		    <dt>PETSC_DIR</dt><dd><span className="file-path">{this.props.value.petscDir}</span></dd>
		    <dt>PETSC_ARCH</dt><dd>{this.props.value.petscArch}</dd>
		    </dl>
		    </div>
	    );
	} else {
	    return (
		    <div className="version-package">
		    <h3>PETSc</h3>
		    <dl>
		    <dt>Configured</dt><dd>{this.props.value.gitDate}</dd>
		    <dt>GIT branch</dt><dd>{this.props.value.gitBranch}</dd>
		    <dt>GIT revision</dt><dd><span className="version">{this.props.value.gitRevision}</span></dd>
		    <dt>PETSC_DIR</dt><dd><span className="file-path">{this.props.value.petscDir}</span></dd>
		    <dt>PETSC_ARCH</dt><dd>{this.props.value.petscArch}</dd>
		    </dl>
		    </div>
	    );
	} // if/else
    } // render
} // VersionPetsc

class VersionMPI extends React.Component {
    render() {
	return (
		<div className="version-package">
		<h3>MPI</h3>
		<dl>
		<dt>Standard</dt><dd>{this.props.value.standard}</dd>
		<dt>Implementation</dt><dd>{this.props.value.implementation}</dd>
		<dt>Version</dt><dd><span className="version">{this.props.value.version}</span></dd>
		</dl>
		</div>
	);
    } // render
} // VersionMPI

class VersionPython extends React.Component {
    render() {
	const modules = Object.keys(this.props.value.modules).map((name) => {
		const module = this.props.value.modules[name];
		return (
		    <span key={name}><dt>{name}</dt><dd><span className="version">v{module.version}</span> from <span className="file-path">{module.location}</span></dd></span>
		);
	    }, this);
	return (
		<div className="version-package">
		<h3>Python</h3>
		<dl>
		<dt>Version</dt><dd><span className="version">{this.props.value.version}</span></dd>
		<dt>Compiled with</dt><dd>{this.props.value.compiler}</dd>
		<dt>Executable</dt><dd><span className="file-path">{this.props.value.executable}</span></dd>
		<dt>Modules</dt><dd>
		<dl>{modules}</dl>
		</dd>
		</dl>
		</div>
	);
    } // render
} // VersionMPI

class Version extends React.Component {
    render() {
	if (!this.props.version) {
	    return null;
	} // if

	const version = this.props.version;

	return (
		<div className="version">
		<VersionPlatform value={this.props.platform} />
		<VersionGit name="PyLith" value={version.pylith} />
		<h2>Dependencies</h2>
		<VersionPetsc value={version.petsc} />
		<VersionMPI value={version.mpi} />
		<VersionGit name="Spatialdata" value={version.spatialdata} />
		<VersionSimple name="Proj" value={version.proj} />
		<VersionSimple name="HDF5" value={version.hdf5} />
		<VersionSimple name="NetCDF" value={version.netcdf} />
		<VersionPython value={version.python} /> 
		</div>
	);
    } // render
} // Version

export { Version };

// End of file
