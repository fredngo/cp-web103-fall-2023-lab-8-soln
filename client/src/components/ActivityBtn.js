import React from 'react'
import './ActivityBtn.css'


const ActivityBtn = (props) =>  {


  return (
          <button className="activityBtn" id={props.id} >{props.activity}</button>
  );

};

export default ActivityBtn;