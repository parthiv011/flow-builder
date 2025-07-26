import {
    ReactFlow,
    Background,
    Controls,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Panel,
    useReactFlow,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useRef, useState } from 'react';
import { TextUpdaterNode } from './TextUpdater';
import { type MessageNodeData } from '../types/flow';

const nodeTypes = {
    textUpdater: TextUpdaterNode, // custom node type
};

const initialNodes: Node<MessageNodeData>[] = []; // Empty initial node list
const initialEdges: Edge[] = []; // Empty initial edge list

export function FlowEditor() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes); // State to hold nodes
    const [edges, setEdges] = useState<Edge[]>(initialEdges); // State to hold edges
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Currently selected node for side panel
    const nodeIdRef = useRef(1); // Ref for generating unique node IDs
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    const selectedNode = nodes.find((n) => n.id === selectedNodeId); // selected node's full data

    // Handle changes in node positions(drag/move)
    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    // Handle changes in edges
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    // Called when two nodes are connected
    const onConnect: OnConnect = useCallback(
        (connection: Connection) =>
            setEdges((eds) => {
                // Restrict to only one outgoing edge from a source node
                const outgoingFromSource = eds.filter(
                    (e) => e.source === connection.source
                ).length;
                if (outgoingFromSource >= 1) return eds;
                return addEdge(connection, eds); // Add edge if allowed
            }),
        []
    );

    // Enables node drop via drag-drop
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Handles drop action to add a new node at calculated position
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if (!reactFlowWrapper.current) return;

            const bounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = screenToFlowPosition({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
            });

            const type = event.dataTransfer.getData('application/reactflow'); // Extract node type
            if (!type) return;

            const newNode: Node<MessageNodeData> = {
                id: `node-${nodeIdRef.current++}`, // Generate unique node ID
                type,
                position,
                data: { label: `Message Node` }, // Default label
            };

            setNodes((nds) => nds.concat(newNode)); // Add new node to flow
        },
        [screenToFlowPosition]
    );

    // Triggered when a node is clicked – opens the settings panel
    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

    // Updates node label text live in state as it's changed in settings panel
    const handleNodeTextChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const updatedLabel = e.target.value;
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === selectedNodeId
                        ? { ...n, data: { ...n.data, label: updatedLabel } }
                        : n
                )
            );
        },
        [selectedNodeId]
    );

    // Checks for unconnected nodes and triggers save
    const handleSave = useCallback(() => {
        const nodesWithoutIncoming = nodes.filter(
            (node) => !edges.some((edge) => edge.target === node.id)
        );
        if (nodes.length > 1 && nodesWithoutIncoming.length > 1) {
            alert(
                `Error: ${nodesWithoutIncoming.length} nodes have no incoming edges. Connect them before saving.`
            );
        } else {
            console.log('Flow saved!', { nodes, edges });
            alert('Flow saved successfully!');
        }
    }, [nodes, edges]);

    return (
        <>
            {/* navigation bar for saving changes */}
            <nav className="absolute z-10 flex max-h-20 w-full justify-end border-b border-neutral-300 bg-gray-100 px-6 py-5 text-right">
                <button
                    onClick={handleSave}
                    className="mr-24 cursor-pointer rounded-md border px-8 py-2 font-semibold tracking-wide text-indigo-500"
                >
                    Save Changes
                </button>
            </nav>

            {/* Main canvas with settings/sidebar */}
            <div className="relative h-screen w-full" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    {/* If a node is selected show the settings panel */}
                    {selectedNode ? (
                        <Panel
                            position="top-right"
                            className="!m-0 !mt-20 h-full w-1/4 border-l border-neutral-300 bg-white p-4"
                        >
                            <h2 className="mb-2 text-xs font-bold text-gray-700">
                                Settings
                            </h2>
                            {/* Input for editing node label */}
                            <input
                                value={selectedNode?.data.label ?? ''}
                                onChange={handleNodeTextChange}
                                className="w-full rounded border px-3 py-2 text-xs text-gray-700 outline-none"
                                placeholder="Enter message"
                            />
                            <button
                                className="mt-4 w-full rounded bg-red-100 px-3 py-1 text-xs text-red-600"
                                onClick={() => setSelectedNodeId(null)} // Close panel
                            >
                                Close Settings
                            </button>
                        </Panel>
                    ) : (
                        // If no node selected, show draggable message node type
                        <Panel
                            position="top-right"
                            className="!m-0 !mt-20 h-full w-1/4 border-l border-neutral-300 bg-white p-4"
                        >
                            <div
                                className="flex w-fit cursor-move flex-col items-center justify-center gap-2 rounded-md border px-14 py-3 text-indigo-500"
                                onDragStart={(event) =>
                                    event.dataTransfer.setData(
                                        'application/reactflow',
                                        'textUpdater' // Set drag type for onDrop
                                    )
                                }
                                draggable
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="lucide lucide-message-circle-more-icon lucide-message-circle-more"
                                >
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                    <path d="M8 12h.01" />
                                    <path d="M12 12h.01" />
                                    <path d="M16 12h.01" />
                                </svg>
                                Message
                            </div>
                        </Panel>
                    )}
                    {/* Canvas background and controls */}
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </>
    );
}
