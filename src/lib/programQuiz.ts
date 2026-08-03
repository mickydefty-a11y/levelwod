import type { QuizAnswers, QuizRecommendation, ReadinessCheck } from '../types/programQuiz'

// Readiness checks for the 5 programs with real prerequisites a quiz answer
// alone can't verify. "Not yet" redirects to fallbackProgramId instead.
// Exported so other features (e.g. the Program Comparison View's "assumes
// prior experience" card tag) can reuse this exact list rather than
// duplicating which programs have real prerequisites.
export const READINESS_CHECKS: Record<string, ReadinessCheck> = {
  'gymnastics-skills-track-10wk': {
    prompt: 'This program assumes you already have a working strict pull-up and dip. Does that sound like you?',
    fallbackProgramId: 'beginner-foundations-12wk',
    fallbackReason: 'Build the core push/pull strength this track assumes, then come back.',
  },
  'olympic-weightlifting-deep-dive-8wk': {
    prompt: 'This program assumes you already have a working Squat Clean and Squat Snatch. Does that sound like you?',
    fallbackProgramId: 'strength-focus-8wk',
    fallbackReason: 'Build a general strength base and Olympic lift technique first, then come back.',
  },
  'russian-squat-program-6wk': {
    prompt: 'This program assumes you already have a comfortable, technically solid Back Squat. Does that sound like you?',
    fallbackProgramId: 'strength-focus-8wk',
    fallbackReason: 'Build a technically solid squat first, then come back for this specialized block.',
  },
  'hyrox-elite-12wk': {
    prompt: "This program assumes you already have the Intermediate tier's fitness base. Does that sound like you?",
    fallbackProgramId: 'hyrox-intermediate-10wk',
    fallbackReason: 'Build that fitness base first, then step up to the Elite tier.',
  },
  'crossfit-open-prep-elite-12wk': {
    prompt: "This program assumes you already have the Intermediate tier's fitness base. Does that sound like you?",
    fallbackProgramId: 'crossfit-open-prep-intermediate-10wk',
    fallbackReason: 'Build that fitness base first, then step up to the Elite tier.',
  },
}

const EXPERIENCE_LABEL: Record<QuizAnswers['experience'], string> = {
  'never-trained': "never having trained before",
  'building-basics': 'some experience, still building the basics',
  'comfortable-basics': 'being comfortable with the basics and wanting to go further',
  'experienced-peak': 'being experienced and chasing peak performance',
}

export function recommendProgram(answers: QuizAnswers): QuizRecommendation {
  const { goal, experience, strongerFocus } = answers
  let programId: string
  let reason: string
  let briefReason: string
  let alternatives: QuizRecommendation['alternatives'] = []

  switch (goal) {
    case 'just-starting': {
      if (experience === 'never-trained') {
        programId = 'total-beginner-onramp-4wk'
        reason = "Based on just starting out and never having trained before, we'd suggest the Total Beginner On-Ramp."
        briefReason = "You told us you're just starting out and have never trained before."
        alternatives = [
          { programId: 'beginner-foundations-12wk', reason: 'A longer on-ramp, if you want more time on the core patterns.' },
        ]
      } else {
        programId = 'beginner-foundations-12wk'
        reason = `Based on just starting out with ${EXPERIENCE_LABEL[experience]}, we'd suggest Beginner Foundations.`
        briefReason = "You told us you're just starting out and want to build the basics."
        alternatives = [
          { programId: 'total-beginner-onramp-4wk', reason: 'A gentler, shorter starting point if you want it.' },
          { programId: 'strength-focus-8wk', reason: 'If you already feel solid on the basics and want to push strength sooner.' },
        ]
      }
      break
    }

    case 'get-stronger': {
      if (strongerFocus === 'percentage-method') {
        programId = '531-strength-9wk'
        reason = 'Based on wanting a classic percentage-based method you can run long-term, we\'d suggest 5/3/1.'
        briefReason = 'You told us you wanted a classic percentage-based method you can run long-term.'
        alternatives = [
          { programId: 'strength-focus-8wk', reason: 'A more balanced program across multiple lifts, if 5/3/1 feels too narrow.' },
          { programId: 'russian-squat-program-6wk', reason: 'If you want to focus specifically on your squat instead.' },
        ]
      } else if (strongerFocus === 'squat-specific') {
        programId = 'russian-squat-program-6wk'
        reason = "Based on wanting a short, focused block to push your squat specifically, we'd suggest the Russian Squat Program."
        briefReason = 'You told us you wanted to build a stronger squat with a short, focused block.'
        alternatives = [
          { programId: 'strength-focus-8wk', reason: 'A more balanced program across multiple lifts, if you want that instead.' },
          { programId: '531-strength-9wk', reason: 'A percentage-based method you can run long-term.' },
        ]
      } else {
        programId = 'strength-focus-8wk'
        reason = "Based on wanting a balanced program across multiple lifts, we'd suggest Strength Focus."
        briefReason = 'You told us you wanted a balanced strength program across multiple lifts.'
        alternatives = [
          { programId: '531-strength-9wk', reason: 'A classic percentage-based method you can run long-term.' },
          { programId: 'russian-squat-program-6wk', reason: 'If you want to focus specifically on your squat instead.' },
        ]
      }
      break
    }

    case 'gymnastics-skills': {
      programId = 'gymnastics-skills-track-10wk'
      reason = "Based on wanting to build gymnastics skills, we'd suggest the Gymnastics Skills Track."
      briefReason = 'You told us you wanted to build gymnastics skills.'
      alternatives = [
        { programId: 'beginner-foundations-12wk', reason: 'Build the core push/pull strength this track assumes first, if needed.' },
      ]
      break
    }

    case 'conditioning': {
      programId = 'conditioning-engine-focus-6wk'
      reason = "Based on wanting to improve your conditioning/engine, we'd suggest Conditioning/Engine Focus."
      briefReason = 'You told us you wanted to improve your conditioning/engine.'
      alternatives = [
        { programId: 'hyrox-beginner-8wk', reason: 'A structured race-format alternative, if you want a concrete event to train for.' },
        { programId: 'strongman-functional-focus-6wk', reason: 'If you want loaded conditioning work too.' },
      ]
      break
    }

    case 'functional-strongman': {
      programId = 'strongman-functional-focus-6wk'
      reason = "Based on wanting functional/strongman-style training, we'd suggest Strongman/Functional Focus."
      briefReason = 'You told us you wanted functional/strongman-style training.'
      alternatives = [
        { programId: 'conditioning-engine-focus-6wk', reason: "If you'd rather focus on pure aerobic conditioning instead." },
        { programId: 'strength-focus-8wk', reason: 'If you want more barbell-focused strength work instead.' },
      ]
      break
    }

    case 'olympic-weightlifting': {
      programId = 'olympic-weightlifting-deep-dive-8wk'
      reason = "Based on wanting to focus on Olympic weightlifting, we'd suggest the Olympic Weightlifting Deep Dive."
      briefReason = 'You told us you wanted to focus on Olympic weightlifting.'
      alternatives = [
        { programId: 'strength-focus-8wk', reason: 'Build a general strength base and Olympic lift technique first, if needed.' },
      ]
      break
    }

    case 'hyrox': {
      if (experience === 'comfortable-basics') {
        programId = 'hyrox-intermediate-10wk'
        reason = "Based on wanting to train for Hyrox with some experience already, we'd suggest Hyrox Intermediate."
        briefReason = 'You told us you wanted to train for Hyrox with some experience already.'
        alternatives = [
          { programId: 'hyrox-beginner-8wk', reason: 'A gentler starting point if Intermediate feels like a stretch.' },
          { programId: 'hyrox-elite-12wk', reason: 'If you want to push straight for the top tier instead.' },
        ]
      } else if (experience === 'experienced-peak') {
        programId = 'hyrox-elite-12wk'
        reason = "Based on wanting to train for Hyrox at peak performance, we'd suggest Hyrox Elite."
        briefReason = 'You told us you wanted to train for Hyrox at peak performance.'
        alternatives = [
          { programId: 'hyrox-intermediate-10wk', reason: 'A strong alternative if Elite feels like too much right now.' },
        ]
      } else {
        programId = 'hyrox-beginner-8wk'
        reason = `Based on wanting to train for Hyrox with ${EXPERIENCE_LABEL[experience]}, we'd suggest Hyrox Beginner.`
        briefReason = 'You told us you wanted to train for Hyrox, starting from the basics.'
        alternatives = [
          { programId: 'conditioning-engine-focus-6wk', reason: 'If you want to build a general aerobic base first instead.' },
          { programId: 'hyrox-intermediate-10wk', reason: 'If you feel ready to jump straight to Intermediate.' },
        ]
      }
      break
    }

    case 'crossfit-open': {
      if (experience === 'comfortable-basics') {
        programId = 'crossfit-open-prep-intermediate-10wk'
        reason = "Based on wanting to train for the CrossFit Open with some experience already, we'd suggest CrossFit Open Prep Intermediate."
        briefReason = 'You told us you wanted to train for the CrossFit Open with some experience already.'
        alternatives = [
          { programId: 'crossfit-open-prep-beginner-8wk', reason: 'A gentler starting point if Intermediate feels like a stretch.' },
          { programId: 'crossfit-open-prep-elite-12wk', reason: 'If you want to push straight for the top tier instead.' },
        ]
      } else if (experience === 'experienced-peak') {
        programId = 'crossfit-open-prep-elite-12wk'
        reason = "Based on wanting to train for the CrossFit Open at peak performance, we'd suggest CrossFit Open Prep Elite."
        briefReason = 'You told us you wanted to train for the CrossFit Open at peak performance.'
        alternatives = [
          { programId: 'crossfit-open-prep-intermediate-10wk', reason: 'A strong alternative if Elite feels like too much right now.' },
        ]
      } else {
        programId = 'crossfit-open-prep-beginner-8wk'
        reason = `Based on wanting to train for the CrossFit Open with ${EXPERIENCE_LABEL[experience]}, we'd suggest CrossFit Open Prep Beginner.`
        briefReason = 'You told us you wanted to train for the CrossFit Open, starting from the basics.'
        alternatives = [
          { programId: 'beginner-foundations-12wk', reason: 'If you want a broader general base first instead.' },
          { programId: 'crossfit-open-prep-intermediate-10wk', reason: 'If you feel ready to jump straight to Intermediate.' },
        ]
      }
      break
    }
  }

  return {
    programId,
    reason,
    briefReason,
    alternatives,
    readinessCheck: READINESS_CHECKS[programId] ?? null,
  }
}

// Applied after a "Not yet" answer to a readiness check — redirects to the
// feeder program instead of the original recommendation. fallbackReason
// already reads fine standalone (it never names the destination program
// twice), so it doubles as its own briefReason.
export function applyReadinessFallback(recommendation: QuizRecommendation): QuizRecommendation {
  if (!recommendation.readinessCheck) return recommendation
  return {
    programId: recommendation.readinessCheck.fallbackProgramId,
    reason: recommendation.readinessCheck.fallbackReason,
    briefReason: recommendation.readinessCheck.fallbackReason,
    alternatives: [],
    readinessCheck: null,
  }
}
