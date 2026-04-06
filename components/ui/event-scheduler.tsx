"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, PlusCircle, CalendarDays, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function EventScheduler() {
  const [date, setDate] = React.useState<Date>();
  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [ampm, setAmpm] = React.useState("AM");
  const [title, setTitle] = React.useState("");
  const [events, setEvents] = React.useState<{ id: number; title: string; date: Date }[]>([]);

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
    setEvents((prev) => [...prev, { id: Date.now(), title, date: selectedDateTime }]);
    setTitle("");
    setDate(undefined);
    setHour("12");
    setMinute("00");
    setAmpm("AM");
  };

  const handleDeleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
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
  );
}
