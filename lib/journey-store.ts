import { create } from "zustand"
import type { CustomerJourney, JourneyNode, JourneyEdge, Actor, AnalysisResult } from "./types"

interface JourneyState {
  currentJourney: CustomerJourney | null
  selectedNode: JourneyNode | null
  analysis: AnalysisResult | null
  setJourney: (journey: CustomerJourney) => void
  addNode: (node: JourneyNode) => void
  updateNode: (id: string, updates: Partial<JourneyNode>) => void
  deleteNode: (id: string) => void
  addEdge: (edge: JourneyEdge) => void
  updateEdge: (id: string, updates: Partial<JourneyEdge>) => void
  deleteEdge: (id: string) => void
  addActor: (actor: Actor) => void
  setSelectedNode: (node: JourneyNode | null) => void
  setAnalysis: (analysis: AnalysisResult | null) => void
  createNewJourney: (name: string, description: string) => void
}

export const useJourneyStore = create<JourneyState>((set) => ({
  currentJourney: null,
  selectedNode: null,
  analysis: null,

  setJourney: (journey) => set({ currentJourney: journey }),

  addNode: (node) =>
    set((state) => ({
      currentJourney: state.currentJourney
        ? {
            ...state.currentJourney,
            nodes: [...state.currentJourney.nodes, node],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateNode: (id, updates) =>
    set((state) => {
      const updatedNodes = state.currentJourney
        ? state.currentJourney.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node))
        : []

      const updatedSelectedNode =
        state.selectedNode?.id === id ? updatedNodes.find((node) => node.id === id) || null : state.selectedNode

      return {
        currentJourney: state.currentJourney
          ? {
              ...state.currentJourney,
              nodes: updatedNodes,
              updatedAt: new Date().toISOString(),
            }
          : null,
        selectedNode: updatedSelectedNode,
      }
    }),

  deleteNode: (id) =>
    set((state) => ({
      currentJourney: state.currentJourney
        ? {
            ...state.currentJourney,
            nodes: state.currentJourney.nodes.filter((node) => node.id !== id),
            edges: state.currentJourney.edges.filter((edge) => edge.source !== id && edge.target !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
    })),

  addEdge: (edge) =>
    set((state) => ({
      currentJourney: state.currentJourney
        ? {
            ...state.currentJourney,
            edges: [...state.currentJourney.edges, edge],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  updateEdge: (id, updates) =>
    set((state) => ({
      currentJourney: state.currentJourney
        ? {
            ...state.currentJourney,
            edges: state.currentJourney.edges.map((edge) => (edge.id === id ? { ...edge, ...updates } : edge)),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  deleteEdge: (id) =>
    set((state) => ({
      currentJourney: state.currentJourney
        ? {
            ...state.currentJourney,
            edges: state.currentJourney.edges.filter((edge) => edge.id !== id),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  addActor: (actor) =>
    set((state) => ({
      currentJourney: state.currentJourney
        ? {
            ...state.currentJourney,
            actors: [...state.currentJourney.actors, actor],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  setSelectedNode: (node) => set({ selectedNode: node }),

  setAnalysis: (analysis) => set({ analysis }),

  createNewJourney: (name, description) =>
    set({
      currentJourney: {
        id: crypto.randomUUID(),
        name,
        description,
        nodes: [],
        edges: [],
        actors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      selectedNode: null,
      analysis: null,
    }),
}))
