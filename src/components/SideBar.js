import React from 'react';
import "./styles/SideBar.css";
import { Link } from 'react-router';
import {ListItem} from 'material-ui/List';
import {debounce} from "../helperFunctions";

function createChildren(items, marginLeft, userType, query) {
  let children = [];
  for(let i = 0; i < items.length; i++) {
    let item=items[i];
    if(item.userType && userType < item.userType) {
      continue;
    }
    if(item.children) {
      const container = <Link activeClassName="side-active-link" className={"list-element list-element-"+marginLeft} to={!item.fake ? (item.to+query) : null} key={item.name}/>;
      children.push((
      <ListItem
             containerElement={container}
             primaryText={item.name}
             initiallyOpen={true}
             nestedItems={createChildren(item.children, marginLeft+10, userType, query)}
             key={item.name}
      />
    ));
    } else {
      const container = <Link activeClassName="side-active-link"  className={"list-element list-element-"+marginLeft}  to={!item.fake ? (item.to+query)  : null}  key={item.name}/>;
      children.push((
            <ListItem containerElement={container}
              primaryText={item.name}
              key={item.name}/>
          ));
    }
  }
  return children;
}

const Search = (props) => {
  return (
    <input value={props.context.state.query} className="search-side-input" onChange={props.changeSearchQuery}  placeholder="Поиск..."/>
  )
}

const SideBar = class Side extends React.Component {
  constructor(props) {
      super(props);
      this.setSearchQuery = debounce(this.setSearchQuery, 500);
      this.state = {
        query: props.searchQuery
      };
  }
  changeSearchQuery(event) {
    this.setState({
      query: event.target.value
    });
    this.setSearchQuery();
  }
  eliminateQuery() {
    this.setState({
      query: ""
    });
    this.setSearchQuery();
  }
  setSearchQuery() {
      this.props.changeSearchQuery(this.state.query, this.props.location);
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.query !== nextProps.searchQuery && nextProps.searchQuery=== "") {
      this.eliminateQuery.call(this);
    }
  }
  render() {
    const props = this.props;
    this.menuItems = createChildren(props.menuItems,0,props.userType, props.query);
    let children = this.menuItems;
    return(
      <div className={`side-bar ${this.props.showNav ? '' : 'deactivated'}`}>
        <Search changeSearchQuery={this.changeSearchQuery.bind(this)} context={this}/>
        <div className="side-list">
          {children}
        </div>
      </div>
    )
  }
}

export default SideBar;