import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { fetchProfile, fetchUserProfile } from "@/services/user";
import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";

import { useParams, useNavigate } from "react-router-dom";
import { ProfileOverviewCard } from "@/components/ProfileOverviewCard";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const localUser = userStr ? JSON.parse(userStr) : null;
  const isOwnProfile = !userId || userId === localUser?._id;

  const [profileImage, setProfileImage] = useState<string | null>(null);

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
            <div className="lg:col-span-12 space-y-4">
              <ProfileOverviewCard
                user={user}
                isOwnProfile={isOwnProfile}
                profileImage={profileImage}
                onProfileImageChange={(image) => {
                  localStorage.setItem("profile-photo", image);
                  setProfileImage(image);
                  window.dispatchEvent(new Event("profile-photo-updated"));
                }}
                onRemoveProfileImage={removePhoto}
              />

              {isOwnProfile && (
                <button
                  onClick={() => {
                    localStorage.removeItem("codetrack_tour_done");
                    navigate("/");
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-4 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:bg-muted/30"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Take Website Tour
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

