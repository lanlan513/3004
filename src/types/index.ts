export interface BrainRegionData {
  id: string
  name: string
  nameEn: string
  color: string
  description: string
  functions: string[]
  facts: string[]
}

export interface NeuronPart {
  id: string
  name: string
  description: string
  color: string
}

export interface Neurotransmitter {
  id: string
  name: string
  nameEn: string
  color: string
  function: string
  effects: string[]
  disorders: string[]
}
