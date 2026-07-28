// Sample opportunity data for the EarnSignal prototype.
//
// Everything here is illustrative prototype information, not real market
// data — see PrototypeDisclaimer. Types are shaped from every field used
// across the Discover, Opportunity Detail, Evidence, Compare and Test Plan
// screens so later stages just need to fill this file in, not redesign it.

/** Drives which Badge colour a status reads as. */
export type SignalTone = "accent" | "info" | "warning" | "danger";

export interface EvidenceStrength {
  label: string; // e.g. "Strong evidence", "Growing signal", "Mostly hype"
  tone: SignalTone;
}

export interface CompetitionLevel {
  label: string; // e.g. "Growing competition", "Very high competition"
  tone: SignalTone;
}

export interface RiskLevel {
  label: string; // e.g. "Low risk", "Medium risk"
  tone: SignalTone;
}

export interface ScoreBreakdownRow {
  label: string; // e.g. "Buyer demand"
  points: number;
}

export type SourceConfidence = "high" | "medium" | "low";

export interface EvidenceSource {
  title: string;
  sourceType: string; // e.g. "Marketplace data", "Qualitative interviews"
  published: string; // ISO date string, e.g. "2024-11-02"
  description: string;
  confidence: SourceConfidence;
  url?: string;
}

export interface TestPlanDay {
  day: number; // 1-7
  task: string;
  estimatedTime: string; // e.g. "~1 hour"
  tags: string[]; // e.g. ["Google search", "Notes app"]
}

export interface OpportunityOverview {
  whatPeopleAreDoing: string;
  whyClientsPay: string[];
  pricing: {
    setupFee: string;
    monthlySupport: string;
    note: string;
  };
  realityCheck: string;
}

export interface OpportunityEvidence {
  scoreBreakdown: ScoreBreakdownRow[];
  sources: EvidenceSource[];
  supported: string[];
  notProven: string[];
}

export interface OpportunityTestPlan {
  estimatedSpend: string; // e.g. "£18–£60"
  estimatedTime: string; // e.g. "8–11 hours"
  successThreshold: string;
  days: TestPlanDay[];
}

export type Difficulty = "Beginner friendly" | "Some experience helpful" | "Advanced";

export const DIFFICULTY_LEVELS: Difficulty[] = [
  "Beginner friendly",
  "Some experience helpful",
  "Advanced",
];

export interface Opportunity {
  slug: string;
  title: string;
  shortDescription: string; // one-line summary shown on the Discover card
  category: string; // e.g. "AI & Automation" — drives Discover's category filter
  difficulty: Difficulty;
  signalScore: number; // 0-100
  evidenceStrength: EvidenceStrength;
  costToStart: string; // e.g. "£35–£120", for display
  startupCostMin: number; // numeric £ minimum, for sorting/filtering by cost
  timeToTest: string; // "7-day test plan" for every opportunity — display only
  estimatedTestHours: number; // actual hours of work required — matches
    // testPlan.estimatedTime's upper bound; used to compare against the
    // user's available hours (Best Match scoring needs hours vs hours,
    // not hours vs days)
  firstIncomeWindow: string; // e.g. "1–4 weeks" — displayed as "Estimated time to first income"
  competition: CompetitionLevel;
  risk: RiskLevel;
  recurringIncomePotential: "High" | "Medium" | "Low";
  skillFit: string; // e.g. "AI / voice setup"
  location: string; // e.g. "United Kingdom"
  deliveryMode: string; // e.g. "Online and local delivery"
  updatedLabel: string; // honest prototype wording, e.g. "Illustrative sample" — never a live-freshness claim
  updatedMinutesAgo: number; // numeric, for "Newest" sorting
  sparkline: number[]; // small trend chart, arbitrary units
  overview: OpportunityOverview;
  whyNow: string;
  evidence: OpportunityEvidence;
  howToStart: string;
  risksDetail: string;
  testPlan: OpportunityTestPlan;
}

/**
 * Six illustrative prototype opportunities. Every number, source and quote
 * here is sample data invented for this demo, not a real market claim —
 * see PrototypeDisclaimer, shown wherever this data renders.
 *
 * "AI receptionist setup for local clinics" carries the fullest detail
 * because it's the one opportunity the original Flowstep screens designed
 * end-to-end (Overview, Evidence, 7-day Test Plan). The other five follow
 * the same shape and tone, using the summary metrics that did appear on
 * the Discover and Compare screens as their anchor numbers.
 */
export const opportunities: Opportunity[] = [
  {
    slug: "ai-receptionist-clinics",
    title: "AI receptionist setup for local clinics",
    shortDescription:
      "Configure voice-AI receptionists for clinics and charge a setup fee plus monthly support.",
    category: "AI & Automation",
    difficulty: "Advanced",
    signalScore: 91,
    evidenceStrength: { label: "Strong evidence", tone: "accent" },
    costToStart: "£35–£120",
    startupCostMin: 35,
    timeToTest: "7-day test plan",
    estimatedTestHours: 11,
    firstIncomeWindow: "1–4 weeks",
    competition: { label: "Growing competition", tone: "warning" },
    risk: { label: "Low risk", tone: "info" },
    recurringIncomePotential: "High",
    skillFit: "AI / voice setup",
    location: "United Kingdom",
    deliveryMode: "Online and local delivery",
    updatedLabel: "Illustrative sample",
    updatedMinutesAgo: 18,
    sparkline: [40, 35, 38, 25, 28, 15, 20, 10, 14, 5, 8],
    overview: {
      whatPeopleAreDoing:
        "Freelancers configure existing voice-AI services for small clinics, connect them to calendars and charge a setup fee plus monthly support.",
      whyClientsPay: [
        "Missed calls can mean lost bookings",
        "Reception staff are expensive",
        "Clinics want a managed solution",
        "The system can match their existing workflow",
      ],
      pricing: {
        setupFee: "£250–£750",
        monthlySupport: "£50–£200",
        note: "Software paid separately by the client",
      },
      realityCheck:
        "This is not passive income. It requires outreach, testing, client communication and responsibility for a business-critical workflow.",
    },
    whyNow:
      "Voice-AI tooling has matured and clinics are actively searching for staffing alternatives, creating a window for early setup specialists.",
    evidence: {
      scoreBreakdown: [
        { label: "Buyer demand", points: 23 },
        { label: "Problem urgency", points: 22 },
        { label: "Ease of testing", points: 18 },
        { label: "Competition outlook", points: 15 },
        { label: "Evidence quality", points: 13 },
      ],
      sources: [
        {
          title: "Freelance marketplace demand",
          sourceType: "Marketplace data",
          published: "2024-11-02",
          description:
            "Shows rising number of client posts requesting voice-AI receptionist setups for small clinics.",
          confidence: "high",
        },
        {
          title: "Small-business interviews",
          sourceType: "Qualitative interviews",
          published: "2024-10-18",
          description:
            "Clinic owners describe missed calls and reception costs as a recurring pain point worth paying to fix.",
          confidence: "high",
        },
        {
          title: "Search-interest movement",
          sourceType: "Search trend data",
          published: "2024-11-10",
          description:
            'Search interest for "AI receptionist for clinics" has trended upward over the past two quarters.',
          confidence: "medium",
        },
        {
          title: "Software adoption reports",
          sourceType: "Industry report",
          published: "2024-09-27",
          description:
            "Voice-AI platform adoption among clinics is documented as growing, supporting sustained demand.",
          confidence: "medium",
        },
        {
          title: "Public case studies",
          sourceType: "Case study review",
          published: "2024-08-14",
          description:
            "A handful of published case studies describe pricing ranges but sample sizes remain small.",
          confidence: "low",
        },
      ],
      supported: [
        "Businesses can lose bookings from missed calls",
        "Voice systems can answer common questions",
        "Setup and management require specialist work",
      ],
      notProven: [
        "Every clinic will buy",
        "The service is effortless",
        "Any income amount is guaranteed",
        "Competition will remain low",
      ],
    },
    howToStart:
      "Pick one voice-AI provider, build a demo flow, then reach out to five local clinics offering a free trial setup.",
    risksDetail:
      "Clinics depend on uptime for patient bookings, so outages or misconfigurations carry real reputational and financial consequences.",
    testPlan: {
      estimatedSpend: "£18–£60",
      estimatedTime: "8–11 hours",
      successThreshold:
        "Continue testing if you receive at least three interested replies or one discovery call from 20 targeted contacts.",
      days: [
        {
          day: 1,
          task: "Choose one clinic type and research its missed-call problems.",
          estimatedTime: "~1 hour",
          tags: ["Google search", "Notes app"],
        },
        {
          day: 2,
          task: "Write a clear offer focused on booked appointments rather than AI technology.",
          estimatedTime: "~1 hour",
          tags: ["Docs", "Competitor offers"],
        },
        {
          day: 3,
          task: "Build a fictional demonstration using sample business information.",
          estimatedTime: "~2 hours",
          tags: ["Voice-AI trial", "Calendar tool"],
        },
        {
          day: 4,
          task: "Find 20 relevant local businesses.",
          estimatedTime: "~1.5 hours",
          tags: ["Google Maps", "Spreadsheet"],
        },
        {
          day: 5,
          task: "Contact the first 10 businesses.",
          estimatedTime: "~1.5 hours",
          tags: ["Email", "Phone"],
        },
        {
          day: 6,
          task: "Improve the message and contact the next 10.",
          estimatedTime: "~1.5 hours",
          tags: ["Email", "Phone"],
        },
        {
          day: 7,
          task: "Review replies, objections and genuine interest.",
          estimatedTime: "~1 hour",
          tags: ["Spreadsheet", "CRM notes"],
        },
      ],
    },
  },
  {
    slug: "short-form-video-estate-agents",
    title: "Short-form video packages for estate agents",
    shortDescription:
      "Package short-form video content for estate agents on a recurring monthly basis.",
    category: "Content & Video",
    difficulty: "Some experience helpful",
    signalScore: 86,
    evidenceStrength: { label: "Strong evidence", tone: "accent" },
    costToStart: "£0–£50",
    startupCostMin: 0,
    timeToTest: "7-day test plan",
    estimatedTestHours: 9,
    firstIncomeWindow: "1–3 weeks",
    competition: { label: "Medium competition", tone: "warning" },
    risk: { label: "Low risk", tone: "info" },
    recurringIncomePotential: "Medium",
    skillFit: "Video editing",
    location: "United Kingdom",
    deliveryMode: "Online and local delivery",
    updatedLabel: "Illustrative sample",
    updatedMinutesAgo: 120,
    sparkline: [24, 22, 15, 14, 6, 4],
    overview: {
      whatPeopleAreDoing:
        "Editors package walkthrough clips, local-area highlights and agent intros into a recurring short-form video subscription for estate agents.",
      whyClientsPay: [
        "Listings with video get more enquiries than photos alone",
        "Most agents have no time or editing skill in-house",
        "Short-form platforms reward consistent posting",
        "A monthly package is easier to budget than one-off jobs",
      ],
      pricing: {
        setupFee: "£0–£100",
        monthlySupport: "£150–£400",
        note: "Filming equipment usually already owned by the editor",
      },
      realityCheck:
        "Consistent output matters more than a single great video — agents pay for a reliable monthly package, not one clip.",
    },
    whyNow:
      "Short-form video platforms are the fastest-growing discovery channel for local services, and most agents still don't have a content routine.",
    evidence: {
      scoreBreakdown: [
        { label: "Buyer demand", points: 20 },
        { label: "Problem urgency", points: 19 },
        { label: "Ease of testing", points: 17 },
        { label: "Competition outlook", points: 16 },
        { label: "Evidence quality", points: 14 },
      ],
      sources: [
        {
          title: "Estate agency social posts",
          sourceType: "Social listening",
          published: "2024-10-30",
          description:
            "A growing share of estate agent accounts are posting short-form video weekly, up from a low base.",
          confidence: "high",
        },
        {
          title: "Agent interviews",
          sourceType: "Qualitative interviews",
          published: "2024-09-22",
          description:
            "Independent agents describe wanting video content but not having time to film or edit it themselves.",
          confidence: "high",
        },
        {
          title: "Freelance listing volume",
          sourceType: "Marketplace data",
          published: "2024-11-05",
          description:
            "Freelance postings for property video editing have increased over recent months.",
          confidence: "medium",
        },
      ],
      supported: [
        "Agents want more video but lack editing time",
        "Recurring packages are easier to sell than one-off edits",
        "Short-form platforms currently reward consistent posting",
      ],
      notProven: [
        "Every listing needs video to sell",
        "Views translate directly into enquiries",
        "This income scales without more of your own time",
      ],
    },
    howToStart:
      "Offer one local agent a free first edit from footage they already have, then propose a monthly package based on the response.",
    risksDetail:
      "Platform algorithms and formats change quickly, so a package built around one platform's style may need reworking later.",
    testPlan: {
      estimatedSpend: "£0–£50",
      estimatedTime: "6–9 hours",
      successThreshold:
        "Continue testing if one agent agrees to a paid trial month after seeing your first free edit.",
      days: [
        {
          day: 1,
          task: "Pick a local area and shortlist 10 independent estate agents.",
          estimatedTime: "~1 hour",
          tags: ["Google Maps", "Spreadsheet"],
        },
        {
          day: 2,
          task: "Draft a simple one-page package offer with sample pricing.",
          estimatedTime: "~1 hour",
          tags: ["Docs"],
        },
        {
          day: 3,
          task: "Ask one agent for existing raw footage or photos to edit for free.",
          estimatedTime: "~1 hour",
          tags: ["Email", "Phone"],
        },
        {
          day: 4,
          task: "Edit the first sample video in the agent's brand style.",
          estimatedTime: "~2 hours",
          tags: ["Video editor"],
        },
        {
          day: 5,
          task: "Deliver the sample and ask for feedback on posting it.",
          estimatedTime: "~1 hour",
          tags: ["Email"],
        },
        {
          day: 6,
          task: "Contact the remaining 9 shortlisted agents with the sample as proof.",
          estimatedTime: "~1.5 hours",
          tags: ["Email", "Phone"],
        },
        {
          day: 7,
          task: "Review interest and propose a paid monthly package to anyone engaged.",
          estimatedTime: "~1 hour",
          tags: ["Spreadsheet"],
        },
      ],
    },
  },
  {
    slug: "booking-websites-beauty-professionals",
    title: "Booking websites for beauty professionals",
    shortDescription:
      "Build simple booking websites for independent beauty professionals still relying on DMs.",
    category: "Web Development",
    difficulty: "Advanced",
    signalScore: 82,
    evidenceStrength: { label: "Growing signal", tone: "info" },
    costToStart: "£0–£40",
    startupCostMin: 0,
    timeToTest: "7-day test plan",
    estimatedTestHours: 10,
    firstIncomeWindow: "1–3 weeks",
    competition: { label: "Medium competition", tone: "warning" },
    risk: { label: "Medium risk", tone: "warning" },
    recurringIncomePotential: "Medium",
    skillFit: "Web development",
    location: "United Kingdom",
    deliveryMode: "Online and local delivery",
    updatedLabel: "Illustrative sample",
    updatedMinutesAgo: 180,
    sparkline: [10, 10, 11, 12, 12, 13],
    overview: {
      whatPeopleAreDoing:
        "Developers build simple one-page booking websites for independent beauty professionals (nails, hair, lashes, massage) who currently rely on messaging apps to take bookings.",
      whyClientsPay: [
        "Manual back-and-forth booking wastes time and loses clients",
        "A booking link looks more professional to new clients",
        "Most competitors in this niche use generic templates",
        "A working site can pay for itself in a handful of avoided no-shows",
      ],
      pricing: {
        setupFee: "£150–£400",
        monthlySupport: "£15–£40",
        note: "Booking/calendar tooling usually billed separately by its provider",
      },
      realityCheck:
        "The build is the easy part — most of the work is getting a first independent professional to trust a newcomer with their bookings.",
    },
    whyNow:
      "More sole-trader beauty professionals are moving off Instagram DMs for booking as client volume grows past what messaging can handle.",
    evidence: {
      scoreBreakdown: [
        { label: "Buyer demand", points: 19 },
        { label: "Problem urgency", points: 17 },
        { label: "Ease of testing", points: 16 },
        { label: "Competition outlook", points: 15 },
        { label: "Evidence quality", points: 15 },
      ],
      sources: [
        {
          title: "Beauty professional interviews",
          sourceType: "Qualitative interviews",
          published: "2024-09-12",
          description:
            "Independent professionals describe losing time and occasional bookings to slow DM back-and-forth.",
          confidence: "high",
        },
        {
          title: "Booking tool adoption",
          sourceType: "Industry report",
          published: "2024-10-02",
          description:
            "Adoption of standalone booking tools among sole traders is documented as steadily increasing.",
          confidence: "medium",
        },
        {
          title: "Local directory listings",
          sourceType: "Directory data",
          published: "2024-08-20",
          description:
            "A large share of local beauty listings still show no website, only a social profile.",
          confidence: "medium",
        },
      ],
      supported: [
        "Manual DM booking is a genuine time cost for busy professionals",
        "A basic booking site is inexpensive to build and host",
        "Many local professionals currently have no website at all",
      ],
      notProven: [
        "A website alone guarantees more clients",
        "Every professional will switch away from DMs",
        "Pricing power stays this low as the niche gets more competitive",
      ],
    },
    howToStart:
      "Build one demo site for a fictional salon, then offer it free to one real local professional in exchange for a testimonial.",
    risksDetail:
      "Ongoing support requests (small edits, password resets) can eat into the time saved unless expectations are set clearly upfront.",
    testPlan: {
      estimatedSpend: "£0–£40",
      estimatedTime: "7–10 hours",
      successThreshold:
        "Continue testing if one professional agrees to actually switch their bookings to the new site during the trial.",
      days: [
        {
          day: 1,
          task: "Shortlist 15 local beauty professionals without an existing website.",
          estimatedTime: "~1.5 hours",
          tags: ["Google Maps", "Instagram"],
        },
        {
          day: 2,
          task: "Build one reusable booking-site template.",
          estimatedTime: "~2.5 hours",
          tags: ["Code editor"],
        },
        {
          day: 3,
          task: "Personalise the template with real details for one shortlisted professional.",
          estimatedTime: "~1.5 hours",
          tags: ["Code editor"],
        },
        {
          day: 4,
          task: "Offer the finished demo to that professional for feedback.",
          estimatedTime: "~1 hour",
          tags: ["Email", "Instagram DM"],
        },
        {
          day: 5,
          task: "Adjust based on feedback and confirm a plan to go live.",
          estimatedTime: "~1 hour",
          tags: ["Code editor"],
        },
        {
          day: 6,
          task: "Contact 5 more shortlisted professionals using the live example.",
          estimatedTime: "~1 hour",
          tags: ["Email", "Instagram DM"],
        },
        {
          day: 7,
          task: "Review replies and note who is ready to commit.",
          estimatedTime: "~1 hour",
          tags: ["Spreadsheet"],
        },
      ],
    },
  },
  {
    slug: "google-business-profile-tradespeople",
    title: "Google Business Profile improvement for tradespeople",
    shortDescription:
      "Audit and improve local tradespeople's Google Business Profiles for ongoing pay.",
    category: "Local Marketing",
    difficulty: "Beginner friendly",
    signalScore: 78,
    evidenceStrength: { label: "Growing signal", tone: "info" },
    costToStart: "£0",
    startupCostMin: 0,
    timeToTest: "7-day test plan",
    estimatedTestHours: 7,
    firstIncomeWindow: "1–2 weeks",
    competition: { label: "Low local competition", tone: "accent" },
    risk: { label: "Low risk", tone: "info" },
    recurringIncomePotential: "Medium",
    skillFit: "Local SEO",
    location: "United Kingdom",
    deliveryMode: "Local delivery",
    updatedLabel: "Illustrative sample",
    updatedMinutesAgo: 300,
    sparkline: [10, 12, 11, 14, 16, 18],
    overview: {
      whatPeopleAreDoing:
        "Freelancers audit and improve local tradespeople's Google Business Profiles — photos, categories, service areas, review replies — then offer ongoing monthly upkeep.",
      whyClientsPay: [
        "Most tradespeople set their profile up once and never touch it again",
        "A stronger profile can mean more calls without any ad spend",
        "Reviews and updates take time tradespeople don't have between jobs",
        "Local search visibility compounds the longer a profile is maintained",
      ],
      pricing: {
        setupFee: "£0–£150",
        monthlySupport: "£25–£75",
        note: "No paid advertising involved — this is unpaid ('organic') local search only",
      },
      realityCheck:
        "Google's local ranking factors are not published, so results vary by trade and area — this is steady maintenance work, not a guaranteed ranking hack.",
    },
    whyNow:
      "Search behaviour for local trades increasingly starts and ends on the map pack, and most tradespeople's profiles are still incomplete.",
    evidence: {
      scoreBreakdown: [
        { label: "Buyer demand", points: 18 },
        { label: "Problem urgency", points: 16 },
        { label: "Ease of testing", points: 17 },
        { label: "Competition outlook", points: 15 },
        { label: "Evidence quality", points: 12 },
      ],
      sources: [
        {
          title: "Local profile completeness audit",
          sourceType: "Directory data",
          published: "2024-10-11",
          description:
            "A sample review of local tradesperson profiles found most missing photos, categories, or regular posts.",
          confidence: "high",
        },
        {
          title: "Tradesperson interviews",
          sourceType: "Qualitative interviews",
          published: "2024-09-29",
          description:
            "Tradespeople describe relying on word-of-mouth and being unaware their online profile needs upkeep.",
          confidence: "medium",
        },
        {
          title: "Local search visibility report",
          sourceType: "Industry report",
          published: "2024-08-30",
          description:
            "Reports describe map-pack visibility as a growing share of how local service businesses are found.",
          confidence: "medium",
        },
      ],
      supported: [
        "Many local profiles are genuinely incomplete or outdated",
        "Maintaining a profile takes recurring, low-skill time",
        "This work requires no paid ad spend to deliver",
      ],
      notProven: [
        "A specific ranking position can be promised",
        "Results are the same across every trade and area",
        "More calls always convert into paid jobs",
      ],
    },
    howToStart:
      "Audit one local tradesperson's profile for free, list three concrete improvements, and offer to implement them as a paid trial month.",
    risksDetail:
      "Google can change how local profiles and rankings work at any time, which can affect outcomes independent of the work done.",
    testPlan: {
      estimatedSpend: "£0",
      estimatedTime: "5–7 hours",
      successThreshold:
        "Continue testing if one tradesperson agrees to a paid month after seeing your free audit.",
      days: [
        {
          day: 1,
          task: "Shortlist 15 local tradespeople and screenshot their current profiles.",
          estimatedTime: "~1 hour",
          tags: ["Google Maps", "Spreadsheet"],
        },
        {
          day: 2,
          task: "Write a short free-audit template covering photos, categories and reviews.",
          estimatedTime: "~1 hour",
          tags: ["Docs"],
        },
        {
          day: 3,
          task: "Complete free audits for 5 shortlisted tradespeople.",
          estimatedTime: "~1.5 hours",
          tags: ["Google Business Profile"],
        },
        {
          day: 4,
          task: "Send the free audits with three concrete next steps each.",
          estimatedTime: "~1 hour",
          tags: ["Email", "Phone"],
        },
        {
          day: 5,
          task: "Follow up with anyone who opened or replied.",
          estimatedTime: "~1 hour",
          tags: ["Email", "Phone"],
        },
        {
          day: 6,
          task: "Implement the agreed changes for the first paying client.",
          estimatedTime: "~1.5 hours",
          tags: ["Google Business Profile"],
        },
        {
          day: 7,
          task: "Confirm the ongoing monthly arrangement and note early results.",
          estimatedTime: "~1 hour",
          tags: ["Spreadsheet"],
        },
      ],
    },
  },
  {
    slug: "social-media-repurposing",
    title: "Social-media content repurposing",
    shortDescription:
      "Turn existing long-form recordings into short clips for busy business owners.",
    category: "Content & Video",
    difficulty: "Some experience helpful",
    signalScore: 75,
    evidenceStrength: { label: "Growing signal", tone: "info" },
    costToStart: "£0",
    startupCostMin: 0,
    timeToTest: "7-day test plan",
    estimatedTestHours: 8,
    firstIncomeWindow: "1–3 weeks",
    competition: { label: "Medium competition", tone: "warning" },
    risk: { label: "Low risk", tone: "info" },
    recurringIncomePotential: "Medium",
    skillFit: "Video editing",
    location: "Worldwide",
    deliveryMode: "Online delivery",
    updatedLabel: "Illustrative sample",
    updatedMinutesAgo: 360,
    sparkline: [12, 13, 15, 16, 19, 21],
    overview: {
      whatPeopleAreDoing:
        "Editors take a business owner's existing long-form content (podcasts, webinars, livestreams) and cut it into short clips for their social channels, on a recurring monthly basis.",
      whyClientsPay: [
        "Business owners already have long-form content sitting unused",
        "Cutting clips consistently takes time most owners don't have",
        "Short clips can be posted across several platforms from one source",
        "It's lower-risk for the client than filming brand-new content",
      ],
      pricing: {
        setupFee: "£0",
        monthlySupport: "£100–£300",
        note: "Volume of source content and clip count both affect pricing",
      },
      realityCheck:
        "Clients pay for a reliable weekly batch of clips, not a single viral moment — consistency is the actual product being sold.",
    },
    whyNow:
      "More independent creators and small businesses now run podcasts or webinars but still lack a repeatable way to turn that into daily social content.",
    evidence: {
      scoreBreakdown: [
        { label: "Buyer demand", points: 17 },
        { label: "Problem urgency", points: 15 },
        { label: "Ease of testing", points: 16 },
        { label: "Competition outlook", points: 14 },
        { label: "Evidence quality", points: 13 },
      ],
      sources: [
        {
          title: "Creator services demand",
          sourceType: "Marketplace data",
          published: "2024-10-24",
          description:
            "Freelance postings for repurposing long-form video into short clips have grown over recent quarters.",
          confidence: "medium",
        },
        {
          title: "Small-business owner interviews",
          sourceType: "Qualitative interviews",
          published: "2024-09-15",
          description:
            "Owners running podcasts or webinars describe wanting more clips but not having editing time themselves.",
          confidence: "medium",
        },
        {
          title: "Platform format trends",
          sourceType: "Industry report",
          published: "2024-11-01",
          description:
            "Short-form clip formats remain a heavily promoted format across major platforms.",
          confidence: "medium",
        },
      ],
      supported: [
        "Plenty of usable source content already exists for most clients",
        "Editing time is a genuine bottleneck for busy owners",
        "One source recording can produce many clips",
      ],
      notProven: [
        "Clips will reliably go viral",
        "Every business has enough source content to repurpose",
        "Engagement translates directly into new customers",
      ],
    },
    howToStart:
      "Offer to repurpose one existing recording for free for a business owner you already know, then propose a recurring package based on the result.",
    risksDetail:
      "Without a steady supply of fresh source content from the client, the recurring package runs out of material to work with.",
    testPlan: {
      estimatedSpend: "£0",
      estimatedTime: "6–8 hours",
      successThreshold:
        "Continue testing if one business owner agrees to a paid monthly package after seeing your sample clips.",
      days: [
        {
          day: 1,
          task: "List 10 small businesses or creators who already publish long-form content.",
          estimatedTime: "~1 hour",
          tags: ["Social media", "Spreadsheet"],
        },
        {
          day: 2,
          task: "Ask one contact for a recent recording to repurpose for free.",
          estimatedTime: "~1 hour",
          tags: ["Email", "DM"],
        },
        {
          day: 3,
          task: "Cut 3–5 sample clips from that recording.",
          estimatedTime: "~2 hours",
          tags: ["Video editor"],
        },
        {
          day: 4,
          task: "Deliver the sample clips and ask for feedback.",
          estimatedTime: "~1 hour",
          tags: ["Email", "DM"],
        },
        {
          day: 5,
          task: "Draft a simple recurring package offer based on the response.",
          estimatedTime: "~1 hour",
          tags: ["Docs"],
        },
        {
          day: 6,
          task: "Contact the remaining 9 shortlisted businesses with the samples as proof.",
          estimatedTime: "~1 hour",
          tags: ["Email", "DM"],
        },
        {
          day: 7,
          task: "Review interest and confirm terms with anyone ready to commit.",
          estimatedTime: "~1 hour",
          tags: ["Spreadsheet"],
        },
      ],
    },
  },
  {
    slug: "ai-prompt-packs-professional-niche",
    title: "AI prompt packs for a professional niche",
    shortDescription:
      "Package AI prompts for a professional niche — an oversaturated market worth checking first.",
    category: "AI & Automation",
    difficulty: "Beginner friendly",
    signalScore: 39,
    evidenceStrength: { label: "Mostly hype", tone: "danger" },
    costToStart: "£0",
    startupCostMin: 0,
    timeToTest: "7-day test plan",
    estimatedTestHours: 6,
    firstIncomeWindow: "Unclear",
    competition: { label: "Very high competition", tone: "danger" },
    risk: { label: "High risk", tone: "danger" },
    recurringIncomePotential: "Low",
    skillFit: "Writing / prompt design",
    location: "Worldwide",
    deliveryMode: "Online delivery",
    updatedLabel: "Illustrative sample",
    updatedMinutesAgo: 1440,
    sparkline: [8, 10, 14, 16, 20, 24],
    overview: {
      whatPeopleAreDoing:
        "Sellers package sets of AI chatbot prompts for a specific profession (e.g. recruiters, teachers) and sell them as a one-off digital download.",
      whyClientsPay: [
        "Some professionals want a shortcut instead of learning prompting themselves",
        "A niche-specific pack feels more relevant than generic examples",
        "Digital downloads are cheap to buy on impulse",
        "Marketplaces make these packs easy to list quickly",
      ],
      pricing: {
        setupFee: "£0",
        monthlySupport: "£0",
        note: "Typically sold as a one-off download, not a subscription",
      },
      realityCheck:
        "This market is extremely crowded and prices have fallen sharply — most sellers report low, inconsistent sales rather than steady income.",
    },
    whyNow:
      "General-purpose chatbots are now everyday tools, but that same accessibility means anyone can write and sell a similar pack in an afternoon.",
    evidence: {
      scoreBreakdown: [
        { label: "Buyer demand", points: 9 },
        { label: "Problem urgency", points: 7 },
        { label: "Ease of testing", points: 10 },
        { label: "Competition outlook", points: 5 },
        { label: "Evidence quality", points: 8 },
      ],
      sources: [
        {
          title: "Digital marketplace listings",
          sourceType: "Marketplace data",
          published: "2024-10-05",
          description:
            "Listings for prompt packs have multiplied rapidly, with most new listings showing few or no sales.",
          confidence: "medium",
        },
        {
          title: "Seller forum discussions",
          sourceType: "Community discussion",
          published: "2024-09-18",
          description:
            "Sellers commonly describe prompt packs as saturated, with heavy price competition and thin margins.",
          confidence: "low",
        },
      ],
      supported: [
        "Chatbot prompting has become mainstream and widely known",
        "Digital packs are simple and cheap to produce",
      ],
      notProven: [
        "This niche has room for many more sellers",
        "A single pack can generate steady, repeatable income",
        "Buyers can't get equivalent prompts for free elsewhere",
      ],
    },
    howToStart:
      "Before building anything, search existing marketplaces for your intended niche to see how saturated it already is.",
    risksDetail:
      "Because prompts themselves aren't protectable, a pack can be copied or replicated almost immediately by a competitor.",
    testPlan: {
      estimatedSpend: "£0",
      estimatedTime: "4–6 hours",
      successThreshold:
        "Only keep going past day 3 if you find a genuinely underserved niche — for most niches, the evidence here says stop.",
      days: [
        {
          day: 1,
          task: "Search marketplaces for prompt packs in your intended niche.",
          estimatedTime: "~1 hour",
          tags: ["Marketplace search"],
        },
        {
          day: 2,
          task: "Note how many similar listings exist and their typical price and reviews.",
          estimatedTime: "~1 hour",
          tags: ["Spreadsheet"],
        },
        {
          day: 3,
          task: "Decide honestly whether a genuine gap exists before writing anything.",
          estimatedTime: "~30 minutes",
          tags: ["Notes app"],
        },
        {
          day: 4,
          task: "If a real gap exists, draft one small sample prompt for that niche only.",
          estimatedTime: "~1 hour",
          tags: ["Notes app"],
        },
        {
          day: 5,
          task: "Show the sample to one person from that profession and ask if they'd pay for it.",
          estimatedTime: "~30 minutes",
          tags: ["Email", "DM"],
        },
        {
          day: 6,
          task: "If the reaction is lukewarm, stop here rather than building the full pack.",
          estimatedTime: "~30 minutes",
          tags: ["Notes app"],
        },
        {
          day: 7,
          task: "Only if response was clearly positive, list a small first version to test real demand.",
          estimatedTime: "~1 hour",
          tags: ["Marketplace listing"],
        },
      ],
    },
  },
];

export function getOpportunityBySlug(slug: string): Opportunity | undefined {
  return opportunities.find((o) => o.slug === slug);
}

/** Distinct categories present in the data, in first-seen order. */
export function getCategories(): string[] {
  return Array.from(new Set(opportunities.map((o) => o.category)));
}

export type CostBucket = "£0" | "Under £50" | "£50+";
export const COST_BUCKETS: CostBucket[] = ["£0", "Under £50", "£50+"];

export function getCostBucket(startupCostMin: number): CostBucket {
  if (startupCostMin <= 0) return "£0";
  if (startupCostMin < 50) return "Under £50";
  return "£50+";
}
