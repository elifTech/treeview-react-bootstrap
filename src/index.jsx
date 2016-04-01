import React from 'react'

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
    this.state = {data: props.data};
    this.setNodeId({ nodes: this.state.data });
    this.findNodeById = this.findNodeById.bind(this);
    this.setChildrenState = this.setChildrenState.bind(this);
    this.setParentSelectable = this.setParentSelectable.bind(this);
    this.checkParentEmpty = this.checkParentEmpty.bind(this);
    this.nodeSelected = this.nodeSelected.bind(this);
    this.nodeDoubleClicked = this.nodeDoubleClicked.bind(this);
  }

  setNodeId(node) {

    if (!node.nodes) return;

    let _this = this;
    let parentNode = node;
    node.nodes.forEach(function checkStates(node) {
      node.nodeId = _this.props.nodes.length;
      node.parentNode = parentNode;
      if(!node.state){
        node.state = {}
      }
      if(!node.state.selected){
        node.state.selected = false;
      }
      _this.props.nodes.push(node);
      _this.setNodeId(node);
    });
  }

  findNodeById(nodes, id){
    let _this = this;
    let result;
    if (nodes)
      nodes.forEach(function(node){
        if(node.nodeId == id) result = node;
        else {
          if(node.nodes){
            result = _this.findNodeById(node.nodes, id) || result;
          }
        }
      });
    return result;
  }

  setChildrenState(nodes, state){
    let _this = this;
    if (nodes)
      nodes.forEach(function(node){
        node.state.selected = state;
        _this.setChildrenState(node.nodes, state);
      });
  }

  setParentSelectable(node){
    if(!node.parentNode || !node.parentNode.state)
      return;
    node.parentNode.state.selected = true;
    this.setParentSelectable(node.parentNode);
  }

  checkParentEmpty(node){
    let parent = node.parentNode;
    if(!parent.state || !parent.state.selected)
      return;
    if(parent.nodes.every(function(node){
          return !node.state.selected
        })){
      parent.state.selected = false;
      this.checkParentEmpty(parent);
    }
  }

  nodeSelected(nodeId, selected)
  {
    let node = this.findNodeById(this.props.data, nodeId);
    node.state.selected = selected;

    if(selected)
      this.setParentSelectable(node);
    else
      this.checkParentEmpty(node);

    this.setChildrenState(node.nodes, selected);
    this.setState({ data: this.props.data });

    if (this.props.onClick)
      this.props.onClick(this.props.data, node);
  }

  nodeDoubleClicked(nodeId, selected)
  {
    let node = this.findNodeById(this.props.data, nodeId);
    if (this.props.onDoubleClick)
      this.props.onDoubleClick(this.props.data, node);
  }

  render() {
    let data = this.state.data;
    let children = [];
    if (data) {
      let _this = this;
      data.forEach(function (node) {
        children.push(React.createElement(TreeNode, {node: node,
          key: node.nodeId,
          level: 1,
          visible: true,
          onSelectedStatusChanged: _this.nodeSelected,
          onNodeDoubleClicked: _this.nodeDoubleClicked,
          options: _this.props}));
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

  nodes: React.PropTypes.arrayOf(React.PropTypes.number)
};

TreeView.defaultProps = {
  levels: 2,

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
    this.state = {node: props.node};
    this.expanded = (props.node.state && props.node.state.hasOwnProperty('expanded')) ?
        props.node.state.expanded :
        (this.props.level < this.props.options.levels);
    this.selected = (props.node.state && props.node.state.hasOwnProperty('selected')) ?
        props.node.state.selected :
        false;
    this.toggleExpanded = this.toggleExpanded.bind(this, this.state.node.nodeId);
    this.toggleSelected = this.toggleSelected.bind(this, this.state.node.nodeId);
    this.doubleClicked = this.doubleClicked.bind(this, this.state.node.nodeId);
  }

  toggleExpanded(id, event) {
    this.setState({ expanded: !this.state.expanded });
    event.stopPropagation();
  }

  toggleSelected(id, event) {
    let selected = !this.props.node.state.selected;
    this.props.onSelectedStatusChanged(id, selected);
    event.stopPropagation();
  }

  doubleClicked(id, event) {
    let selected = !this.props.node.state.selected;
    this.props.onNodeDoubleClicked(id, selected);
    event.stopPropagation();
  }

  render() {
    let node = this.props.node;
    let options = this.props.options;

    let style;
    node.icon = (node.state.selected) ? options.selectedIcon : options.unselectedIcon;
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
    for (let i = 0; i < this.props.level-1; i++) {
      indents.push(
      <span className={'indent'} style={treeviewSpanIndentStyle} key = {i}> </span>
    )
    }

    let expandCollapseIcon;
    if (node.nodes) {
      if (!this.state.expanded) {
        expandCollapseIcon = (
            <span className={options.expandIcon} style={treeviewSpanStyle} onClick = {this.toggleExpanded}> </span>
      )
      }
      else {
        expandCollapseIcon = (
            <span className={options.collapseIcon} style={treeviewSpanStyle} onClick = {this.toggleExpanded}>   </span>
      )
      }
    }
    else {
      expandCollapseIcon = (
          <span className={options.emptyIcon} style={treeviewSpanStyle}> </span>
    )
    }

    let nodeIcon = (
        <span className={'icon'} style={treeviewSpanIconStyle}> <i className={node.icon || options.nodeIcon}>  </i> </span>
  );

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
        children.push(React.createElement(TreeNode, {node: node,
          key: node.nodeId,
          level: _this.props.level+1,
          visible: _this.state.expanded && _this.props.visible,
          onSelectedStatusChanged: _this.props.onSelectedStatusChanged,
          onNodeDoubleClicked: _this.props.onNodeDoubleClicked,
          options: options}));
      });
    }

    style["cursor"] = "pointer";

    return (
        <li className="list-group-item"
            style={style}
            onClick={this.toggleSelected}
            onDoubleClick={this.doubleClicked}
            key={node.nodeId}>
            {indents}
            {expandCollapseIcon}
            {nodeIcon}
            {nodeText}
            {badges}
            {children}
        </li>
    );
  }
}