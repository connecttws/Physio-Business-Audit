export interface PatientDetails {
  name: string;
  phone?: string;
  whatsappNumber?: string;
  age?: string;
  occupation?: string;
  track: string;
  auditorName?: string;
  date?: string;
}

export interface QuestionOption {
  text: string;
  val: number;
  flag: string | null;
}

export interface Question {
  id: string;
  label: string;
  sub: string;
  options: QuestionOption[];
}

export interface ClinicalTrack {
  id: string;
  title: string;
  badge: string;
  iconName: string;
  radarPillars: string[];
  questions: Question[];
}

export interface PillarScore {
  name: string;
  score: number;
  target: number;
  status: "optimal" | "moderate" | "critical";
  description?: string;
}

export interface DangerCard {
  title: string;
  description: string;
}

export interface RehabPhase {
  phase: string;
  sessions: string;
  title: string;
  color: string;
  items: string[];
}

export interface PhysioAuditRecord {
  id: string;
  createdAt: string;
  patient: PatientDetails;
  trackId: string;
  trackTitle: string;
  trackBadge: string;
  redFlag: "safe" | "alert";
  pastHistory: "pills_heat" | "short_physio" | "first_time";
  answers: Record<string, number>; // questionId -> optionIndex
  flags: string[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: {
    title: string;
    level: "optimal" | "moderate" | "severe";
    color: string;
    summary: string;
  };
  pillars: PillarScore[];
  rehabProtocol: RehabPhase[];
  consultationScript: string;
}

export interface UniversalOption {
  value: string;
  label: string;
  subtext: string;
  isAlert?: boolean;
}

export interface UniversalQuestion {
  id: string;
  title: string;
  description: string;
  options: UniversalOption[];
}

export const UNIVERSAL_QUESTIONS: UniversalQuestion[] = [
  {
    id: "u_redflag",
    title: "1. Neurological Red Flag Screen",
    description: "Screening for severe spinal nerve / neurological involvement requiring medical alert",
    options: [
      {
        value: "safe",
        label: "Safe for Active Rehab",
        subtext: "Pain is localized musculoskeletal stiffness, joint catch, or postural fatigue. No numbness in groin or loss of motor control.",
        isAlert: false,
      },
      {
        value: "alert",
        label: "Medical Alert (Neurological Flag)",
        subtext: "Numbness in groin/saddle area, loss of bowel/bladder control, or progressive foot drop / sudden hand paralysis.",
        isAlert: true,
      },
    ],
  },
  {
    id: "u_past",
    title: "2. Prior Treatment & Intervention History",
    description: "Understanding previous interventions and why relief was temporary",
    options: [
      {
        value: "pills_heat",
        label: "Passive Modalities Only",
        subtext: "Relied on painkiller pills, hot water bags, pain relief sprays, or massage (only masks pain nerve signals).",
      },
      {
        value: "short_physio",
        label: "Short Passive Machine Therapy",
        subtext: "Did 2–5 electrical machine sessions (TENS, IFT, Ultrasound), but pain returned once sessions stopped.",
      },
      {
        value: "first_time",
        label: "First Clinical Assessment",
        subtext: "First time seeking a structured biomechanical evaluation and active corrective rehabilitation.",
      },
    ],
  },
];

export const TRACK_DATA: Record<string, ClinicalTrack> = {
  lumbar: {
    id: "lumbar",
    title: "Lower Back & Sciatic Nerve Screen",
    badge: "Lower Back & Sciatica",
    iconName: "Activity",
    radarPillars: ["Disc Clearance", "Pelvic Tilt", "Glute Activation", "Flexion Tolerance", "Nerve Pathway"],
    questions: [
      {
        id: "q_rad",
        label: "1. Sciatic Nerve Shooting Pain",
        sub: "Does pain stay in your back, or shoot down your glute, hamstring, or foot?",
        options: [
          { text: "Sharp electric shooting pain radiating down below the knee (Nerve root compression)", val: 10, flag: "Severe Sciatic Nerve Compression" },
          { text: "Ache radiates into the buttock or upper thigh, but stops at the knee", val: 30, flag: "Referred Sacroiliac / Gluteal Strain" },
          { text: "Localized only in lower back with no leg radiation", val: 50, flag: null },
        ],
      },
      {
        id: "q_flex",
        label: "2. Forward Bending & Shoe Tying Catch",
        sub: "What happens when you bend forward to brush teeth or tie shoelaces?",
        options: [
          { text: "Sharp catch/spasm in lower back; cannot bend forward without holding knees", val: 10, flag: "Lumbar Disc Flexion Intolerance" },
          { text: "Mild stiffness; takes 15 seconds to stand back up straight", val: 30, flag: null },
          { text: "Completely smooth forward bend with zero hesitation", val: 50, flag: null },
        ],
      },
      {
        id: "q_morn",
        label: "3. Morning Bed Stiffness (Disc Turgor)",
        sub: "How does your spine feel during the first 20 minutes after waking up?",
        options: [
          { text: "Extremely stiff like a wooden plank; need hot water or walking to unlock", val: 15, flag: "High Morning Disc Turgor Pressure" },
          { text: "Mild morning tightness for 5 minutes, then loosens up", val: 35, flag: null },
          { text: "Wake up completely loose and agile", val: 50, flag: null },
        ],
      },
      {
        id: "q_desk",
        label: "4. Prolonged Seated Desk Lock (Glute Amnesia)",
        sub: "What happens when you stand up after sitting at a desk for 2 hours?",
        options: [
          { text: "Cannot stand straight immediately; hips feel locked and lower back aches", val: 15, flag: "Glute Amnesia & Psoas Hip Contracture" },
          { text: "Feel sluggish and need to stretch out my lower back", val: 30, flag: null },
          { text: "Stand up effortlessly with zero spinal ache", val: 50, flag: null },
        ],
      },
      {
        id: "q_arch",
        label: "5. Standing Extension & Walking Tolerance",
        sub: "Does walking or standing for 20+ minutes cause a deep burning ache across your lower back?",
        options: [
          { text: "Yes, I must sit down or lean forward on a trolley to relieve the ache", val: 15, flag: "Facet Joint Jamming & Spinal Stenosis Drag" },
          { text: "Occasional fatigue when standing for over an hour", val: 35, flag: null },
          { text: "Can walk and stand for hours with zero lumbar discomfort", val: 50, flag: null },
        ],
      },
      {
        id: "q_cough",
        label: "6. Coughing / Sneezing Jolts (Valsalva)",
        sub: "When you cough, sneeze, or strain, does a sharp jolt shoot into your lower back?",
        options: [
          { text: "Yes, sudden sneezes trigger a painful jolt into spine/hips", val: 10, flag: "Positive Valsalva Disc Pressure Flag" },
          { text: "Rarely, only when coughing violently with bad posture", val: 30, flag: null },
          { text: "No, coughing or sneezing has zero effect on my back", val: 50, flag: null },
        ],
      },
    ],
  },
  cervical: {
    id: "cervical",
    title: "Cervical Spine, Tech-Neck & Headaches",
    badge: "Cervical & Tech-Neck",
    iconName: "Headphones",
    radarPillars: ["Cervical Curve", "Trapezius Tone", "Headache Severity", "Finger Sensation", "Head Rotation"],
    questions: [
      {
        id: "q_c1",
        label: "1. Finger Numbness & Tingling (Radiculopathy)",
        sub: "Do you experience pins-and-needles, numbness, or tingling down into your hands or fingers?",
        options: [
          { text: "Frequent tingling or electric sensation in thumb/index/pinky fingers while typing or sleeping", val: 10, flag: "Cervical Nerve Root Compression" },
          { text: "Ache radiates to shoulder blade only, no finger numbness", val: 30, flag: "Periscapular Trapezius Trigger Point" },
          { text: "Pain stays localized strictly in neck muscles", val: 50, flag: null },
        ],
      },
      {
        id: "q_c2",
        label: "2. Cervicogenic Headaches Behind the Eyes",
        sub: "Does neck stiffness trigger throbbing headaches rising from the base of the skull?",
        options: [
          { text: "Frequent tension headaches behind the eyes or temples after 3 PM screen work", val: 15, flag: "Suboccipital Tension & Cervicogenic Headaches" },
          { text: "Occasional dull heaviness in forehead when stressed", val: 30, flag: null },
          { text: "Zero headaches; head feels clear all day", val: 50, flag: null },
        ],
      },
      {
        id: "q_c3",
        label: "3. Driving & Shoulder Blind Spot Checks",
        sub: "Can you turn your head fully 85° to look over your shoulder without twisting your whole torso?",
        options: [
          { text: "Neck is locked; sharp pinch prevents looking over shoulder while driving/reversing", val: 15, flag: "C1-C2 Atlantoaxial Rotational Lock" },
          { text: "Can rotate, but feels stiff and pulls uncomfortably on trapezius", val: 30, flag: null },
          { text: "Full, smooth 85° rotation on both sides without restriction", val: 50, flag: null },
        ],
      },
      {
        id: "q_c4",
        label: "4. Trapezius 'Stone Knot' Spasms",
        sub: "How do your upper shoulder muscles (trapezius) feel when pressed with fingers?",
        options: [
          { text: "Rock hard like concrete; tender to the touch with active painful trigger knots", val: 15, flag: "Chronic Levator Scapulae & Trapezius Spasm" },
          { text: "Firm and tight after a long workday, but loosens with hot shower", val: 30, flag: null },
          { text: "Soft, supple, and relaxed with zero tender points", val: 50, flag: null },
        ],
      },
      {
        id: "q_c5",
        label: "5. Forward Head Carriage & Screen Posture",
        sub: "Do you catch yourself chin-poking forward towards monitors or looking down at phones for 6+ hours?",
        options: [
          { text: "Yes, prominent forward head posture and developing 'dowager hump' behind neck", val: 15, flag: "Severe Tech-Neck Gravitational Shear" },
          { text: "Notice slouching when tired, but can pull head back with effort", val: 35, flag: null },
          { text: "Ergonomic monitor at eye level; ears aligned over shoulders", val: 50, flag: null },
        ],
      },
      {
        id: "q_c6",
        label: "6. Pillow & Night Sleep Disturbance",
        sub: "Do you constantly struggle to find a comfortable pillow height because of neck ache?",
        options: [
          { text: "Wake up frequently during the night due to neck stiffness or arm falling asleep", val: 10, flag: "Sleep Ergonomics & Cervical Facet Irritation" },
          { text: "Wake up slightly stiff if sleeping on an awkward pillow", val: 30, flag: null },
          { text: "Sleep peacefully with zero neck discomfort", val: 50, flag: null },
        ],
      },
    ],
  },
  knee: {
    id: "knee",
    title: "Knee Joint, Patella & Gait Dysfunction",
    badge: "Knee Joint & Patella",
    iconName: "Crosshair",
    radarPillars: ["Patellar Track", "Glute Medius", "Stair Shear", "Cartilage Cushion", "Gait Alignment"],
    questions: [
      {
        id: "q_k1",
        label: "1. Descending Stairs & Step Agony",
        sub: "How do your knees respond when walking DOWN stairs or steep slopes?",
        options: [
          { text: "Sharp stabbing ache under kneecap; must take steps one at a time sideways", val: 10, flag: "Patellofemoral Joint Shear & Cartilage Softening" },
          { text: "Dull ache or instability going down, but manageable", val: 30, flag: null },
          { text: "Walk down stairs swiftly with zero knee discomfort", val: 50, flag: null },
        ],
      },
      {
        id: "q_k2",
        label: "2. Crepitus (Sandpaper Grating Sounds)",
        sub: "Do your knees crunch, pop, or feel like sandpaper grinding when you squat or bend?",
        options: [
          { text: "Loud audible grinding, crunching, or grating accompanied by dull ache", val: 15, flag: "Severe Retropatellar Crepitus & Chondromalacia" },
          { text: "Pops occasionally without severe pain", val: 35, flag: null },
          { text: "Smooth, silent, lubricated joint movement", val: 50, flag: null },
        ],
      },
      {
        id: "q_k3",
        label: "3. 'Movie Theater Sign' (Prolonged Sitting Ache)",
        sub: "Does keeping your knees bent at 90° during car rides or movies cause a deep throbbing ache?",
        options: [
          { text: "Severe ache; I must straighten my knee out constantly to relieve pressure", val: 15, flag: "Positive Cinema Sign (Patellar Hyperpression)" },
          { text: "Slight stiffness after 2 hours of bent sitting", val: 30, flag: null },
          { text: "Can sit with bent knees for hours with zero pain", val: 50, flag: null },
        ],
      },
      {
        id: "q_k4",
        label: "4. Dynamic Knee Valgus (Inward Wobble)",
        sub: "When you squat or step up, do your knees shake or cave inwards towards each other?",
        options: [
          { text: "Knees collapse inwards noticeably (Weak hip abductors / gluteus medius)", val: 15, flag: "Dynamic Valgus Collapse & ACL/Meniscus Strain" },
          { text: "Slight inward drift only when lifting heavy weights or fatigued", val: 30, flag: null },
          { text: "Knees track straight over toes with rock-solid stability", val: 50, flag: null },
        ],
      },
      {
        id: "q_k5",
        label: "5. Joint Swelling & 'Giving Way' Sensations",
        sub: "Has your knee suddenly buckled, felt loose, or swelled with fluid after normal walks?",
        options: [
          { text: "Knee has buckled or felt unstable like it might give out underneath me", val: 10, flag: "Ligamentous Laxity & Meniscal Instability" },
          { text: "Puffy or warm after extended walks, but no giving way", val: 30, flag: null },
          { text: "Completely stable with zero swelling", val: 50, flag: null },
        ],
      },
      {
        id: "q_k6",
        label: "6. Squatting & Floor Sitting Ability",
        sub: "Can you perform a full deep squat or sit cross-legged on the floor comfortably?",
        options: [
          { text: "Impossible; severe pain prevents squatting past 60°", val: 15, flag: "End-Range Meniscal Horn Impingement" },
          { text: "Can squat with hands holding support for balance", val: 30, flag: null },
          { text: "Can sit cross-legged and deep squat with full mobility", val: 50, flag: null },
        ],
      },
    ],
  },
  shoulder: {
    id: "shoulder",
    title: "Shoulder Impingement & Rotator Cuff Screen",
    badge: "Shoulder & Rotator Cuff",
    iconName: "ShieldAlert",
    radarPillars: ["Subacromial Space", "Rotator Power", "Painful Arc", "Scapular Control", "Night Tolerance"],
    questions: [
      {
        id: "q_s1",
        label: "1. The Painful Arc (Reaching Overhead)",
        sub: "Do you experience a sharp pinch when lifting your arm sideways between 60° and 120°?",
        options: [
          { text: "Sharp painful pinch at mid-height; must twist shoulder to get arm overhead", val: 10, flag: "Subacromial Supraspinatus Impingement" },
          { text: "Dull ache at the very top of overhead reach", val: 30, flag: null },
          { text: "Full, smooth 180° arm elevation with zero pinching", val: 50, flag: null },
        ],
      },
      {
        id: "q_s2",
        label: "2. 3 AM Throbbing Night Pain",
        sub: "Can you sleep on the affected shoulder without waking up from a deep throbbing ache?",
        options: [
          { text: "Cannot sleep on that side; throbs and radiates down the outer upper arm", val: 10, flag: "Active Rotator Cuff Tendinopathy & Bursitis" },
          { text: "Slight discomfort when sleeping directly on the shoulder joint", val: 30, flag: null },
          { text: "Sleep peacefully on either side with zero shoulder pain", val: 50, flag: null },
        ],
      },
      {
        id: "q_s3",
        label: "3. Reaching Behind the Back (Internal Rotation)",
        sub: "Can you reach behind your back to tuck in a shirt, scratch your shoulder blade, or fasten a bra?",
        options: [
          { text: "Severely restricted; sharp pain stops hand at the belt line or pocket", val: 15, flag: "Posterior Capsule Tightness & Frozen Shoulder Risk" },
          { text: "Can reach, but feels tight and pulls into front shoulder", val: 35, flag: null },
          { text: "Effortlessly reach mid-back and touch shoulder blades", val: 50, flag: null },
        ],
      },
      {
        id: "q_s4",
        label: "4. Overhead Lifting & Putting Bags in Overhead Bins",
        sub: "How does your shoulder feel when lifting a 3–5 kg bag overhead into an airplane bin or high shelf?",
        options: [
          { text: "Arm feels weak and gives out; cannot hold weight overhead safely", val: 15, flag: "Rotator Cuff Dynamic Stabilizer Failure" },
          { text: "Can lift, but rely on shrugging neck and upper trapezius heavily", val: 30, flag: null },
          { text: "Press and stabilize weight overhead with full power", val: 50, flag: null },
        ],
      },
      {
        id: "q_s5",
        label: "5. Clicking, Popping & Clunking Sensations",
        sub: "Does moving your arm in circles produce audible pops or clunking in the shoulder blade?",
        options: [
          { text: "Frequent catching, popping, or clunking when moving arm forward or back", val: 15, flag: "Scapular Dyskinesis & Labral Friction" },
          { text: "Occasional painless clicks when cold", val: 35, flag: null },
          { text: "Smooth, silent, gliding shoulder blade movement", val: 50, flag: null },
        ],
      },
      {
        id: "q_s6",
        label: "6. Forward Rounded Shoulders & Kyphosis",
        sub: "Do your shoulders roll forward with shoulder blades flaring out (winging) away from ribs?",
        options: [
          { text: "Shoulders rolled inward; tight chest muscles pull shoulder joint out of socket alignment", val: 15, flag: "Pectoralis Minor Contracture & Scapular Winging" },
          { text: "Notice posture slouching when tired at desk", val: 35, flag: null },
          { text: "Upright chest with shoulder blades packed flat against rib cage", val: 50, flag: null },
        ],
      },
    ],
  },
  ankle: {
    id: "ankle",
    title: "Ankle Joint, Heel Pain & Plantar Fascia",
    badge: "Ankle & Heel Pain",
    iconName: "Footprints",
    radarPillars: ["Fascial Elasticity", "Achilles Stretch", "Ankle Stability", "Arch Support", "First-Step Ease"],
    questions: [
      {
        id: "q_a1",
        label: "1. Morning 'First-Step' Heel Agony",
        sub: "What happens when your bare foot hits the floor when stepping out of bed in the morning?",
        options: [
          { text: "Sharp, knife-like stabbing pain in the heel; must limp for the first 10 minutes", val: 10, flag: "Classic Plantar Fasciitis Degenerative Tear" },
          { text: "Dull ache under heel, eases up after walking around", val: 30, flag: null },
          { text: "First steps are painless and soft", val: 50, flag: null },
        ],
      },
      {
        id: "q_a2",
        label: "2. Achilles Tendon Stiffness & Tightness",
        sub: "How does the back of your heel and lower calf feel when climbing stairs or walking uphill?",
        options: [
          { text: "Burning, stiff cord at back of heel; tender when pinched between fingers", val: 15, flag: "Insertional Achilles Tendinopathy" },
          { text: "Tight lower calves after walking, but no sharp tendon pain", val: 35, flag: null },
          { text: "Springy and flexible calves with zero Achilles irritation", val: 50, flag: null },
        ],
      },
      {
        id: "q_a3",
        label: "3. Recurrent Ankle Inversion 'Rolls' (Sprains)",
        sub: "How often do you roll or twist your ankle while walking on uneven ground or pavements?",
        options: [
          { text: "Ankle feels loose/wobbly; rolls frequently or past history of 2+ severe sprains", val: 10, flag: "Chronic Lateral Ligament Instability (ATFL Laxity)" },
          { text: "Rolled it once long ago, still feels slightly weak", val: 30, flag: null },
          { text: "Ankles feel rock-solid with rapid balance reactions", val: 50, flag: null },
        ],
      },
      {
        id: "q_a4",
        label: "4. Ankle Dorsiflexion (Knee-to-Wall Reach)",
        sub: "Can you lunge forward with heel glued to the floor and touch knee to wall 4 inches away?",
        options: [
          { text: "Heel lifts immediately; pinching sensation in front of ankle", val: 15, flag: "Anterior Talocrural Impingement & Equinus Drag" },
          { text: "Tight calf limits forward stretch slightly", val: 30, flag: null },
          { text: "Full 5+ inch knee-to-wall ankle mobility with heel planted", val: 50, flag: null },
        ],
      },
      {
        id: "q_a5",
        label: "5. Flat Feet (Overpronation) & Arch Collapse",
        sub: "When standing barefoot, does your foot arch collapse flat with the ankle rolling inward?",
        options: [
          { text: "Completely flat arches; shoes wear down heavily on the inside edge", val: 15, flag: "Severe Kinetic Overpronation & Navicular Drop" },
          { text: "Mild arch drop when standing on hard tiles", val: 35, flag: null },
          { text: "Healthy, visible foot arch providing active shock absorption", val: 50, flag: null },
        ],
      },
      {
        id: "q_a6",
        label: "6. Walking Barefoot on Hard Floors",
        sub: "Can you walk barefoot comfortably on hard marble or tile floors at home?",
        options: [
          { text: "Cannot walk barefoot; feels like bone bruising under the heel or forefoot", val: 15, flag: "Plantar Fat Pad Atrophy & Metatarsalgia" },
          { text: "Prefer wearing cushioned slippers at home", val: 35, flag: null },
          { text: "Walk barefoot on any surface with complete comfort", val: 50, flag: null },
        ],
      },
    ],
  },
  elbow: {
    id: "elbow",
    title: "Elbow, Wrist & Repetitive Strain (RSI)",
    badge: "Elbow, Wrist & RSI",
    iconName: "MousePointerClick",
    radarPillars: ["Extensor Tendon", "Median Nerve", "Grip Power", "Wrist Ergonomics", "Flexor Balance"],
    questions: [
      {
        id: "q_e1",
        label: "1. Outer Elbow Burning (Tennis Elbow / Epicondylitis)",
        sub: "Does lifting a coffee mug, opening a tight jar, or turning a door handle trigger outer elbow pain?",
        options: [
          { text: "Sharp burning pain on outer elbow bone radiating into forearm extensors", val: 10, flag: "Lateral Epicondylalgia (Tennis Elbow Extensor Shear)" },
          { text: "Dull ache after continuous typing or mouse work", val: 30, flag: null },
          { text: "Strong grip with zero elbow bone sensitivity", val: 50, flag: null },
        ],
      },
      {
        id: "q_e2",
        label: "2. Carpal Tunnel Numbness in Thumb & Index Fingers",
        sub: "Do you experience tingling or numbness in your thumb, index, and middle finger during typing or driving?",
        options: [
          { text: "Frequent pins-and-needles waking me up at night; need to shake hands out", val: 10, flag: "Carpal Tunnel Median Nerve Entrapment" },
          { text: "Mild finger heaviness after 4 hours of non-stop computer use", val: 30, flag: null },
          { text: "Crisp, normal nerve sensation in all fingers 24/7", val: 50, flag: null },
        ],
      },
      {
        id: "q_e3",
        label: "3. 'Text Thumb' & Wrist Snapping (De Quervain's)",
        sub: "Does gripping your smartphone, swiping with thumb, or lifting a baby cause sharp wrist pain?",
        options: [
          { text: "Sharp catching pain at base of thumb/radial wrist bone", val: 15, flag: "De Quervain's Tenosynovitis (Thumb Tendon Friction)" },
          { text: "Slight thumb fatigue after heavy typing", val: 35, flag: null },
          { text: "Smooth, pain-free wrist flexion and thumb extension", val: 50, flag: null },
        ],
      },
      {
        id: "q_e4",
        label: "4. Crush Grip Weakness & Dropping Objects",
        sub: "Have you noticed your hand grip feeling weak or accidentally dropping cups or grocery bags?",
        options: [
          { text: "Noticeable loss of grip strength; cannot hold heavy bags or squeeze tightly", val: 15, flag: "Neuromuscular Grip Inhibition & Extensor Tear" },
          { text: "Grip tires out faster than normal during workouts", val: 35, flag: null },
          { text: "Powerful, confident grip with zero weakness", val: 50, flag: null },
        ],
      },
      {
        id: "q_e5",
        label: "5. Inner Elbow Tenderness (Golfer's Elbow)",
        sub: "Does the bony bump on the INSIDE of your elbow ache when carrying shopping bags or pulling doors?",
        options: [
          { text: "Tender and painful when pulling or carrying weight at side", val: 15, flag: "Medial Epicondylitis (Flexor Tendon Overload)" },
          { text: "Mild stiffness when straightening arm fully", val: 35, flag: null },
          { text: "Zero inner elbow tenderness", val: 50, flag: null },
        ],
      },
      {
        id: "q_e6",
        label: "6. Keyboard Mouse Ergonomics & Forearm Posture",
        sub: "How many hours daily do you work with wrists bent backwards on a keyboard or unergonomic mouse?",
        options: [
          { text: "7–10 hours daily on flat laptop with unsupported, bent wrists", val: 15, flag: "Static RSI Ergonomic Compression" },
          { text: "Moderate 4–5 hours with occasional rest breaks", val: 35, flag: null },
          { text: "Ergonomic vertical mouse and wrist rests; regular micro-breaks", val: 50, flag: null },
        ],
      },
    ],
  },
  postop: {
    id: "postop",
    title: "Post-Surgical, Post-Fracture & Trauma Rehab",
    badge: "Post-Surgical Rehab",
    iconName: "Stethoscope",
    radarPillars: ["Joint ROM", "Muscle Atrophy", "Scar Tissue", "Weight Bearing", "Kinetic Confidence"],
    questions: [
      {
        id: "q_p1",
        label: "1. Terminal Joint Extension Lag (Straightening)",
        sub: "Can you straighten your post-op/post-fracture joint completely flat (0° extension)?",
        options: [
          { text: "Cannot straighten completely; stuck with a permanent bent lag", val: 10, flag: "Terminal Extension Arthrofibrosis Lag" },
          { text: "Can straighten with gentle active pushing, but feels tight", val: 30, flag: null },
          { text: "Achieves full 0° lock or normal hyperextension effortlessly", val: 50, flag: null },
        ],
      },
      {
        id: "q_p2",
        label: "2. Arthrogenic Muscle Inhibition & Visible Shrinkage",
        sub: "Has the muscle around the injured joint visibly shrunk compared to the opposite healthy limb?",
        options: [
          { text: "Severe visible muscle wasting (e.g. quad/shoulder visibly smaller and feels dormant)", val: 10, flag: "Arthrogenic Muscle Inhibition & Atrophy" },
          { text: "Slight muscle softness, but can activate with conscious effort", val: 30, flag: null },
          { text: "Equal limb circumference, muscle volume, and symmetrical tone", val: 50, flag: null },
        ],
      },
      {
        id: "q_p3",
        label: "3. Surgical Scar Adhesion & Tissue Glide",
        sub: "Is the surgical scar red, sensitive, or stuck tightly to underlying bone/tissues?",
        options: [
          { text: "Scar is rigid and tethered; pulling sensation during movement", val: 15, flag: "Adherent Scar Tissue & Fascial Restriction" },
          { text: "Scar is healed but slightly tender when pressed", val: 35, flag: null },
          { text: "Scar tissue glides freely in all directions with zero pain", val: 50, flag: null },
        ],
      },
      {
        id: "q_p4",
        label: "4. Progressive Weight-Bearing & Limping Gait",
        sub: "Can you put 100% of your bodyweight through the limb without limping or holding walls?",
        options: [
          { text: "Limping heavily or reliant on crutch/cane; afraid to bear full weight", val: 10, flag: "Antalgic Gait & Weight-Bearing Kinesiophobia" },
          { text: "Can bear weight, but tire out and limp after 10 minutes", val: 30, flag: null },
          { text: "Full, symmetrical, balanced weight-bearing with normal gait", val: 50, flag: null },
        ],
      },
      {
        id: "q_p5",
        label: "5. Post-Immobilization Joint Stiffness",
        sub: "How stiff does the joint feel after cast/brace removal or when waking up?",
        options: [
          { text: "Extremely rigid joint capsule; feels like rust has seized the hinge", val: 15, flag: "Capsular Adhesions & Post-Immobilization Contracture" },
          { text: "Moderately stiff, unlocks slowly through the day", val: 35, flag: null },
          { text: "Smooth range of motion with minimal morning stiffness", val: 50, flag: null },
        ],
      },
      {
        id: "q_p6",
        label: "6. Kinesiophobia (Fear of Re-Injury / Moving)",
        sub: "Are you anxious that moving the joint or exercising will tear the surgical repair or re-break the bone?",
        options: [
          { text: "Terrified to bend or load it; afraid of re-injury without direct physiotherapist guidance", val: 15, flag: "High Kinesiophobia & Movement Avoidance" },
          { text: "Slightly cautious with aggressive movements", val: 35, flag: null },
          { text: "Confident and eager to push through structured rehabilitation", val: 50, flag: null },
        ],
      },
    ],
  },
};

export const CLINICAL_REHAB_PROTOCOL: RehabPhase[] = [
  {
    phase: "Phase 1: Sessions 1–4",
    sessions: "Weeks 1–2",
    title: "Decompression & Pain Modulation",
    color: "teal",
    items: [
      "Targeted passive manual joint mobilization",
      "Myofascial release of hypertonic muscle trigger points",
      "Pain-free neural dynamic gliding protocols",
      "Ergonomic load off-loading & biomechanical taping",
    ],
  },
  {
    phase: "Phase 2: Sessions 5–8",
    sessions: "Weeks 3–4",
    title: "Motor Control & Stabilizer Activation",
    color: "amber",
    items: [
      "Re-education of dormant deep stabilizers (core/scapular/gluteal)",
      "Multi-joint closed kinetic chain alignment retraining",
      "Isometric muscle contraction to rebuild tendon load tolerance",
      "Controlled eccentric lengthening in previous pain arcs",
    ],
  },
  {
    phase: "Phase 3: Sessions 9–12+",
    sessions: "Weeks 5–6+",
    title: "Load Tolerance & Recurrence Prevention",
    color: "emerald",
    items: [
      "Dynamic multi-plane functional resistance loading",
      "Safe return-to-sport / workstation durability drills",
      "Individualized Home Exercise Protocol (HEP) handover",
      "Permanent mechanical adaptation & re-injury shield",
    ],
  },
];

export function calculatePhysioAudit(
  patient: PatientDetails,
  trackId: string,
  answers: Record<string, number>,
  redFlag: "safe" | "alert" = "safe",
  pastHistory: "pills_heat" | "short_physio" | "first_time" = "pills_heat",
  recordId?: string
): PhysioAuditRecord {
  const track = TRACK_DATA[trackId] || TRACK_DATA.lumbar;
  const flags: string[] = [];

  let totalPoints = 0;
  let maxPoints = 0;

  // Track questions scoring
  track.questions.forEach((q) => {
    const selectedIdx = answers[q.id] ?? 0;
    const opt = q.options[selectedIdx] || q.options[0];
    totalPoints += opt.val;
    maxPoints += 50;
    if (opt.flag) {
      flags.push(opt.flag);
    }
  });

  const percentage = Math.round((totalPoints / maxPoints) * 100);

  // Status classification
  let level: "optimal" | "moderate" | "severe" = "optimal";
  let statusTitle = "Optimal Biomechanical Health";
  let statusColor = "text-emerald-400";
  let summary =
    "Kinetic chain alignment is within functional limits. Routine postural exercises and scheduled mobility drills will maintain this healthy joint status.";

  if (percentage < 45) {
    level = "severe";
    statusTitle = "Severe Kinetic Chain Breakdown (High Re-Injury Risk)";
    statusColor = "text-red-400";
    summary =
      "Your joint is operating under acute mechanical shear. Deep stabilizer muscles have shut down, and passive structures (ligaments, discs, and cartilage) are bearing abnormal stress. Immediate hands-on clinical rehabilitation is required to prevent chronic structural degeneration.";
  } else if (percentage < 75) {
    level = "moderate";
    statusTitle = "Compensatory Strain & Muscle Imbalance";
    statusColor = "text-amber-400";
    summary =
      "Your primary pain is a direct symptom of muscle compensation. Surrounding stabilizer muscles have developed chronic trigger knots and tightness, forcing the joint into improper mechanics during daily tasks and desk work.";
  }

  // 5 Pillars scoring mapped directly to track's radar pillars
  const pillars: PillarScore[] = track.radarPillars.map((pillarName, idx) => {
    // Map individual questions to pillar scores with realistic variation around percentage
    const q = track.questions[idx];
    let score = percentage;
    if (q) {
      const selectedIdx = answers[q.id] ?? 0;
      const opt = q.options[selectedIdx] || q.options[0];
      // Normalize option value (10-50) to 0-100 scale: (val / 50) * 100
      score = Math.round((opt.val / 50) * 100);
    } else {
      // 5th pillar synthesis
      const offset = (idx % 2 === 0 ? 1 : -1) * (idx * 3);
      score = Math.min(100, Math.max(15, percentage + offset));
    }

    let status: "optimal" | "moderate" | "critical" = "optimal";
    if (score < 45) status = "critical";
    else if (score < 75) status = "moderate";

    return {
      name: pillarName,
      score,
      target: 95,
      status,
      description: `Target level: 95% functional balance. Current capacity is ${score}%.`,
    };
  });

  const patientName = patient.name.trim() || "Patient";

  const consultationScript = `"${patientName}, your score of ${percentage}/100 proves why temporary treatments like pain sprays, painkillers, or heat bags have failed you. Those methods only numb the pain nerve, but your joint mechanics remain compromised.\n\nEvery time you walk, sit, or move, your body compensates, increasing joint wear. We cannot fix this with a single session of electrical machines. We recommend our 12-Session 3-Phase Corrective Protocol to decompress the joint, retrain your stabilizers, and eliminate the root cause permanently."`;

  const id =
    recordId ||
    `kp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    id,
    createdAt: new Date().toISOString(),
    patient: {
      ...patient,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
    trackId: track.id,
    trackTitle: track.title,
    trackBadge: track.badge,
    redFlag,
    pastHistory,
    answers,
    flags,
    totalScore: percentage,
    maxScore: 100,
    percentage,
    status: {
      title: statusTitle,
      level,
      color: statusColor,
      summary,
    },
    pillars,
    rehabProtocol: CLINICAL_REHAB_PROTOCOL,
    consultationScript,
  };
}

export function isValidIndianMobile(phone?: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return true;
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) return true;
  return false;
}

export function cleanIndianMobile(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

export const CLINIC_SUPPORT_PHONE = "918368052044";
export const CLINIC_DISPLAY_PHONE = "+91 8368052044";

export const SAMPLE_PATIENT: PatientDetails = {
  name: "Rahul Sharma",
  phone: "9876543210",
  whatsappNumber: "9876543210",
  age: "34",
  occupation: "Software Engineer (9 hrs desk work)",
  track: "lumbar",
  auditorName: "Dr. KineticFix Clinical Specialist",
};

export const SAMPLE_PHYSIO_AUDIT: PhysioAuditRecord = calculatePhysioAudit(
  SAMPLE_PATIENT,
  "lumbar",
  {
    q_rad: 0,
    q_flex: 0,
    q_morn: 0,
    q_desk: 0,
    q_arch: 1,
    q_cough: 1,
  },
  "alert",
  "pills_heat",
  "sample-rahul-lumbar"
);
