import { Opportunity, StudentProfile, OpportunityMatchReport } from '../types';

export function calculateOpportunityMatch(opp: Opportunity, profile: StudentProfile): OpportunityMatchReport {
  // Skill matching
  const matchedSkills = (opp.skillsRequired || []).filter(reqSkill =>
    (profile.skills || []).some(studentSkill => studentSkill.toLowerCase() === reqSkill.toLowerCase())
  );
  const missingSkills = (opp.skillsRequired || []).filter(reqSkill =>
    !(profile.skills || []).some(studentSkill => studentSkill.toLowerCase() === reqSkill.toLowerCase())
  );

  // Course matching
  const courseLower = (profile.course || '').toLowerCase();
  const isCourseMatched = (opp.targetCourses || []).some(tc => 
    tc.toLowerCase() === 'any course' || 
    courseLower.includes(tc.toLowerCase()) || 
    tc.toLowerCase().includes(courseLower)
  );

  // Institution matching
  const isInstMatched = (opp.institutionEligibility || []).includes(profile.institutionType as any);

  // Score calculation
  const totalReq = (opp.skillsRequired || []).length;
  const skillRatio = totalReq > 0 ? (matchedSkills.length / totalReq) : 0.8;
  let score = Math.round((skillRatio * 55) + (isCourseMatched ? 25 : 10) + (isInstMatched ? 20 : 5));
  score = Math.min(98, Math.max(68, score));

  // Dynamic tailored reasoning
  let matchReason = '';
  if (matchedSkills.length >= 3) {
    matchReason = `Direct match on ${matchedSkills.length} core skills (${matchedSkills.slice(0, 3).join(', ')}) with strong alignment to ${profile.course}.`;
  } else if (matchedSkills.length === 2) {
    matchReason = `Directly matches your ${matchedSkills.join(' & ')} competencies; high relevance for ${profile.careerGoal}.`;
  } else if (matchedSkills.length === 1) {
    const nextSkill = missingSkills[0] ? ` while developing ${missingSkills[0]}` : '';
    matchReason = `Builds on your ${matchedSkills[0]} background${nextSkill} in an active industry environment.`;
  } else if (isCourseMatched) {
    matchReason = `Curriculum-aligned with your ${profile.course} studies at ${profile.institutionName}.`;
  } else {
    matchReason = `High-value opportunity to broaden your technical skill portfolio toward ${profile.careerGoal}.`;
  }

  const recommendationNote = score >= 90
    ? 'High-priority match: Recommended to prepare application immediately.'
    : score >= 80
    ? 'Recommended match: Profile aligns well with core technical requirements.'
    : 'Growth opportunity: Ideal for bridging skill gaps and gaining practical experience.';

  return {
    opportunityId: opp.id,
    matchScore: score,
    matchReason,
    matchedSkills,
    missingSkills,
    recommendationNote,
  };
}
