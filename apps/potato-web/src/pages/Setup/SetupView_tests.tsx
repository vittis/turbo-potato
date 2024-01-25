import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
function Draggable(props) {
  const Element = props.element || "div";
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
  });

  return (
    <Element ref={setNodeRef} {...listeners} {...attributes} className="w-fit">
      {props.children}
    </Element>
  );
}

/* The implementation details of <Item> is not
 * relevant for this example and therefore omitted. */

export function SetupViewTest() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Draggable id="my-draggable-element">
        <div className={`p-10 bg-zinc-700 w-fit ${isDragging ? "opacity-30" : ""}`}>Drag me</div>
      </Draggable>

      <DragOverlay>
        <div className="p-10 bg-zinc-700 w-fit">Drag me</div>
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }
}
