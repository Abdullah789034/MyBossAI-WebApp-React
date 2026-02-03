// LLM Integration Section (Commented out for now)
// This section will be used to integrate AI/LLM for dynamic message generation

/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateLLMMessage = async (context) => {
  if (!process.env.LLM_ENABLED || process.env.LLM_ENABLED !== 'true') {
    return null;
  }

  try {
    const { intensity, type, userActivity, taskStats, userName } = context;
    
    const prompt = `You are a ${intensity} boss managing ${userName}. 
    Current situation:
    - Activity status: ${userActivity.isActive ? 'Active' : 'Inactive'}
    - Pending tasks: ${taskStats.pendingTasks}
    - Completed tasks: ${taskStats.completedTasks}
    - Overdue tasks: ${taskStats.overdueTasks}
    
    Generate a ${type} message (${intensity} tone) to motivate or warn the employee.
    Keep it concise (max 100 characters) and professional.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a productivity manager boss." },
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('LLM Error:', error);
    return null;
  }
};

export const generatePersonalizedMessage = async (user, activityContext, taskStats) => {
  if (!process.env.LLM_ENABLED || process.env.LLM_ENABLED !== 'true') {
    return null;
  }

  try {
    const context = {
      intensity: user.settings.bossIntensity,
      type: activityContext.type,
      userActivity: activityContext,
      taskStats,
      userName: user.name,
    };

    return await generateLLMMessage(context);
  } catch (error) {
    console.error('LLM Personalized Message Error:', error);
    return null;
  }
};
*/

// Placeholder function for when LLM is enabled
export const generateLLMMessage = async (context) => {
  // LLM integration commented out for now
  return null;
};

export const generatePersonalizedMessage = async (user, activityContext, taskStats) => {
  // LLM integration commented out for now
  return null;
};


