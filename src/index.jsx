import React from 'react'
import _ from 'lodash';

let treeviewSpanStyle = {
  "width": "1rem",
  "height": "1rem"
};

let treeviewSpanIndentStyle = treeviewSpanStyle;
treeviewSpanIndentStyle["marginLeft"] = "10px";
treeviewSpanIndentStyle["marginRight"] = "10px";

let treeviewSpanIconStyle = treeviewSpanStyle;
treeviewSpanIconStyle["marginLeft"] = "10px";
treeviewSpanIconStyle["marginRight"] = "5px";

class TreeView extends React.Component {

  constructor(props) {
    super(props);

    this.nodesQuantity = 0;

    /*this.state = {data: props.data};
     this.someData = _.clone(props.data);
     this.setNodeId({nodes: this.state.data});*/


    this.state = {data: this.setNodeId(_.clone({nodes: props.data}))};


    this.findNodeById = this.findNodeById.bind(this);
    this.setChildrenState = this.setChildrenState.bind(this);
    this.setParentSelectable = this.setParentSelectable.bind(this);
    this.checkParentEmpty = this.checkParentEmpty.bind(this);
    this.nodeSelected = this.nodeSelected.bind(this);
    this.nodeDoubleClicked = this.nodeDoubleClicked.bind(this);
    this.addNode = this.addNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: this.setNodeId(_.clone({nodes: nextProps.data}))});
  }

  setNodeId(node) {

    if (!node.nodes) return;

    return node.nodes.map(childNode => {
      return {
        nodeId: this.nodesQuantity++,
        nodes: this.setNodeId(childNode),
        parentNode: node,
        state: {
          selected: childNode.state ? !!childNode.state.selected : false,
          expanded: childNode.state ? !!childNode.state.expanded : false
        },
        text: childNode.text,
        icon: childNode.icon
      }
    });

  }

  findNodeById(nodes, id) {
    let _this = this;
    let result;
    if (nodes)
      nodes.forEach(function (node) {
        if (node.nodeId == id) result = node;
        else {
          if (node.nodes) {
            result = _this.findNodeById(node.nodes, id) || result;
          }
        }
      });
    return result;
  }

  deleteById(obj, id) {
    if (!obj || obj.length <= 0)
      return [];
    let arr = [];
    _.each(obj, (val) => {
      if (val.nodes && val.nodes.length > 0)
        val.nodes = this.deleteById(val.nodes, id);

      if (val.nodeId !== id) {
        arr.push(val);
      }
    });
    return arr;
  }

  setChildrenState(nodes, state) {
    let _this = this;
    if (nodes)
      nodes.forEach(function (node) {
        node.state.selected = state;
        _this.setChildrenState(node.nodes, state);
      });
  }

  setParentSelectable(node) {
    if (!node.parentNode || !node.parentNode.state)
      return;
    node.parentNode.state.selected = true;
    this.setParentSelectable(node.parentNode);
  }

  checkParentEmpty(node) {
    let parent = node.parentNode;
    if (!parent.state || !parent.state.selected)
      return;
    if (parent.nodes.every((childNode) => !childNode.state.selected)) {
      parent.state.selected = false;
      this.checkParentEmpty(parent);
    }
  }

  nodeSelected(nodeId, selected) {
    let node = this.findNodeById(this.state.data, nodeId);
    node.state.selected = selected;

    /*if (!selected)
     this.setParent(node);*/
    //this.setParentSelectable(node);
    /*else
     this.checkParentEmpty(node);*/

    this.setChildrenState(node.nodes, selected);
    this.setState({data: this.state.data});

    if (this.props.onClick)
      this.props.onClick(this.state.data, node);
  }

  nodeDoubleClicked(nodeId, selected) {
    let node = this.findNodeById(this.state.data, nodeId);
    if (this.props.onDoubleClick)
      this.props.onDoubleClick(this.state.data, node);
  }

  convert(obj) {
    if (!obj || obj.length <= 0)
      return [];
    return _.map(obj, (val) => {
      let treeNodeData = {
        text: val.text,
        selected: val.state.selected
      };
      let children = this.convert(val.nodes);
      if (children.length > 0)
        treeNodeData.nodes = children;
      return treeNodeData;
    });
  }

  addNode(nodeId, text) {
    let node = this.findNodeById(this.state.data, nodeId);

    let newNode = {
      text: text,
      state: {},
      parentNode: node,
      nodeId: this.nodesQuantity++
    };

    if (node.nodes) {
      node.nodes.push(newNode)
    } else {
      node.nodes = [newNode]
    }

    console.log(this.convert(this.state.data));

    if (this.props.onNodeAdded)
      this.props.onNodeAdded(this.state.data);
  }

  removeNode(nodeId) {
    let newData = this.deleteById(_.clone(this.state.data), nodeId);
    if(newData.length === 0)
      return false;
    this.setState({data: newData});
    if (this.props.onNodeRemoved)
      this.props.onNodeRemoved(newData);
  }

  render() {
    let data = this.state.data;
    let children = [];
    if (data) {
      let _this = this;
      data.forEach(function (node) {
        children.push(React.createElement(TreeNode, {
          node: node,
          key: node.nodeId,
          level: 1,
          visible: true,
          onSelectedStatusChanged: _this.nodeSelected,
          onNodeDoubleClicked: _this.nodeDoubleClicked,
          addNode: _this.addNode,
          removeNode: _this.removeNode,
          options: _this.props,
          nodes: _this.state.data,
          allowNew: _this.props.allowNew
        }));
      });
    }

    return (
        <div classID="treeview" className="treeview">
          <ul className="list-group">
            {children}
          </ul>
        </div>
    )
  }
}

TreeView.propTypes = {
  levels: React.PropTypes.number,
  expandIcon: React.PropTypes.string,
  selectable: React.PropTypes.bool,

  emptyIcon: React.PropTypes.string,
  nodeIcon: React.PropTypes.string,

  color: React.PropTypes.string,
  backColor: React.PropTypes.string,
  borderColor: React.PropTypes.string,
  onhoverColor: React.PropTypes.string,
  selectedColor: React.PropTypes.string,
  selectedBackColor: React.PropTypes.string,

  enableLinks: React.PropTypes.bool,
  highlightSelected: React.PropTypes.bool,
  showBorder: React.PropTypes.bool,
  showTags: React.PropTypes.bool,

  nodes: React.PropTypes.arrayOf(React.PropTypes.object)
};

TreeView.defaultProps = {
  levels: 2,
  selectable: true,

  expandIcon: 'glyphicon glyphicon-plus',
  collapseIcon: 'glyphicon glyphicon-minus',
  emptyIcon: 'glyphicon',
  nodeIcon: 'glyphicon glyphicon-stop',
  unselectedIcon: 'glyphicon glyphicon-unchecked',
  selectedIcon: 'glyphicon glyphicon-check',

  color: "#428bca",
  backColor: undefined,
  borderColor: undefined,
  onhoverColor: '#F5F5F5',
  selectedColor: '#000000',
  selectedBackColor: '#FFFFFF',

  enableLinks: false,
  highlightSelected: true,
  showBorder: true,
  showTags: false,

  nodes: []
};

export class TreeNode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {node: props.node, expanded: true};
    /*this.expanded = (props.node.state && props.node.state.hasOwnProperty('expanded')) ?
     props.node.state.expanded :
     (this.props.level < this.props.options.levels);*/
    this.selected = (props.node.state && props.node.state.hasOwnProperty('selected')) ?
        props.node.state.selected :
        false;
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.doubleClicked = this.doubleClicked.bind(this);
    this.newNodeForm = this.newNodeForm.bind(this);
    this.addNode = this.addNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({node: nextProps.node});
    /*this.expanded = (nextProps.node.state && nextProps.node.state.hasOwnProperty('expanded')) ?
     nextProps.node.state.expanded :
     (this.props.level < this.props.options.levels);*/
    this.selected = (nextProps.node.state && nextProps.node.state.hasOwnProperty('selected')) ?
        nextProps.node.state.selected :
        false;
  }

  toggleExpanded(event) {
    this.setState({expanded: !this.state.expanded});
    event.stopPropagation();
  }

  toggleSelected(event) {
    let selected = !this.props.node.state.selected;
    this.props.onSelectedStatusChanged(this.state.node.nodeId, selected);
    event.stopPropagation();
  }

  doubleClicked(event) {
    let selected = !this.props.node.state.selected;
    this.props.onNodeDoubleClicked(this.state.node.nodeId, selected);
    event.stopPropagation();
  }

  newNodeForm(event) {
    this.setState({addNode: !this.state.addNode});
    event.stopPropagation();
  }

  addNode(event) {
    if (!new RegExp('^[a-zA-Z0-9]+$').test(this.refs.newNodeName.value)) {
      this.refs.newNodeName.setCustomValidity("Incorrect format");
      return false;
    }
    this.setState({addNode: false});
    console.log("ref", this.refs.newNodeName.value);
    this.props.addNode(this.state.node.nodeId, this.refs.newNodeName.value);
    this.setState({expanded: true});
    event.stopPropagation();
  }

  removeNode(event) {
    this.props.removeNode(this.state.node.nodeId);
    event.stopPropagation();
  }

  render() {
    let node = _.clone(this.props.node);
    let options = _.clone(this.props.options);

    let style;

    if(this.props.options.selectable) node.icon = (node.state.selected) ? options.selectedIcon : options.unselectedIcon;

    if (!this.props.visible) {

      style = {
        display: 'none'
      };
    }
    else {

      if (options.highlightSelected && node.state.selected) {
        style = {
          color: options.selectedColor,
          backgroundColor: options.selectedBackColor
        };
      }
      else {
        style = {
          color: node.color || options.color,
          backgroundColor: node.backColor || options.backColor
        };
      }

      if (!options.showBorder) {
        style.border = 'none';
      }
      else if (options.borderColor) {
        style.border = '1px solid ' + options.borderColor;
      }
    }

    let indents = [];
    for (let i = 0; i < this.props.level - 1; i++) {
      indents.push(
          <span className={'indent'} style={treeviewSpanIndentStyle} key={i}> </span>
      )
    }

    let expandCollapseIcon;
    if (node.nodes) {
      if (!this.state.expanded) {
        expandCollapseIcon = (
            <span className={options.expandIcon} style={treeviewSpanStyle}
                  onClick={this.toggleExpanded}> </span>
        )
      }
      else {
        expandCollapseIcon = (
            <span className={options.collapseIcon} style={treeviewSpanStyle}
                  onClick={this.toggleExpanded}>   </span>
        )
      }
    }
    else {
      expandCollapseIcon = (
          <span className={options.emptyIcon} style={treeviewSpanStyle}> </span>
      )
    }

    let nodeIcon = (node.icon || options.nodeIcon) ? (
        <span className={'icon'} onClick={this.toggleSelected} style={treeviewSpanIconStyle}> <i
            className={node.icon || options.nodeIcon}> </i> </span>
    ) : "";

    let nodeText;
    if (options.enableLinks) {
      nodeText = (
          <a href={ node.href}> {node.text} </a>
      )
    }
    else {
      nodeText = (
          <span style={treeviewSpanStyle}> {node.text} </span>
      )
    }

    let badges;
    if (options.showTags && node.tags) {
      badges = node.tags.map(function (tag) {
        return (
            <span className={'badge'} style={treeviewSpanStyle}> {tag} </span>
        )
      });
    }

    let children = [];
    if (node.nodes) {
      let _this = this;
      node.nodes.forEach(function (node) {
        children.push(React.createElement(TreeNode, {
          node: node,
          key: node.nodeId,
          level: _this.props.level + 1,
          visible: _this.state.expanded && _this.props.visible,
          onSelectedStatusChanged: _this.props.onSelectedStatusChanged,
          onNodeDoubleClicked: _this.props.onNodeDoubleClicked,
          addNode: _this.props.addNode,
          removeNode: _this.props.removeNode,
          options: options,
          allowNew: _this.props.allowNew
        }));
      });
    }

    let addButton = this.props.allowNew ? (
        <span className="glyphicon glyphicon-plus addElement" style={{float:"right", cursor:"pointer"}}
              onClick={this.newNodeForm}></span>) : "";

    let removeButton = this.props.options.removable ? (
        <span className="glyphicon glyphicon-remove removeElement" style={{cursor:"pointer"}}
              onClick={this.removeNode}></span>) : "";

    let newNode;

    if (this.state.addNode) {
      newNode = (<div className="input-group">
            <input type="text" className="form-control nodeName" ref="newNodeName"/>
          <span className="input-group-btn">
            <span className="btn btn-primary submitNode" onClick={this.addNode}>Add</span>
          </span>
          </div>
      );
    }

    style["cursor"] = "pointer";

    let treeNode = (
        <li className="list-group-item"
            style={style}
            onDoubleClick={this.doubleClicked}
            key={node.nodeId}>
          {indents}
          {expandCollapseIcon}
          {nodeIcon}
          {removeButton}
          {nodeText}
          {badges}
          {addButton}
          {newNode}
          {children}
        </li>
    );

    return (
        <ul>
          {treeNode}
        </ul>
    );
  }
}

export default TreeView;
