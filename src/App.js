import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';

var parameters = require('./sample.json');

class ComponentAvatar extends React.Component {
    constructor() {
	super();

	this.state = {
	    showChildren: true
	};
    } // constructor
    
    render() {
	const prefix = (this.props.parent) ? parent+"." : "";
	const fullName = prefix+"."+this.props.facility;

	/*
	const components = history.map(() => {
  const desc = move ?
    'Move #' + move :
    'Game start';
  return (
    <li>
      <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
    </li>
  );
});
*/
	return (
	        <li key={fullName}>
		<input type="checkbox" defaultChecked={true} /><label><span className="pyre-component">{this.props.facility}</span> = <span className="python-type">{this.props.value.class}</span></label>
		{/*<ul>{components}</ul>*/}
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
		<ComponentAvatar facility="application" value={this.props.application} />
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
	    
		<p>ADD DETAIL SETTINGS HERE
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
