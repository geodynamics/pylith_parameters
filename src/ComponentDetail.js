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

import './Pyre.css';
import './ComponentDetail.css';

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
		<dl className="detail-metadata">
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
		<dl className="detail-metadata">
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

export { DetailPanel };

// End of file
