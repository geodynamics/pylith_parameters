import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';

// :TODO:
// Version
// Typecheck with PropTypes
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
		<div className="component-hierarchy">
		<h2>Component Hierarchy</h2>
		<article>
		<section>
		<div className="hierarchy-settings">
		<button onClick={() => this.handleExpandClick()}>Expand all</button>
		<button onClick={() => this.handleCollapseClick()}>Collapse all</button>
		</div>
		<ul>
		<ComponentAvatar key="application" facility="application" value={this.props.application} prefix={null} handleSelection={this.props.handleSelection} ref={(obj) => { this.component = obj; }}/>
		</ul>
		</section>
		</article>
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

	const fullPath = (selected.props.prefix) ? selected.props.prefix + "." + selected.props.value.name : selected.props.value.name;
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
	        <h2>
		<span className="pyre-component">{facility}</span> = <span className="python-type">{component.class}</span>
		</h2>
	    
		<h3>Component information</h3>
		<dl className="metadata">
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
		<div className="component-detail">
		<aside>
		<h2>Details for Selected Component</h2>
		<div className="detail-settings">
		<label><input type="checkbox" defaultChecked={this.state.showDescription} onChange={() => this.handleDescriptionChange()} />Show description</label>
		<label><input type="checkbox" defaultChecked={this.state.showLocation} onChange={() => this.handleLocationChange()} />Show location</label>
		</div>
		<ComponentDetail selected={this.props.selected} showDescription={this.state.showDescription} showLocation={this.state.showLocation}/>
		</aside>
		</div>
	);
    } // render
} // DetailPanel

class Version extends React.Component {
    render() {
	return (
		<dl>
		<dt>PyLith</dt><dd>{this.props.version.pylith}</dd>
		</dl>
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
    render() {
	return (
	    <input type="file" id="filename" onChange={(event) => { this.props.handleChange(event.target.files[0])}}/>
	);
    } // render
} // FileSelector

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
		<h1>PyLith Parameter Viewer</h1>
		<div className="file-selector">
		<FileSelector handleChange={(filein) => this.loadParameters(filein)} />
		</div>
		<Tabs selectedIndex={1}>
           	    <TabList>
	                <Tab>Version</Tab>
	                <Tab>Parameters</Tab>
	            </TabList>
                    <TabPanel>
		<Version version={this.state.parameters ? this.state.parameters.version : null}/>
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
