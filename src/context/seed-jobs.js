
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };
import process from "process";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ── Data pools (matching your PostJobPage exactly) ─────────────

const JOB_CATEGORIES = [
  "Care Assistant",
  "Support Worker",
  "Senior Carer",
  "Healthcare Assistant",
  "Nurse",
  "Mental Health Support",
  "Domiciliary Care",
  "Live-in Care",
  "Nursery Nurse",
  "Social Worker",
  "Occupational Therapist",
  "Physiotherapist",
];

const UK_LOCATIONS = [
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Liverpool",
  "Sheffield",
  "Bristol",
  "Newcastle",
  "Nottingham",
  "Leicester",
  "Southampton",
  "Cardiff",
  "Edinburgh",
  "Glasgow",
  "Belfast",
  "Brighton",
  "Oxford",
  "Cambridge",
  "Coventry",
  "Reading",
  "Derby",
  "Wolverhampton",
  "Stoke-on-Trent",
  "Plymouth",
  "Sunderland",
  "York",
  "Bath",
  "Exeter",
  "Norwich",
  "Portsmouth",
];

const CONTRACT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Zero Hours",
  "Bank",
];

const SALARY_RANGES = [
  "Up to £20,000",
  "£20,000 – £25,000",
  "£25,000 – £30,000",
  "£30,000 – £35,000",
  "£35,000 – £40,000",
  "£40,000+",
];

const COMPANIES = [
  "Sunrise Care Homes",
  "Anchor Trust",
  "HC-One",
  "Bupa Care Services",
  "Four Seasons Health Care",
  "Barchester Healthcare",
  "Care UK",
  "Avery Healthcare",
  "Maria Mallaband Care Group",
  "Vida Healthcare",
  "Helping Hands",
  "Prestige Nursing",
  "Allied Healthcare",
  "Turning Point",
  "Voyage Care",
  "National Care Group",
  "Priory Group",
  "Creative Support",
  "Mencap",
  "Leonard Cheshire",
  "Scope",
  "Action for Children",
  "Dimensions UK",
  "Lifeways",
  "Community Integrated Care",
];

const SALARY_SPECIFICS = {
  "Care Assistant": ["£10.50/hr", "£11.00/hr", "£11.50/hr", "£21,000"],
  "Support Worker": ["£11.00/hr", "£11.50/hr", "£12.00/hr", "£22,000"],
  "Senior Carer": ["£12.00/hr", "£12.50/hr", "£13.00/hr", "£25,000"],
  "Healthcare Assistant": ["£11.50/hr", "£12.00/hr", "£22,000", "£23,000"],
  Nurse: ["£28,000", "£32,000", "£35,000", "£38,000"],
  "Mental Health Support": ["£22,000", "£24,000", "£26,000", "£13.00/hr"],
  "Domiciliary Care": ["£10.50/hr", "£11.00/hr", "£11.50/hr", "£20,000"],
  "Live-in Care": ["£650/week", "£700/week", "£750/week", "£800/week"],
  "Nursery Nurse": ["£19,000", "£20,000", "£21,000", "£10.50/hr"],
  "Social Worker": ["£32,000", "£36,000", "£40,000", "£44,000"],
  "Occupational Therapist": ["£32,000", "£36,000", "£40,000", "£45,000"],
  Physiotherapist: ["£30,000", "£35,000", "£40,000", "£45,000"],
};

const DESCRIPTIONS = {
  "Care Assistant": [
    `We are looking for a compassionate and dedicated Care Assistant to join our team. You will provide personal care and support to our residents, helping them to live fulfilling and dignified lives.\n\nAs a Care Assistant you will assist with daily living activities including washing, dressing, and mealtimes. You will build meaningful relationships with residents and their families, following individual care plans and maintaining accurate records.`,
    `An exciting opportunity has arisen for an enthusiastic Care Assistant to join our growing team. You will be at the heart of delivering outstanding person-centred care to elderly residents.\n\nWorking as part of a friendly and supportive team, you will help residents with personal care, mobility, and social activities. Full training provided — no experience necessary.`,
  ],
  "Support Worker": [
    `We are recruiting a Support Worker to provide high quality care and support to adults with learning disabilities and complex needs. You will work closely with individuals to promote their independence and wellbeing.\n\nYou will support service users with daily living skills, social activities, healthcare appointments, and community access. A positive, patient attitude and genuine commitment to person-centred care is essential.`,
    `Join our dedicated team as a Support Worker supporting adults with mental health needs. You will play a key role in helping individuals achieve their personal goals and live independently.\n\nDuties include supporting with daily routines, personal care, budgeting, and community activities. Experience is desirable but not essential — we offer full induction training.`,
  ],
  "Senior Carer": [
    `We are seeking an experienced Senior Carer to lead and inspire our care team. You will provide exceptional hands-on care whilst supervising and mentoring junior care staff.\n\nResponsibilities include completing care assessments, medication administration, supervising care staff on shift, and liaising with healthcare professionals. NVQ Level 3 or equivalent is highly desirable.`,
  ],
  "Healthcare Assistant": [
    `An excellent opportunity for a Healthcare Assistant to join our busy clinical team. You will support registered nurses and healthcare professionals in delivering outstanding patient care.\n\nDuties include taking patient observations, assisting with personal care, supporting with clinical procedures under supervision, and maintaining patient records. Previous healthcare experience is preferred.`,
  ],
  Nurse: [
    `We are looking for a dedicated Registered Nurse (RGN/RMN) to join our clinical team. You will lead the delivery of safe, effective, and compassionate nursing care to our residents.\n\nYou will be responsible for medication management, care planning, clinical assessments, and supervising care staff. Current NMC registration is essential.`,
  ],
  "Mental Health Support": [
    `We have a rewarding opportunity for a Mental Health Support Worker to join our specialist team. You will provide one-to-one support to adults experiencing mental health challenges, helping them to recover and rebuild their lives.\n\nYou will support individuals with daily living, therapeutic activities, crisis management, and community integration. Experience in mental health is desirable.`,
  ],
  "Domiciliary Care": [
    `We are recruiting experienced Domiciliary Care Workers to deliver high-quality care in clients' own homes across the local area. You will support elderly and disabled clients to maintain their independence and quality of life.\n\nDuties include personal care, medication prompting, meal preparation, and companionship. A full driving licence and access to a vehicle is required.`,
  ],
  "Live-in Care": [
    `An exceptional opportunity for an experienced Live-in Carer to provide dedicated one-to-one support to a client in their own home. You will live with the client and provide round-the-clock care and companionship.\n\nDuties include personal care, domestic tasks, meal preparation, medication management, and social activities. Previous live-in care experience is essential.`,
  ],
  "Nursery Nurse": [
    `We are looking for a warm and enthusiastic Nursery Nurse to join our Ofsted-rated Outstanding nursery. You will plan and deliver stimulating activities that support children's development and wellbeing.\n\nYou will work with children aged 0–5, supporting their early learning, personal development, and care needs. CACHE Level 3 or equivalent is required.`,
  ],
  "Social Worker": [
    `We are seeking a qualified Social Worker to join our adults' services team. You will hold a caseload of complex cases, working with adults at risk to promote their independence and safeguarding.\n\nYou will carry out assessments, develop support plans, attend multi-agency meetings, and represent the local authority at court where required. Social Work England registration is essential.`,
  ],
  "Occupational Therapist": [
    `An excellent opportunity for an Occupational Therapist to join our community therapy team. You will carry out assessments and deliver therapeutic interventions to help clients regain independence following illness or injury.\n\nYou will work across a variety of settings including clients' homes, hospitals, and care homes. HCPC registration is essential.`,
  ],
  Physiotherapist: [
    `We are looking for a skilled Physiotherapist to join our growing rehabilitation team. You will assess, diagnose, and treat patients with a range of physical conditions to improve their mobility and quality of life.\n\nYou will work with patients across all age groups in both community and inpatient settings. HCPC registration is required.`,
  ],
};

const REQUIREMENTS_POOL = {
  "Care Assistant": [
    "Compassionate and caring nature",
    "Good communication skills",
    "Ability to work flexible shifts including weekends",
    "DBS check required (we can arrange)",
    "No experience necessary — full training provided",
  ],
  "Support Worker": [
    "Experience working with learning disabilities desirable",
    "Person-centred approach",
    "Ability to work shifts including evenings and weekends",
    "Enhanced DBS check required",
    "Good written and verbal communication",
  ],
  "Senior Carer": [
    "Minimum 2 years care experience",
    "NVQ Level 3 in Health & Social Care (or working towards)",
    "Medication administration experience",
    "Leadership and supervisory skills",
    "Enhanced DBS check required",
  ],
  "Healthcare Assistant": [
    "Previous healthcare experience preferred",
    "Good observational skills",
    "Ability to work as part of a multidisciplinary team",
    "Enhanced DBS check required",
    "Willingness to undertake further training",
  ],
  Nurse: [
    "Current NMC registration (RGN or RMN)",
    "Clinical assessment skills",
    "Medication management experience",
    "Strong leadership and communication skills",
    "Commitment to ongoing professional development",
  ],
  "Mental Health Support": [
    "Experience in mental health settings desirable",
    "Empathetic and non-judgemental approach",
    "Knowledge of mental health conditions and treatments",
    "Enhanced DBS check required",
    "Ability to remain calm under pressure",
  ],
  "Domiciliary Care": [
    "Full UK driving licence and own vehicle essential",
    "Compassionate nature",
    "Ability to work flexible hours including early mornings and evenings",
    "DBS check required",
    "Previous home care experience preferred",
  ],
  "Live-in Care": [
    "Minimum 2 years live-in care experience",
    "Flexibility to live with client",
    "Excellent personal care skills",
    "Enhanced DBS check required",
    "Strong communication and interpersonal skills",
  ],
  "Nursery Nurse": [
    "CACHE Level 3 or equivalent qualification",
    "Experience working with children aged 0–5",
    "Knowledge of EYFS framework",
    "Enhanced DBS check required",
    "Paediatric first aid (or willingness to obtain)",
  ],
  "Social Worker": [
    "Qualified Social Worker with Social Work England registration",
    "Experience in adult safeguarding",
    "Current driving licence",
    "Ability to manage a complex caseload",
    "Good report writing and IT skills",
  ],
  "Occupational Therapist": [
    "HCPC registration essential",
    "Experience in community or inpatient settings",
    "Strong assessment and report writing skills",
    "Full UK driving licence",
    "Ability to work autonomously and within a team",
  ],
  Physiotherapist: [
    "HCPC registration essential",
    "Experience in relevant clinical area",
    "Strong assessment and clinical reasoning skills",
    "Good communication with patients and families",
    "Commitment to CPD",
  ],
};

const BENEFITS_POOL = [
  "28 days annual leave (including bank holidays)",
  "Company pension scheme",
  "Free enhanced DBS check",
  "Paid training and induction",
  "Career development and progression opportunities",
  "Employee Assistance Programme",
  "Free uniform provided",
  "Mileage allowance",
  "Refer a friend bonus scheme",
  "Blue Light Card discount",
  "Free parking on site",
  "Flexible working patterns",
  "Overtime available",
  "Recognition and reward schemes",
  "NVQ / QCF funding available",
];

// ── Helpers ────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, min, max) {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return admin.firestore.Timestamp.fromDate(d);
}

function generateJob(index) {
  const category = pick(JOB_CATEGORIES);
  const location = pick(UK_LOCATIONS);
  const company = pick(COMPANIES);
  const contract = pick(CONTRACT_TYPES);
  const salaryRange = pick(SALARY_RANGES);
  const salary = pick(SALARY_SPECIFICS[category] || ["Competitive"]);
  const descriptions = DESCRIPTIONS[category] || [
    DESCRIPTIONS["Care Assistant"][0],
  ];
  const description = pick(descriptions);
  const requirements =
    REQUIREMENTS_POOL[category] || REQUIREMENTS_POOL["Care Assistant"];
  const benefits = pickN(BENEFITS_POOL, 4, 8);
  const postedAt = randomDate(90); // spread over last 90 days

  return {
    // Core fields (matching your PostJobPage form exactly)
    title: `${category}${Math.random() > 0.7 ? " — " + contract : ""}`,
    company,
    category,
    location,
    contractType: contract,
    salaryRange,
    salary,
    description,
    requirements, // stored as array
    benefits, // stored as array

    // Metadata
    postedAt,
    isVacant: true,
    createdAt: postedAt,
    updatedAt: postedAt,
    status: "active",
    featured: Math.random() > 0.85, // ~15% featured
    applicants: 0,

    // Seed marker so you can easily delete seed data later
    _seeded: true,
    _seedIndex: index,
  };
}

// ── Batch writer ───────────────────────────────────────────────

async function seedJobs(total = 1500) {
  const BATCH_SIZE = 400; // Firestore max is 500 per batch
  let written = 0;

  console.log(`\n🌱 Seeding ${total} jobs into Firestore...\n`);

  while (written < total) {
    const batchCount = Math.min(BATCH_SIZE, total - written);
    const batch = db.batch();

    for (let i = 0; i < batchCount; i++) {
      const ref = db.collection("jobs").doc(); // auto-ID
      batch.set(ref, generateJob(written + i));
    }

    await batch.commit();
    written += batchCount;
    console.log(`  ✅ ${written} / ${total} jobs written`);
  }

  console.log(`\n🎉 Done! ${total} jobs seeded successfully.\n`);
  console.log("To delete all seeded jobs later, run:");
  console.log("  node seed-jobs.js --delete\n");
}

// ── Delete seeded jobs ─────────────────────────────────────────

async function deleteSeededJobs() {
  console.log("\n🗑️  Deleting seeded jobs...\n");
  const snap = await db.collection("jobs").where("_seeded", "==", true).get();

  if (snap.empty) {
    console.log("No seeded jobs found.");
    return;
  }

  const BATCH_SIZE = 400;
  let deleted = 0;
  let docs = snap.docs;

  while (docs.length > 0) {
    const batch = db.batch();
    const chunk = docs.splice(0, BATCH_SIZE);
    chunk.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    deleted += chunk.length;
    console.log(`  🗑️  ${deleted} deleted`);
  }

  console.log(`\n✅ ${deleted} seeded jobs deleted.\n`);
}

// ── Entry point ────────────────────────────────────────────────

(async () => {
  try {
    if (process.argv.includes("--delete")) {
      await deleteSeededJobs();
    } else {
      await seedJobs(1500);
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
