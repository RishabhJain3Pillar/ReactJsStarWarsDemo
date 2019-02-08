import React, { Component } from 'react';
import closeIcon from "./../close-icon-red.png"


const PlanetsDetails = (props) => {
  return (
      <div className={props.show ? "modal display-block" : "modal display-none"}>
        <div className="modal-main">
          <p style={{fontSize:'40px',color:'black'}}><b>{props.children.name}</b></p>
          <img alt="close" src={closeIcon} style={{height:'30px', width:'30px', position:'absolute', right:'0', top:'0', marginTop:'55px'}} onClick={props.handleClose}/>
          <div>
            <p style={{fontSize:'12px',color:'black'}}>Population: <b>{props.children.population}</b>.</p>
            <p style={{fontSize:'12px',color:'black'}}>Rotation period: <b>{props.children.rotation_period} days</b></p>
            <p style={{fontSize:'12px',color:'black'}}>Orbital period: <b>{props.children.orbital_period} days</b></p>
          </div>
        </div>

      </div>
  );
}
export default PlanetsDetails;
