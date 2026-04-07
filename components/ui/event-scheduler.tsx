"use client";

import * as React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from "date-fns";
import { Calendar as CalendarIcon, Clock, PlusCircle, CalendarDays, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EventType = "school-term" | "holiday" | "exam-week" | "public-holiday" | null;

interface Event {
  id: number;
  title: string;
  date: Date;
  type?: EventType;
}

const eventTypeColors: Record<Exclude<EventType, null>, { bg: string; border: string; color: string }> = {
  "school-term": { bg: "#10b981", border: "#10b981", color: "School Term" },
  "holiday": { bg: "#3b82f6", border: "#3b82f6", color: "Holiday" },
  "exam-week": { bg: "#ef4444", border: "#ef4444", color: "Exam Week" },
  "public-holiday": { bg: "#f59e0b", border: "#f59e0b", color: "Public Holiday" },
};

export default function EventScheduler() {
  const [date, setDate] = React.useState<Date>();
  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [ampm, setAmpm] = React.useState("AM");
  const [title, setTitle] = React.useState("");
  const [eventType, setEventType] = React.useState<EventType>(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const selectedDateTime = React.useMemo(() => {
    if (!date) return null;
    const d = new Date(date);
    let h = parseInt(hour);
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    d.setHours(h, parseInt(minute), 0, 0);
    return d;
  }, [date, hour, minute, ampm]);

  const handleAddEvent = () => {
    if (!title || !selectedDateTime) return;
    setEvents((prev) => [...prev, { id: Date.now(), title, date: selectedDateTime, type: eventType }]);
    setTitle("");
    setDate(undefined);
    setHour("12");
    setMinute("00");
    setAmpm("AM");
    setEventType(null);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const getDayEventType = (day: number): EventType => {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const event = events.find((e) => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear();
    });
    return event?.type || null;
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    return allDays;
  };

  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const daysInMonth = getDaysInMonth();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...daysInMonth.map((d) => d.getDate()),
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-2 gap-4" data-create-event-modal>
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 w-5 text-[#176293]" />
              Create Event
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-h-[48px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-full min-h-[48px]",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4" side="bottom" align="start" sideOffset={6}>
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={eventType || ""} onValueChange={(value) => setEventType(value as EventType || null)}>
                <SelectTrigger className="w-full min-h-[48px]">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="school-term">School Term</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="exam-week">Exam Week</SelectItem>
                  <SelectItem value="public-holiday">Public Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Time</label>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="w-[80px] min-h-[48px]">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const h = i + 1;
                      return (
                        <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                          {h.toString().padStart(2, "0")}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <span className="font-semibold">:</span>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="w-[80px] min-h-[48px]">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {["00", "15", "30", "45"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={ampm} onValueChange={setAmpm}>
                  <SelectTrigger className="w-[80px] min-h-[48px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddEvent}
              disabled={!title || !selectedDateTime}
              className="flex items-center gap-2 bg-[#176293] hover:bg-[#1A3E6F] text-white min-h-[48px]"
            >
              <PlusCircle className="h-4 w-4" /> Add Event
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Scheduled Events</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {events.length === 0 && (
              <p className="text-sm text-slate-500">No events scheduled yet</p>
            )}
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex justify-between items-center border rounded-lg px-3 py-3 min-h-[48px]"
              >
                <div>
                  <span className="font-medium block">{ev.title}</span>
                  <span className="text-sm text-slate-500">{format(ev.date, "PPP p")}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEvent(ev.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-xl p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="hover:bg-white/20 text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="hover:bg-white/20 text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-3 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-[#1E3A5F]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3 mb-8">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-24" />;
              }

              const eventType = getDayEventType(day);
              const colors = eventType ? eventTypeColors[eventType] : null;

              return (
                <div
                  key={day}
                  className={cn(
                    "p-4 rounded-lg min-h-[120px] border transition-all duration-200 hover:shadow-md hover:scale-105",
                    colors
                      ? `bg-[${colors.bg}]/10 border-[${colors.border}]/20`
                      : "bg-gray-50 border-gray-200"
                  )}
                  style={colors ? {
                    backgroundColor: `rgba(${parseInt(colors.bg.slice(1, 3), 16)}, ${parseInt(colors.bg.slice(3, 5), 16)}, ${parseInt(colors.bg.slice(5, 7), 16)}, 0.1)`,
                    borderColor: `rgba(${parseInt(colors.bg.slice(1, 3), 16)}, ${parseInt(colors.bg.slice(3, 5), 16)}, ${parseInt(colors.bg.slice(5, 7), 16)}, 0.2)`,
                  } : undefined}
                >
                  <div className="font-semibold text-lg text-[#1E3A5F]">{day}</div>
                  {eventType && (
                    <div className="text-xs font-medium mt-2 text-[#6b7280]">
                      {eventTypeColors[eventType].color}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-[#1E3A5F] mb-4">Event Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(eventTypeColors) as Array<Exclude<EventType, null>>).map((type) => {
                const color = eventTypeColors[type];
                return (
                  <div
                    key={type}
                    className="p-3 rounded-lg bg-gray-50 border-l-4"
                    style={{ borderColor: color.bg }}
                  >
                    <div className="text-sm font-medium text-[#1E3A5F]">
                      {color.color}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
