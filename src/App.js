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
// See LICENSE for license information.
//
// ----------------------------------------------------------------------
//

import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HierarchyPanel } from './ComponentHierarchy';
import { DetailPanel } from './ComponentDetail';
import { Version } from './PylithVersion';

import './App.css';

// :TODO:
// Typecheck with PropTypes
// Expand all doesn't expand hidden children
// Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the ComponentAvatar component.


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


// End of file
