import React, { useState } from 'react';
import { X, Save, Sparkles, User, GraduationCap, Target, BookOpen, Plus, Trash2 } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  onOpenRegistration?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
  onOpenRegistration,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState(profile.fullName);
  const [institutionName, setInstitutionName] = useState(profile.institutionName);
  const [institutionType, setInstitutionType] = useState(profile.institutionType);
  const [course, setCourse] = useState(profile.course);
  const [level, setLevel] = useState(profile.level);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState<string[]>([...profile.skills]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills(prev => [...prev, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({
        fullName,
        institutionName,
        institutionType,
        course,
        level,
        careerGoal,
        bio,
        skills,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-['Outfit']">
                Student Profile & Career Settings
              </h3>
              <p className="text-xs text-slate-300">
                Powers AI match algorithms, skills-gap diagnostic, and application resumes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. University of Nairobi, Nairobi Technical Training Institute"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Institution Category</label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900"
              >
                <option value="University">University</option>
                <option value="TVET">TVET Institute / College</option>
                <option value="Polytechnic">National Polytechnic</option>
                <option value="Graduate">Recent Graduate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Course / Major</label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Sc. Computer Science"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Year / Academic Level</label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. 3rd Year / Final Year"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Career Goal</label>
            <input
              type="text"
              required
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. Full Stack Cloud Engineer & AI Solutions Architect"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium"
            />
          </div>

          {/* Skills Adder */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">
              Verified Technical & Professional Skills ({skills.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g., Docker, Kotlin, Solar Installation)"
                className="flex-1 p-2 rounded-xl border border-slate-200 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Professional Summary / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            {onOpenRegistration ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegistration();
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
              >
                + Register New Student Account
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile & Recalculate'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
