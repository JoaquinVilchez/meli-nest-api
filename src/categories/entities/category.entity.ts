export class Category {
  id: string
  name: string
  slug: string
  parentId?: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}
