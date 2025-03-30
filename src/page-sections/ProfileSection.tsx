"use client";

import React, { useRef, useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Pencil, Save } from "lucide-react";
import { useAuthContext } from "../context/auth-context/AuthContext";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

interface ProfileSectionProps {
  className?: string;
}

interface UpdateProfileData {
  name: string;
  email: string;
  avatar?: File;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ className }) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading, updateProfile } = useAuthContext();
  const [avatarError, setAvatarError] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    created_at: "",
  });

  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        created_at: user.created_at || "",
      });

      setEditedUserData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const getAvatarUrl = () => {
    if (avatarPreview) {
      console.log("Using avatar preview:", avatarPreview);
      return avatarPreview;
    }

    if (userData.avatar && process.env.NEXT_PUBLIC_API_BASE_URL) {
      const avatarPath = userData.avatar.startsWith("/")
        ? userData.avatar
        : `/${userData.avatar}`;
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${avatarPath}`;
      console.log("Constructed server avatar URL:", url);
      return url;
    }

    console.log("Using default avatar");
    return "/default-avatar.jpg";
  };

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Define max file size (e.g., 2MB)
    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`Image size exceeds ${MAX_FILE_SIZE_MB}MB. Please select a smaller file or compress it.`);
      // Optional: Attempt compression if within a reasonable range (e.g., 5MB)
      const COMPRESSION_THRESHOLD_MB = 5;
      if (file.size <= COMPRESSION_THRESHOLD_MB * 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: MAX_FILE_SIZE_MB, // Target size
            maxWidthOrHeight: 1024, // Resize dimensions
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          toast.info("Image compressed successfully.");
          setSelectedFile(compressedFile);

          const reader = new FileReader();
          reader.onload = (e) => {
            setAvatarPreview(e.target?.result as string);
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          toast.error("Failed to compress image. Please select a smaller file.");
          return;
        }
      }
      return;
    }

    // File is within size limit
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setAvatarError(false);
  };

  const saveProfileChanges = async () => {
    try {
      if (!editedUserData.name.trim()) {
        toast.error("Name cannot be empty");
        return;
      }

      if (!editedUserData.email.trim()) {
        toast.error("Email cannot be empty");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedUserData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const profileData: UpdateProfileData = {
        name: editedUserData.name,
        email: editedUserData.email,
      };
      if (selectedFile) {
        profileData.avatar = selectedFile;
      }

      const success = await updateProfile(profileData);

      if (success) {
        setEditingProfile(false);
        setAvatarPreview(null);
        setSelectedFile(null);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      if (error.response?.status === 413) {
        toast.error("File too large. Please upload an image under 2MB.");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection or server status.");
      } else {
        toast.error(
          `Failed to update profile: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  return (
    <div className={`max-w-6xl mx-auto ${className || ""}`}>
      <h2 className="text-center text-[#4eb7f0] text-2xl font-bold mb-2 flex items-center justify-center">
        <div className="h-px w-16 bg-[#4eb7f0] mr-4"></div>
        MY PROFILE
        <div className="h-px w-16 bg-[#4eb7f0] ml-4"></div>
      </h2>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-8">
        Manage your account, pets, and saved listings
      </p>

      {loading ? (
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-10">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-7 w-48 mb-3" />
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-5 w-36" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-white shadow-md rounded-xl overflow-hidden mb-10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-[#4eb7f0]">
                  <AvatarImage
                    src={getAvatarUrl()}
                    alt={userData.name}
                    onError={(e) => {
                      setAvatarError(true);
                      e.currentTarget.src = "/default-avatar.jpg";
                    }}
                  />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  onChange={handleFileSelect}
                />
                {editingProfile && (
                  <button
                    className="absolute bottom-0 right-0 bg-[#4eb7f0] p-1.5 rounded-full text-white"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <Camera size={14} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                {editingProfile ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedUserData.name}
                        onChange={(e) =>
                          setEditedUserData({
                            ...editedUserData,
                            name: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedUserData.email}
                        onChange={(e) =>
                          setEditedUserData({
                            ...editedUserData,
                            email: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{userData.name}</h3>
                    <p className="text-gray-600">{userData.email}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Joined {formatJoinDate(userData.created_at)}
                    </p>
                  </>
                )}
              </div>

              <div>
                {editingProfile ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProfile(false);
                        setEditedUserData({
                          name: userData.name,
                          email: userData.email,
                          avatar: userData.avatar,
                        });
                        setAvatarPreview(null);
                        setSelectedFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#4eb7f0] hover:bg-[#3aa0d9]"
                      onClick={saveProfileChanges}
                    >
                      <Save size={16} className="mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="border-[#4eb7f0] text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white"
                    onClick={() => setEditingProfile(true)}
                  >
                    <Pencil size={16} className="mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSection;