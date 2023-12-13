import { BoardManager } from "../BoardManager";
import { EVENT_TYPE, Event } from "./EventTypes";

function sortEventsByType(events: any[]) {
  events.sort(function (a, b) {
    if (a.type === EVENT_TYPE.USE_ABILITY && b.type === EVENT_TYPE.FAINT) {
      return -1;
    } else if (
      a.type === EVENT_TYPE.FAINT &&
      b.type === EVENT_TYPE.USE_ABILITY
    ) {
      return 1;
    } else {
      return 0;
    }
  });

  return events;
}

function executeStepEvents(bm: BoardManager, events: any[]) {
  events.forEach((event) => {
    bm.getUnitById(event.actorId).applyEvent(event);
  });

  return events;
}

export function sortAndExecuteEvents(bm: BoardManager, events: Event[]) {
  return executeStepEvents(bm, sortEventsByType(events));
}
