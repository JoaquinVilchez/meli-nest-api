export class Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
}
