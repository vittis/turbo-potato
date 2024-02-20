import { useMemo } from "react";
import { useGameState } from "./services/state/useGameState";
import { useQuery } from "@tanstack/react-query";
import { fetchBattleSetup } from "./game/scenes/battle/BattleScene";
import { Button } from "./components/ui/button";

function App() {
  const { selectedEntity, isGamePaused, setSelectedEntity, setIsGamePaused } = useGameState();

  const { data } = useQuery({
    queryKey: ["game/battle/setup"],
    queryFn: fetchBattleSetup,
    staleTime: Infinity,
  });

  const firstState = data?.firstStep;

  const teamOneUnits = useMemo<any[]>(() => {
    if (!firstState) return [];
    return firstState?.units.filter((unit) => unit.owner === 0);
  }, [firstState]);

  const teamTwoUnits = useMemo<any[]>(() => {
    if (!firstState) return [];
    return firstState?.units.filter((unit) => unit.owner === 1);
  }, [firstState]);

  const allUnits = useMemo<any[]>(() => {
    return [...teamOneUnits, ...teamTwoUnits];
  }, [teamOneUnits, teamTwoUnits]);

  return (
    <>
      <div className="fixed top-24 w-full flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setIsGamePaused(!isGamePaused);
          }}
          className="w-[200px] h-12"
        >
          {!isGamePaused ? "Stop" : "Start"}
        </Button>
      </div>

      <div className="fixed bottom-10 w-full flex justify-center">
        <div
          tabIndex={0}
          className="collapse collapse-plus bg-stone-800 absolute left-2 bottom-2 w-fit mr-auto ml-auto"
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium text-white text-center">
            Show Units
          </div>
          <div className="collapse-content">
            {firstState && (
              <div className="w-fit flex justify-center inset-x-0 bg-stone-800 shadow-md p-4 rounded-lg mx-auto">
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr className="text-zinc-100 italic text-md uppercase">
                        <th>Name</th>
                        <th>Hp</th>
                        <th>Shield</th>
                        <th>Atk Cd</th>
                        <th>Atk Dmg</th>
                        <th>Spell Cd</th>
                        <th>Spell Dmg</th>
                        <th>Dmg Reduction</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-100">
                      {allUnits.map((unit: any) => {
                        return (
                          <tr
                            // @todo add an ID
                            onClick={() => {
                              if (selectedEntity !== `${unit.owner}${unit.position}`) {
                                setSelectedEntity(`${unit.owner}${unit.position}`);
                              } else {
                                setSelectedEntity(null);
                              }
                            }}
                            tabIndex={0}
                            className={`border-none hover:brightness-125 cursor-pointer transition-all ${
                              selectedEntity === `${unit.owner}${unit.position}`
                                ? "bg-amber-400 text-zinc-900"
                                : `${unit.owner === 0 ? "bg-amber-950" : "bg-slate-800"}`
                            }`}
                            key={`${unit.owner}${unit.position}`}
                          >
                            <td>{unit.name}</td>
                            <td>{unit.stats.hp}</td>
                            <td>{unit.stats.shield}</td>
                            <td>{unit.stats.attackCooldownModifier * -1}%</td>
                            <td>{unit.stats.attackDamageModifier}%</td>
                            <td>{unit.stats.spellCooldownModifier * -1}%</td>
                            <td>{unit.stats.spellDamageModifier}%</td>
                            <td>{unit.stats.damageReductionModifier}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
