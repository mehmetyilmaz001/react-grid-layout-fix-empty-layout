import React from "react";
import ReactDOM from "react-dom";
import RGL, { WidthProvider } from "react-grid-layout";

import "./styles.css";

const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;

  return idCounter.toString();
};

const itemH = 3;
const itemW = 3;

class MinMaxLayout extends React.PureComponent {
  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    rowHeight: 10,
    preventCollision: false,
    cols: 12,
    compactType: null
  };

  state = {
    layout: [
      { x: 0, y: 0, w: itemW, h: itemH, i: getId() },
      { x: 3, y: 0, w: itemW, h: itemH, i: getId() },
      { x: 1, y: 4, w: itemW, h: itemH, i: getId() },
      { x: 4, y: 4, w: itemW, h: itemH, i: getId() },
      { x: 7, y: 4, w: itemW, h: itemH, i: getId() }
    ]
  };

  onLayoutChange = (layout) => {
    // Find the max Y coordinate which an item reached (The last row num)
    const maxY = Math.max(...layout.map((i) => i.y));
    const emptyRows = [];

    // Find the empty rows
    for (let i = 0; i <= maxY; i++) {
      const itemsCountPerRow = layout.filter((f) => f.y === i).length;

      // If there no items in a row
      if (itemsCountPerRow === 0) {
        emptyRows.push(i);
      }
    }

    // Begin from the bottom rows
    emptyRows.reverse();

    let updatedLayout = [...layout];

    // The row after the empty row to begin shifting
    const upperRow = emptyRows[0] + 1;

    // //Move the items to the empty rows
    while (emptyRows.length > 0) {
      updatedLayout = layout.map((i) => {
        // If there are items on the upper row
        // Set thier y to empty rows y for moving up
        if (i.y === upperRow) {
          return {
            ...i,
            y: emptyRows[0]
          };
        } else {
          return i;
        }
      });

      // Remove the filled row
      emptyRows.shift();
    }

    this.setState({ layout: updatedLayout });
  };

  render() {
    return (
      <React.Fragment>
        <button onClick={this.addNewItem}>Add item</button>
        <ReactGridLayout
          {...this.props}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
        >
          {this.state.layout.map((item) => (
            <div key={item.i} data-grid={item}>
              <span>{item.i}</span>
            </div>
          ))}
        </ReactGridLayout>
      </React.Fragment>
    );
  }

  addNewItem = () => {
    const { layout } = this.state;
    const newItem = { x: 0, y: 0, w: 3, h: 3, i: getId() };

    if (layout.some((item) => item.x === 0 && item.y === 0)) {
      this.setState({
        layout: layout
          .map((item) => {
            if (item.x === 0) {
              return { y: item.y++, ...item };
            }

            return item;
          })
          .concat([newItem])
      });
    } else {
      this.setState({ layout: layout.concat([newItem]) });
    }
  };
}

module.exports = MinMaxLayout;

if (require.main === module) {
  require("../test-hook.jsx")(module.exports);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MinMaxLayout />, rootElement);
