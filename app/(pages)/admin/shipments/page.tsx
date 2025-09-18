import AdminLayout from "@/components/admin/AdminLayout"
import ShipmentsList from "@/components/admin/ShipmentList"

const page = () => {
  return (
    <AdminLayout>
      <ShipmentsList />
    </AdminLayout>
  )
}

export default page