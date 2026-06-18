import { create } from 'zustand'

interface BrainState {
  selectedRegion: string | null
  setSelectedRegion: (id: string | null) => void
  isPanelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

export const useBrainStore = create<BrainState>((set) => ({
  selectedRegion: null,
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  isPanelOpen: false,
  setPanelOpen: (open) => set({ isPanelOpen: open })
}))
