import { ActivityType } from "discord.js";

let rotation = false;

let defaultActivity = {
  name: "Evt",
  state: "lmfao",
  type: ActivityType.Streaming,
  url: "https://www.youtube.com/watch?v=JjjNa8khhww",
};

let activity = defaultActivity;

export function set(activityObj) {
  if (!activityObj) {
    activity = defaultActivity;
    return;
  }

  activity = { ...activity, ...activityObj };
}

export function get() {
  return activity;
}

export function rotate() {
  return rotation;
}

export function setRotation(newRotation) {
  rotation = newRotation;
}

export default {
  get,
  set,
  rotate,
  setRotation,
};
