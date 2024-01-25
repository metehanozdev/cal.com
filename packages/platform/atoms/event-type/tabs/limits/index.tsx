import { LimitBookingFrequency } from "event-type/components/limit-booking-frequency";
import { LimitFirstSlot } from "event-type/components/limit-first-slot";
import { LimitTotalBookingDuration } from "event-type/components/limit-total-booking-duration";
import { OffsetStartTimes } from "event-type/components/offset-start-times";
import { useFormContext, useWatch } from "react-hook-form";

import { Label } from "@calcom/ui";

import { EventIntervalScheduler } from "../../components/event-interval-range-selector/index";
import { MinimumBookingNoticeInput } from "../../components/min-booking-notice-input/index";
import { beforeAndAfterBufferOptions, slotIntervalOptions } from "../../lib/limitsUtils";
import type { FormValues } from "../../types";
import type { EventTypeSetupProps } from "../event-setup/index";

type LimitsProps = {
  eventType: Pick<EventTypeSetupProps, "eventType">;
};

export function Limits({ eventType }: LimitsProps) {
  const formMethods = useFormContext<FormValues>();
  // offsetStart toggle is client-side only, opened by default if offsetStart is set
  const offsetStartValue = useWatch({
    control: formMethods.control,
    name: "offsetStart",
  });
  // Preview how the offset will affect start times
  const offsetOriginalTime = new Date();
  offsetOriginalTime.setHours(9, 0, 0, 0);
  const offsetAdjustedTime = new Date(offsetOriginalTime.getTime() + offsetStartValue * 60 * 1000);

  const originalTime = offsetOriginalTime.toLocaleTimeString("en", { timeStyle: "short" });
  const adjustedTime = offsetAdjustedTime.toLocaleTimeString("en", { timeStyle: "short" });

  return (
    <div>
      <div className="border-subtle space-y-6 rounded-lg border p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <EventIntervalScheduler
            classnames="w-full"
            labelTitle="Before event"
            labelFor="beforeBufferTime"
            controllerName="beforeBufferTime"
            defaultValue={eventType.beforeEventBuffer || 0}
            selectDefaultValue={
              beforeAndAfterBufferOptions.find((option) => option.value === value) ||
              beforeAndAfterBufferOptions[0]
            }
            selectOptions={beforeAndAfterBufferOptions}
            variant="event interval"
          />
          <EventIntervalScheduler
            classnames="w-full"
            labelTitle="After event"
            labelFor="afterBufferTime"
            controllerName="afterBufferTime"
            defaultValue={eventType.afterEventBuffer || 0}
            selectDefaultValue={
              beforeAndAfterBufferOptions.find((option) => option.value === value) ||
              beforeAndAfterBufferOptions[0]
            }
            selectOptions={beforeAndAfterBufferOptions}
            variant="event interval"
          />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="w-full">
            <Label htmlFor="minimumBookingNotice">Minimum Notice</Label>
            <MinimumBookingNoticeInput {...formMethods.register("minimumBookingNotice")} />
          </div>
          <EventIntervalScheduler
            classnames="w-full"
            labelTitle="Time-slot intervals"
            labelFor="slotInterval"
            controllerName="slotInterval"
            selectDefaultValue={
              slotIntervalOptions.find((option) => option.value === eventType.slotInterval) ||
              slotIntervalOptions[0]
            }
            selectOptions={slotIntervalOptions}
            variant="time slot interval"
          />
        </div>
      </div>
      {/* This is the controller to limit booking frequency */}
      <LimitBookingFrequency formMethods={formMethods} />
      {/* This is the controller to limit first booking slot */}
      <LimitFirstSlot formMethods={formMethods} />
      {/* This is the controller to limit total booking duration */}
      <LimitTotalBookingDuration formMethods={formMethods} />
      {/* TODO: this is the controller for limiting future bookings  */}
      {/* controller for offset start times */}
      <OffsetStartTimes
        formMethods={formMethods}
        offsetStartValue={offsetStartValue}
        originalTime={originalTime}
        adjustedTime={adjustedTime}
      />
    </div>
  );
}
