import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';

// :TODO:
// File selector
// Version
// Typecheck with PropTypes

var parameters = require('./sample.json');

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
	    return null;
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
	    <input type="file" id="filename" onChange={(event) => { console.log(event.target.files[0]); this.props.handleChange(event.target.files[0])}}/>
	);
    } // render
} // FileSelector

class App extends React.Component {
    loadParameters(filename) {
	console.log(filename);

	if (!window.FileReader) {
	    alert("error");
	} // if

	var reader = new FileReader();
	reader.onload = function() {
	    console.log(reader.result);

	    var data = JSON.parse(reader.result);
	    console.log(data);
	};
	reader.readAsDataURL(filename);
    } // loadParameters

    render() {
	return (
	    <div>
		<FileSelector handleChange={(filename) => this.loadParameters(filename)} />
		<Tabs selectedIndex={1}>
           	    <TabList>
	                <Tab>Version</Tab>
	                <Tab>Parameters</Tab>
	            </TabList>
                    <TabPanel>
		<Version version={parameters.version}/>
                    </TabPanel>
                    <TabPanel>
  		<Parameters application={parameters.application}/>
                    </TabPanel>
		</Tabs>
		</div>
	);
    } // render
} // App

export default App;
