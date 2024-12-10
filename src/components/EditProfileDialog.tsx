import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "@/config";

// Shadcn UI Components
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

interface EditProfileDialogProps {
  user: {
    username: string;
    about: string;
    role: string;
    profileImage : string
  };
  onProfileUpdate: (updatedUser: {
    username: string;
    about: string;
    role: string;
    profileImage : string
  }) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ user, onProfileUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [about, setAbout] = useState(user.about || '');
  const [role, setRole] = useState(user.role);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open,setOpen] = useState(false)
  const navigate = useNavigate()
const {toast} = useToast()
const {setAuth,auth} = useUser()
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem('jwt');
    
    try {
      setLoading(true);
      
      // Create form data for multipart upload
      const formData = new FormData();
      formData.append('username', username);
      formData.append('about', about);
      formData.append('role', role);
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/auth`, 
        formData, 
        {
          headers: {
            'Authorization': jwt,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setOpen(false)
      navigate('/blogs')
      if(auth)
        setAuth({id : auth?.id,profileImage : response.data.user.profileImage})
      console.log(auth)
      localStorage.setItem('profileImage',response.data.user.profileImage)
      // Call the update callback
      onProfileUpdate({
        username : response.data.user.username,
        about : response.data.user.about,
        role : response.data.user.role,
        profileImage : response.data.user.profileImage
      });

      toast({
        title:'Profile updated successfully',
        className : 'bg-green-800 text-white'
      })
    } catch (error) {
        toast({
            title:'Profile updation failed',
            variant : 'destructive'
          })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Edit size={20} className="text-md cursor-pointer" />
        </div>
      </DialogTrigger>
      <DialogContent  className=" max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Profile Image Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profileImage" className="text-right">
              Profile Picture
            </Label>
            <div className="col-span-3 flex items-center space-x-4">
              <Input 
                id="profileImage" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Profile Preview" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Username */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* About */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="about" className="text-right">
              About
            </Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="col-span-3"
              placeholder="Tell us about yourself"
              rows={8}
            />
          </div>

          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;