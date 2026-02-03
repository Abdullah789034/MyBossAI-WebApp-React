// Default message templates
const defaultMessages = {
  gentle: {
    warning: [
      "Hey, I noticed you haven't been active for a while. Everything okay?",
      "Just checking in - are you making progress on your tasks?",
      "A gentle reminder: you have tasks waiting for you.",
      "Time to get back to work! Your tasks are waiting.",
    ],
    critical: [
      "You've been inactive during work hours. Please get back on track.",
      "Your productivity is dropping. Let's refocus on your tasks.",
      "I need you to be more active during work hours.",
    ],
    info: [
      "New task assigned! Check your dashboard.",
      "You completed a task! Great job!",
      "Your work hours are starting soon.",
    ],
    motivation: [
      "You're doing great! Keep up the good work!",
      "I'm impressed with your progress today!",
      "You're on fire! Keep it up!",
    ],
  },
  moderate: {
    warning: [
      "You're slacking off. Get back to work now.",
      "I'm watching you. You need to be more active.",
      "This is unacceptable. Return to your tasks immediately.",
      "Your inactivity is noted. Get back to work.",
    ],
    critical: [
      "This is your final warning. You're not meeting expectations.",
      "Your performance is below standards. Immediate action required.",
      "I'm not happy with your activity levels. Fix this now.",
      "You're wasting company time. Get back to work immediately.",
    ],
    info: [
      "New task assigned. Complete it by the deadline.",
      "Task completed. Good, but I expect more.",
      "Work hours are active. You should be working.",
    ],
    motivation: [
      "Good work, but don't get complacent.",
      "You're meeting expectations. Keep it up.",
      "Decent progress. Maintain this pace.",
    ],
  },
  harsh: {
    warning: [
      "What the hell are you doing? Get back to work NOW!",
      "This is pathetic. You're wasting my time and yours.",
      "I don't pay you to slack off. GET TO WORK!",
      "Your laziness is unacceptable. Do your job!",
    ],
    critical: [
      "This is absolutely unacceptable! You're fired if this continues!",
      "I'm done with your excuses. WORK NOW or face consequences!",
      "You're a disappointment. Shape up or ship out!",
      "This is your last chance. Get your act together NOW!",
    ],
    info: [
      "New task. Complete it or else.",
      "Task done. About time. Do better next time.",
      "Work hours. You better be working.",
    ],
    motivation: [
      "Finally, some actual work. Don't mess it up.",
      "You're doing what you're supposed to. Keep it that way.",
      "Acceptable performance. Don't let it drop.",
    ],
  },
};

export function generateMockMessage(type, intensity, isActive, customMessages = null) {
  const messages = customMessages || defaultMessages[intensity];
  const messagePool = messages[type];
  
  if (!messagePool || messagePool.length === 0) {
    return "No message available.";
  }
  
  const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
  return randomMessage;
}

export function getNotificationType(isActive, isInActiveHours, intensity) {
  if (!isInActiveHours) {
    return 'info';
  }

  if (!isActive) {
    return intensity === 'harsh' ? 'critical' : 'warning';
  }

  return Math.random() > 0.7 ? 'motivation' : 'info';
}

export { defaultMessages };


