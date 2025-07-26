import { useCallback, type ChangeEvent } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export function TextUpdaterNode({ data, id }: NodeProps) {
    // Callback to handle input changes
    // Logs the updated input value for the node with a specific ID
    // This change is local and not synced to any parent or state
    const onChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement>) => {
            console.log(
                `Node ${id} updated locally (not synced to parent):`,
                evt.target.value
            );
        },
        [id] // Ensures the function is memoized per node instance
    );

    return (
        // Main container for the custom node with fixed dimensions and styling
        <div className="text-updater-node relative w-[160px] overflow-hidden rounded-md bg-white shadow-2xl">
            {/* Target handle (incoming connection) placed on the left */}
            <Handle type="target" position={Position.Left} />

            {/* Input section for editing node text */}
            <div className="flex flex-col text-xs">
                {/* Label for the input field */}
                <label
                    htmlFor={`text-${id}`}
                    className="flex items-center justify-between gap-2 bg-green-300 p-1 text-[8px] font-medium text-neutral-800"
                >
                    <span className="inline-flex items-center justify-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-message-circle-more-icon lucide-message-circle-more h-2 w-2"
                        >
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                            <path d="M8 12h.01" />
                            <path d="M12 12h.01" />
                            <path d="M16 12h.01" />
                        </svg>
                        Send Message
                    </span>
                    <svg
                        role="img"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="h-2 w-2 rounded-full bg-white text-green-500"
                    >
                        <title>WhatsApp</title>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </label>

                {/* onChange logs the input change locally */}
                <input
                    id={`text-${id}`}
                    name="text"
                    value={data.label ?? ''}
                    onChange={onChange}
                    className="nodrag px-2 py-2 text-[8px] font-light text-neutral-500 outline-none"
                    placeholder="Message here"
                />
            </div>

            {/* Source handle (outgoing connection) placed on the right */}
            <Handle type="source" position={Position.Right} />
        </div>
    );
}
