import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';

var parameters = require('./sample.json');

class ComponentAvatar extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    showChildren: true,
	    selected: false
	};
    } // constructor

    render() {
	function getComponent(name) {
	    const component = this.props.value.components[name];
	    const prefix = (this.props.prefix) ? this.props.prefix+"."+this.props.value.name : this.props.value.name;
	    return (
		<li key={name}>
		    <ComponentAvatar facility={name} value={component} prefix={prefix} />
		    </li>
	    );
	} // getComponent
	    
	const subcomponents = Object.keys(this.props.value.components).map(getComponent, this);
	return (
	    <div>
		<input type="checkbox" defaultChecked={true} /><label><span className="pyre-component">{this.props.facility}</span> = <span className="python-type">{this.props.value.class}</span></label>
		<ul>{subcomponents}</ul>
		</div>
	);
    } // render
} // ComponentAvatar

class ComponentHierarchy extends React.Component {
    render() {
	return (
		<div className="component-hierarchy">
		<article>
		<section>
		<ul>
		<li key="application">
		<ComponentAvatar facility="application" value={this.props.application} prefix={null} />
		</li>
		</ul>
		</section>
		</article>
		</div>
	);
    } // render
} // ComponentHierarchy

class DetailSettings extends React.Component {
    render() {
	return (
		<p>ADD DETAIL SETTINGS HERE (expand all, collapse all)
		</p>
	);
    } // render
} // DetailSettings

class ComponentDetail extends React.Component {
    render() {
	return (
		<div className="component-detail">
		<aside>
		<p>ADD COMPONENT DETAIL VIEW HERE
	    </p>
		</aside>
		</div>
	);
    } // render
} // ComponentDetail

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
    render() {
	return (
		<div>
	        <DetailSettings />
		<ComponentHierarchy application={this.props.application}/>
		<ComponentDetail />
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
