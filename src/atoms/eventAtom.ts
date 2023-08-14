import { atom } from "recoil";

export const eventCountState = atom({
  key: "eventCount",
  default: 0,
});
