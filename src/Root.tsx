import { Composition } from "remotion";
import { TinyEmergencyAd, type TinyEmergencyAdProps } from "./TinyEmergencyAd";

const sharedSettings = {
  component: TinyEmergencyAd,
  durationInFrames: 180,
  fps: 30,
  height: 1080,
  width: 1080,
};

const compositions: Array<{
  id: string;
  props: TinyEmergencyAdProps;
}> = [
  {
    id: "TinyEmergencyAd",
    props: {
      accent: "blue",
      badge: "Official-ish PSA",
      headline: "Problems too small for therapy?",
      punchline: "File them with the Bureau.",
      stamp: "Approved-ish",
      crises: [
        "Typed 'thanks' as 'thanos'",
        "Opened fridge with no strategy",
        "Said 'you too' to the dentist",
        "Joined a call as 'iPhone (4)'",
      ],
    },
  },
  {
    id: "PanicForecast",
    props: {
      accent: "pink",
      badge: "Forecast desk",
      headline: "Today: inbox drizzle, meeting thunder.",
      punchline: "Bring snacks and a fake reboot.",
      stamp: "Weather-ish",
      crises: [
        "9:00 AM: quick-question fog",
        "1:00 PM: confident nod lightning",
        "4:59 PM: urgent sparkle warning",
        "Tomorrow: emotionally damp tabs",
      ],
    },
  },
  {
    id: "ComplaintReceipt",
    props: {
      accent: "yellow",
      badge: "Complaint department",
      headline: "Your feedback matters for four seconds.",
      punchline: "Then it joins the shrug archive.",
      stamp: "Filed-ish",
      crises: [
        "Complaint received",
        "Specialist assigned: unfortunately you",
        "Escalated to Loud Sighs",
        "Outcome: velvet-lined shrug",
      ],
    },
  },
  {
    id: "MeetingEscapePlan",
    props: {
      accent: "green",
      badge: "Meeting escape unit",
      headline: "When the agenda becomes interpretive dance.",
      punchline: "Deploy the strategic connection issue.",
      stamp: "Vanished-ish",
      crises: [
        "Nod with premium confidence",
        "Say 'circling back' and back away",
        "Freeze face on purpose",
        "Return with tea and no explanation",
      ],
    },
  },
  {
    id: "SnackProtocol",
    props: {
      accent: "yellow",
      badge: "Snack protocol",
      headline: "Productivity is just hunger wearing glasses.",
      punchline: "Authorize emergency crunch support.",
      stamp: "Snacktified",
      crises: [
        "Desk crackers: approved",
        "Granola bar: morally complex",
        "Grapes: suspiciously formal",
        "Cold fries: legally a salad",
      ],
    },
  },
  {
    id: "TabTherapy",
    props: {
      accent: "blue",
      badge: "Browser counseling",
      headline: "Your 47 open tabs are forming a union.",
      punchline: "Negotiate before they request benefits.",
      stamp: "Tabs-ish",
      crises: [
        "One tab is just vibes",
        "Four are duplicate calendars",
        "Seven are emotional support docs",
        "The loud one is hiding",
      ],
    },
  },
];

export const RemotionRoot = () => {
  return (
    <>
      {compositions.map(({ id, props }) => (
        <Composition key={id} id={id} {...sharedSettings} defaultProps={props} />
      ))}
    </>
  );
};
