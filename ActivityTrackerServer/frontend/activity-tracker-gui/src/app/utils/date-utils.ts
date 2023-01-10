import {FormControl, FormGroup} from "@angular/forms";
import {TimeRange} from "../models/common-models";

export function getYesterday(): Date {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
}

export function getTimesForm(): FormGroup {
  const today = new Date();
  const yesterday = getYesterday();

  return new FormGroup({
    from: new FormControl(yesterday),
    to: new FormControl(today)
  });
}

export function getTimeRangeFromTimesForm(timesForm: FormGroup): TimeRange {
  return {
    from: (timesForm.get("from").value as Date).getTime(),
    to: (timesForm.get("to").value as Date).getTime(),
  };
}
