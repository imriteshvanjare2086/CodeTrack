import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProfile, fetchUserProfile } from "@/services/user";
import { useState, useRef, useEffect } from "react";
import { Camera, User, Upload, X, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useParams, useNavigate } from "react-router-dom";
import { WebsiteTour } from "@/components/WebsiteTour";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const localUser = userStr ? JSON.parse(userStr) : null;
  const isOwnProfile = !userId || userId === localUser?._id;
  const [showTour, setShowTour] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => userId ? fetchUserProfile(userId) : fetchProfile(),
    initialData: isOwnProfile ? localUser : undefined,
  });

  useEffect(() => {
    if (isOwnProfile) {
      setProfileImage(localStorage.getItem("profile-photo") || user?.profileImage || localUser?.profileImage || null);
    } else if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user, userId, isOwnProfile, localUser?.profileImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Please select a file under 2MB.");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem("profile-photo", base64String);
        setProfileImage(base64String);
        setIsUploading(false);
        toast.success("Profile photo updated successfully!");
        window.dispatchEvent(new Event("profile-photo-updated"));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    localStorage.removeItem("profile-photo");
    setProfileImage(user?.profileImage || null);
    toast.success("Profile photo removed.");
    window.dispatchEvent(new Event("profile-photo-updated"));
  };

  if (!user || (!user.username && isLoading)) {
    return <div className="p-10 text-white font-mono">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader 
          title={isOwnProfile ? "Your Profile" : `${user?.username}'s Dashboard`} 
          description={isOwnProfile ? "Manage your account and view your stats." : `Viewing ${user?.username}'s coding stats and progress.`} 
        />

        {isLoading && !user ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 text-center font-mono text-sm text-muted-foreground">
            Loading profile…
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 text-center font-mono text-sm text-muted-foreground">
            Couldn’t load profile. Please login again.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Avatar Section */}
            <Card className="lg:col-span-4 rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl border-dashed">
              <CardContent className="pt-8 pb-6 flex flex-col items-center">
                <div className="relative group">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl relative"
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
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
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                      >
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </motion.div>
                  
                  {isOwnProfile && profileImage && profileImage !== user?.profileImage && (
                    <button 
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-lg font-heading font-bold text-foreground capitalize">{user.username}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{user.email}</p>
                </div>

                {isOwnProfile && (
                  <>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-xl border border-primary/20 text-xs font-bold transition-all"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {profileImage ? "Change Photo" : "Upload Photo"}
                    </button>

                    <button 
                      onClick={() => {
                        localStorage.removeItem("codetrack_tour_done");
                        navigate("/");
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-muted/20 hover:bg-muted/30 text-muted-foreground px-4 py-2.5 rounded-xl border border-border/40 text-xs font-bold transition-all"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Take Website Tour
                    </button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Info label="Username" value={user?.username || "Admin"} />
                  <Info label="Email Address" value={user?.email || ""} />
                  <Info label="Current Streak" value={`${user?.streak || 0} days`} />
                  <Info label="Problems Solved" value={`${user?.problemsSolved || 0}`} />
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">Platform Activity</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  <Info label="LeetCode" value={`${user?.platformStats?.leetcode || 0}`} />
                  <Info label="Codeforces" value={`${user?.platformStats?.codeforces || 0}`} />
                  <Info label="CodeChef" value={`${user?.platformStats?.codechef || 0}`} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/10 p-3">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}

