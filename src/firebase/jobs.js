import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, limit, startAfter,
  updateDoc, deleteDoc, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from './config';

const JOBS_COLLECTION = 'jobs';
const PAGE_SIZE = 10;

// Add a new job
export async function createJob(jobData) {
  const ref = await addDoc(collection(db, JOBS_COLLECTION), {
    ...jobData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isVacant: true,
    views: 0,
  });
  return ref.id;
}

// Get jobs with optional filters + pagination
export async function getJobs({ category, location, contractType, salaryRange, lastDoc = null } = {}) {
  let q = collection(db, JOBS_COLLECTION);
  const constraints = [orderBy('createdAt', 'desc')];

  if (category) constraints.push(where('category', '==', category));
  if (location) constraints.push(where('location', '==', location));
  if (contractType) constraints.push(where('contractType', '==', contractType));
  if (salaryRange) constraints.push(where('salaryRange', '==', salaryRange));

  constraints.push(limit(PAGE_SIZE));
  if (lastDoc) constraints.push(startAfter(lastDoc));

  const snapshot = await getDocs(query(q, ...constraints));
  const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  return { jobs, lastVisible };
}

// Get single job
export async function getJob(id) {
  const snap = await getDoc(doc(db, JOBS_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Update job
export async function updateJob(id, data) {
  await updateDoc(doc(db, JOBS_COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Mark as no longer vacant
export async function closeJob(id) {
  await updateDoc(doc(db, JOBS_COLLECTION, id), {
    isVacant: false,
    closedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Delete job
export async function deleteJob(id) {
  await deleteDoc(doc(db, JOBS_COLLECTION, id));
}

// Search jobs by keyword
export async function searchJobs(keyword) {
  // Basic search by title - for full-text search use Algolia/Typesense in production
  const snapshot = await getDocs(
    query(collection(db, JOBS_COLLECTION), orderBy('title'), limit(50))
  );
  const kw = keyword.toLowerCase();
  return snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(j => j.title?.toLowerCase().includes(kw) || j.company?.toLowerCase().includes(kw));
}

// Increment views
export async function incrementViews(id) {
  const ref = doc(db, JOBS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { views: (snap.data().views || 0) + 1 });
  }
}

// Seed sample data (for development)
export async function seedSampleJobs() {
  const { JOB_CATEGORIES, UK_LOCATIONS, CONTRACT_TYPES, SALARY_RANGES } = await import('../data/categories.js');
  const sampleJobs = [
    {
      title: "Care Assistant",
      company: "Sunrise Care Homes",
      category: "Care Assistant",
      location: "London",
      contractType: "Full-time",
      salaryRange: "£20,000 - £25,000",
      salary: "£22,000",
      description: "We are looking for a compassionate Care Assistant to join our team in South London. You will provide person-centred care to our residents, supporting them with daily living activities.",
      requirements: ["NVQ Level 2 in Health & Social Care preferred", "Compassionate nature", "Good communication skills", "DBS check required"],
      benefits: ["28 days holiday", "Pension scheme", "Training & development", "Free DBS check"],
      isVacant: true,
      featured: true,
    },
    {
      title: "Senior Healthcare Assistant",
      company: "NHS Foundation Trust",
      category: "Healthcare Assistant",
      location: "Manchester",
      contractType: "Full-time",
      salaryRange: "£25,000 - £30,000",
      salary: "£27,500",
      description: "Join our dedicated healthcare team at Manchester Royal Infirmary. As a Senior HCA you will provide high quality care to patients on our busy medical ward.",
      requirements: ["Previous HCA experience required", "NVQ Level 3 preferred", "Basic Life Support training"],
      benefits: ["NHS pension", "Excellent holiday entitlement", "Staff discounts", "Childcare vouchers"],
      isVacant: true,
      featured: true,
    },
    {
      title: "Night Care Assistant",
      company: "Barchester Healthcare",
      category: "Night Care Assistant",
      location: "Birmingham",
      contractType: "Part-time",
      salaryRange: "£20,000 - £25,000",
      salary: "£11.50/hr",
      description: "Night Care Assistants needed to cover night shifts at our residential care home. You will ensure the safety and comfort of our residents throughout the night.",
      requirements: ["Caring nature", "Ability to work nights", "DBS check"],
      benefits: ["Night enhancement pay", "Pension", "Free meals on shift"],
      isVacant: false,
      featured: false,
    },
    {
      title: "Support Worker - Learning Disabilities",
      company: "Mencap",
      category: "Learning Disability Support Worker",
      location: "Bristol",
      contractType: "Full-time",
      salaryRange: "£20,000 - £25,000",
      salary: "£21,000",
      description: "Support adults with learning disabilities to live fulfilling and independent lives in our supported living service.",
      requirements: ["Experience with learning disabilities preferred", "Full UK driving licence preferred", "DBS check"],
      benefits: ["Competitive salary", "Pension", "Paid training", "Employee assistance programme"],
      isVacant: true,
      featured: false,
    },
    {
      title: "Registered Nurse (RGN)",
      company: "Four Seasons Health Care",
      category: "Registered General Nurse (RGN)",
      location: "Leeds",
      contractType: "Full-time",
      salaryRange: "£35,000 - £40,000",
      salary: "£36,000",
      description: "We are looking for a Registered General Nurse to lead our nursing team in our care home. You will oversee the clinical care of all residents.",
      requirements: ["NMC registered", "Pin in good standing", "Care home experience preferred"],
      benefits: ["£2,000 welcome bonus", "Revalidation support", "CPD funding", "Excellent pension"],
      isVacant: true,
      featured: true,
    },
    {
      title: "Community Mental Health Support Worker",
      company: "Mind",
      category: "Mental Health Support Worker",
      location: "Edinburgh",
      contractType: "Full-time",
      salaryRange: "£25,000 - £30,000",
      salary: "£26,500",
      description: "Support people with mental health challenges to live independently in the community. You will work with clients in their own homes and community settings.",
      requirements: ["Experience in mental health", "Good communication", "Full UK licence preferred"],
      benefits: ["Pension", "Annual leave enhancement", "Wellbeing support", "Flexible working"],
      isVacant: true,
      featured: false,
    },
    {
      title: "Domiciliary Care Worker",
      company: "Helping Hands",
      category: "Domiciliary Carer",
      location: "Sheffield",
      contractType: "Part-time",
      salaryRange: "Up to £20,000",
      salary: "£10.90/hr",
      description: "Provide home care visits to elderly clients in Sheffield. Help with personal care, medication, meal preparation and companionship.",
      requirements: ["Caring attitude", "Full UK driving licence required", "DBS check"],
      benefits: ["Mileage allowance", "Uniform provided", "Flexible hours", "Career progression"],
      isVacant: true,
      featured: false,
    },
    {
      title: "Paramedic",
      company: "London Ambulance Service",
      category: "Paramedic",
      location: "London",
      contractType: "Full-time",
      salaryRange: "£35,000 - £40,000",
      salary: "£38,000",
      description: "Join our 999 emergency response team as a Paramedic. You will respond to emergency calls across London, providing pre-hospital care.",
      requirements: ["HCPC registered Paramedic", "Clean driving licence", "Category C1 licence preferred"],
      benefits: ["NHS pension", "Excellent development opportunities", "Shift enhancements", "Blue light card"],
      isVacant: true,
      featured: true,
    },
  ];

  for (const job of sampleJobs) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = Timestamp.fromDate(new Date(Date.now() - daysAgo * 86400000));
    await addDoc(collection(db, JOBS_COLLECTION), {
      ...job,
      createdAt,
      updatedAt: createdAt,
      views: Math.floor(Math.random() * 500),
    });
  }
  return true;
}
