/**
 * Initial Seed Data for CureLink Platform
 * Provides realistic medical equipment, healthcare facilities, reminders, and health records.
 */

export interface Equipment {
  id: string;
  name: string;
  category: 'Mobility' | 'Respiratory' | 'Home Care' | 'Hospital Equipment' | 'Other';
  description: string;
  location: string;
  dailyRate: number;
  available: boolean;
  condition: string;
  image: string;
  ownerName?: string;
  contactPhone?: string;
}

export interface BorrowRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  requesterName: string;
  contact: string;
  startDate: string;
  returnDate: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  createdAt: string;
  totalCost?: number;
}

export interface HealthcareResource {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Pharmacy' | 'Diagnostic Center';
  address: string;
  phone: string;
  openingHours: string;
  verified: boolean;
  lat: number;
  lng: number;
  emergencyServices: boolean;
  description: string;
}

export interface Reminder {
  id: string;
  title: string;
  type: 'Medication' | 'Appointment' | 'Equipment Return' | 'Health Check' | 'Other';
  date: string;
  time: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  type: 'Prescription' | 'Lab Report' | 'Appointment' | 'Medical Report' | 'Other';
  date: string;
  provider: string; // Doctor or Hospital
  notes: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'request' | 'reminder' | 'system' | 'approval';
  date: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string;
}

export const INITIAL_USER: UserProfile = {
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@curelink.demo',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  emergencyContact: 'David Mitchell (+1 555-987-6543)',
  bloodGroup: 'O+',
  allergies: 'Penicillin, Shellfish',
};

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq_1',
    name: 'Ergonomic Folding Wheelchair',
    category: 'Mobility',
    description: 'Lightweight aircraft-grade aluminum frame with dual-action companion handbrakes, swing-away footrests, and 18-inch breathable nylon padded seat.',
    location: 'Mission Medical Hub, 1420 Valencia St',
    dailyRate: 5,
    available: true,
    condition: 'Excellent Condition',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Mission Community Health Alliance',
    contactPhone: '+1 (555) 431-8900',
  },
  {
    id: 'eq_2',
    name: 'Philips Respironics 5L Oxygen Concentrator',
    category: 'Respiratory',
    description: 'High-efficiency continuous flow oxygen concentrator delivering 0.5 to 5.0 LPM with OPI (Oxygen Percentage Indicator) and ultra-quiet 45 dBA compressor.',
    location: 'St. Jude Wellness Depot, 890 Pine St',
    dailyRate: 14,
    available: true,
    condition: 'Certified Sterile & Calibrated',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    ownerName: 'BreatheFree Care Network',
    contactPhone: '+1 (555) 672-1100',
  },
  {
    id: 'eq_3',
    name: 'Dual-Trigger Folding Walker with Wheels',
    category: 'Mobility',
    description: 'Sturdy 1-inch anodized aluminum tubing with dual front 5-inch glide wheels, rear glide skis, and ergonomic contoured ribbed hand grips. Supports up to 350 lbs.',
    location: 'North Wing Community Center, 301 Broadway',
    dailyRate: 3,
    available: true,
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1583912267670-6575ad3736df?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Golden Gate Senior Collective',
    contactPhone: '+1 (555) 890-4411',
  },
  {
    id: 'eq_4',
    name: 'Standard Aluminum Underarm Crutches (Pair)',
    category: 'Mobility',
    description: 'Push-button adjustable underarm crutches suited for height 5’2” to 6’0”. Fitted with high-density underarm pads and jumbo non-skid vinyl rubber contour tips.',
    location: 'City Care Clinic, 650 East District Way',
    dailyRate: 2,
    available: false,
    condition: 'Sanitized & Inspected',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Bay Orthopedic Outreach',
    contactPhone: '+1 (555) 321-9922',
  },
  {
    id: 'eq_5',
    name: 'Full-Electric Adjustable Hospital Bed',
    category: 'Hospital Equipment',
    description: 'Hospital grade full-electric home bed with pendant remote control for independent head, foot, and overall height elevation. Includes steel safety side rails.',
    location: 'Hope Care Foundation, 210 West Campus Blvd',
    dailyRate: 18,
    available: true,
    condition: 'Like New / Sanitized',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Hope Medical Equipment Exchange',
    contactPhone: '+1 (555) 887-3400',
  },
  {
    id: 'eq_6',
    name: 'Omron CompAir High-Flow Nebulizer',
    category: 'Respiratory',
    description: 'Compact compressor nebulizer system delivering fast medication delivery (<0.35 mL/min rate) with reusable V.V.T. nebulizer kit, adult and pediatric masks.',
    location: 'CarePoint Health, 502 Market Plaza',
    dailyRate: 4,
    available: true,
    condition: 'Sanitized & Fully Tested',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80',
    ownerName: 'CarePoint Community Outreach',
    contactPhone: '+1 (555) 456-7890',
  },
  {
    id: 'eq_7',
    name: 'Drive Medical 4-Wheel Rollator with Padded Seat',
    category: 'Mobility',
    description: 'Smooth rolling 7.5-inch non-marring casters with loop hand brakes for secure parking, padded seamless seat with backrest and convenient underseat zippered storage.',
    location: 'Apex Physical Therapy Annex, 1180 Post St',
    dailyRate: 4,
    available: true,
    condition: 'Excellent Condition',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Apex Physical Therapy',
    contactPhone: '+1 (555) 782-9901',
  },
  {
    id: 'eq_8',
    name: 'Hydraulic Patient Hoyer Transfer Lift',
    category: 'Home Care',
    description: 'Heavy duty chrome-plated steel hydraulic transfer hoist with 450 lb weight capacity, 6-point spreader bar, and smooth pedal-operated adjustable base legs.',
    location: 'Mercy Community Center, 770 Potrero Ave',
    dailyRate: 15,
    available: true,
    condition: 'Inspected & Certified',
    image: 'https://images.unsplash.com/photo-1583912267670-6575ad3736df?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Mercy Medical Assist Program',
    contactPhone: '+1 (555) 231-6677',
  },
];

export const INITIAL_BORROW_REQUESTS: BorrowRequest[] = [
  {
    id: 'req_101',
    equipmentId: 'eq_4',
    equipmentName: 'Standard Aluminum Underarm Crutches (Pair)',
    requesterName: 'Sarah Mitchell',
    contact: '+1 (555) 234-5678',
    startDate: '2026-10-02',
    returnDate: '2026-10-16',
    notes: 'Post-ankle arthroscopy recovery. Prescribed 2 weeks non-weight bearing.',
    status: 'Approved',
    createdAt: '2026-10-01T09:30:00Z',
    totalCost: 28,
  },
  {
    id: 'req_102',
    equipmentId: 'eq_2',
    equipmentName: 'Philips Respironics 5L Oxygen Concentrator',
    requesterName: 'Sarah Mitchell',
    contact: '+1 (555) 234-5678',
    startDate: '2026-10-10',
    returnDate: '2026-10-17',
    notes: 'Temporary post-bronchitis home recovery backup.',
    status: 'Pending',
    createdAt: '2026-10-06T14:15:00Z',
    totalCost: 98,
  },
];

export const INITIAL_RESOURCES: HealthcareResource[] = [
  {
    id: 'res_1',
    name: 'San Francisco General Hospital & Trauma Center',
    type: 'Hospital',
    address: '1001 Potrero Ave, San Francisco, CA 94110',
    phone: '+1 (415) 206-8000',
    openingHours: 'Open 24/7 (Emergency & Acute Care)',
    verified: true,
    lat: 37.7558,
    lng: -122.4046,
    emergencyServices: true,
    description: 'Level 1 Trauma Center providing comprehensive acute inpatient medical care, emergency medicine, and public health support.',
  },
  {
    id: 'res_2',
    name: 'UCSF Medical Center at Mission Bay',
    type: 'Hospital',
    address: '1855 4th St, San Francisco, CA 94158',
    phone: '+1 (415) 353-1664',
    openingHours: 'Open 24/7 (Emergency Department)',
    verified: true,
    lat: 37.7675,
    lng: -122.3912,
    emergencyServices: true,
    description: 'World-renowned medical complex featuring specialized women’s, children’s, and cancer specialty care centers.',
  },
  {
    id: 'res_3',
    name: 'Mission Neighborhood Health Center',
    type: 'Clinic',
    address: '240 Shotwell St, San Francisco, CA 94110',
    phone: '+1 (415) 552-3870',
    openingHours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
    verified: true,
    lat: 37.7644,
    lng: -122.4162,
    emergencyServices: false,
    description: 'Community health center providing primary healthcare, pediatric services, chronic disease support, and dental wellness.',
  },
  {
    id: 'res_4',
    name: 'Walgreens 24-Hour Pharmacy & Wellness',
    type: 'Pharmacy',
    address: '498 Castro St, San Francisco, CA 94114',
    phone: '+1 (415) 861-3136',
    openingHours: '24 Hours Daily',
    verified: true,
    lat: 37.7618,
    lng: -122.4350,
    emergencyServices: false,
    description: 'Full-service prescription dispensary, vaccinations, medical supplies, home health essentials, and over-the-counter care.',
  },
  {
    id: 'res_5',
    name: 'Quest Diagnostics Patient Service Center',
    type: 'Diagnostic Center',
    address: '450 Sutter St Ste 1200, San Francisco, CA 94108',
    phone: '+1 (415) 397-6287',
    openingHours: 'Mon-Fri: 7:00 AM - 4:00 PM',
    verified: true,
    lat: 37.7895,
    lng: -122.4072,
    emergencyServices: false,
    description: 'Comprehensive clinical lab testing, routine bloodwork, pathology, metabolic panels, and health screenings.',
  },
  {
    id: 'res_6',
    name: 'Kaiser Permanente Medical Offices',
    type: 'Clinic',
    address: '2238 Geary Blvd, San Francisco, CA 94115',
    phone: '+1 (415) 833-2000',
    openingHours: 'Mon-Sat: 7:30 AM - 7:00 PM',
    verified: true,
    lat: 37.7828,
    lng: -122.4418,
    emergencyServices: false,
    description: 'Outpatient clinic providing internal medicine, radiology, cardiology consults, and preventive wellness checks.',
  },
  {
    id: 'res_7',
    name: 'CVS Pharmacy & MinuteClinic',
    type: 'Pharmacy',
    address: '1285 Sutter St, San Francisco, CA 94109',
    phone: '+1 (415) 202-9497',
    openingHours: 'Daily: 8:00 AM - 10:00 PM',
    verified: true,
    lat: 37.7877,
    lng: -122.4230,
    emergencyServices: false,
    description: 'Prescription pickup, on-site nurse practitioner walk-in consultations, minor illness treatment, and immunizations.',
  },
  {
    id: 'res_8',
    name: 'Bay Area Advanced Imaging & MRI',
    type: 'Diagnostic Center',
    address: '3838 California St, San Francisco, CA 94118',
    phone: '+1 (415) 750-5900',
    openingHours: 'Mon-Fri: 7:00 AM - 6:00 PM, Sat: 8:00 AM - 1:00 PM',
    verified: true,
    lat: 37.7861,
    lng: -122.4578,
    emergencyServices: false,
    description: 'High-field MRI, low-dose CT scanning, digital X-rays, bone densitometry, and 3D ultrasound diagnostics.',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem_1',
    title: 'Amoxicillin 500mg Morning Dose',
    type: 'Medication',
    date: '2026-10-08',
    time: '08:00',
    notes: 'Take after breakfast with a full glass of water. Course ends Friday.',
    completed: false,
    createdAt: '2026-10-06T10:00:00Z',
  },
  {
    id: 'rem_2',
    title: 'Dr. Evans Orthopedic Follow-up',
    type: 'Appointment',
    date: '2026-10-12',
    time: '14:30',
    notes: 'Bring post-op X-rays and wear loose comfortable clothing for knee mobility exam.',
    completed: false,
    createdAt: '2026-10-05T11:20:00Z',
  },
  {
    id: 'rem_3',
    title: 'Crutches Return Date to City Care Clinic',
    type: 'Equipment Return',
    date: '2026-10-16',
    time: '16:00',
    notes: 'Wipe down grips with antiseptic wipes before handover at East District desk.',
    completed: false,
    createdAt: '2026-10-02T08:00:00Z',
  },
  {
    id: 'rem_4',
    title: 'Blood Pressure & Heart Rate Log',
    type: 'Health Check',
    date: '2026-10-07',
    time: '19:00',
    notes: 'Rest quietly for 5 minutes prior to cuff reading. Target < 120/80 mmHg.',
    completed: true,
    createdAt: '2026-10-07T07:00:00Z',
  },
];

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'rec_1',
    title: 'Post-Op Knee Arthroscopy Recovery Plan',
    type: 'Medical Report',
    date: '2026-09-28',
    provider: 'Dr. Robert Evans, St. Mary Orthopedics',
    notes: 'Procedure successful. Physical therapy recommended 2x weekly starting week 3. Ice applied 20 mins every 3 hours.',
    createdAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'rec_2',
    title: 'Comprehensive Metabolic & Lipid Panel',
    type: 'Lab Report',
    date: '2026-09-15',
    provider: 'Quest Diagnostics (Ref #QD-98441)',
    notes: 'Fasting glucose 92 mg/dL (Normal). Total cholesterol 178 mg/dL. HDL 58 mg/dL. Vitamin D slightly low at 28 ng/mL.',
    createdAt: '2026-09-16T12:00:00Z',
  },
  {
    id: 'rec_3',
    title: 'Amoxicillin Antibiotic Prescription',
    type: 'Prescription',
    date: '2026-10-03',
    provider: 'Dr. Elena Rostova, Mission Health',
    notes: '500mg oral capsules. 3 times daily for 7 days. Complete full course as prescribed.',
    createdAt: '2026-10-03T15:30:00Z',
  },
  {
    id: 'rec_4',
    title: 'Annual Preventive Cardiology Checkup',
    type: 'Appointment',
    date: '2026-08-20',
    provider: 'Pacific Heart & Vascular Institute',
    notes: 'Resting ECG sinus rhythm normal. Stress test completed without ischemic changes. Next review August 2027.',
    createdAt: '2026-08-21T09:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Borrow Request Approved',
    message: 'Your request for "Standard Aluminum Underarm Crutches" has been approved by Bay Orthopedic Outreach.',
    type: 'approval',
    date: '2026-10-02T10:15:00Z',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Upcoming Reminder',
    message: 'Don’t forget your Amoxicillin 500mg Morning Dose scheduled today at 08:00 AM.',
    type: 'reminder',
    date: '2026-10-07T08:00:00Z',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Equipment Request Submitted',
    message: 'Your request for "Philips Respironics 5L Oxygen Concentrator" was forwarded to BreatheFree Care Network.',
    type: 'request',
    date: '2026-10-06T14:15:00Z',
    read: true,
  },
  {
    id: 'notif_4',
    title: 'Welcome to CureLink',
    message: 'Your account is ready. Discover shared medical equipment, local healthcare providers, and manage your health records.',
    type: 'system',
    date: '2026-10-01T08:00:00Z',
    read: true,
  },
];
