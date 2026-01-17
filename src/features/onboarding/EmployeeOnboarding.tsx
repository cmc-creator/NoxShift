import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Calendar, Users, Award, Mail, MessageSquare, Shield, Sparkles, Rocket } from 'lucide-react';

interface EmployeeOnboardingProps {
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  managerName: string;
  startDate: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function EmployeeOnboarding({ 
  employeeName, 
  employeeEmail, 
  companyName, 
  managerName, 
  startDate,
  onComplete,
  onSkip 
}: EmployeeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const steps = [
    {
      id: 0,
      title: '👋 Welcome to the Team!',
      subtitle: `We're thrilled to have you at ${companyName}`,
      icon: Rocket,
      color: 'from-purple-600 to-pink-600',
      content: (
        <div className="text-center py-8">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-3xl font-black text-white mb-4">
            Welcome, {employeeName.split(' ')[0]}!
          </h3>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            You're joining an amazing team at <span className="font-bold text-purple-400">{companyName}</span>. 
            Let's get you set up and ready to make an impact!
          </p>
          <div className="bg-slate-800/50 rounded-2xl p-6 max-w-md mx-auto border border-slate-700">
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs text-slate-400">Start Date</div>
                  <div className="text-sm font-bold text-white">{new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-xs text-slate-400">Your Manager</div>
                  <div className="text-sm font-bold text-white">{managerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs text-slate-400">Work Email</div>
                  <div className="text-sm font-bold text-white">{employeeEmail}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: '📅 Your Schedule & Shifts',
      subtitle: 'Everything you need to know about your work schedule',
      icon: Calendar,
      color: 'from-blue-600 to-cyan-600',
      content: (
        <div className="py-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border-2 border-blue-400/30">
              <Calendar className="w-10 h-10 text-white mb-4" />
              <h4 className="text-xl font-black text-white mb-2">View Your Schedule</h4>
              <p className="text-blue-100 text-sm">
                Check your upcoming shifts in the calendar. You'll get notifications for any changes.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 border-2 border-purple-400/30">
              <MessageSquare className="w-10 h-10 text-white mb-4" />
              <h4 className="text-xl font-black text-white mb-2">Request Time Off</h4>
              <p className="text-purple-100 text-sm">
                Need a day off? Submit requests through the Time-Off tool. Your manager will approve quickly!
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h4 className="text-lg font-bold text-white mb-4">📌 Quick Tips:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">
                  <span className="font-bold text-white">Clock in/out:</span> Use the Time Clock feature at the start and end of your shifts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">
                  <span className="font-bold text-white">Shift swaps:</span> Trade shifts with teammates through the Marketplace (manager approval required)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">
                  <span className="font-bold text-white">Availability:</span> Keep your availability updated so we can schedule you at times that work for you
                </span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '🏆 Rewards & Recognition',
      subtitle: 'Earn XP, level up, and get rewarded for great work',
      icon: Award,
      color: 'from-yellow-600 to-amber-600',
      content: (
        <div className="py-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-black text-white mb-3">Guild XP System</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Every shift you work, every achievement you unlock, and every contribution you make earns you XP. 
              Level up to unlock rewards, bonuses, and exclusive perks!
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <div className="text-3xl mb-2">💪</div>
              <div className="text-sm font-bold text-white mb-1">Work Shifts</div>
              <div className="text-xs text-slate-400">+50 XP per shift</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm font-bold text-white mb-1">Perfect Attendance</div>
              <div className="text-xs text-slate-400">+150 XP weekly</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-sm font-bold text-white mb-1">Receive Kudos</div>
              <div className="text-xs text-slate-400">+25 XP each</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-lg font-black text-white mb-2">XP Merch Store</h4>
                <p className="text-purple-200 text-sm mb-3">
                  Trade your XP for real rewards! Gift cards, company swag, extra PTO hours, and more.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/30">
                    🎁 $10 Gift Card - 500 XP
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/30">
                    👕 Company T-Shirt - 300 XP
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/30">
                    ⏰ 2 Hours PTO - 1000 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '🚀 Basecamp Portal',
      subtitle: 'Your social hub for team connection and fun',
      icon: Rocket,
      color: 'from-pink-600 to-rose-600',
      content: (
        <div className="py-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-black text-white mb-3">Team Connection Hub</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Basecamp is where the magic happens! Connect with teammates, share ideas, play games, 
              and stay updated on company news.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white">Team Directory</h4>
              </div>
              <p className="text-sm text-slate-400">
                Find coworkers, view profiles, and connect with your team members
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white">Kudos Wall</h4>
              </div>
              <p className="text-sm text-slate-400">
                Give shout-outs and recognize teammates for great work
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white">Ideas Board</h4>
              </div>
              <p className="text-sm text-slate-400">
                Share suggestions and vote on ideas to improve the workplace
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white">Games & Fun</h4>
              </div>
              <p className="text-sm text-slate-400">
                Play trivia, compete on leaderboards, and have fun with the team
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-pink-500/50 rounded-2xl p-6 text-center">
            <p className="text-pink-200 font-semibold">
              🎉 Your Basecamp account is ready! Explore all features from the main menu.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '✅ All Set!',
      subtitle: 'You're ready to start your journey',
      icon: CheckCircle,
      color: 'from-green-600 to-emerald-600',
      content: (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4">You're All Set!</h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Welcome aboard, {employeeName.split(' ')[0]}! We're excited to work with you. 
            If you have any questions, don't hesitate to reach out to {managerName} or your team.
          </p>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 max-w-md mx-auto border border-slate-700 mb-8">
            <h4 className="text-lg font-bold text-white mb-4">Quick Access:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm font-semibold text-white">View Schedule</span>
                <span className="text-xs text-blue-400">Menu → Calendar</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm font-semibold text-white">Time Clock</span>
                <span className="text-xs text-green-400">Top Navigation</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm font-semibold text-white">Basecamp Portal</span>
                <span className="text-xs text-purple-400">Menu → Basecamp</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-sm font-semibold text-white">Guild Dashboard</span>
                <span className="text-xs text-yellow-400">Menu → Guild</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-400 shrink-0" />
              <div className="text-left">
                <h5 className="font-bold text-white mb-2">Need Help?</h5>
                <p className="text-blue-200 text-sm">
                  Access the Help Center anytime from the menu, or contact your manager directly. 
                  We're here to support your success!
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border-2 border-purple-500/50 shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStepData.color} px-8 py-6 flex items-center justify-between border-b-2 border-white/20`}>
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <currentStepData.icon className="w-8 h-8" />
              {currentStepData.title}
            </h2>
            <p className="text-white/90 text-sm mt-1 font-semibold">
              {currentStepData.subtitle}
            </p>
          </div>
          {onSkip && (
            <button onClick={onSkip} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="px-8 py-4 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex-1 h-2 rounded-full transition-all ${
                    idx <= currentStep 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                      : 'bg-slate-700'
                  }`}
                />
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 max-h-[calc(90vh-280px)] overflow-y-auto">
          {currentStepData.content}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-6 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
          >
            Back
          </button>
          
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-1">
              {completedSteps.length} of {steps.length - 1} steps completed
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className={`px-6 py-3 bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2`}
          >
            {isLastStep ? (
              <>
                Get Started
                <Rocket className="w-5 h-5" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
