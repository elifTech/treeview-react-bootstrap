var React = require('react');

var treeviewSpanStyle = {
  "width": "1rem",
  "height": "1rem"
};

var treeviewSpanIndentStyle = treeviewSpanStyle;
treeviewSpanIndentStyle["marginLeft"] = "10px";
treeviewSpanIndentStyle["marginRight"] = "10px";

var treeviewSpanIconStyle = treeviewSpanStyle;
treeviewSpanIconStyle["marginLeft"] = "10px";
treeviewSpanIconStyle["marginRight"] = "5px";

var TreeView = React.createClass({displayName: "TreeView",

  propTypes: {
    levels: React.PropTypes.number,

    expandIcon: React.PropTypes.string,
    collapseIcon: React.PropTypes.string,
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
  },

  getDefaultProps: function () {
    return {
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
      onhoverColor: '#F5F5F5', // TODO Not implemented yet, investigate radium.js 'A toolchain for React component styling'
      selectedColor: '#000000',
      selectedBackColor: '#FFFFFF',

      enableLinks: false,
      highlightSelected: true,
      showBorder: true,
      showTags: false,

      nodes: []
    }
  },
  getInitialState: function() {
    var data = this.props.data;
    this.setNodeId({ nodes: data });
    return {data: data};
  },
  setNodeId: function(node) {

    if (!node.nodes) return;

    var _this = this;
    var parentNode = node;
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
  },
  findNodeById: function(nodes, id){
    var _this = this;
    var result;
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
  },
  setChildrenState: function(nodes, state){
    var _this = this;
    if (nodes)
      nodes.forEach(function(node){
        node.state.selected = state;
        _this.setChildrenState(node.nodes, state);
      });
  },
  setParentSelectable: function(node){
    if(!node.parentNode || !node.parentNode.state)
      return;
    node.parentNode.state.selected = true;
    this.setParentSelectable(node.parentNode);
  },
  checkParentEmpty: function(node){
    var parent = node.parentNode;
    if(!parent.state || !parent.state.selected)
      return;
    if(parent.nodes.every(function(node){
      return !node.state.selected
    })){
      parent.state.selected = false;
      this.checkParentEmpty(parent);
    }
  },
  nodeSelected: function(nodeId, selected)
  {
    var node = this.findNodeById(this.props.data, nodeId);
    node.state.selected = selected;

    if(selected)
      this.setParentSelectable(node);
    else
      this.checkParentEmpty(node);
    
    this.setChildrenState(node.nodes, selected);
    this.setState({ data: this.props.data });

    if (this.props.onClick)
      this.props.onClick(this.props.data);
  },

  render: function() {
    var data = this.state.data;
    var children = [];
    if (data) {
      var _this = this;
      data.forEach(function (node) {
        children.push(React.createElement(TreeNode, {node: node,
                                key: node.nodeId, 
                                level: 1, 
                                visible: true, 
                                onSelectedStatusChanged: _this.nodeSelected,
                                options: _this.props}));
      });
    }

    return (
      React.createElement("div", {  id: "treeview", className: "treeview"}, 
        React.createElement("ul", { className: "list-group"}, 
          children
        )
      )
    );
  }
});


var TreeNode = React.createClass({displayName: "TreeNode",

  getInitialState: function() {
    var node = this.props.node;
    return {
      expanded: (node.state && node.state.hasOwnProperty('expanded')) ?
                  node.state.expanded :
                    (this.props.level < this.props.options.levels) ?
                      true :
                      false,
      selected: (node.state && node.state.hasOwnProperty('selected')) ? 
                  node.state.selected :
                  false
    }
  },

  toggleExpanded: function(id, event) {
    this.setState({ expanded: !this.state.expanded });
    event.stopPropagation();
  },

  toggleSelected: function(id, event) {
    var selected = !this.props.node.state.selected;
    this.props.onSelectedStatusChanged(id, selected);
    event.stopPropagation();
  },

  render: function() {
    var node = this.props.node;
    var options = this.props.options;

    var style;
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

    var indents = [];
    for (var i = 0; i < this.props.level-1; i++) {
      indents.push(React.createElement("span", {className: "indent", 
        style: treeviewSpanIndentStyle, key: i}));
    }

    var expandCollapseIcon;
    if (node.nodes) {
      if (!this.state.expanded) {
        expandCollapseIcon = (
          React.createElement("span", {className: options.expandIcon,
                style: treeviewSpanStyle, 
                onClick: this.toggleExpanded.bind(this, node.nodeId)}
          )
        );
      }
      else {
        expandCollapseIcon = (
          React.createElement("span", {className: options.collapseIcon,
                style: treeviewSpanStyle,
                onClick: this.toggleExpanded.bind(this, node.nodeId)}
          )
        );
      }
    }
    else {
      expandCollapseIcon = (
        React.createElement("span", {className: options.emptyIcon, 
          style: treeviewSpanStyle})
      );
    }

    var nodeIcon = (
      React.createElement("span", {className: "icon",
        style: treeviewSpanIconStyle}, 
        React.createElement("i", {className: node.icon || options.nodeIcon})
      )
    );

    var nodeText;
    if (options.enableLinks) {
      nodeText = (
        React.createElement("a", {href: node.href/*style="color:inherit;"*/}, 
          node.text
        )
      );
    }
    else {
      nodeText = (
        React.createElement("span", {style: treeviewSpanStyle}, node.text)
      );
    }

    var badges;
    if (options.showTags && node.tags) {
      badges = node.tags.map(function (tag) {
        return (
          React.createElement("span", {className: "badge", 
            style: treeviewSpanStyle}, tag)
        );
      });
    }

    var children = [];
    if (node.nodes) {
      var _this = this;
      node.nodes.forEach(function (node) {
        children.push(React.createElement(TreeNode, {node: node,
                          key: node.nodeId,  
                          level: _this.props.level+1, 
                          visible: _this.state.expanded && _this.props.visible,
                          onSelectedStatusChanged: _this.props.onSelectedStatusChanged, 
                          options: options}));
      });
    }

    style["cursor"] = "pointer";

    return (
      React.createElement("li", {className: "list-group-item", 
          style: style, 
          onClick: this.toggleSelected.bind(this, node.nodeId), 
          key: node.nodeId}, 
        indents, 
        expandCollapseIcon, 
        nodeIcon, 
        nodeText, 
        badges, 
        children
      )
    );
  }
});
module.exports = TreeView;
