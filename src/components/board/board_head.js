import React, { Children, Component } from 'react'

class BoardHead extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
    return (
      <thead>
        <tr>
          <th></th>
          {Children.map(this.props.children, (x, i) => <th key={`th${i}`}>{i}</th>)}
        </tr>
      </thead>
    )
  }
}

export default BoardHead
