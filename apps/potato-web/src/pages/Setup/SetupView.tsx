import React, { useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function Draggable({ children, id, unit }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const unitEquips = unit?.equipment || [];

  return (
    <button
      /* data-unit-id={unitId} */
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-[150px] h-[150px] rounded-md border border-zinc-700 relative"
    >
      {children}
      <div className="absolute top-0 right-0">
        {unitEquips.map((equip) => (
          <div className="border border-zinc-700 rounded p-1" key={equip}>
            {equip}
          </div>
        ))}
      </div>
    </button>
  );
}

export function Droppable({ children, id }: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-[150px] h-[150px] rounded-md border border-zinc-700",
        isOver && "bg-zinc-800"
      )}
    >
      {children}
    </div>
  );
}

export async function fetchSetupStuff() {
  const response = await fetch("http://localhost:8787/game/setup/allStuff");
  const data = await response.json();
  return data;
}

/* 
    2 1 0 
    5 4 3 
*/
export function SetupView() {
  const { data } = useQuery({
    queryKey: ["setup-stuff"],
    queryFn: fetchSetupStuff,
  });

  const classes = data?.classes || [];
  const weapons = data?.weapons || [];

  const [board, setBoard] = useState<{ id: string; occupied: boolean; unit: any }[]>([
    {
      id: "0",
      occupied: false,
      unit: null,
    },
    {
      id: "1",
      occupied: false,
      unit: null,
    },
    {
      id: "2",
      occupied: false,
      unit: null,
    },
    {
      id: "3",
      occupied: false,
      unit: null,
    },
    {
      id: "4",
      occupied: false,
      unit: null,
    },
    {
      id: "5",
      occupied: false,
      unit: null,
    },
  ]);

  function handleDragEnd(event: DragEndEvent) {
    console.log(event);
    const isFromBoard = !classes.find((unitClass) => unitClass.id === event.active.id);

    const isEquipment = !!weapons.find((weapon) => weapon.id === event.active.id);

    if (isEquipment) {
      const targetCell = board.find((cell) => cell.id === event.over?.id);
      const hasUnit = targetCell?.unit;

      if (!hasUnit) return;

      const weaponName = weapons.find((weapon) => weapon.id === event.active.id).name;

      const newBoard = board.map((cell) => {
        if (cell.id === event.over?.id) {
          const unitEquipment = cell?.unit?.equipment || [];
          return {
            ...cell,
            unit: {
              ...cell.unit,
              equipment: [...unitEquipment, weaponName],
            },
          };
        }
        return cell;
      });

      setBoard(newBoard);

      return;
    }

    const name = classes.find((unitClass) => unitClass.id === event.active.id)?.name;

    let newBoard;
    if (!isFromBoard) {
      newBoard = board.map((cell) => {
        if (cell.id === event.over?.id) {
          return {
            ...cell,
            occupied: true,
            unit: { id: Math.floor(Math.random() * 100), name: name },
          };
        }

        return cell;
      });
    } else {
      newBoard = board.map((cell) => {
        if (cell?.unit?.id === event?.active?.id && cell.id !== event.over?.id) {
          return {
            ...cell,
            occupied: false,
            unit: null,
          };
        }

        const unit = board.find((cell) => cell?.unit?.id === event.active.id)?.unit;

        if (cell.id === event.over?.id) {
          return {
            ...cell,
            occupied: true,
            unit: {
              id: Math.floor(Math.random() * 100),
              name: unit?.name,
              equipment: unit?.equipment,
            },
          };
        }

        return cell;
      });
    }

    setBoard(newBoard);
  }

  console.log(board);

  return (
    <DndContext
      // sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="flex p-6">
        <div className="flex items-center justify-center">
          <div className="w-fit h-fit grid grid-cols-3 gap-4">
            {board.map(({ id, unit }) => (
              <React.Fragment key={id}>
                {unit ? (
                  <Droppable id={id}>
                    <Draggable key={unit.id} id={unit.id} unit={unit}>
                      {unit.name}
                    </Draggable>
                  </Droppable>
                ) : (
                  <Droppable id={id}></Droppable>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grow">
          <div className="w-full flex gap-4 mb-20 mt-4 min-h-[150px] items-center justify-center">
            {classes.map((unitClass) => (
              <Draggable key={unitClass.id} id={unitClass.id}>
                {unitClass.name}
              </Draggable>
            ))}
          </div>

          <div className="w-full flex gap-4 mb-20 mt-4 min-h-[150px] items-center justify-center">
            {weapons.map((weapon) => (
              <Draggable key={weapon.id} id={weapon.id}>
                {weapon.name}
              </Draggable>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
