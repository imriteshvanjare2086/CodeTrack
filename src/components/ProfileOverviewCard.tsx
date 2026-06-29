import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Camera, Check, Github, Linkedin, Link as LinkIcon, Upload, User, X } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, type UserProfile } from "@/services/user";

type ProfileLinks = {
  github: string;
  linkedin: string;
  leetcode: string;
  codeforces: string;
  codechef: string;
};

const emptyLinks: ProfileLinks = {
  github: "",
  linkedin: "",
  leetcode: "",
  codeforces: "",
  codechef: "",
};

const linkFields = [
  { key: "github", label: "GitHub", icon: Github },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "leetcode", label: "LeetCode", icon: LinkIcon },
  { key: "codeforces", label: "Codeforces", icon: LinkIcon },
  { key: "codechef", label: "CodeChef", icon: LinkIcon },
] as const;

function normalizeLinks(links: ProfileLinks): ProfileLinks {
  return {
    github: links.github.trim(),
    linkedin: links.linkedin.trim(),
    leetcode: links.leetcode.trim(),
    codeforces: links.codeforces.trim(),
    codechef: links.codechef.trim(),
  };
}

function parseSkills(value: string) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function ProfileOverviewCard({
  user,
  isOwnProfile = false,
  profileImage,
  onProfileImageChange,
  onRemoveProfileImage,
}: {
  user: UserProfile;
  isOwnProfile?: boolean;
  profileImage?: string | null;
  onProfileImageChange?: (image: string) => void;
  onRemoveProfileImage?: () => void;
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [links, setLinks] = useState<ProfileLinks>(emptyLinks);
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    setLinks({ ...emptyLinks, ...(user.profileLinks || {}) });
    setSkillsText((user.skills || []).join(", "));
  }, [user.profileLinks, user.skills]);

  const skills = (user.skills || []).filter(Boolean);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Please select a file under 2MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onProfileImageChange?.(reader.result as string);
      setIsUploading(false);
      toast.success("Profile photo updated successfully!");
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const nextLinks = normalizeLinks(links);
      const nextSkills = parseSkills(skillsText);
      const updated = await updateProfile({
        profileLinks: nextLinks,
        skills: nextSkills,
      });
      setLinks({ ...emptyLinks, ...(updated.profileLinks || nextLinks) });
      setSkillsText((updated.skills || nextSkills).join(", "));
      queryClient.setQueryData(["profile", undefined], updated);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["friends-leaderboard"] });
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated.");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Could not update profile.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] p-6 md:p-8 shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center lg:items-start">
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl relative"
            >
              {profileImage || user.profileImage ? (
                <img src={profileImage || user.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
                  <User className="h-12 w-12" />
                  <span className="text-[10px] font-mono uppercase tracking-tighter">No Photo</span>
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                  aria-label="Change profile photo"
                >
                  <Camera className="h-8 w-8 text-white" />
                </button>
              )}
            </motion.div>

            {isOwnProfile && profileImage && (
              <button
                type="button"
                onClick={onRemoveProfileImage}
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
                aria-label="Remove profile photo"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-5 w-full text-center lg:text-left">
            <h3 className="text-2xl font-heading font-black text-foreground capitalize">
              {user.username}
            </h3>
          </div>

          {isOwnProfile && (
            <>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/20"
              >
                <Upload className="h-3.5 w-3.5" />
                {profileImage ? "Change Photo" : "Upload Photo"}
              </button>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">Profile Links</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {linkFields.map(({ key, label, icon: Icon }) => (
                <div key={key} className="rounded-xl border border-border/40 bg-muted/10 p-3">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                  {isOwnProfile ? (
                    <input
                      value={links[key]}
                      onChange={(e) => setLinks((current) => ({ ...current, [key]: e.target.value }))}
                      placeholder={`${label} URL`}
                      className="w-full rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                    />
                  ) : links[key] ? (
                    <a href={links[key]} target="_blank" rel="noreferrer" className="block truncate text-sm font-semibold text-primary hover:underline">
                      {links[key]}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-muted-foreground">None</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">Skills</h4>
            {isOwnProfile ? (
              <textarea
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, DSA, MongoDB, Codeforces..."
                className="mt-3 min-h-24 w-full rounded-xl border border-border/40 bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
              />
            ) : skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-muted-foreground">None</p>
            )}
          </div>

          {isOwnProfile && (
            <button
              type="button"
              onClick={saveProfile}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
