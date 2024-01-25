import { Nav } from "@/components/Nav/Nav";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: "draggable",
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        id="unit-box"
        className={`w-[240px] h-[240px] bg-zinc-700 rounded relative text-center ${
          isDragging ? "opacity-100" : ""
        }`}
        {...listeners}
        {...attributes}
      >
        <div
          className="z-20 absolute w-full h-full text-center"
          onClick={() => {
            console.log("click");
          }}
        ></div>
        Bixao
      </div>

      {/* <DragOverlay>
        {isDragging ? (
          <div className="w-[240px] h-[240px] bg-zinc-100 rounded text-center opacity-0"></div>
        ) : null}
      </DragOverlay> */}
      {/* <button className="mt-1 z-20 w-fit" style={style} {...listeners}>
        {props.children}
      </button> */}
    </>
  );
}

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className="w-fit" ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

const SetupView = () => {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  /*  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 100 },
  });
  const keyboardSensor = useSensor(KeyboardSensor); */

  const sensors = useSensors(pointerSensor);

  return (
    <>
      <div className="relative h-full p-4">
        <section className="flex flex-col h-full">
          <Nav />
          {/* <DndContext sensors={sensors}>
            <Draggable></Draggable>
            <Droppable>
              <div className="w-[300px] h-[300px] bg-red-400">here pls</div>
            </Droppable>
          </DndContext> */}
        </section>
      </div>
    </>
  );
};

export { SetupView };
