import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';

var parameters = require('./sample.json');

class ComponentAvatar extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    showChildren: true
	};

    } // constructor

    handleCollapseClick(event) {
	event.stopPropagation();
	this.setState({
	    showChildren: !this.state.showChildren,
	    selected: false
	});
    } // handleClick

    setSelected(value) {
	this.setState({
	    selected: value
	});
    } // setSelected 

    getComponent() {
	return this.props.value;
    } // getComponent
    
    handleDetailClick(event) {
	event.stopPropagation();

	console.log("DETAIL CLICK");
	console.log(this.props.value);

	// :TODO:
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

class HierarchySettings extends React.Component {
    render() {
	return (
	    <div className="hierarchy-settings">
		<button >Expand all</button>
		<button >Collapse all</button>
		</div>
	);
    } // render
} // DetailSettings

class HierarchyPanel extends React.Component {
    render() {
	return (
		<div className="component-hierarchy">
		<article>
		<section>
	        <HierarchySettings />
		<ul>
		<ComponentAvatar key="application" facility="application" value={this.props.application} prefix={null} handleSelection={this.props.handleSelection} />
		</ul>
		</section>
		</article>
		</div>
	);
    } // render
} // HierarchyPanel

class ComponentDetail extends React.Component {
    constructor(props) {
	super(props);
	
	this.myprops = {value: {
	    name: null,
	    class: null,
	    description: null,
	    setFrom: null,
	    aliases: [],
	    properties: [],
	    components: []
	}
		     }
    } // constructor
    
    render() {

	let aliases = null;
	let componentProperties = null;
	let componentFacilities = null;
	/* properties = 
		<dt><span class="pyre-property">field</span> (<span class="python-type">str</span>)<dt><dd><span class="pyre-value">displacement</span>
          <dl class="metadata">
		<dt>Description</dt><dd>Name of solution field to constrain.</dd>
		            <dt>Set from</dt><dd>{default}</dd>
          </dl>
        </dd> */

	/* facilities = 
        <dt><span class="pyre-component">auxiliary_fields</span><dt><dd><span class="python-type">pylith.bc.AuxFieldsTimeDependent</span>
          <dl class="metadata">
            <dt>Description</dt><dd>Discretization of constraint parameters.</dd>
            <dt>Set from</dt><dd>{default}</dd>
            <dt>Configurable as</dt><dd><span class="pyre-component">auxfieldstimedependnet</span>, <span class="pyre-component">auxiliary_fields</span></dd>
          </dl>
        </dd> */
	
	/*aliases = <span class="pyre-component">dirichlettimedependent</span>, <span class="pyre-component">x_neg</span>*/
	return (
	    <div className="component-detail">
	        <h2>
		<span className="pyre-component">{this.myprops.value.name}</span> = <span className="python-type">{this.myprops.value.class}</span>
		</h2>

		<h3>Component information</h3>
		<dl className="metadata">
		<dt>Full path</dt><dd><span className="pyre-component">[{this.myprops.value.fullPath}]</span></dd>
		<dt>Description</dt><dd>{this.myprops.value.description}</dd>
		<dt>Set from</dt><dd>{this.myprops.value.setFrom}</dd>
		<dt>Configurable as</dt><dd>{aliases}</dd>
		</dl>

		<h3>Properties</h3>
		<dl>{componentProperties}</dl>

	        <h3>Facilities (subcomponents)</h3>
		<dl>{componentFacilities}</dl>
		</div>
	);
    } // render
} // ComponentDetail


class DetailPanel extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    showDescription: true,
	    showLocation: true
	};
    } // constructor
    
    render() {
	return (
		<div className="component-detail">
		<aside>
		<div className="detail-settings">
		<label><input type="checkbox" defaultChecked={true} />Show description</label>
		<label><input type="checkbox" defaultChecked={true} />Show location</label>
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
	console.log("handleSelected");
	console.log(this.selected);
	if (this.selected) {
	    this.selected.setSelected(true);
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


class App extends React.Component {
    render() {
	return (
	    <div>
		<p>ADD HEADER HERE; File selector;
		</p>
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
