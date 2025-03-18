import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@server/actions/auth-action";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import {
  Edit,
  RefreshCw,
  MapPin,
  Calendar,
  MoreHorizontal,
  Heart,
  User,
  KeyRound,
  Bookmark,
  AlertTriangle,
  BookmarkPlus,
  Pencil,
  Save,
  Camera,
  X,
} from "lucide-react";
import router from "next/router";

// Mock data - In a real application, this would come from your API
const userData = {
  id: 1,
  name: "Jane Smith",
  email: "jane.smith@example.com",
  joinDate: "Jan 15, 2025",
  avatar: "/assets/avatar.jpg",
};

const petData = [
  {
    id: 1,
    name: "Fluffy",
    description:
      "Fluffy is a friendly dog who loves playing in the park. He went missing near the city center.",
    image: "/assets/image.jpg",
    badgeType: "Lost",
    location: "City Center",
    date: "Feb 24, 2025",
    status: "Active",
  },
  {
    id: 2,
    name: "Bella",
    description:
      "Bella is a calm and gentle cat. She has been lost since last Wednesday.",
    image: "/assets/image1.jpg",
    badgeType: "Lost",
    location: "Riverside Park",
    date: "Feb 21, 2025",
    status: "Active",
  },
  {
    id: 3,
    name: "Max",
    description:
      "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/image2.jpg",
    badgeType: "Found",
    location: "Downtown",
    date: "Feb 25, 2025",
    status: "Active",
  },
];

const wishlistData = [
  {
    id: 4,
    name: "Buddy",
    description:
      "Buddy was found wandering around the street. Looking for his owner.",
    image: "/assets/image3.jpg",
    badgeType: "Found",
    location: "Oak Street",
    date: "Feb 22, 2025",
    status: "Active",
  },
  {
    id: 5,
    name: "Whiskers",
    description:
      "Whiskers is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image5.jpg",
    badgeType: "Stray",
    location: "Maple Avenue",
    date: "Feb 26, 2025",
    status: "Active",
  },
];

const reportedData = [
  {
    id: 6,
    name: "Ching Chang",
    description:
      "Ching Chang is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image4.jpg",
    badgeType: "Stray",
    location: "Pine District",
    date: "Feb 23, 2025",
    status: "Reported",
    reportReason: "This appears to be a duplicate listing.",
  },
];

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("myPets");
  const [editingProfile, setEditingProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    joinDate: "Jan 15, 2025",
    avatar: "/assets/avatar.jpg",
  });

  const [editedUserData, setEditedUserData] = useState({ ...userData });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [myPets, setMyPets] = useState(petData);
  const [wishlist, setWishlist] = useState(wishlistData);
  const [reportedPets, setReportedPets] = useState(reportedData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentPagePets, setCurrentPagePets] = useState(1);
  const [currentPageWishlist, setCurrentPageWishlist] = useState(1);
  const [currentPageReported, setCurrentPageReported] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const totalPagesPets = Math.ceil(myPets.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  // Function to mark the pet as reunited
  const markAsReunited = (id: number) => {
    setMyPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === id
          ? {
              ...pet,
              status: pet.status === "Reunited" ? "Active" : "Reunited",
            }
          : pet
      )
    );
  };

  const handlePageChangePets = (newPage) => {
    setCurrentPagePets;
  };
  // Function to handle editing (this could link to an edit page or modal)
  const handleEdit = (id: number) => {
    alert(`Editing pet with ID: ${id}`);
  };

  // Function to remove from wishlist
  const removeFromWishlist = (id: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((pet) => pet.id !== id));
  };

  // Function to change password

  // Function to dismiss reported pet
  const dismissReport = (id: number) => {
    setReportedPets((prevReported) =>
      prevReported.filter((pet) => pet.id !== id)
    );
  };
  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setAvatarPreview(savedAvatar);
      setUserData((prevData) => ({
        ...prevData,
        avatar: savedAvatar,
      }));
      setEditedUserData((prevData) => ({
        ...prevData,
        avatar: savedAvatar,
      }));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (optional - limit to 5MB for example)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        // This ensures we have a result before setting state
        if (typeof reader.result === "string") {
          // Set the preview immediately for visual feedback
          setAvatarPreview(reader.result);

          // Also update the edited user data
          setEditedUserData((prevData) => ({
            ...prevData,
            avatar: reader.result as string,
          }));

          // For immediate display, you can also update the current userData
          setUserData((prevData) => ({
            ...prevData,
            avatar: reader.result as string,
          }));

          // Optionally save to localStorage immediately
          localStorage.setItem("userAvatar", reader.result);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        toast.error("There was an error processing your image.");
      };

      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    setUserData({ ...editedUserData });
    if (avatarPreview) {
      localStorage.setItem("userAvatar", avatarPreview);
    }
    setEditingProfile(false);
  };

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchemas = yup.object({
    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const [resetToken, setResetToken] = useState<string | null>(null);
  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      // Check if reset token exists in localStorage first
      const token = resetToken || localStorage.getItem("reset_token");

      console.log("Reset token:", token);

      if (!token) {
        console.error("Reset token not available");
        toast.error("Reset token is missing. Please restart the process.");
        return;
      }

      // Log the values being passed to resetPassword for debugging
      console.log("Requesting password reset with values:", {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        resetToken: token,
      });

      // Proceed with the password reset if the token is available
      const response = await resetPassword(
        values.newPassword,
        values.confirmPassword,
        token
      );

      if (response.success) {
        toast.success("Password reset successfully!");
        // Clean up stored tokens
        localStorage.removeItem("reset_token");
        localStorage.removeItem("verify_token"); // Clear verify token
        localStorage.removeItem("user_email"); // Clear user email
      } else {
        toast.error(response.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error in password change:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues,
    validationSchema: validationSchemas,
    onSubmit: handlePasswordChange,
  });
  const renderPetCard = (pet: any, type: string) => (
    <Card
      key={pet.id}
      className={`relative bg-white shadow-md rounded-xl overflow-hidden w-full transition-all duration-300 ${
        pet.status === "Reunited" ? "opacity-75" : ""
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4eb7f0]"></div>

      <Badge
        variant="default"
        className={`absolute top-3 left-3 z-10 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md ${
          pet.badgeType === "Lost"
            ? "bg-red-500"
            : pet.badgeType === "Found"
            ? "bg-[#8DC63F]"
            : pet.badgeType === "Reported"
            ? "bg-orange-500"
            : "bg-yellow-500"
        }`}
      >
        {pet.status === "Reunited" ? "Reunited" : pet.badgeType}
      </Badge>

      <CardContent className="p-0">
        <div className="relative w-full h-40 sm:h-48 overflow-hidden">
          <Image
            src={pet.image}
            alt={pet.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gray-100/80 -z-10"></div>

          {pet.status === "Reunited" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                REUNITED
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <CardTitle className="text-lg font-bold mb-1 flex items-center justify-between">
            <span>{pet.name}</span>
            <button
              onClick={() => (type === "myPets" ? handleEdit(pet.id) : null)}
              className="p-1 text-gray-400 hover:text-[#4eb7f0] transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
          </CardTitle>

          <div className="flex flex-wrap text-xs text-gray-500 mb-2">
            <div className="flex items-center mr-3">
              <MapPin size={12} className="mr-1 text-[#4eb7f0]" />
              <span>{pet.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={12} className="mr-1 text-[#4eb7f0]" />
              <span>{pet.date}</span>
            </div>
          </div>

          <CardDescription className="text-sm line-clamp-2 mb-4 text-gray-600">
            {pet.description}
          </CardDescription>

          {pet.reportReason && (
            <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start">
                <AlertTriangle
                  size={14}
                  className="mr-2 text-orange-500 mt-0.5"
                />
                <p className="text-xs text-orange-700">{pet.reportReason}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {type === "myPets" && (
              <>
                <button
                  onClick={() => markAsReunited(pet.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pet.status === "Reunited"
                      ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <RefreshCw size={14} />
                  {pet.status === "Reunited"
                    ? "Mark as Active"
                    : "Mark as Reunited"}
                </button>

                <button
                  onClick={() => handleEdit(pet.id)}
                  className="p-2 border border-gray-200 rounded-full text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white hover:border-[#4eb7f0] transition-colors duration-200"
                >
                  <Edit size={16} />
                </button>
              </>
            )}

            {type === "wishlist" && (
              <button
                onClick={() => removeFromWishlist(pet.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <Heart size={14} />
                Remove from Wishlist
              </button>
            )}

            {type === "reported" && (
              <button
                onClick={() => dismissReport(pet.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
              >
                <X size={14} />
                Dismiss Report
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="w-full bg-[#EFEEF1] px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-6xl mx-auto">
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
                      src={avatarPreview || userData.avatar}
                      alt={userData.name}
                      onError={(e) => {
                        console.error("Error loading avatar image");
                        e.currentTarget.src = "/default-avatar.jpg"; // Fallback image
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
                      <p className="text-sm text-gray-500">
                        Member since {userData.joinDate}
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
                          setEditedUserData({ ...userData });
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

        <Tabs defaultValue="myPets" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto bg-[#e4e3e7]">
            <TabsTrigger
              value="myPets"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <User size={16} className="mr-2" />
              My Pets
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <Heart size={16} className="mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="reported"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <AlertTriangle size={16} className="mr-2" />
              Reported
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <KeyRound size={16} className="mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myPets">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="relative bg-white shadow-md rounded-xl overflow-hidden w-full"
                    >
                      <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-5">
                          <Skeleton className="h-6 w-[50%] rounded-md" />
                          <div className="flex mt-3 mb-3">
                            <Skeleton className="h-4 w-[40%] rounded-md mr-2" />
                            <Skeleton className="h-4 w-[40%] rounded-md" />
                          </div>
                          <Skeleton className="mt-2 h-4 w-full rounded-md" />
                          <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                          <div className="mt-5 flex justify-between">
                            <Skeleton className="h-10 w-[48%] rounded-lg" />
                            <Skeleton className="h-10 w-[48%] rounded-lg" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : myPets.length > 0 ? (
                myPets.map((pet) => renderPetCard(pet, "myPets"))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  {/* No pets message */}
                </div>
              )}
            </div>

            {/* Pagination Component Here */}
            {myPets.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPagePets > 1)
                        handlePageChangePets(currentPagePets - 1);
                    }}
                    className={`${
                      currentPagePets === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  <PaginationContent>
                    {Array.from({ length: totalPagesPets }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPagePets === index + 1}
                          onClick={() => handlePageChangePets(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  {currentPagePets < totalPagesPets && (
                    <PaginationNext
                      onClick={() => handlePageChangePets(currentPagePets + 1)}
                    />
                  )}
                </Pagination>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {loading ? (
                Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="relative bg-white shadow-md rounded-xl overflow-hidden w-full"
                    >
                      <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-5">
                          <Skeleton className="h-6 w-[50%] rounded-md" />
                          <div className="flex mt-3 mb-3">
                            <Skeleton className="h-4 w-[40%] rounded-md mr-2" />
                            <Skeleton className="h-4 w-[40%] rounded-md" />
                          </div>
                          <Skeleton className="mt-2 h-4 w-full rounded-md" />
                          <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                          <div className="mt-5 flex justify-between">
                            <Skeleton className="h-10 w-full rounded-lg" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : wishlist.length > 0 ? (
                wishlist.map((pet) => renderPetCard(pet, "wishlist"))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <div className="text-gray-400 mb-3">
                    <BookmarkPlus size={48} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Save pet listings to your wishlist to keep track of pets
                    you're interested in helping.
                  </p>
                  <Button className="mt-4 bg-[#4eb7f0] hover:bg-[#3aa0d9]">
                    Browse Listings
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reported">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {loading ? (
                Array(1)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="relative bg-white shadow-md rounded-xl overflow-hidden w-full"
                    >
                      <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-5">
                          <Skeleton className="h-6 w-[50%] rounded-md" />
                          <div className="flex mt-3 mb-3">
                            <Skeleton className="h-4 w-[40%] rounded-md mr-2" />
                            <Skeleton className="h-4 w-[40%] rounded-md" />
                          </div>
                          <Skeleton className="mt-2 h-4 w-full rounded-md" />
                          <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                          <Skeleton className="mt-3 p-2 h-16 w-full rounded-md" />
                          <div className="mt-5 flex justify-between">
                            <Skeleton className="h-10 w-full rounded-lg" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : reportedPets.length > 0 ? (
                reportedPets.map((pet) => renderPetCard(pet, "reported"))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <div className="text-gray-400 mb-3">
                    <AlertTriangle size={48} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No Reported Pets
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    There are currently no reports on any of your pet listings.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white shadow-md rounded-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <KeyRound className="mr-2 text-[#4eb7f0]" size={20} />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {" "}
                    {/* Use handleSubmit here */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={values.newPassword}
                        onChange={handleChange}
                        className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg"
                      />
                      {touched.confirmPassword &&
                        typeof errors.confirmPassword === "string" && (
                          <div className="text-red-500 text-sm">
                            {errors.confirmPassword}
                          </div>
                        )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#4eb7f0] hover:bg-[#3aa0d9]"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
