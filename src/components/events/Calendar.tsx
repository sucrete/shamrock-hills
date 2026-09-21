'use client';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { createPlugin, sliceEvents, EventClickArg } from '@fullcalendar/core';
import RevealAnimation from '../animation/RevealAnimation';
import moment from 'moment';
import { cn } from '@/utils/cn';

import { X } from '@/components/ui/Icons';

interface SanityEvent {
  _id: string;
  title: string;
  start: string;
  end?: string;
  eventDescription: string;
  flyerQuestion: boolean;
  linkQuestion: boolean;
  multidayEvent: boolean;
  flyer?: {
    asset?: {
      url: string;
    };
  };
  linkDeets?: {
    linkURL: string;
    linkText: string;
  };
}

const CalendarComponent = ({ eventsData }: { eventsData: SanityEvent[] }) => {
  const events = eventsData.map(({ _id, end, multidayEvent, ...rest }) => ({
    id: _id,
    end: multidayEvent && end ? moment(end).add(1, 'days').format('YYYY-MM-DD') : end,
    multidayEvent,
    ...rest,
  }));
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeView, setActiveView] = useState('dayGridMonth');

  const CustomViewConfig = {
    classNames: ['custom-view'],
    content: function (props: any) {
      let segs = sliceEvents(props, true);
      const sortedSegs = segs.sort(
        (a: any, b: any) => new Date(b.range.start).getTime() - new Date(a.range.start).getTime(),
      );

      if (segs.length === 0) {
        return {
          html: `
            <div class='w-auto relative h-[700px] flex flex-col justify-center'>

              <img class="h-[250px] mx-auto w-auto relative z-30" src="/images/events/teared-out-golfer.png"/>
              <div class="flex flex-col items-center justify-center font-body text-[#b8b8b8] py-10 leading-4 text-center">
                <img class="h-3 w-auto mb-3 opacity-25" src="/images/events/no-events.svg"/>
                  No events scheduled <br/>for this month.
              </div>
            </div>
         `,
        };
      }

      const html = `

      <!-- EVENTs LIST MARKUP -->
        <div class="flex flex-col-reverse gap-2.5 relative">
          ${sortedSegs
            .map((seg: any) => {
              const isToday = moment().isBetween(moment(seg.range.start), moment(seg.range?.end), undefined, '[]');
              return `
              <div class=" w-full rounded-[20px] border border-[#80808021] transition-all duration-250 relative z-[7] hover:border-[#e8e8e8] hover:z-[77] hover:realistic-shadow-light ${isToday ? `bg-white bg-[position:top_right] bg-no-repeat bg-size-[auto_100px]` : 'bg-white'} ${(seg.def.extendedProps.linkQuestion || seg.def.extendedProps.flyerQuestion) ? 'p-[2.25rem_2.25rem_2.5rem_2.25rem]' : 'p-[2.25rem_2.25rem_3rem_2.25rem]'}">

                <div class="font-body text-[#1d1d1d] text-[18px] semibold tracking-[-.5px] pb-2 leading-[1.2]">${seg.def.title}</div>

                <div class="text-[#5d5e5e] text-sm md:text-[14px]">
                  <img src="/images/events/calendar.svg" class="inline-block h-3 w-auto mr-2.5 ml-0.5 relative -top-[1.5px]" alt=""/>
                  <span>${moment(seg.range.start).add(1, 'days').format('dddd, MMM Do')}</span>
                  ${
                    moment(seg.range.end).isAfter(moment(seg.range.start).add(1, 'days'))
                      ? `<span>&nbsp;- ${moment(seg.range.end).format('dddd, MMM Do')}</span>`
                      : ''
                  }
                  ${isToday ? '<span class=" monospaced-medium text-black bg-[#fffbca] rounded-md px-2.5 py-[3.5px] border-[#f9f5c5] border ml-2 relative -top-[2.5px] shadow-1">today</span> ' : ''}
                </div>
                <hr class="bg-black/10 mb-1 mt-3 opacity-100 border-none h-[1px]"/>
                <div class="pt-2 text-black whitespace-pre-line leading-[1.3] text-sm md:text-[14px]">${seg.def.extendedProps.eventDescription}</div>
                <div class=" flex flex-col md:flex-row gap-1.5 ${!(seg.def.extendedProps.linkQuestion || seg.def.extendedProps.flyerQuestion) ? 'p-0' : 'pt-5'}">
                   ${
                     seg.def.extendedProps.flyerQuestion
                       ? `
                    <a href=${seg.def.extendedProps?.flyer?.asset?.url} target="_blank" class="btn-sm-dark bg-white border-bushwood-900 border-[1.5px] text-bushwood hover:text-white hover:bg-bushwood-900">
                      <span>View flyer</span>
                    </a>`
                       : ''
                   }
                   ${
                     seg.def.extendedProps.linkQuestion
                       ? `
                    <a href=${seg.def.extendedProps.linkDeets.linkURL} target="_blank" class="btn-sm-dark border-bushwood-900 bg-bushwood-900 text-accent hover:bg-bushwood-800">
                      <span>${seg.def.extendedProps.linkDeets.linkText}</span>
                    </a>`
                       : ''
                   }
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      `;
      return { html };
    },
  };

  const CustomViewPlugin = createPlugin({
    name: 'custom-month-list-plugin',
    views: {
      monthList: CustomViewConfig,
    },
  });

  return (
    <section className="pt-[7rem] pb-[7rem] md:py-[7rem] bg-[#f3f2f1]">
      <div className="main-container mx-auto px-4 mt-3 lg:mt-10">
        {/* Modal Reproduction with Tailwind */}
        {selectedEvent && (
          <div
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4">
            <RevealAnimation delay={0.0} useSpring={true}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full md:min-w-[580px] max-w-[580px] bg-white rounded-[8px] md:rounded-[10px] overflow-hidden shadow-[0_64px_64px_-32px_rgba(0,61,61,0.3),0_32px_32px_-16px_rgba(0,61,61,0.3),0_16px_16px_-8px_rgba(0,61,61,0.3),0_0_0_1px_rgba(0,61,61,0.3)]">
                <div className="p-6 pb-0.5 md:p-10 md:pb-1 relative">
                  <h3 className="font-body text-[#1d1d1d] text-[18px] md:text-[21px] semibold tracking-[-.5px] leading-[1.2] w-3/4 pb-2">
                    {selectedEvent.title}
                  </h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="cursor-pointer absolute top-5 right-5 h-8 w-8 md:top-8 md:right-8 md:h-10 md:w-10 bg-[#f9f9f9] hover:bg-ns-green-light rounded-full flex items-center justify-center text-black/70 transition-all">
                    <X className="size-[15px] md:size-[20px]" />
                  </button>
                </div>

                <div className="px-6 pb-3 md:px-10 md:pb-8 pt-0 leading-[140%]">
                  <div className="text-[#5d5e5e] text-[12px] md:text-sm flex items-center">
                    <img
                      src="/images/events/calendar.svg"
                      className="h-3 top-[0px] md:h-3.5 w-auto mr-2.5 ml-0.5 relative md:-top-[1px]"
                      alt=""
                    />
                    <span>{moment(selectedEvent.start).format('dddd, MMM Do')}</span>
                    {selectedEvent.end && (
                      <span>&nbsp;- {moment(selectedEvent.end).subtract(1, 'days').format('dddd, MMM Do')}</span>
                    )}
                  </div>
                  <hr className="bg-[#e7e7e7] my-3 md:my-5 opacity-100 border-none h-[1px]" />
                  <div
                    className={cn(
                      'whitespace-pre-line leading-[1.3] text-[12px] md:text-sm',
                      selectedEvent.extendedProps.flyerQuestion || selectedEvent.extendedProps.linkQuestion
                        ? 'pb-0'
                        : 'pb-8',
                    )}>
                    {selectedEvent.extendedProps.eventDescription}
                  </div>
                </div>

                {(selectedEvent.extendedProps.flyerQuestion || selectedEvent.extendedProps.linkQuestion) && (
                  <div className="px-6 pb-6 md:px-10 md:pb-12 pt-2 flex flex-col md:flex-row gap-1.5 border-t border-transparent">
                    {selectedEvent.extendedProps.flyerQuestion && (
                      <a
                        href={selectedEvent.extendedProps?.flyer?.asset?.url}
                        target="_blank"
                        className="flex-1 btn-sm-dark bg-white border-bushwood-900 border-[1.5px] py-[8px] text-bushwood text-[12px] md:text-[14px] hover:text-white hover:bg-bushwood-900 before:content-none">
                        View flyer
                      </a>
                    )}
                    {selectedEvent.extendedProps.linkQuestion && (
                      <a
                        target="_blank"
                        href={selectedEvent.extendedProps.linkDeets?.linkURL}
                        className="flex-1 btn-sm-dark border-bushwood-900 bg-bushwood-900 text-accent py-[8px] text-[12px] md:text-[14px] hover:bg-bushwood-800 before:content-none">
                        {selectedEvent.extendedProps.linkDeets.linkText}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </RevealAnimation>
          </div>
        )}

        {/* FullCalendar with Tailwind Overrides */}
        <div className="calendar-theme">
          <RevealAnimation delay={0.3}>
            <div>
              <FullCalendar
                plugins={[dayGridPlugin, CustomViewPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'dayGridMonth,monthList',
                  center: 'title',
                  right: 'today prev,next',
                }}
                height={activeView === 'monthList' ? 'auto' : 800}
                views={{
                  monthList: { buttonText: 'list', duration: { months: 1 } },
                  dayGridMonth: {},
                }}
                events={events}
                eventClick={(info) => setSelectedEvent(info.event)}
                datesSet={(info) => setActiveView(info.view.type)}
                firstDay={1}
              />
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default CalendarComponent;
