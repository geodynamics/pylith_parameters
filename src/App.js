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

	this.subcomponents = Object.keys(props.value.components).map((name) => {
	    const component = this.props.value.components[name];
	    const prefix = (this.props.prefix) ? this.props.prefix+"."+this.props.value.name : this.props.value.name;
	    return (
		    <ComponentAvatar key={name} facility={name} value={component} prefix={prefix} />
	    );	    
	}, this);

    } // constructor

    handleCollapseClick(event) {
	event.stopPropagation();
	this.setState({
	    showChildren: !this.state.showChildren
	});
    } // handleClick
    
    handleDetailClick(event) {
	event.stopPropagation();
	console.log("DETAIL CLICK");
	console.log(this.props.value);
    } // handleClick
    
    render() {
	const componentClass = this.state.showChildren ? 'pyre-component-expanded' : 'pyre-component-collapsed';
	const childrenClass = this.state.showChildren ? 'pyre-children' : 'pyre-children-collapsed';

	return (
		<li key={this.props.value.name} className={componentClass} onClick={(event) => this.handleCollapseClick(event)} >
		<span className="pyre-component">{this.props.facility}</span> = <span className="python-type" onClick={(event) => this.handleDetailClick(event)}>{this.props.value.class}</span>
		<ul className={childrenClass}>{this.subcomponents}</ul>
		</li>
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
		<ComponentAvatar key="application" facility="application" value={this.props.application} prefix={null} />
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
		<p>ADD DETAIL SETTINGS HERE (show/hide setFrom, description)
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
