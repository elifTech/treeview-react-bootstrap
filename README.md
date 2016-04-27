# treeview-react-bootstrap

  Nice, easy to use component to displaying tree structures, made with
  <a href="https://github.com/facebook/react">React</a> and
  <a href="https://github.com/twbs/bootstrap">Twitter Bootstrap</a> <br />
  Based on <a href="https://github.com/jonmiles/react-bootstrap-treeview">jonmiles/react-bootstrap-treeview</a>,
  but provides a set of additional useful features
##### Try it :
  You can see an example <a href="http://eliftech.github.io/treeview-react-bootstrap">here</a>

### Installation

<pre>
 <code>
  npm install treeview-react-bootstrap --save
 </code>
</pre>

### Usage

##### Import

<pre>
 <code>
  TreeView = require('treeview-react-bootstrap').default;
 </code>
</pre>

###### es2015 style import
<pre><code>
  import TreeView from 'treeview-react-bootstrap';
</code></pre>

##### Render

###### in \*.jsx :
<pre>
 <code>
  React.render(
    &lt;TreeView data={data} /&gt;,
    document.getElementById('treeview')
 );
 </code>
</pre>

###### in \*.js :
<pre>
 <code>
  React.render(                
	React.createElement(TreeView, {data: data}),
	document.getElementById('treeview')
  );
 </code>
</pre>

##### Options

|Param | Description | Default |
|------|-------------|---------|
| data | [Object] <br>No default, expects data<br><br>*This is the core data to be displayed by the tree view*  | undefined |
| selectable      | Boolean flag<br><br>*Allow to select nodes by clicking on them* | true |
| allowNew        | Boolean flag<br><br>*Allow to add new nodes using add button* | false |
| removable       | Boolean flag<br><br>*Allow to remove existing nodes using remove button* | false |
| *onNodeAdded*   | Callback<br><br>*Function that is called after node has been added* | undefined |
| *onNodeRemoved* | Callback<br><br>*Function that is called after node has been removed* | undefined |
| *onDoubleClick* | Callback<br><br>*Function that is called after node has been removed* | undefined |

This treeview component also supports all [options](https://github.com/jonmiles/react-bootstrap-treeview#options) defined for base component.

##### Data structure
"data" property must be provided for treeview to work.
It should be an array of objects(nodes).

###### Node object structure.
<pre>
<code>
{
  text: String,
  nodes: [Node]
}
</code>
</pre>

###### Node options

The following properties are defined to allow node level overrides, such as node specific icons, colours and tags.

|Param | Description | Default |
|------|-------------|---------|
| text | String <br> Mandatory <br><br>*The text value displayed for a given tree node, typically to the right of the nodes icon.*  | undefined |
| icon | String <br><br>*The icon-class set to icon on given node, typically displayed to the left of the text.* | "glyphicon glyphicon-stop" |
| color | String <br><br>*The foreground color used on a given node, overrides global color option.* | #428bca |
| backColor       | String <br><br>*The background color used on a given node, overrides global color option.* | undefined |
| href | String <br><br>*Used in conjunction with global enableLinks option to specify anchor tag URL on a given node.* | undefined |
| state | Object<br><br>*Describes a node's initial state.* |node: props.node,<br> expanded: true |
| state*.expanded* | Boolean<br><br>*Whether or not a node is expanded i.e. open. Takes precedence over global option levels.* | true |
| state*.selected* | Boolean<br><br>*Whether or not a node is selected.* | false |
| tags | [String]<br><br>*Used in conjunction with global showTags option to add additional information to the right of each node; using Bootstrap Badges* | undefined |

###### Example
<pre><code>
var data = [
  {
    text: "Parent 1",
    nodes: [
      {
        text: "Child 1",
        nodes: [
          {
            text: "Grandchild 1"
          },
          {
            text: "Grandchild 2"
          }
        ]
      },
      {
        text: "Child 2"
      }
    ]
  },
  {
    text: "Parent 2"
  }
];
</code></pre>
