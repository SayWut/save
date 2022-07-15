import config from "config";
import * as HTMLparse from "node-html-parser";
import { HTMLElement } from "node-html-parser";
import { default as axios } from "axios";
import { EventData } from "../types";

const baseUrl = config.get<any>("arenas").menora;

/**
 * Gets menora's events html page by a giving optional year and month,
 * if not provided sets to current year and month.
 *
 * @param year search by year
 * @param month search by month (1 - 12)
 * @returns html page of the events
 */
const getEventsHtml = async (year: number, month: number) => {
  const params = {
    yr: year,
    month,
  };

  try {
    const response = await axios.get(baseUrl, { params });
    return response.data;
  } catch (err: any) {
    console.error("[getEventsHtml] unable to get events", err);
    throw Error("[getEventsHtml] unable to get events" + err.message);
  }
};

/**
 * Extracts the events' title from a giving html document
 *
 * @param document the events html page
 * @returns a list of events title
 */
const getEventTitles = (document: HTMLElement): string[] => {
  const listEventTitleClass = document.querySelectorAll(".event-title");
  const listEventTitles = listEventTitleClass.map((value) => {
    return value.childNodes[0].innerText;
  });

  return listEventTitles;
};

/**
 * Extracts the events' timestamp from a giving html document.
 *
 * @param document the events html page
 * @returns list of events' dates
 */
const getEventDates = (document: HTMLElement): string[] => {
  const listEventDateClass = document.querySelectorAll(".event-time");
  const listEventDates = listEventDateClass.map((value) => {
    const child = value.childNodes[1] as HTMLElement;

    if (child && child.rawTagName && child.rawTagName === "time") {
      return child.rawAttributes.datetime;
    }

    return "N/A";
  });

  return listEventDates;
};

/**
 * Gets events' data by a giving optional year and month,
 * if not provided sets to current year and month.
 * {@link EventData}
 *
 * @returns list of events data
 */
const getEventsData = async (year: number, month: number): Promise<EventData[]> => {
  // the html page returns not filtered events
  // the page can have events from the previous month
  // and events from the next month. filters them later
  const htmlPage = await getEventsHtml(year, month);
  const document = HTMLparse.parse(htmlPage);

  const listEventTitles = getEventTitles(document);
  const listEventDates = getEventDates(document);
  const events = [];

  // if month not provided set month filter to current month
  var filterEventsMonth = month - 1;
  if (!filterEventsMonth) {
    filterEventsMonth = new Date().getMonth();
  }

  console.log(listEventDates);
  for (var i = 0; i < listEventTitles.length; i++) {
    const eventDate = new Date(listEventDates[i]);

    if (eventDate.getMonth() === filterEventsMonth) {
      const event = {
        title: listEventTitles[i],
        date: eventDate.getTime(),
      };

      events.push(event);
    }
  }

  return events;
};

export { getEventsData };
