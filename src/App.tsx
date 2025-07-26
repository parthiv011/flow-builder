import { ReactFlowProvider } from '@xyflow/react';
import { FlowEditor } from './components/FlowEditor';

function App() {
    return (
        <ReactFlowProvider>
            <FlowEditor />
        </ReactFlowProvider>
    );
}

export default App;
