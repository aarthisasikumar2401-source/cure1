/**
 * CureLink Explainable Symptom Guidance Engine
 * Deterministic, rule-based clinical triaging logic.
 *
 * NOTE: This is an educational healthcare support tool. It does NOT diagnose diseases,
 * prescribe medications, or provide dosage instructions.
 */

export interface SymptomAnalysisResult {
  urgency: 'urgent' | 'soon' | 'routine';
  urgencyLabel: string;
  assessmentSummary: string;
  keyFactors: string[];
  whyThisGuidance: string;
  recommendedActions: string[];
  redFlags: string[];
  whenToSeekCare: string[];
  disclaimer: string;
  detectedEmergency: boolean;
}

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'severe chest pain',
  'pressure in chest',
  'difficulty breathing',
  'shortness of breath',
  "can't breathe",
  'cant breathe',
  'cannot breathe',
  'severe bleeding',
  'unconscious',
  'loss of consciousness',
  'passed out',
  'seizure',
  'stroke',
  'face drooping',
  'slurred speech',
  'sudden weakness',
  'paralysis',
  'suicidal',
  'suicide attempt',
  'harm myself',
  'coughing blood',
  'anaphylaxis',
  'choking',
];

const SOON_KEYWORDS = [
  'high fever',
  'fever over 102',
  'fever over 39',
  'deep wound',
  'suspected fracture',
  'broken bone',
  'severe pain',
  'persistent vomiting',
  'dehydration',
  'stiff neck',
  'blood in stool',
  'blood in urine',
  'sudden vision changes',
  'asthma flare',
  'ear infection severe',
  'worsening rapidly',
  'unable to keep fluids down',
  'abdominal pain severe',
];

const COMMON_SYMPTOM_PATTERNS = [
  {
    regex: /\b(headache|migraine|head throbbing)\b/i,
    name: 'Headache / Cranial Discomfort',
    advice: 'Rest in a quiet, dimly lit room. Maintain hydration and note any sensitivity to light or sudden onset changes.',
  },
  {
    regex: /\b(cough|coughing|sore throat|congestion|runny nose|sneezing)\b/i,
    name: 'Upper Respiratory / Cold Symptoms',
    advice: 'Stay well-hydrated with warm fluids, rest, and monitor body temperature. Use steam or saline nasal mist if tolerated.',
  },
  {
    regex: /\b(fever|chills|sweating|temperature)\b/i,
    name: 'Elevated Temperature / Feverish Sensation',
    advice: 'Keep a temperature log with times, drink plenty of electrolyte-rich fluids, and wear light, comfortable clothing.',
  },
  {
    regex: /\b(nausea|upset stomach|stomach ache|diarrhea|cramps)\b/i,
    name: 'Gastrointestinal Discomfort',
    advice: 'Sip small quantities of clear fluids or oral rehydration solution. Avoid heavy, greasy, or spicy foods.',
  },
  {
    regex: /\b(joint pain|back pain|knee pain|muscle ache|sprain|stiffness)\b/i,
    name: 'Musculoskeletal / Joint Discomfort',
    advice: 'Rest the affected area, avoid strain, and apply intermittent cold or warmth as appropriate. Avoid heavy lifting.',
  },
  {
    regex: /\b(rash|itchy|hives|skin redness|swelling)\b/i,
    name: 'Dermatological / Skin Irritation',
    advice: 'Avoid scratching, keep the area clean and dry, and note whether the rash is spreading or accompanied by fever.',
  },
  {
    regex: /\b(fatigue|tired|exhausted|low energy|drowsy)\b/i,
    name: 'General Fatigue / Malaise',
    advice: 'Ensure adequate nightly sleep, review recent fluid and caloric intake, and avoid overexertion.',
  },
];

export const symptomService = {
  analyze(input: string): SymptomAnalysisResult {
    const text = (input || '').trim().toLowerCase();

    if (!text) {
      return {
        urgency: 'routine',
        urgencyLabel: 'Routine / Non-Urgent',
        assessmentSummary: 'Please describe the symptoms you are experiencing to receive structured health guidance.',
        keyFactors: ['No specific symptoms entered'],
        whyThisGuidance: 'A description of symptoms is required to evaluate potential guidance paths.',
        recommendedActions: ['Enter your symptoms in the search box above to receive next-step guidance.'],
        redFlags: ['Sudden severe chest pain, shortness of breath, slurred speech, or heavy bleeding.'],
        whenToSeekCare: ['Whenever you feel uncertain about your physical health.'],
        disclaimer: 'CureLink is an informational support tool and does NOT substitute for licensed clinical diagnosis.',
        detectedEmergency: false,
      };
    }

    // 1. Check for Emergency Indicators
    const detectedEmergencyWords = EMERGENCY_KEYWORDS.filter((word) =>
      text.includes(word)
    );

    if (detectedEmergencyWords.length > 0) {
      return {
        urgency: 'urgent',
        urgencyLabel: 'EMERGENCY / IMMEDIATE MEDICAL CARE REQUIRED',
        assessmentSummary:
          'Potential red-flag medical emergency detected. Do not wait or self-treat. Contact local emergency services (e.g., 911 or local emergency number) or go to the nearest emergency department right away.',
        keyFactors: [
          `Critical alert term(s) identified: "${detectedEmergencyWords.join('", "')}"`,
          'High-risk symptom pattern indicating immediate life safety priority',
          'Automated safety protocol triggered: diagnostic deferral in favor of immediate emergency response',
        ],
        whyThisGuidance:
          'The symptoms entered correspond to recognized emergency medical conditions requiring immediate in-person clinical evaluation by trauma or emergency teams.',
        recommendedActions: [
          'Call your local emergency telephone number (911 or country emergency dispatch) immediately.',
          'If safe, alert a family member, neighbor, or caregiver in your immediate vicinity.',
          'Unlock front door if you are waiting for paramedics.',
          'Do NOT drive yourself if you are feeling faint, short of breath, or disoriented.',
          'Do NOT take new medications or exceed existing prescriptions while awaiting emergency care.',
        ],
        redFlags: [
          'Chest pain spreading to neck, jaw, arm, or back',
          'Inability to speak in full sentences due to breathlessness',
          'Sudden facial droop, arm weakness, or slurred speech (FAST stroke signs)',
          'Sudden loss of balance, consciousness, or active uncontrolled bleeding',
        ],
        whenToSeekCare: [
          'Right now. Do not wait for symptoms to pass or attempt home remedies.',
        ],
        disclaimer:
          'CRITICAL NOTICE: CureLink does not provide diagnosis, prescriptions, or emergency dispatch. Immediate clinical intervention is required.',
        detectedEmergency: true,
      };
    }

    // 2. Check for "Soon" / Prompt Care Indicators
    const detectedSoonWords = SOON_KEYWORDS.filter((word) => text.includes(word));
    const isWorsening =
      text.includes('worsening') ||
      text.includes('getting worse') ||
      text.includes('severe') ||
      text.includes('several days') ||
      text.includes('high fever');

    // 3. Match Common Symptom Patterns
    const matchedPatterns = COMMON_SYMPTOM_PATTERNS.filter((pattern) =>
      pattern.regex.test(text)
    );

    const patternNames = matchedPatterns.map((p) => p.name);
    const patternAdvice = matchedPatterns.map((p) => p.advice);

    if (detectedSoonWords.length > 0 || (isWorsening && matchedPatterns.length > 0)) {
      const factors = [
        ...detectedSoonWords.map((w) => `Priority factor: "${w}"`),
        ...(isWorsening ? ['Reported symptoms are worsening or prolonged'] : []),
        ...patternNames.map((p) => `Identified category: ${p}`),
        'No immediate emergency red flags detected at this time',
      ];

      return {
        urgency: 'soon',
        urgencyLabel: 'Prompt Evaluation Recommended (Within 24–48 Hours)',
        assessmentSummary:
          'Your described symptoms show moderate intensity or persistent duration that warrants prompt evaluation by a licensed physician, urgent care clinic, or primary care provider.',
        keyFactors: factors.length > 0 ? factors : ['Elevated symptom duration or severity noted'],
        whyThisGuidance:
          'The presence of persistent symptoms, moderate discomfort, or progressive changes indicates an in-person or telehealth clinical assessment is the safest course of action to prevent complications.',
        recommendedActions: [
          'Schedule an appointment with your primary care physician or visit an urgent care walk-in clinic.',
          'Maintain a structured log of when symptoms started, their frequency, and any triggers.',
          'Ensure hydration and rest while awaiting your appointment.',
          ...patternAdvice.slice(0, 2),
        ],
        redFlags: [
          'Sudden development of high fever resistant to comfort measures',
          'New shortness of breath, confusion, or severe chest pain',
          'Inability to retain liquids for more than 12-24 hours',
          'Spreading rash with joint swelling or fever',
        ],
        whenToSeekCare: [
          'Contact a medical clinic or urgent care within 24 to 48 hours.',
          'Escalate to the emergency department immediately if red-flag symptoms emerge.',
        ],
        disclaimer:
          'CureLink Explainable Guidance is for educational support only. It is not medical advice, does not diagnose illness, and never replaces evaluation by a healthcare provider.',
        detectedEmergency: false,
      };
    }

    // 4. Routine / Mild / Supportive Guidance
    const factors = [
      ...(patternNames.length > 0
        ? patternNames.map((p) => `Detected focus: ${p}`)
        : ['General non-acute symptom query described']),
      'No acute emergency or high-priority warning signs identified',
      'Guidance oriented around general self-care observation and routine clinical consultation',
    ];

    const actions = [
      'Monitor your symptoms closely over the next 24 to 72 hours.',
      'Rest and maintain adequate hydration and balanced nutrition.',
      ...(patternAdvice.length > 0
        ? patternAdvice
        : ['Prepare a concise list of symptoms to discuss with your doctor if they persist.']),
      'Contact a doctor, pharmacist, or community clinic if symptoms do not improve after a few days.',
    ];

    return {
      urgency: 'routine',
      urgencyLabel: 'Routine Care & Supportive Monitoring',
      assessmentSummary:
        'The symptoms you described appear consistent with mild or non-emergency concerns. Continue monitoring, practice supportive home comfort measures, and consult your doctor if they do not resolve.',
      keyFactors: factors,
      whyThisGuidance:
        'Based on the absence of acute emergency indicators and the mild nature of the described factors, routine observation with standard healthcare follow-up is appropriate.',
      recommendedActions: actions,
      redFlags: [
        'Sudden onset of severe pain, chest tightness, or respiratory distress',
        'Fever exceeding 102°F (38.9°C) or lasting more than 3 consecutive days',
        'Stiff neck accompanied by headache and light sensitivity',
        'Any unexpected rapid escalation in symptom severity',
      ],
      whenToSeekCare: [
        'Schedule a routine check-in with your doctor or community clinic if symptoms persist longer than 3–5 days.',
        'Seek urgent medical care immediately if any red-flag warning signs develop.',
      ],
      disclaimer:
        'CureLink Explainable Guidance provides supportive educational information only. It does not provide medical diagnosis, prescribe drugs, or give dosage instructions.',
      detectedEmergency: false,
    };
  },
};
