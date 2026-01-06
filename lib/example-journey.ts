import type { CustomerJourney } from "./types"

export const exampleJourney: CustomerJourney = {
  id: "0f291e8a-46ef-405f-9341-de78004c61fb",
  name: "Example",
  description: "Example journey",
  nodes: [
    {
      id: "360101f5-7218-4a69-ad1a-f2a1b118801f",
      type: "touchpoint",
      label: "Touchpoint",
      position: {
        x: 178.68130535644656,
        y: 241.80197507001014,
      },
      description: "Kickoff",
      duration: "2h",
    },
    {
      id: "dc965d45-e54e-450b-8a19-8071711061bf",
      type: "endpoint",
      label: "Endpoint",
      position: {
        x: 1043.0532135844685,
        y: 351.7215707007545,
      },
    },
    {
      id: "8aef4ba4-4610-41bf-8638-60c47f480d44",
      type: "process",
      label: "Process",
      position: {
        x: 336.43144292414854,
        y: 148.22526300929934,
      },
      description: "Qualification, MAGIC5",
      duration: "2d",
    },
    {
      id: "6448d556-47f0-4472-8b91-a05056436d5a",
      type: "handoff",
      label: "Handoff",
      position: {
        x: 450.55383333564237,
        y: 269.1688737844503,
      },
      description: "Handoff to Solutions Team",
      aiOpportunity: "Automate the creation of Space, Documentation, Boilerplate",
      criteria: [
        {
          id: "a6c0f2e9-0fc9-4993-837e-1e0ae9f4bf29",
          condition: "Done",
          type: "manual",
        },
      ],
    },
    {
      id: "f761e4df-29cd-46c9-9664-13685f3d3d1a",
      type: "decision",
      label: "Decision",
      position: {
        x: 571.4611395100881,
        y: 123.95696827723913,
      },
      description: "POC Acceptance",
      duration: "5d",
      criteria: [
        {
          id: "408490de-da38-4685-aa46-6c05373aa244",
          condition: "Done",
          type: "manual",
        },
      ],
    },
    {
      id: "0c196346-42b7-4adf-bb61-80c2c2ab0b21",
      type: "handoff",
      label: "Handoff",
      position: {
        x: 693.6151796418865,
        y: 288.36129253908337,
      },
      description: "Go forward with deployment team",
      duration: "3d",
      aiOpportunity: "Reduce cycle time with more API-driven operations",
      criteria: [
        {
          id: "e36624cf-be77-4950-bc60-0d13f7ee085c",
          condition: "Done",
          type: "manual",
        },
      ],
    },
    {
      id: "81ac4069-5fa7-44a9-ae7d-4c6cba54d08c",
      type: "process",
      label: "Process",
      position: {
        x: 904.0817131240253,
        y: 162.93854361177307,
      },
      description: "Wrap, Retro",
      duration: "2w",
      aiOpportunity: "Better connection between lessons learned and bootstrap",
      criteria: [
        {
          id: "04b6b2bb-430d-4cc7-8cd4-80801ca488f9",
          condition: "Done",
          type: "manual",
        },
      ],
    },
  ],
  edges: [
    {
      id: "c5295a95-9241-4cfa-85f5-696374457ef2",
      source: "360101f5-7218-4a69-ad1a-f2a1b118801f",
      target: "8aef4ba4-4610-41bf-8638-60c47f480d44",
      type: "default",
    },
    {
      id: "382f9378-afae-45c2-9955-3a578b7e848a",
      source: "8aef4ba4-4610-41bf-8638-60c47f480d44",
      target: "6448d556-47f0-4472-8b91-a05056436d5a",
      type: "default",
    },
    {
      id: "32af4467-1f13-4d23-bed3-5363bb87631f",
      source: "6448d556-47f0-4472-8b91-a05056436d5a",
      target: "f761e4df-29cd-46c9-9664-13685f3d3d1a",
      type: "default",
    },
    {
      id: "48905dd1-dc48-4093-a198-a543602b2f57",
      source: "f761e4df-29cd-46c9-9664-13685f3d3d1a",
      target: "0c196346-42b7-4adf-bb61-80c2c2ab0b21",
      type: "default",
    },
    {
      id: "545f3fab-0059-4b63-9955-b0f2198c79c0",
      source: "0c196346-42b7-4adf-bb61-80c2c2ab0b21",
      target: "81ac4069-5fa7-44a9-ae7d-4c6cba54d08c",
      type: "default",
    },
    {
      id: "5d533baf-1cd4-4ae2-8edc-8199ff8f988c",
      source: "81ac4069-5fa7-44a9-ae7d-4c6cba54d08c",
      target: "dc965d45-e54e-450b-8a19-8071711061bf",
      type: "default",
    },
  ],
  actors: [],
  createdAt: "2026-01-06T19:01:53.345Z",
  updatedAt: "2026-01-06T19:09:09.838Z",
}
