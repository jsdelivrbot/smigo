import React, { Children } from 'react'

const BoardHead = ({ children }) => (
  <thead>
    <tr>
      <th></th>
      {Children.map(children, (x, i) => <th key={`th${i}`}>{i}</th>)}
    </tr>
  </thead>
)

export default BoardHead
