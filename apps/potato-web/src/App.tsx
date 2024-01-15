import { CSSProperties, useMemo } from "react";
import { useGameStore } from "./services/state/game";
import { useQuery } from "@tanstack/react-query";
import { fetchBattleSetup } from "./game/scenes/battle/BattleScene";

function App() {
  const { selectedEntity, isGamePaused, setSelectedEntity, setIsGamePaused } = useGameStore();

  const { data } = useQuery({
    queryKey: ["game/battle/setup"],
    queryFn: fetchBattleSetup,
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
      <div className="absolute top-10 w-full flex justify-center">
        <button
          onClick={() => {
            setIsGamePaused(!isGamePaused);
          }}
          className={`btn  btn-wide shadow-lg ${!isGamePaused ? "btn-neutral" : "btn-secondary"}`}
        >
          {!isGamePaused ? "Stop" : "Start"}
        </button>
      </div>

      <div className="absolute bottom-10 w-full flex justify-center">
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

      {/* navbar */}
      {/* <main className="shadow-md relative max-w-screen-md mx-auto bg-base-100 rounded-box mt-4 flex flex-col items-center px-6">
        <div className="navbar bg-base-100 p-0">
          <div className="navbar-start">
            <a href="/" className="text-3xl prose text-primary font-normal">
              🥔 <b>Potate</b>
            </a>
          </div>
          <div className="navbar-center"></div>
          <div className="navbar-end">
            <button className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
        </div>
      </main> */}
      {/* <DemoUI /> */}
      {/* Online players count */}
      <div className="fixed bottom-5 right-5 stats shadow">
        <div className="stat py-2 px-5">
          <div className="stat-value countdown">
            <span
              style={
                {
                  "--value": 5,
                } as CSSProperties
              }
            ></span>
          </div>
          <div className="stat-title text-slate-800 font-semibold">online</div>
        </div>
      </div>
      {/* Members */}
      <div className="fixed flex flex-col items-center top-5 right-5 px-5 py-2 bg-base-100 shadow rounded z-50">
        <h1 className="text-primary border-b-[3px] border-primary mb-2">Members</h1>
        {Object.keys([
          {
            name: "kekw",
          },
        ]).map((memberId) => (
          <div key={memberId} className={`font-bold text-slate-800`}>
            {"Kekw"}{" "}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
