import React, { useState,useRef, useEffect} from 'react'
import CytoscapeComponent from 'react-cytoscapejs';
import { generateGraph } from './generateGraph';
import { layouts } from './layout';
import setupCy from "./setupCy";
import cytoscape, { Stylesheet } from "cytoscape";
import { cyto1, cyto2, cyto3, getCytoCircle } from './DB';
import expandCollapse  from "cytoscape-expand-collapse"
setupCy();
function getDefaultStylesheet() {
    return [{ selector: "node", style: { label: "data(label)" } }];
}
  
// cytoscape.use(expandCollapse);
function CytoView() {
  // const cytp = Cytoscape.use( ext );
  const cyRef = useRef() 
  var options = {
    layoutBy: null, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
    // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
    fisheye: true, // whether to perform fisheye view after expand/collapse you can specify a function too
    animate: true, // whether to animate on drawing changes you can specify a function too
    animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
    ready: function () { }, // callback when expand/collapse initialized
    undoable: true, // and if undoRedoExtension exists,

    cueEnabled: true, // Whether cues are enabled
    expandCollapseCuePosition: 'top-left', // default cue position is top left you can specify a function per node too
    expandCollapseCueSize: 12, // size of expand-collapse cue
    expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
    expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
    collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
    expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
    edgeTypeInfo: "edgeType", // the name of the field that has the edge type, retrieved from edge.data(), can be a function, if reading the field returns undefined the collapsed edge type will be "unknown"
    groupEdgesOfSameTypeOnCollapse : false, // if true, the edges to be collapsed will be grouped according to their types, and the created collapsed edges will have same type as their group. if false the collapased edge will have "unknown" type.
    allowNestedEdgeCollapse: true, // when you want to collapse a compound edge (edge which contains other edges) and normal edge, should it collapse without expanding the compound first
    zIndex: 999 // z-index value of the canvas in which cue ımages are drawn
  };
  // cyRef.expandCollapse(options)
  // var api = cyRef.expandCollapse('get')
  const layout1 = {
      name: "concentric",
      animate: true,
    maxSimulationTime: 40000,
    avoidOverlap: true,
    spacingFactor: 2
  }
  const layout2 = {
    name: "concentric",
    animate: true,
  maxSimulationTime: 40000,
  avoidOverlap: true,
  spacingFactor: 2
  }
  const [selectedNode, setSelectedNode] = useState('')
  const [elements, setElements] = useState(() => generateGraph(8));
  const [layout, setLayout] = useState(layouts.concentric);
  const [stylesheet, setStylesheet] = useState(
        getDefaultStylesheet
  );
  const db = getCytoCircle(20)
  const setListeners = (cy) => {
    console.log('cy', cy)
  
    // example cytoscape event listener
    cy.on('click ', 'node', (event) => {
      setSelectedNode(event.target._private.data)
    });
    cy.on('click ', 'node', (event) => {
      if (event.target._private.data.label === "a")
    {
      
      cy.collapseAll()
    } else {
        cy.expandAll()

      }
    });
   
  };
  return (
    <>
      <div style={{ margin: "100px" }}>
        <div>Bind, Connection, edges</div>
        <CytoscapeComponent
          minZoom={0.5}
          maxZoom={2}
                  elements={cyto3}
                  style={{
                    width: "800px",
                    height: "500px",
                    border: "1px solid black",
                  }}
                  layout={layout}
          stylesheet={stylesheet}
          cy={(cy) => (cyRef.current = cy)}
                
                />
      </div>
      <div style={{ margin: "100px" }}>
        <div>parent and child</div>
        <CytoscapeComponent
             minZoom={0.5}
             maxZoom={2}
                  elements={db}
                  style={{
                    width: "800px",
                    height: "500px",
                    border: "1px solid black",
                  }}
                  layout={layout}
                  stylesheet={stylesheet}
          cy={(cy) => (cyRef.current = cy)}
          
                />
      </div>
      <div style={{ margin: "100px" }}>
        <div>onClick</div>
        <div>
          {JSON.stringify(selectedNode) }
        </div>
          <CytoscapeComponent
                  elements={cyto2}
                  style={{
                    width: "800px",
                    height: "500px",
                    border: "1px solid black",
                  }}
                  layout={layout}
                  minZoom={0.5}
                  maxZoom={2}
                  stylesheet={stylesheet}
                  cy={(cy) => {
                    setListeners(cy);
                  }}
                />
      </div>
      <div style={{ margin: "100px" }}>
        <div>expand and collapse</div>
          <CytoscapeComponent
                  elements={cyto2}
                  style={{
                    width: "800px",
                    height: "500px",
                    border: "1px solid black",
                  }}
                  layout={layout}
                  minZoom={0.5}
                  maxZoom={2}
                  stylesheet={stylesheet}
                  cy={(cy) => {
                    setListeners(cy);
                  }}
                />
      </div>

      </>
  )
}

export default CytoView