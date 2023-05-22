import { CSSProperties } from "react";

function App() {
  return (
    <>
      <main className="shadow-md relative max-w-screen-md mx-auto bg-base-100 border-base-content/5 border rounded-box m-4 flex flex-col items-center px-6">
        {/* navbar */}
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
      </main>

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
          <div className="stat-title">online</div>
        </div>
      </div>

      {/* Members */}
      <div className="fixed flex flex-col items-center top-5 right-5 px-5 py-2 bg-base-100 shadow rounded z-50">
        <h1 className="text-primary border-b-[3px] border-primary mb-2">
          Members
        </h1>
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
