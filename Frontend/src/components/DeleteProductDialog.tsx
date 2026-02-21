import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { deleteProduct } from '@/lib/store'
import { toast } from '@/lib/toast'
import type { Product } from '@/lib/store'

interface Props {
  product: Product | null
  onOpenChange: (open: boolean) => void
  onProductDeleted: () => void
}

export default function DeleteProductDialog({ product, onOpenChange, onProductDeleted }: Props) {
  const [loading, setLoading] = useState(false)

  if (!product) return null

  const handleDelete = () => {
    setLoading(true)
    try {
      deleteProduct(product.id)
      onProductDeleted()
      toast.error("Product deleted successfully", {
        className: "bg-red-600 text-white border-none shadow-lg font-bold"
      })
    } catch { toast.error('Failed to delete product') }
    finally { setLoading(false) }
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" />Delete Product</DialogTitle>
          <DialogDescription>Delete <strong>{product.name}</strong>? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
