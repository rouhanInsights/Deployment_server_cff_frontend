"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Slot = {
  slot_id: number;
  slot_details: string;
};

type Props = {
  date: string;
  slot: number | null;
  onDateChange: (val: string) => void;
  onSlotChange: (slotId: number) => void;
};

function getNextThreeValidDates(): Date[] {
  const validDates: Date[] = [];
  const today = new Date();

  while (validDates.length < 3) {
    today.setDate(today.getDate() + 1);
    const next = new Date(today); // clone
    if (next.getDay() === 1) continue; // skip Monday
    validDates.push(new Date(next));
  }

  return validDates;
}

export default function CheckoutForm({
  date,
  slot,
  onDateChange,
  onSlotChange,
}: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/slots`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => {
        console.error("Failed to load slots", err);
        setSlots([]);
      });

    setAllowedDates(getNextThreeValidDates());
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Delivery Date
        </label>
        <DatePicker
  selected={date ? new Date(date) : null}
  onChange={(val: Date | null) => {
    if (val) {
      onDateChange(val.toISOString().split("T")[0]);
    }
  }}
  includeDates={allowedDates}
  placeholderText="Choose a valid date 🗓️"
  className="w-full border font-bold text-black rounded px-3 py-2 text-sm"
  dayClassName={(date) => {
    return date.getDay() === 1 ? "monday-disabled has-tooltip" : "";
  }}
  renderDayContents={(day, date) => {
  if (date.getDay() === 1) {
    return (
      <div className="tooltip-wrapper">
        {day}
        <div className="tooltip-text">
          Monday we are out of service, please select the next date
        </div>
      </div>
    );
  }
  return day;
}}

/>
        <p className="text-sm text-red-500 mt-1">
          * Only next 3 delivery days available (Monday we are out of service)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Delivery Time Slot
        </label>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((s) => (
            <button
              key={s.slot_id}
              type="button"
              onClick={() => onSlotChange(s.slot_id)}
              className={`border px-4 py-2 rounded text-sm text-center ${
                slot === s.slot_id
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white hover:bg-gray-50 border-gray-300"
              }`}
            >
              {s.slot_details}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
