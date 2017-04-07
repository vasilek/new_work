import React from "react";
import { Link } from 'react-router';
import "./styles/LeftNav.css"
import SideNav from 'react-simple-sidenav';
import {ListItem} from 'material-ui/List';

function createChildren(items, marginLeft) {
  let children = [];
  items.forEach((item, i) => {
    if(item.children) {
      const container = <Link className={"list-element list-element-"+marginLeft} to={item.to}/>;
      children[i] = (
      <ListItem
             containerElement={container}
             primaryText={item.name}
             initiallyOpen={false}
             nestedItems={createChildren(item.children, marginLeft+10)}
             key={item.name}
      />
      );
    } else {
      const container = <Link className={"list-element list-element-"+marginLeft}  to={item.to} key={item.name}/>;
      children[i] = (
            <ListItem containerElement={container}
              primaryText={item.name}
              key={item.name}/>
      )
    }
  });
  return children;
}

const Nav = (props) => {
  let children = [];
  if(props.children.length > 0) {
    const items = props.children;
    children = createChildren(items,0);
  }
  return (
    <div className="left-sidebar-container">
      <SideNav
     showNav={props.showNav}
     title={<div>СПКИ</div>}
     titleStyle={{backgroundColor: '#2196F3'}}
     items={children}
     itemStyle={{padding: 0}}
     onHideNav={props.handleHide}/>
   </div>
  )
}

export default Nav;
