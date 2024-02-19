import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export async function setupTeams(data) {
  try {
    const response = await fetch("http://localhost:8787/game/setup/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export interface UnitsDTO {
  equipments: string[];
  position: number;
  unitClass: string;
}

export function Draggable({ children, id, unit, isClass }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
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
      className={cn(
        "w-[100px] h-[100px] rounded-md border border-zinc-700 relative bg-black transition-colors",
        isDragging && "z-30",
        isClass && "border-green-900 hover:border-green-700",
        !isClass &&
          !unit &&
          "border-dashed border-yellow-700 hover:border-yellow-600 w-auto h-auto p-1"
      )}
    >
      {children}
      <div className="absolute top-0 right-0">
        {unitEquips.map((equip) => (
          <div className="border border-yellow-700 border-dashed rounded p-0.5 text-xs" key={equip}>
            {equip}
          </div>
        ))}
      </div>
    </button>
  );
}

export function Droppable({ children, id }: any) {
  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-[100px] h-[100px] rounded-md border border-zinc-700 transition-transform",
        isOver && "bg-zinc-800",
        isOver && "scale-110"
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
    2 1 0   0 1 2
    5 4 3   3 4 5
*/
export function SetupView() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["setup-stuff"],
    queryFn: fetchSetupStuff,
  });

  const { mutateAsync: setupTeamsMutation } = useMutation({
    mutationFn: setupTeams,
    mutationKey: ["setup-teams"],
    onSuccess: (data) => {
      localStorage.setItem("game", JSON.stringify(data));
      toast.success("Game started!");
      navigate("/game");
    },
  });

  const classes = data?.classes || [];
  const weapons = data?.weapons || [];

  const [board, setBoard] = useState<{ id: string; unit: any }[]>([
    {
      id: "2",
      unit: null,
    },
    {
      id: "1",
      unit: null,
    },
    {
      id: "0",
      unit: null,
    },
    {
      id: "5",
      unit: null,
    },
    {
      id: "4",
      unit: null,
    },
    {
      id: "3",
      unit: null,
    },
  ]);

  const [board2, setBoard2] = useState<{ id: string; unit: any }[]>([
    {
      id: "-0",
      unit: null,
    },
    {
      id: "-1",
      unit: null,
    },
    {
      id: "-2",
      unit: null,
    },
    {
      id: "-3",
      unit: null,
    },
    {
      id: "-4",
      unit: null,
    },
    {
      id: "-5",
      unit: null,
    },
  ]);

  useEffect(() => {
    const board = JSON.parse(localStorage.getItem("board") || "[]");
    const board2 = JSON.parse(localStorage.getItem("board2") || "[]");

    if (board.length > 0) {
      setBoard(board);
      setBoard2(board2);
    }
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    let targetBoard;
    let targetSetBoard;
    if (event.over?.id.toString().startsWith("-")) {
      targetBoard = board2;
      targetSetBoard = setBoard2;
    } else {
      targetBoard = board;
      targetSetBoard = setBoard;
    }

    const isFromBoard = !classes.find((unitClass) => unitClass.id === event.active.id);

    const isEquipment = !!weapons.find((weapon) => weapon.id === event.active.id);

    if (isEquipment) {
      const targetCell = targetBoard.find((cell) => cell.id === event.over?.id);
      const hasUnit = targetCell?.unit;

      if (!hasUnit) return;

      const weaponName = weapons.find((weapon) => weapon.id === event.active.id).name;

      const newBoard = targetBoard.map((cell) => {
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

      targetSetBoard(newBoard);

      return;
    }

    const name = classes.find((unitClass) => unitClass.id === event.active.id)?.name;

    let newBoard;
    if (!isFromBoard) {
      newBoard = targetBoard.map((cell) => {
        if (cell.id === event.over?.id) {
          return {
            ...cell,
            unit: { id: Math.floor(Math.random() * 100), name: name },
          };
        }

        return cell;
      });
    } else {
      newBoard = targetBoard.map((cell) => {
        if (cell?.unit?.id === event?.active?.id && cell.id !== event.over?.id) {
          return {
            ...cell,
            unit: null,
          };
        }

        const unit = targetBoard.find((cell) => cell?.unit?.id === event.active.id)?.unit;

        if (cell.id === event.over?.id) {
          return {
            ...cell,
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

    targetSetBoard(newBoard);
  }

  function onClickStartGame() {
    const team1finalUnits: UnitsDTO[] = board
      .filter((cell) => !!cell.unit)
      .map((cell) => {
        return {
          equipments: cell.unit?.equipment,
          position: parseInt(cell.id),
          unitClass: cell.unit.name,
        };
      });

    const team2finalUnits: UnitsDTO[] = board2
      .filter((cell) => !!cell.unit)
      .map((cell) => {
        return {
          equipments: cell.unit?.equipment,
          position: parseInt(cell.id.toString().replace("-", "")),
          unitClass: cell.unit.name,
        };
      });

    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("board2", JSON.stringify(board2));

    setupTeamsMutation({ team1: team1finalUnits, team2: team2finalUnits });
  }

  return (
    <>
      <DndContext
        // sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="flex p-6 gap-6 flex-col">
          <div className="grow flex flex-col">
            <div className="w-full flex gap-4 mt-4 min-h-[100px] items-center justify-center flex-wrap">
              {classes.map((unitClass) => (
                <Draggable key={unitClass.id} id={unitClass.id} isClass>
                  {unitClass.name}
                </Draggable>
              ))}
            </div>

            <div className="w-full flex gap-4 mt-4 min-h-[100px] items-center justify-center flex-wrap">
              {weapons.map((weapon) => (
                <Draggable key={weapon.id} id={weapon.id}>
                  {weapon.name}
                </Draggable>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center min-w-[500px] gap-20 mt-20">
            <div className="w-fit h-fit grid grid-cols-3 gap-5">
              {board.map(({ id, unit }) => (
                <React.Fragment key={id}>
                  {unit ? (
                    <Droppable id={id}>
                      <Draggable key={unit.id} id={unit.id} unit={unit} isClass>
                        {unit.name}
                      </Draggable>
                    </Droppable>
                  ) : (
                    <Droppable id={id}></Droppable>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="w-fit h-fit grid grid-cols-3 gap-5">
              {board2.map(({ id, unit }) => (
                <React.Fragment key={id}>
                  {unit ? (
                    <Droppable id={id}>
                      <Draggable key={unit.id} id={unit.id} unit={unit} isClass>
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
        </div>
      </DndContext>

      <div className="mt-10 mx-auto w-fit">
        <Button onClick={onClickStartGame}>Start game</Button>
      </div>
    </>
  );
}
