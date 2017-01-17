import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';

// :TODO:
// Typecheck with PropTypes
// Expand all doesn't expand hidden children
// Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the ComponentAvatar component.

class ComponentAvatar extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    showChildren: true
	};

    } // constructor

    getFacility() {
	return this.props.facility;
    } // getFacility
    
    getComponent() {
	return this.props.value;
    } // getComponent

    setShowChildren(value) {
	this.setState({
	    showChildren: value
	});
    } // setShowChildren
    
    handleCollapseClick(event) {
	event.stopPropagation();
	this.setState({
	    showChildren: !this.state.showChildren
	});
    } // handleClick

    setSelected(value) {
	this.setState({
	    selected: value
	});
    } // setSelected 

    handleDetailClick(event) {
	event.stopPropagation();

	this.setSelected(true);
	this.props.handleSelection(this)
    } // handleClick
    
    render() {
	if (!this.props.value) {
	    return (<p className="null-selection">No components.</p>);
	} // if
	const componentClass = this.state.showChildren ? 'pyre-component-expanded' : 'pyre-component-collapsed';
	const pythonClass = this.state.selected ? 'python-type-selected' : 'python-type';

	let subcomponents = null;
	if (this.state.showChildren) {
	    subcomponents = Object.keys(this.props.value.components).map((name) => {
		const component = this.props.value.components[name];
		const prefix = (this.props.prefix) ? this.props.prefix+"."+this.props.value.name : this.props.value.name;
		return (
			<ComponentAvatar key={name} facility={name} value={component} prefix={prefix} handleSelection={this.props.handleSelection}/>
		);
	    }, this);
	} // if
	return (
		<li key={this.props.value.name} className={componentClass} onClick={(event) => this.handleCollapseClick(event)} >
		<span className="pyre-component">{this.props.facility}</span> = <span className={pythonClass} onClick={(event) => this.handleDetailClick(event)}>{this.props.value.class}</span>
		<ul>{subcomponents}</ul>
		</li>
	);
    } // render
} // ComponentAvatar

class HierarchyPanel extends React.Component {

    handleCollapseClick() {
	this.component.setShowChildren(false);
    } // handleCollapseClick

    handleExpandClick() {
	this.component.setShowChildren(true);
    } // handleExpandClick

    render() {
	return (
		<div className="component-panel">
		<h2>Component Hierarchy</h2>
		<div className="hierarchy-settings">
		<button onClick={() => this.handleExpandClick()}>Expand all</button>
		<button onClick={() => this.handleCollapseClick()}>Collapse all</button>
		</div>
		<div className="hierarchy-list">
		<ul>
		<ComponentAvatar key="application" facility="application" value={this.props.application} prefix={null} handleSelection={this.props.handleSelection} ref={(obj) => { this.component = obj; }}/>
		</ul>
		</div>
		</div>
	);
    } // render
} // HierarchyPanel

class ComponentDetail extends React.Component {
    render() {
	const selected = this.props.selected;
	const component = (selected) ? selected.getComponent() : null;
	if (!component) {
	    return (<p className="null-selection">No component selected.</p>);
	} // if
	const facility = selected.getFacility();

	const fullPath = (selected.props.prefix) ? selected.props.prefix + "." + selected.props.facility : selected.props.value.facility;
	const description = (this.props.showDescription) ? <div><dt>Description</dt><dd>{component.description}</dd></div> : null;
	const location = (this.props.showLocation) ? <div><dt>Set from</dt><dd>{component.setFrom}</dd></div> : null;
	
	const aliases = (component.aliases) ? component.aliases
	      .map(alias => <span key={alias} className="pyre-component">{alias}</span>)
	      .reduce((prev,curr) => {return([prev, ', ', curr])}) : null;

	const properties = Object.keys(component.properties).map((name) => {
	    const property = this.props.selected.getComponent().properties[name];
	    return (
		    <ComponentProperty key={name} name={name} value={property} showDescription={this.props.showDescription} showLocation={this.props.showLocation} />
		);
	    }, this);

	const facilities = Object.keys(component.components).map((name) => {
	    const facility = this.props.selected.getComponent().components[name];
	    return (
		    <ComponentFacility key={name} name={name} value={facility} showDescription={this.props.showDescription} showLocation={this.props.showLocation} />
		);
	    }, this);

	return (
		<div className="component-detail">
		<h3>
		<span className="pyre-component">{facility}</span> = <span className="python-type">{component.class}</span>
		</h3>
	    
		<h3>Component information</h3>
		<dl className="detail-metadata">
		<dt>Full path</dt><dd><span className="pyre-component">[{fullPath}]</span></dd>
		<dt>Configurable as</dt><dd>{aliases}</dd>
		{description}
	        {location}
		</dl>
		
		<h3>Properties</h3>
		<dl>{properties}</dl>
		
	        <h3>Facilities (subcomponents)</h3>
		<dl>{facilities}</dl>
		</div>
	);
    } // render
} // ComponentDetail


class ComponentProperty extends React.Component {
    render() {
	const property = this.props.value;
	const description = (this.props.showDescription) ? <div><dt>Description</dt><dd>{property.description}</dd></div> : null;
	const location = (this.props.showLocation) ? <div><dt>Set from</dt><dd>{property.setFrom}</dd></div> : null;
	return(
		<div><dt><span className="pyre-property">{this.props.name}</span> (<span className="python-type">{property.type}</span>)</dt><dd><span className="pyre-value">{property.value}</span>
		<dl className="metadata">
		{description}
            {location}
	    </dl>
		</dd></div>
	);
    } // render
} // ComponentProperty

class ComponentFacility extends React.Component {
    render() {
	const facility = this.props.value;
	const description = (this.props.showDescription) ? <div><dt>Description</dt><dd>{facility.description}</dd></div> : null;
	const location = (this.props.showLocation) ? <div><dt>Set from</dt><dd>{facility.setFrom}</dd></div> : null;
	const aliases = (facility.aliases) ? facility.aliases
	      .map(alias => <span key={alias} className="pyre-component">{alias}</span>)
	      .reduce((prev,curr) => {return([prev, ', ', curr])}) : null;
	return(
		<div><dt><span className="pyre-component">{this.props.name}</span></dt><dd><span className="python-type">{facility.class}</span>
		<dl className="metadata">
		<dt>Configurable as</dt><dd>{aliases}</dd>
		{description}
                {location}
	        </dl>
		</dd></div>
	);
    } // render
} // ComponentFacility

class DetailPanel extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    showDescription: true,
	    showLocation: true
	};
    } // constructor
    
    handleDescriptionChange() {
	this.setState({
	    showDescription: !this.state.showDescription
	});
    } // handleDescriptionChange

    handleLocationChange() {
	this.setState({
	    showLocation: !this.state.showLocation
	});
    } // handleLocationChange

    render() {
	return (
		<div className="detail-panel">
		<h2>Details for Selected Component</h2>
		<div className="detail-settings">
		<label><input type="checkbox" defaultChecked={this.state.showDescription} onChange={() => this.handleDescriptionChange()} />Show description</label>
		<label><input type="checkbox" defaultChecked={this.state.showLocation} onChange={() => this.handleLocationChange()} />Show location</label>
		</div>
		<ComponentDetail selected={this.props.selected} showDescription={this.state.showDescription} showLocation={this.state.showLocation}/>
		</div>
	);
    } // render
} // DetailPanel

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

class Parameters extends React.Component {
    constructor(props) {
	super(props);
	
	this.state = {
	    selected: null
	};
    } // constructor

    handleSelection(selected) {
	// Remove previous selection
	if (this.selected) {
	    this.selected.setSelected(false);
	} // if

	// Set new selection
	this.selected = selected;
	if (this.selected) {
	    this.selected.setSelected(true);
	    this.setState({
		selected: this.selected
	    });
	} // if
    } // handleSelection
    
    render() {
	return (
		<div>
		<HierarchyPanel application={this.props.application} handleSelection={(selected) => this.handleSelection(selected)} />
		<DetailPanel selected={this.state.selected} />
		</div>
	);
    } // render
} // Parameters


class FileSelector extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    file: null
	};
    } // constructor

    handleFileChanged(event) {
	this.setState({
	    file: event.target.files[0]
	});
	this.props.handleChange(event.target.files[0]);
    } // handleFileChanged

    handleReload() {
	if (this.state.file) {
	    this.props.handleChange(this.state.file);
	} // if
    } // handleFileChanged

    render() {
	return (
	    <div>
	    <input type="file" id="filename" onChange={(event) => this.handleFileChanged(event)}/>
		<button onClick={() => this.handleReload()}>Reload</button>
</div>
	);
    } // render
} // FileSelector

class TimeStamp extends React.Component {    
    render() {
	let tstamp = null;
	if (this.props.value) {
	    // Will be local time, so convert to UTC and then display as locale (expects UTC).
	    let d = new Date(this.props.value);
	    const now = new Date();
	    tstamp = new Date(d.getTime() + now.getTimezoneOffset() * 60000).toString();
	} // if
	return (
	    <p>Parameters time stamp: {tstamp ? tstamp : "N/A"}</p>
	);
    } // render
} // TimeStamp

class App extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    parameters: null
	};
    } // constructor

    loadParameters(filein) {

	if (!window.FileReader) {
	    alert("Error: This browser does not implement file reading. Try a recent version of Chrome or Firefox.");
	} // if

	    var reader = new FileReader();
	    reader.onload = (function(app) {
		return function(e) {
		    try {
			app.setState({
			    parameters: JSON.parse(reader.result)
			});
		    } catch (err) {
			alert("Error encountered while attempting to read JSON parameter file. " + err.message);
		    } // try/catch
		};
	    })(this);
	reader.readAsText(filein);
    } // loadParameters
    
    render() {
	return (
		<div>
		<div className="header">
		<h1>PyLith Parameter Viewer</h1>
		<FileSelector handleChange={(filein) => this.loadParameters(filein)} />
		<TimeStamp value={(this.state.parameters) ? this.state.parameters.timestamp : null} />
		</div>
		<Tabs selectedIndex={1}>
           	    <TabList>
	                <Tab>Version</Tab>
	                <Tab>Parameters</Tab>
	            </TabList>
                <TabPanel>
		<Version platform={this.state.parameters ? this.state.parameters.platform : null} version={this.state.parameters ? this.state.parameters.version : null}/>
                    </TabPanel>
                <TabPanel>
  		<Parameters application={this.state.parameters ? this.state.parameters.application : null}/>
                </TabPanel>
		</Tabs>
		</div>
	);
    } // render
} // App

export default App;
