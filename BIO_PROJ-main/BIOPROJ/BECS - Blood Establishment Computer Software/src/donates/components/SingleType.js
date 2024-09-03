import React from "react";
import {Link} from 'react-router-dom'
import Card from '../../shared/UIElements/Card';

import './SingleType.css'


const SingleType = props => {
  console.log("SingleType");
  console.log('-------------------------------------------------------------------------------------------');
  console.log(props);
  console.log('-------------------------------------------------------------------------------------------');
    return (
        <li className="blood-items">
          <Card>
            {props.role === 'admin' || props.role === 'user'  ? (
              <Link to={`/${props.name}/donations`}>
                <div className="blood-item__info">
                  <h2>{props.name}</h2>
                  <h3>{'Number of donates: ' + props.donatesCount}</h3>
                </div>
              </Link>
            ) : (
              <div className="blood-item__info">
                <h2>{props.name}</h2>
                <h3>{'Number of donates: ' + props.donatesCount}</h3>
              </div>
            )}
          </Card>
        </li>
      );
};

export default SingleType;