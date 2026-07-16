import React from 'react'
import { Globe, Tag } from 'lucide-react'
import Input from '../../../components/ui/Input'

export default function CommunityForm({ commName, setCommName, commDesc, setCommDesc, commTags, setCommTags, commImage, setCommImage }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <Input
        label="Community Name"
        id="modalCommName"
        type="text"
        required
        placeholder="e.g. Health-Tech Founders"
        value={commName}
        onChange={(e) => setCommName(e.target.value)}
        leftIcon={<Globe className="h-4 w-4 text-slate-400" />}
      />
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description</label>
        <textarea
          required
          rows={3}
          placeholder="Share resources, test clinical platforms, seek advisor roles..."
          value={commDesc}
          onChange={(e) => setCommDesc(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-400 transition-all resize-none text-slate-800"
        />
      </div>
      <Input
        label="Tags (Comma separated)"
        id="modalCommTags"
        type="text"
        placeholder="health, tech, startup"
        value={commTags}
        onChange={(e) => setCommTags(e.target.value)}
        leftIcon={<Tag className="h-4 w-4 text-slate-400" />}
      />
      <Input
        label="Cover Image URL (Optional)"
        id="modalCommImage"
        type="url"
        placeholder="https://images.unsplash.com/..."
        value={commImage}
        onChange={(e) => setCommImage(e.target.value)}
        leftIcon={<Globe className="h-4 w-4 text-slate-400" />}
      />
    </div>
  )
}
