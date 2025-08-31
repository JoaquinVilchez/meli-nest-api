export interface RequestPopulate {
  query: { populate?: string }
  validatedPopulate?: string[]
}
