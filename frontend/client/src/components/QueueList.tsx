import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Song } from "../types/Song";

interface Props {
  queue: Song[];
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
}

export default function QueueList({ queue, onRemove, onReorder }: Props) {
  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <>
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .queue-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: slide-in 0.25s ease both;
          user-select: none;
        }
        .queue-item:last-child { border-bottom: none; }
        .queue-item:hover { background: rgba(255,255,255,0.025); }
        .queue-item.dragging {
          background: rgba(167,139,250,0.08);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .drag-handle {
          color: rgba(255,255,255,0.15);
          font-size: 14px;
          cursor: grab;
          flex-shrink: 0;
          transition: color 0.15s;
          line-height: 1;
        }
        .queue-item:hover .drag-handle { color: rgba(255,255,255,0.35); }
        .drag-handle:active { cursor: grabbing; }

        .remove-btn {
          width: 26px; height: 26px;
          border-radius: 8px;
          background: rgba(255,107,107,0.0);
          border: 1px solid transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
          opacity: 0;
          transition: all 0.15s;
        }
        .queue-item:hover .remove-btn {
          opacity: 1;
          color: #FF6B6B;
          background: rgba(255,107,107,0.1);
          border-color: rgba(255,107,107,0.2);
        }
        .remove-btn:hover {
          background: rgba(255,107,107,0.2) !important;
          transform: scale(1.1);
        }
        .remove-btn:active { transform: scale(0.92); }
      `}</style>

      {queue.length === 0 ? (
        /* ── Empty state ── */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 32, opacity: 0.3 }}>🎶</div>
          <p style={{ color: "#444", fontSize: 13, margin: 0, textAlign: "center" }}>
            Queue is empty — add songs to get started
          </p>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 99,
              background: "rgba(167,139,250,0.08)",
              color: "#A78BFA",
              fontFamily: "monospace",
              opacity: 0.7,
            }}
          >
            FIFO · enqueue / dequeue
          </span>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="queue">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {queue.map((song, index) => (
                  <Draggable key={song._id} draggableId={song._id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`queue-item${snapshot.isDragging ? " dragging" : ""}`}
                        style={{ ...provided.draggableProps.style }}
                      >
                        {/* Drag handle */}
                        <span {...provided.dragHandleProps} className="drag-handle">
                          ⠿
                        </span>

                        {/* Index / Next badge */}
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: index === 0 ? 11 : 12,
                            fontWeight: 700,
                            fontFamily: index === 0 ? "'DM Sans', sans-serif" : "monospace",
                            background:
                              index === 0
                                ? "rgba(0,255,209,0.12)"
                                : "rgba(255,255,255,0.04)",
                            color:
                              index === 0 ? "#00FFD1" : "rgba(255,255,255,0.2)",
                            border:
                              index === 0
                                ? "1px solid rgba(0,255,209,0.25)"
                                : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {index === 0 ? "▶" : index + 1}
                        </div>

                        {/* Song art placeholder */}
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "linear-gradient(135deg,#1a1a2e,#16213e)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          🎵
                        </div>

                        {/* Song info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: index === 0 ? "#fff" : "rgba(255,255,255,0.75)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {song.title}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#555",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {song.artist}
                          </div>
                        </div>

                        {/* Duration */}
                        {"dur" in song && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#444",
                              fontFamily: "monospace",
                              flexShrink: 0,
                            }}
                          >
                            {(song as Song & { dur?: string }).dur}
                          </span>
                        )}

                        {/* Remove button */}
                        <button
                          className="remove-btn"
                          onClick={() => onRemove(index)}
                          title="Remove from queue"
                        >
                          ✕
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}