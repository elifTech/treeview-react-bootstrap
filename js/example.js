var TreeView = window.default;

var data = [
  {
    text: 'Parent 1',
    nodes: [
      {
        text: 'Child 1',
        nodes: [
          {
            text: 'Grandchild 1'
          },
          {
            text: 'Grandchild 2'
          }
        ]
      },
      {
        text: 'Child 2'
      }
    ]
  },
  {
    text: 'Parent 2'
  },
  {
    text: 'Parent 3',
    state:{expanded:false},
    nodes: [
      {
        text: 'Child 1',
      },
      {
        text: 'Child 2',
      },
      {
        text: 'Child 3',
      }
    ]
  },
  {
    text: 'Parent 4',
    state:{
      selected: true
    }
  },
  {
    text: 'Parent 5'
  }
];


ReactDOM.render(
  React.createElement(TreeView, {data: data}),
  document.getElementById('treeview')
);
