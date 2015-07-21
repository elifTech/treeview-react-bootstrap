# treeview-react-bootstrap

  Nice, easy to use component to displaying tree structures, made with 
  <a href="https://github.com/facebook/react">React</a> and 
  <a href="https://github.com/twbs/bootstrap">Twitter Bootstrap</a> <br />
  Based on <a href="https://github.com/jonmiles/react-bootstrap-treeview">jonmiles/react-bootstrap-treeview</a>, 
  but provides a set of additional useful features
##### Try it :
  You can see an example <a href="http://eliftech.github.io/treeview-react-bootstrap">here</a>

### Installation
<pre><code>
  npm install treeview-react-bootstrap --save
</code></pre>

### Usage

<pre><code>
  var TreeView = require('treeview-react-bootstrap');
</code></pre>
###### if you use *.jsx :
<pre><code>
  React.render(
    &lt;TreeView data={data} /&gt;,
    document.getElementById('treeview')
 );
</code></pre>
###### if you use *.js :
<pre><code>
  React.render(                
		React.createElement(TreeView, {data: data}),
		document.getElementById('treeview')
		);
</code></pre>
