import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Briefcase, User, Info, ArrowLeft, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { API_URL } from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/Spinner';

export default function UserProfileView({ userId, onBack, onChat }) {
  const { currentUser, checkAuth } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  // Fetch target profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/user/${userId}`);
        setProfileUser(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !profileUser) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-slate-500 font-medium">{error || 'User not found.'}</p>
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const isFollowing = currentUser?.following?.includes(profileUser.id || profileUser._id);

  // Follow/Unfollow toggle handler
  const handleFollowToggle = async () => {
    if (!currentUser) return;
    try {
      setFollowLoading(true);
      const currentFollowing = currentUser.following || [];
      const profileId = profileUser.id || profileUser._id;
      let updatedFollowing;

      if (isFollowing) {
        updatedFollowing = currentFollowing.filter(id => id !== profileId);
      } else {
        updatedFollowing = [...currentFollowing, profileId];
      }

      await axios.put(`${API_URL}/user/${currentUser.id || currentUser._id}`, {
        following: updatedFollowing
      });

      // Refresh authentication details to sync context state
      await checkAuth();
    } catch (err) {
      console.error('Failed to toggle follow status:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const prefs = profileUser.investment_preferences?.length
    ? profileUser.investment_preferences.join(', ')
    : 'General Sectors';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-all border-none bg-transparent cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column - User Identity Cards */}
        <div className="space-y-6">
          <Card className="p-6 text-center flex flex-col items-center">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md relative group select-none">
              {profileUser.profile_image ? (
                <img
                  src={profileUser.profile_image}
                  alt={profileUser.first_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-400">
                  {profileUser.first_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + Badges */}
            <h2 className="text-xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
              {profileUser.first_name} {profileUser.last_name}
            </h2>
            <p className="text-xs text-primary-600 font-semibold mt-0.5">@{profileUser.username}</p>

            <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 uppercase tracking-wider mt-3 select-none">
              {profileUser.role}
            </span>

            {/* Details List */}
            <div className="w-full mt-6 space-y-3.5 text-xs text-slate-600 border-t border-slate-100 pt-6 text-left">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate" title={prefs}>{prefs}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{profileUser.country || 'Location N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{profileUser.email}</span>
              </div>
              {profileUser.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{profileUser.phone}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="w-full mt-6 space-y-3 pt-6 border-t border-slate-100">
              <Button
                variant="primary"
                className="w-full justify-center text-xs h-9"
                onClick={() => onChat?.(profileUser)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>

              {currentUser && ['ENTREPRENEUR', 'INVESTOR'].includes(currentUser.role) && (currentUser.id || currentUser._id) !== (profileUser.id || profileUser._id) && (
                <Button
                  variant={isFollowing ? 'outline' : 'primary'}
                  className="w-full justify-center text-xs h-9"
                  disabled={followLoading}
                  onClick={handleFollowToggle}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-primary-600 text-primary-600' : ''}`} />
                  {isFollowing ? 'Unfollow' : 'Follow Me'}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Experience and Biography */}
        <div className="lg:col-span-2 space-y-6">
          {/* About section */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              About Me
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {profileUser.user_background || profileUser.experience || 'No description provided by this user.'}
            </p>
          </Card>

          {/* Professional Background */}
          {(profileUser.experience || profileUser.user_background) && (
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Professional Background
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Past experiences</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {profileUser.experience || 'Senior consultant and developer.'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Overview</h4>
              <p className="text-lg font-black text-slate-900 leading-tight">
                {profileUser.role === 'INVESTOR' ? 'Number of active investments' : 'Number of active pitches'}
              </p>
              <div className="text-3xl font-black text-primary-600">
                {profileUser.role === 'INVESTOR' ? '18' : '3'}
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Financial summary</h4>
              <p className="text-lg font-black text-slate-900 leading-tight">
                {profileUser.role === 'INVESTOR' ? 'Total amount invested' : 'Total funding goal'}
              </p>
              <div className="text-3xl font-black text-emerald-600">
                {profileUser.role === 'INVESTOR' ? '$42M' : '$150K'}
              </div>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
