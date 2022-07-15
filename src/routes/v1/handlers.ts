import { Request, Response } from "express";
import { GetMenoraEventsQuery } from "../../types";

import * as menoraHall from "../../helpers/menora-arena";

/**
 * HTTP GET handler: response with the events by a giving year and month
 * if not provide response with the event of the current year and month
 * {@link GetMenoraEventsQuery}
 */
export function getMenoraEvents(req: Request<{}, {}, {}, GetMenoraEventsQuery>, res: Response) {
  const { year, month } = req.query;

  if ((year && !month) || (!year && month)) {
    console.error("you have to provide all the params or none", year, month);

    return res
      .status(400)
      .json({ err: "you have to provide all the params or none" });
  }

  menoraHall
    .getEventsData(year, month)
    .then((eventsData) => {
      res.status(200).json(eventsData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ err: error.message });
    });
};