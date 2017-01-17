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

export { HierarchyPanel };

// End of file